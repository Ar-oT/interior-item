create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table public.cart_shares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  items jsonb not null,
  created_at timestamptz not null default now()
);

create index cart_items_user_id_idx on public.cart_items (user_id);
create index cart_shares_user_id_idx on public.cart_shares (user_id);

alter table public.cart_items enable row level security;
alter table public.cart_shares enable row level security;

create policy "Users can read own cart items"
on public.cart_items for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own cart items"
on public.cart_items for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own cart items"
on public.cart_items for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own cart items"
on public.cart_items for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can read own cart shares"
on public.cart_shares for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own cart shares"
on public.cart_shares for insert to authenticated
with check ((select auth.uid()) = user_id);

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

create function private.get_shared_cart(p_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select items
  from public.cart_shares
  where id = p_id;
$$;

revoke all on function private.get_shared_cart(uuid) from public;
grant execute on function private.get_shared_cart(uuid) to anon, authenticated;

create function public.get_shared_cart(p_id uuid)
returns jsonb
language sql
stable
security invoker
set search_path = private
as $$
  select private.get_shared_cart(p_id);
$$;

revoke all on function public.get_shared_cart(uuid) from public;
grant execute on function public.get_shared_cart(uuid) to anon, authenticated;
