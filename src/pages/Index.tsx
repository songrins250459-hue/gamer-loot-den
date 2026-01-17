import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/components/ProductGrid";
import { EmailSignupSection } from "@/components/EmailSignupSection";
import { CartDrawer } from "@/components/CartDrawer";

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setCartOpen(true)} />
      <main>
        <HeroSection />
        <ProductGrid />
        <EmailSignupSection />
      </main>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container text-center">
          <p className="font-display text-sm uppercase tracking-wider text-muted-foreground">
            © 2024 Gear Bunker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
