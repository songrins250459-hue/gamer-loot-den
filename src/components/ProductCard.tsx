import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/database";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      
      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-foreground">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 font-body text-sm text-muted-foreground">
          {product.description}
        </p>
        <p className="mt-3 font-display text-2xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/product/${product.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            자세히 보기
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
