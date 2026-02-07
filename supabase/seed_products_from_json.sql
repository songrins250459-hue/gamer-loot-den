-- Ensure required tables exist before inserting seed data
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(10,2) not null,
  image_url text,
  category text not null default 'gaming',
  created_at timestamp with time zone not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text unique,
  phone text,
  address text,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  total integer not null check (total >= 0),
  status text not null default '결제대기',
  items jsonb not null default '[]'::jsonb,
  payment_key text,
  created_at timestamp with time zone not null default now()
);

-- If tables already existed, add missing columns safely
alter table public.products
  add column if not exists name text,
  add column if not exists description text,
  add column if not exists price numeric(10,2),
  add column if not exists image_url text,
  add column if not exists category text,
  add column if not exists created_at timestamp with time zone;

alter table public.customers
  add column if not exists user_id uuid references auth.users (id) on delete set null,
  add column if not exists name text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists address text,
  add column if not exists created_at timestamp with time zone;

alter table public.orders
  add column if not exists user_id uuid references auth.users (id) on delete cascade,
  add column if not exists title text,
  add column if not exists total integer,
  add column if not exists status text,
  add column if not exists items jsonb,
  add column if not exists payment_key text,
  add column if not exists created_at timestamp with time zone;

insert into public.products (
  id,
  name,
  description,
  price,
  image_url,
  category,
  created_at
) values
(
  'b1a7f3c2-8d4e-4a6b-9f2c-1e2a3b4c5d6e',
  'Nintendo Switch OLED',
  '7-inch OLED screen, neon and white colors',
  429000,
  '/public/images/nintendo-switch.png',
  'consoles',
  timezone('utc', now())
),
(
  'c2d8e4f5-9a6b-4c3d-8e1f-2b3a4c5d6e7f',
  'PS5 Controller',
  'DualSense wireless controller',
  298000,
  '/public/images/ps5.png',
  'accessories',
  timezone('utc', now())
),
(
  'd3e9f5a6-1b7c-4d8e-9f2a-3b4c5d6e7f80',
  'Handheld PC',
  'Powerful handheld gaming PC',
  599000,
  '/public/images/umpc.png',
  'pcs',
  timezone('utc', now())
),
(
  'e4f0a6b7-2c8d-4e9f-0a1b-4c5d6e7f8091',
  'PlayStation 5',
  '열심히 일한 당신, 이 정도 누릴 자격 있습니다. 퇴근 후 패드를 쥐는 순간, 스트레스는 사라지고 가슴 뛰는 모험이 시작됩니다.',
  499.99,
  '/images/ps5.png',
  'console',
  timezone('utc', now())
),
(
  'f5a1b7c8-3d9e-4f0a-1b2c-5d6e7f8091a2',
  'UMPC Gaming Handheld',
  '하루 종일 의자에 앉아 일한 당신, 이제 게임은 누워서 하세요. 침대 위가 곧 PC방이 되는, 게이머를 위한 최고의 휴식을 선물합니다.',
  699.99,
  '/images/umpc.png',
  'handheld',
  timezone('utc', now())
),
(
  'a6b2c8d9-4e0f-5a1b-2c3d-6e7f8091a2b3',
  'Nintendo Switch OLED (KR)',
  '스마트폰만 보는 아이에게, 아빠와 함께하는 즐거운 추억을 선물하세요. 우리 집 거실이 웃음 터지는 파티룸이 됩니다.',
  299.99,
  '/images/nintendo-switch.png',
  'console',
  timezone('utc', now())
) on conflict (id) do nothing;

insert into public.customers (
  id,
  user_id,
  name,
  email,
  phone,
  address,
  created_at
) values
(
  '11111111-1111-1111-1111-111111111111',
  null,
  '김민지',
  'minji.kim@example.com',
  '010-1111-2222',
  '서울특별시 강남구 테헤란로 123',
  timezone('utc', now())
),
(
  '22222222-2222-2222-2222-222222222222',
  null,
  '박준호',
  'junho.park@example.com',
  '010-3333-4444',
  '부산광역시 해운대구 해운대로 456',
  timezone('utc', now())
),
(
  '33333333-3333-3333-3333-333333333333',
  null,
  '이서연',
  'seoyeon.lee@example.com',
  '010-5555-6666',
  '대구광역시 수성구 동대구로 789',
  timezone('utc', now())
) on conflict (id) do nothing;

insert into public.orders (
  id,
  user_id,
  title,
  total,
  status,
  items,
  payment_key,
  created_at
)
select
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  u.id,
  'Nintendo Switch OLED + PS5 Controller',
  727000,
  '결제완료',
  '[
    {"product_id":"b1a7f3c2-8d4e-4a6b-9f2c-1e2a3b4c5d6e","name":"Nintendo Switch OLED","price":429000,"quantity":1},
    {"product_id":"c2d8e4f5-9a6b-4c3d-8e1f-2b3a4c5d6e7f","name":"PS5 Controller","price":298000,"quantity":1}
  ]'::jsonb,
  'pay_aaaaaaaa',
  timezone('utc', now())
from (
  select id, row_number() over (order by created_at) as rn
  from auth.users
  order by created_at
  limit 2
) u
where u.rn = 1
union all
select
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  u.id,
  'PlayStation 5',
  499000,
  '결제대기',
  '[
    {"product_id":"e4f0a6b7-2c8d-4e9f-0a1b-4c5d6e7f8091","name":"PlayStation 5","price":499000,"quantity":1}
  ]'::jsonb,
  null,
  timezone('utc', now())
from (
  select id, row_number() over (order by created_at) as rn
  from auth.users
  order by created_at
  limit 2
) u
where u.rn = 2
on conflict (id) do nothing;

