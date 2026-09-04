create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  user_id uuid not null references auth.users (id) on delete cascade,
  amount integer not null check (amount > 0),
  status text not null default 'pending',
  items jsonb not null,
  payment_key text,
  method text,
  toss_status text,
  receipt_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_status_check check (status in ('pending', 'awaiting_deposit', 'paid', 'failed')),
  constraint orders_order_id_format check (order_id ~ '^[A-Za-z0-9_=-]{6,64}$')
);

create index orders_user_id_idx on public.orders (user_id);
create index orders_payment_key_idx on public.orders (payment_key);

alter table public.orders enable row level security;

create policy "Users can read own orders"
on public.orders for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own pending orders"
on public.orders for insert to authenticated
with check ((select auth.uid()) = user_id and status = 'pending');

create policy "Users can update own orders"
on public.orders for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
