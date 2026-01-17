import { MessageCircle } from "lucide-react";

const FloatingChatButton = () => {
  return (
    <button
      type="button"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] text-[#111111] shadow-[0_10px_25px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEE500]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label="상담하기"
      title="상담하기"
    >
      <MessageCircle className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
      <span className="sr-only">상담하기</span>
    </button>
  );
};

export default FloatingChatButton;

