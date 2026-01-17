import { FormEvent, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface StatusMessage {
  type: "success" | "error";
  message: string;
}

export function EmailSignupSection() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setStatus({
        type: "error",
        message: "이메일과 비밀번호를 모두 입력해주세요.",
      });
      return;
    }

    if (password.length < 6) {
      setStatus({
        type: "error",
        message: "비밀번호는 최소 6자 이상이어야 합니다.",
      });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: fullName ? { full_name: fullName } : undefined,
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/` : undefined,
        },
      });

      if (error) {
        setStatus({
          type: "error",
          message: error.message,
        });
        return;
      }

      setStatus({
        type: "success",
        message: "회원가입 메일을 발송했어요. 받은 편지함을 확인해주세요!",
      });
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "알 수 없는 오류가 발생했어요.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-t border-border bg-gradient-to-b from-background via-card/40 to-background py-16">
      <div className="container grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
            Member Access
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground">
            슈퍼베이스 연동 이메일 회원가입
          </h2>
          <p className="mt-4 text-muted-foreground">
            Gear Bunker 전용 계정을 만들어 개인 맞춤형 장바구니, 주문 내역, 이벤트 정보를 받아보세요.
            회원 가입 후 이메일에 전송되는 확인 링크를 클릭하면 즉시 로그인할 수 있어요.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Supabase Auth로 안전하게 관리되는 계정
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              장바구니 및 주문 상태 동기화
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              이벤트, 한정 출시 알림 이메일 발송
            </li>
          </ul>
        </div>

        <Card className="shadow-2xl shadow-primary/10">
          <CardHeader>
            <CardTitle>이메일로 가입하기</CardTitle>
            <CardDescription>
              이름은 선택 입력이며, 최소 6자 이상의 비밀번호를 사용해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="space-y-2">
                <Label htmlFor="fullName">이름 (선택)</Label>
                <Input
                  id="fullName"
                  placeholder="홍길동"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="최소 6자 이상 입력"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              {status && (
                <div
                  className={`flex items-center gap-2 rounded-none border px-3 py-2 text-sm ${
                    status.type === "success"
                      ? "border-emerald-500/50 text-emerald-600"
                      : "border-destructive/50 text-destructive"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "가입 처리 중..." : "가입 메일 보내기"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

