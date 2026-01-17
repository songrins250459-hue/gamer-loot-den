import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden border-b border-border bg-gradient-to-b from-background via-card to-background">
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
      
      {/* Glow effect */}
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-primary/20 blur-[120px]" />

      <div className="container relative z-10 text-center">
        <h1 className="animate-slide-up font-display text-5xl font-black uppercase tracking-tight text-foreground md:text-7xl lg:text-8xl">
          GEAR <span className="text-glow text-primary">BUNKER</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl animate-slide-up font-body text-lg text-muted-foreground md:text-xl" style={{ animationDelay: "0.1s" }}>
          게이머를 위한 프리미엄 장비 · 당신의 승리를 위한 최고의 선택
        </p>

        <div className="mt-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button variant="hero" size="xl" onClick={scrollToProducts}>
            쇼핑하기
          </Button>
        </div>

        <button 
          onClick={scrollToProducts}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
}
