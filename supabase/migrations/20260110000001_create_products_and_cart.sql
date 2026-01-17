-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price integer not null check (price >= 0),
  image_url text,
  category text not null default 'default',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists products_created_at_idx on public.products (created_at desc);

-- Create cart table (simple cart per-session; consider adding user_id for multi-user carts)
create table if not exists public.cart (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists cart_created_at_idx on public.cart (created_at asc);

-- Seed sample products (idempotent insert)
insert into public.products (id, name, description, price, image_url, category)
select * from (values
  (gen_random_uuid(), 'Nintendo Switch OLED', '7-inch OLED screen, neon and white colors', 429000, '/public/images/nintendo-switch.png', 'consoles'),
  (gen_random_uuid(), 'PS5 Controller', 'DualSense wireless controller', 298000, '/public/images/ps5.png', 'accessories'),
  (gen_random_uuid(), 'Handheld PC', 'Powerful handheld gaming PC', 599000, '/public/images/umpc.png', 'pcs')
) as v(id, name, description, price, image_url, category)
where not exists (
  select 1 from public.products p where p.name = v.name
);


