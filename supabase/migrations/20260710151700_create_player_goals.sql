create table if not exists public.player_goals (
  id uuid primary key default gen_random_uuid(),
  player_id text not null,
  role text not null,
  description text not null,
  progress integer not null default 0 check (progress between 0 and 100),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.player_goals enable row level security;

grant select on table public.player_goals to anon, authenticated;
grant insert, update, delete on table public.player_goals to authenticated;

create policy "Public player goals are readable" on public.player_goals for select using (true);
create policy "Admins can insert player goals" on public.player_goals for insert to authenticated with check (public.is_admin());
create policy "Admins can update player goals" on public.player_goals for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete player goals" on public.player_goals for delete to authenticated using (public.is_admin());
