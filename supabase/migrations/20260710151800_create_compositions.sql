create table if not exists public.compositions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  picks text[] not null default '{}',
  ratings jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.compositions enable row level security;

create policy "Public compositions are readable" on public.compositions for select using (true);
create policy "Admins can insert compositions" on public.compositions for insert to authenticated with check (public.is_admin());
create policy "Admins can update compositions" on public.compositions for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete compositions" on public.compositions for delete to authenticated using (public.is_admin());
