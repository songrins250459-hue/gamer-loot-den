-- Create products table (if missing)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(10,2) not null,
  image_url text,
  category text not null default 'gaming',
  created_at timestamptz not null default timezone('utc', now())
) ;

-- Create customers table
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text unique,
  phone text,
  address text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists customers_user_id_idx on public.customers (user_id);
create index if not exists customers_created_at_idx on public.customers (created_at desc);

-- Create orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  total integer not null check (total >= 0),
  status text not null default '결제대기',
  items jsonb not null default '[]'::jsonb,
  payment_key text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

