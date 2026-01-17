import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from "@/hooks/useOrders";

const profileSchema = z.object({
  fullName: z.string().min(2, "이름은 2자 이상 입력해주세요."),
  phone: z
    .string()
    .regex(/^[0-9+\-() ]*$/, "숫자와 특수문자(-, +, ())만 사용할 수 있습니다.")
    .optional()
    .or(z.literal("")),
  address: z.string().max(120, "주소는 120자 이내로 입력해주세요.").optional().or(z.literal("")),
  bio: z.string().max(160, "소개는 160자 이내로 입력해주세요.").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const MyPage = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const { data: orders = [], isLoading: ordersLoading } = useOrders(user?.id);
  const [saving, setSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.user_metadata?.full_name ?? "",
        phone: user.user_metadata?.phone ?? "",
        address: user.user_metadata?.address ?? "",
        bio: user.user_metadata?.bio ?? "",
      });
    }
  }, [user, form]);

  const handleProfileSave = async (values: ProfileFormValues) => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: values.fullName,
        phone: values.phone || null,
        address: values.address || null,
        bio: values.bio || null,
      },
    });
    setSaving(false);

    if (error) {
      toast({
        title: "정보 저장 실패",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "프로필이 업데이트되었습니다",
      description: "다음 방문부터 최신 정보가 반영됩니다.",
    });
  };

  if (loading) {
    return (
      <section className="container flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">계정 정보를 불러오는 중입니다...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="container flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <h1 className="text-3xl font-bold">로그인이 필요합니다</h1>
        <p className="text-muted-foreground">마이페이지를 보려면 먼저 로그인해주세요.</p>
        <Button asChild>
          <Link to="/">홈으로 가기</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="container min-h-[60vh] py-12">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>회원 정보</CardTitle>
              <CardDescription>로그인에 사용된 Supabase 계정 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <p className="text-sm uppercase text-muted-foreground">이메일</p>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-sm uppercase text-muted-foreground">계정 ID</p>
                <p className="font-mono text-base">{user.id}</p>
              </div>
              <div>
                <p className="text-sm uppercase text-muted-foreground">가입일</p>
                <p className="text-base">
                  {user.created_at ? new Date(user.created_at).toLocaleString("ko-KR") : "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>회원 정보 수정</CardTitle>
              <CardDescription>이름, 연락처, 주소 등 기본 정보를 업데이트하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleProfileSave)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이름</FormLabel>
                        <FormControl>
                          <Input placeholder="홍길동" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>연락처</FormLabel>
                        <FormControl>
                          <Input placeholder="010-0000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>배송지</FormLabel>
                        <FormControl>
                          <Input placeholder="서울특별시 ..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>한 줄 소개</FormLabel>
                        <FormControl>
                          <Input placeholder="즐겨 사용하는 콘솔이나 취향을 적어주세요." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
                      {saving ? "저장 중..." : "정보 저장"}
                    </Button>
                  </div>
                </form>
              </Form>
              <p className="mt-4 text-xs text-muted-foreground">
                이메일과 비밀번호 변경은 Supabase 대시보드의 Authentication 설정에서 관리해야 합니다.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="self-start">
          <CardHeader>
            <CardTitle>결제 내역</CardTitle>
            <CardDescription>최근 구매 이력을 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <p className="text-sm text-muted-foreground">결제 내역을 불러오는 중입니다...</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">아직 구매 기록이 없습니다.</p>
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li key={order.id} className="rounded-md border border-border p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{order.title}</p>
                        <p className="text-xs text-muted-foreground">
                          주문번호 {order.id} · {new Date(order.created_at).toLocaleString("ko-KR")}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">{order.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {order.items.map((item) => item.name).join(", ")}
                    </p>
                    <p className="text-lg font-bold text-primary">{order.total.toLocaleString()}원</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MyPage;

