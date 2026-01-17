export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

export interface Order {
  id: string;
  user_id: string;
  title: string;
  total: number;
  status: string;
  payment_key?: string | null;
  created_at: string;
  items: OrderItem[];
}
