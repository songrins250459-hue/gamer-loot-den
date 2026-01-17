import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductGrid() {
  const { data: products, isLoading, error } = useProducts();

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-destructive">제품을 불러오지 못했습니다</p>
      </div>
    );
  }

  return (
    <section id="products" className="py-16">
      <div className="container">
        <h2 className="mb-2 text-center font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
          추천 <span className="text-primary">제품</span>
        </h2>
        <p className="mb-12 text-center font-body text-muted-foreground">
          당신의 게이밍 경험을 업그레이드하세요
        </p>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-none" />
                <Skeleton className="h-6 w-3/4 rounded-none" />
                <Skeleton className="h-4 w-full rounded-none" />
                <Skeleton className="h-8 w-1/3 rounded-none" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
