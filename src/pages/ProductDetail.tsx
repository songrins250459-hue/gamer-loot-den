import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { requestTossPayment } from "@/lib/tossPayments";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || "");
  const addToCart = useAddToCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [processingPurchase, setProcessingPurchase] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (product) {
      addToCart.mutate({ productId: product.id, quantity });
    }
  };

  const handleBuyNow = async () => {
    if (!product) {
      return;
    }

    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "구매하려면 먼저 로그인해주세요.",
        variant: "destructive",
      });
      return;
    }

    const amount = Math.max(100, Math.round(product.price * quantity));

    setProcessingPurchase(true);

    const orderItems = [
      {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image_url: product.image_url ?? null,
      },
    ];

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        title: `${product.name} x${quantity}`,
        total: amount,
        status: "결제대기",
        items: orderItems,
      })
      .select("id")
      .single();

    if (error || !data) {
      toast({
        title: "결제 시작에 실패했습니다",
        description: error?.message ?? "주문을 생성하지 못했습니다.",
        variant: "destructive",
      });
      setProcessingPurchase(false);
      return;
    }

    try {
      await requestTossPayment({
        amount,
        orderId: data.id,
        orderName: product.name,
        customerName: user.user_metadata?.full_name ?? user.email ?? "게스트",
      });
    } catch (paymentError) {
      await supabase
        .from("orders")
        .update({ status: "결제실패" })
        .eq("id", data.id);

      const message =
        paymentError instanceof Error ? paymentError.message : "결제를 진행하지 못했습니다.";
      toast({
        title: "결제가 취소되었습니다",
        description: message,
        variant: "destructive",
      });
      setProcessingPurchase(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onCartClick={() => setCartOpen(true)} />
        <div className="container py-12">
          <div className="grid gap-12 lg:grid-cols-2">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4 rounded-none" />
              <Skeleton className="h-8 w-1/3 rounded-none" />
              <Skeleton className="h-32 w-full rounded-none" />
            </div>
          </div>
        </div>
        <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header onCartClick={() => setCartOpen(true)} />
        <div className="container flex flex-col items-center justify-center py-24">
          <h1 className="mb-4 font-display text-2xl text-foreground">제품을 찾을 수 없습니다</h1>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              쇼핑으로 돌아가기
            </Link>
          </Button>
        </div>
        <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setCartOpen(true)} />

      <main className="container py-12">
        {/* Back button */}
        <Button asChild variant="ghost" className="mb-8">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            쇼핑으로 돌아가기
          </Link>
        </Button>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden border border-border bg-card">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <span className="mb-2 font-body text-sm uppercase tracking-wider text-primary">
              {product.category}
            </span>

            <h1 className="mb-4 font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <p className="mb-6 font-display text-3xl font-bold text-primary md:text-4xl">
              ${product.price.toFixed(2)}
            </p>

            <div className="mb-8 border-l-4 border-primary bg-card p-6">
              <p className="font-body text-lg leading-relaxed text-foreground">
                {product.description}
              </p>
            </div>

            {/* Quantity selector */}
            <div className="mb-8 flex items-center gap-4">
              <span className="font-body text-sm uppercase tracking-wider text-muted-foreground">
                수량
              </span>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-display text-lg">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="default"
              size="xl"
                className="w-full sm:flex-1"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {addToCart.isPending ? "추가 중..." : "장바구니 담기"}
            </Button>
              <Button
                variant="secondary"
                size="xl"
                className="w-full sm:flex-1"
                onClick={handleBuyNow}
                disabled={processingPurchase}
              >
                {processingPurchase ? "결제 준비중..." : "구매하기"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
};

export default ProductDetail;
