import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="text-muted-foreground" disabled>
        <Moon className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative"
    >
      <Sun
        aria-hidden="true"
        className={`h-5 w-5 transition-all ${isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0"}`}
      />
      <Moon
        aria-hidden="true"
        className={`absolute h-5 w-5 transition-all ${isDark ? "scale-100 rotate-0" : "scale-0 rotate-90"}`}
      />
    </Button>
  );
};

export default ThemeToggle;

