import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginButton = () => {
  const { user, loading, signIn, signOut, signUp } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [submitting, setSubmitting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!open) {
      setMode("login");
      form.reset();
    }
  }, [open, form]);

  const handleSubmit = async (values: LoginFormValues) => {
    const isSignUp = mode === "signup";
    setSubmitting(true);
    const action = isSignUp ? signUp : signIn;
    const { error } = await action(values.email, values.password);
    setSubmitting(false);

    if (error) {
      toast({
        title: isSignUp ? "회원가입 실패" : "로그인 실패",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isSignUp ? "회원가입 완료" : "로그인 성공",
      description: isSignUp ? "이메일 인증 후 다시 로그인해주세요." : "다시 만나 반가워요!",
    });

    if (!isSignUp) {
      setOpen(false);
      form.reset();
    } else {
      setMode("login");
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    const { error } = await signOut();
    setSigningOut(false);

    if (error) {
      toast({
        title: "로그아웃 실패",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "로그아웃 완료",
      description: "다음에 또 만나요!",
    });
  };

  if (loading) {
    return (
      <Button variant="ghost" disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>로딩중...</span>
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" className="gap-2" asChild>
          <Link to="/mypage">
            <User className="h-4 w-4" />
            마이페이지
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2" disabled={signingOut}>
          {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          로그아웃
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LogIn className="h-4 w-4" />
          로그인
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "로그인" : "회원가입"}</DialogTitle>
          <DialogDescription>
            {mode === "login" ? "등록된 계정으로 로그인하세요." : "새 계정을 만들고 이메일 인증을 완료하세요."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex rounded-full bg-muted p-1 text-sm font-semibold text-muted-foreground">
          <button
            type="button"
            className={`flex-1 rounded-full px-4 py-1 transition ${mode === "login" ? "bg-background text-foreground shadow" : ""}`}
            onClick={() => setMode("login")}
          >
            로그인
          </button>
          <button
            type="button"
            className={`flex-1 rounded-full px-4 py-1 transition ${mode === "signup" ? "bg-background text-foreground shadow" : ""}`}
            onClick={() => setMode("signup")}
          >
            회원가입
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="비밀번호"
                      type="password"
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {mode === "login" ? "로그인" : "회원가입"}
            </Button>
          </form>
        </Form>
        <p className="text-center text-xs text-muted-foreground">
          {mode === "login"
            ? "비밀번호를 잊었다면 Supabase 대시보드에서 재설정 메일을 발송하세요."
            : "가입 후 수신된 인증 메일을 확인해야 로그인할 수 있습니다."}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginButton;

