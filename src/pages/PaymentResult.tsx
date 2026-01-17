import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const statusCopy = {
  success: {
    title: "결제가 완료되었습니다",
    description: "주문 내역은 마이페이지에서 확인할 수 있습니다.",
  },
  fail: {
    title: "결제를 완료하지 못했습니다",
    description: "다시 시도하거나 다른 결제 수단을 선택해주세요.",
  },
};

const PaymentResult = () => {
  const { status } = useParams<{ status: "success" | "fail" }>();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState(status ? statusCopy[status].description : "");
  const [isUpdating, setIsUpdating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (!status || !orderId) {
      setError("유효하지 않은 결제 요청입니다.");
      setIsUpdating(false);
      return;
    }

    const paymentKey = searchParams.get("paymentKey");
    const payload: Record<string, string | null> = {
      status: status === "success" ? "결제완료" : "결제실패",
    };

    if (status === "success" && paymentKey) {
      payload.payment_key = paymentKey;
    }

    const updateOrder = async () => {
      const { error: updateError } = await supabase.from("orders").update(payload).eq("id", orderId);
      if (updateError) {
        setError(updateError.message);
      } else {
        setMessage(statusCopy[status].description);
      }
      setIsUpdating(false);
    };

    updateOrder();
  }, [status, searchParams]);

  const Icon = status === "success" ? CheckCircle2 : XCircle;

  return (
    <section className="container flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
      {status ? (
        <>
          <Icon className={`h-16 w-16 ${status === "success" ? "text-primary" : "text-destructive"}`} />
          <div>
            <h1 className="font-display text-3xl font-bold">
              {statusCopy[status].title}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {error ?? message}
            </p>
          </div>
          {isUpdating && !error && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              결제 정보를 반영하고 있습니다...
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="default">
              <Link to="/">홈으로 가기</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/mypage">마이페이지</Link>
            </Button>
          </div>
        </>
      ) : (
        <p className="text-lg text-muted-foreground">결제 결과를 확인할 수 없습니다.</p>
      )}
    </section>
  );
};

export default PaymentResult;

