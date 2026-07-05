-- Run this in Supabase SQL Editor (Dashboard > SQL)

create table if not exists products (
  id text primary key,
  name text not null,
  description text,
  price numeric not null,
  unit text not null,
  image text not null,
  category text not null check (category in ('meat','processed','poultry','dairy','cheese')),
  rating numeric default 4.5,
  is_available boolean default true,
  tag text,
  original_price numeric,
  min_quantity numeric,
  quantity_step numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at on row changes
create or replace function update_products_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on products;
create trigger products_updated_at
  before update on products
  for each row execute function update_products_updated_at();

alter table products enable row level security;

drop policy if exists "public can read products" on products;
create policy "public can read products"
  on products for select
  using (true);

drop policy if exists "authenticated can modify products" on products;
create policy "authenticated can modify products"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Enable Realtime: also add `products` in Dashboard > Database > Replication

-- Storage bucket (create via Dashboard > Storage > New bucket: product-images, Public)
-- Then run storage policies below in SQL Editor:

-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
-- on conflict (id) do update set public = true;

-- drop policy if exists "public read product images" on storage.objects;
-- create policy "public read product images"
--   on storage.objects for select
--   using (bucket_id = 'product-images');

-- drop policy if exists "authenticated upload product images" on storage.objects;
-- create policy "authenticated upload product images"
--   on storage.objects for insert
--   with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- drop policy if exists "authenticated update product images" on storage.objects;
-- create policy "authenticated update product images"
--   on storage.objects for update
--   using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- drop policy if exists "authenticated delete product images" on storage.objects;
-- create policy "authenticated delete product images"
--   on storage.objects for delete
--   using (bucket_id = 'product-images' and auth.role() = 'authenticated');
