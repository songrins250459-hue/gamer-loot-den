import { useEffect, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type ChatMessage = {
  id: string;
  text: string;
  from: "user" | "bot";
  time: string;
};

const FloatingChatButton = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSend = message.trim().length > 0;

  const formatTime = (value?: string) => {
    const now = value ? new Date(value) : new Date();
    return now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const key = "chat_session_id";
    let stored = localStorage.getItem(key);
    if (!stored) {
      const generated =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(key, generated);
      stored = generated;
    }
    setSessionId(stored);
  }, []);

  useEffect(() => {
    if (!open || !sessionId) return;
    let active = true;
    const loadMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("chat_messages")
        .select("id, message, role, created_at")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      if (!active) return;
      if (error) {
        // eslint-disable-next-line no-console
        console.error("[chat] load failed:", error);
        setLoading(false);
        return;
      }
      setMessages(
        (data ?? []).map((item) => ({
          id: item.id,
          text: item.message,
          from: item.role === "bot" ? "bot" : "user",
          time: formatTime(item.created_at),
        })),
      );
      setLoading(false);
    };
    loadMessages();
    return () => {
      active = false;
    };
  }, [open, sessionId]);

  const handleSend = async () => {
    if (!canSend || !sessionId) return;
    const trimmed = message.trim();
    const newMessage: ChatMessage = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text: trimmed,
      from: "user",
      time: formatTime(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    const { error: insertError } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        role: "user",
        message: newMessage.text,
      });
    if (insertError) {
      // eslint-disable-next-line no-console
      console.error("[chat] send failed:", insertError);
    }

    if (trimmed === "테스트") {
      const { data, error } = await supabase
        .from("products")
        .select("name")
        .order("created_at", { ascending: true });
      if (error) {
        // eslint-disable-next-line no-console
        console.error("[chat] products load failed:", error);
        return;
      }
      const names = (data ?? []).map((item) => item.name).filter(Boolean);
      const responseText =
        names.length > 0
          ? `상품 목록:\n${names.join("\n")}`
          : "현재 등록된 상품이 없습니다.";
      const botMessage: ChatMessage = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text: responseText,
        from: "bot",
        time: formatTime(),
      };
      setMessages((prev) => [...prev, botMessage]);
      const { error: botInsertError } = await supabase
        .from("chat_messages")
        .insert({
          session_id: sessionId,
          role: "bot",
          message: botMessage.text,
        });
      if (botInsertError) {
        // eslint-disable-next-line no-console
        console.error("[chat] bot send failed:", botInsertError);
      }
      return;
    }

    const { data, error } = await supabase.functions.invoke("chatbot", {
      body: { message: trimmed },
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[chat] ai failed:", error);
      return;
    }
    const reply =
      typeof data?.reply === "string" && data.reply.trim().length > 0
        ? data.reply.trim()
        : "죄송합니다. 답변을 생성하지 못했어요.";
    const botMessage: ChatMessage = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text: reply,
      from: "bot",
      time: formatTime(),
    };
    setMessages((prev) => [...prev, botMessage]);
    const { error: botInsertError } = await supabase.from("chat_messages").insert({
      session_id: sessionId,
      role: "bot",
      message: botMessage.text,
    });
    if (botInsertError) {
      // eslint-disable-next-line no-console
      console.error("[chat] bot send failed:", botInsertError);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <section className="w-[320px] overflow-hidden rounded-2xl border border-border bg-background shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold">상담 채팅</p>
              <p className="text-xs text-muted-foreground">
                운영시간 내 빠르게 답변드려요
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="채팅 닫기"
            >
              <X className="h-4 w-4" />
            </Button>
          </header>
          <div className="h-64 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {loading ? (
              <div className="rounded-lg bg-muted px-3 py-2 text-muted-foreground">
                채팅 내역을 불러오는 중입니다...
              </div>
            ) : messages.length === 0 ? (
              <div className="rounded-lg bg-muted px-3 py-2 text-muted-foreground">
                지금 무엇을 도와드릴까요? 메시지를 남겨주세요.
              </div>
            ) : (
              messages.map((item) => (
                <div
                  key={item.id}
                  className={`flex ${
                    item.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                      item.from === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p>{item.text}</p>
                    <p className="mt-1 text-[10px] opacity-70">{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <form
            className="flex items-center gap-2 border-t border-border px-3 py-3"
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
          >
            <Input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="메시지를 입력하세요"
              className="h-10"
            />
            <Button type="submit" size="icon" disabled={!canSend}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </section>
      )}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] text-[#111111] shadow-[0_10px_25px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEE500]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={open ? "채팅 닫기" : "상담하기"}
        title={open ? "채팅 닫기" : "상담하기"}
      >
        <MessageCircle className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
        <span className="sr-only">상담하기</span>
      </button>
    </div>
  );
};

export default FloatingChatButton;

