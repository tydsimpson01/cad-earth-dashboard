create table if not exists public.coach_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.coach_notes enable row level security;

create policy "Public coach notes are readable" on public.coach_notes for select using (true);
create policy "Admins can insert coach notes" on public.coach_notes for insert to authenticated with check (public.is_admin());
create policy "Admins can update coach notes" on public.coach_notes for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete coach notes" on public.coach_notes for delete to authenticated using (public.is_admin());
