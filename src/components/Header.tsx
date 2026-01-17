import { ShoppingCart, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const { data: cartItems = [] } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <span className="font-display text-xl font-bold tracking-wider text-foreground">
            GEAR <span className="text-primary">BUNKER</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link 
            to="/" 
            className="font-body text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            쇼핑
          </Link>
          <span className="font-body text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary cursor-pointer">
            소개
          </span>
          <span className="font-body text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary cursor-pointer">
            문의
          </span>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <LoginButton />
        <Button
          variant="outline"
          size="icon"
          onClick={onCartClick}
          className="relative"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
              {totalItems}
            </span>
          )}
        </Button>
        </div>
      </div>
    </header>
  );
}
