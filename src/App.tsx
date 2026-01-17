import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import MyPage from "./pages/MyPage";
import PaymentResult from "./pages/PaymentResult";
import FloatingChatButton from "./components/FloatingChatButton";
import { AuthProvider } from "./hooks/useAuth";
import ThemeProvider from "./components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/payment/:status" element={<PaymentResult />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <FloatingChatButton />
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
