import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Order } from "@/types/database";

export const useOrders = (userId?: string) => {
  return useQuery({
    queryKey: ["orders", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        return [] as Order[];
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return (data ?? []).map((order) => ({
        ...order,
        items: Array.isArray(order.items) ? (order.items as Order["items"]) : [],
      }));
    },
  });
};


