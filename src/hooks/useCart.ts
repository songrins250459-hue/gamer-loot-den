import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/database";
import { toast } from "@/hooks/use-toast";

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart")
        .select(`
          *,
          product:products(*)
        `)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as CartItem[];
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      // Check if item already exists in cart
      const { data: existing } = await supabase
        .from("cart")
        .select("*")
        .eq("product_id", productId)
        .maybeSingle();

      if (existing) {
        // Update quantity
        const { error } = await supabase
          .from("cart")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from("cart")
          .insert({ product_id: productId, quantity });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cartId, quantity }: { cartId: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase
          .from("cart")
          .delete()
          .eq("id", cartId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart")
          .update({ quantity })
          .eq("id", cartId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartId: string) => {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("id", cartId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("cart")
        .delete()
        .neq("id", "");
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
