-- Artify database: run once in Supabase Dashboard > SQL Editor.
create table if not exists public.artify_user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  custom_art jsonb not null default '[]'::jsonb,
  orders jsonb not null default '[]'::jsonb,
  cart jsonb not null default '[]'::jsonb,
  wishlist jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.artify_user_data enable row level security;
drop policy if exists "Users can read own Artify data" on public.artify_user_data;
drop policy if exists "Users can insert own Artify data" on public.artify_user_data;
drop policy if exists "Users can update own Artify data" on public.artify_user_data;
create policy "Users can read own Artify data" on public.artify_user_data for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own Artify data" on public.artify_user_data for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own Artify data" on public.artify_user_data for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
