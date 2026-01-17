-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'gaming',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart table
CREATE TABLE public.cart (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- Products are public readable (no auth needed for browsing)
CREATE POLICY "Products are publicly readable" 
ON public.products 
FOR SELECT 
USING (true);

-- Cart is publicly accessible (no auth for this simple demo)
CREATE POLICY "Cart is publicly readable" 
ON public.cart 
FOR SELECT 
USING (true);

CREATE POLICY "Cart items can be inserted" 
ON public.cart 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Cart items can be updated" 
ON public.cart 
FOR UPDATE 
USING (true);

CREATE POLICY "Cart items can be deleted" 
ON public.cart 
FOR DELETE 
USING (true);

-- Seed products with gaming gear
INSERT INTO public.products (name, description, price, image_url, category) VALUES
('Nintendo Switch OLED', '스마트폰만 보는 아이에게, 아빠와 함께하는 즐거운 추억을 선물하세요. 우리 집 거실이 웃음 터지는 파티룸이 됩니다.', 299.99, '/images/nintendo-switch.png', 'console'),
('PlayStation 5', '열심히 일한 당신, 이 정도 누릴 자격 있습니다. 퇴근 후 패드를 쥐는 순간, 스트레스는 사라지고 가슴 뛰는 모험이 시작됩니다.', 499.99, '/images/ps5.png', 'console'),
('UMPC Gaming Handheld', '하루 종일 의자에 앉아 일한 당신, 이제 게임은 누워서 하세요. 침대 위가 곧 PC방이 되는, 게이머를 위한 최고의 휴식을 선물합니다.', 699.99, '/images/umpc.png', 'handheld'),
('Custom Gaming Keyboard', '0.01초가 승패를 가르는 순간, 당신의 반응 속도를 100% 끌어올려 줍니다. 피지컬을 완성하는 마지막 퍼즐은 바로 키보드입니다.', 149.99, '/images/keyboard.png', 'accessory');