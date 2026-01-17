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

