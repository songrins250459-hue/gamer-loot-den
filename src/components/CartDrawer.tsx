import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart, useUpdateCartQuantity, useRemoveFromCart } from "@/hooks/useCart";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { requestTossPayment } from "@/lib/tossPayments";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { data: cartItems = [], isLoading } = useCart();
  const updateQuantity = useUpdateCartQuantity();
  const removeItem = useRemoveFromCart();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handleBuyNow = async () => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "결제하려면 먼저 로그인해 주세요.",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      return;
    }

    const amount = Math.max(100, Math.round(totalPrice));
    if (amount <= 0) {
      toast({
        title: "결제 금액 오류",
        description: "결제 가능한 금액이 아닙니다.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    const orderItems = cartItems.map((item) => ({
      product_id: item.product_id,
      name: item.product?.name ?? "상품",
      price: item.product?.price ?? 0,
      quantity: item.quantity,
      image_url: item.product?.image_url ?? null,
    }));

    const orderTitle =
      orderItems.length === 1
        ? orderItems[0].name
        : `${orderItems[0].name} 외 ${orderItems.length - 1}건`;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        title: orderTitle,
        total: amount,
        status: "결제대기",
        items: orderItems,
      })
      .select("id")
      .single();

    if (error || !data) {
      toast({
        title: "결제에 실패했습니다",
        description: error?.message ?? "주문을 생성하지 못했습니다.",
        variant: "destructive",
      });
      setProcessing(false);
      return;
    }

    try {
      await requestTossPayment({
        amount,
        orderId: data.id,
        orderName: orderTitle,
        customerName: user.user_metadata?.full_name ?? user.email ?? "게스트",
      });
    } catch (paymentError) {
      await supabase
        .from("orders")
        .update({ status: "결제실패" })
        .eq("id", data.id);

      const message =
        paymentError instanceof Error ? paymentError.message : "결제가 취소되었습니다.";
    toast({
        title: "결제를 진행하지 못했습니다",
        description: message,
        variant: "destructive",
    });
      setProcessing(false);
      return;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col rounded-none border-l border-border bg-card sm:max-w-lg">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2 font-display text-xl uppercase tracking-wide">
            <ShoppingBag className="h-5 w-5 text-primary" />
            장바구니
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin border-2 border-primary border-t-transparent" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
              <p className="font-body text-lg text-muted-foreground">장바구니가 비어있습니다</p>
              <p className="mt-1 font-body text-sm text-muted-foreground">
                제품을 추가해 보세요
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-border pb-4"
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden bg-muted">
                    <img
                      src={item.product?.image_url || "/placeholder.svg"}
                      alt={item.product?.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
                        {item.product?.name}
                      </h4>
                      <p className="font-display text-sm text-primary">
                        ${item.product?.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity.mutate({
                              cartId: item.id,
                              quantity: item.quantity - 1,
                            })
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-body text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity.mutate({
                              cartId: item.id,
                              quantity: item.quantity + 1,
                            })
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeItem.mutate(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <SheetFooter className="flex-col gap-4 border-t border-border pt-4 sm:flex-col">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg uppercase tracking-wide text-muted-foreground">
                합계
              </span>
              <span className="font-display text-2xl font-bold text-primary">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <Button variant="default" size="lg" className="w-full" onClick={handleBuyNow} disabled={processing}>
              {processing ? "결제 준비중..." : "구매하기"}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
