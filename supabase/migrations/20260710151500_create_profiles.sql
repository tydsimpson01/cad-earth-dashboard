create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_admin = true
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_admin)
  values (new.id, new.email, false)
  on conflict (id) do nothing;
  return new;
end;
$$;

alter table public.profiles enable row level security;

create policy "Profiles are readable by self and admins" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "Admins can insert profiles" on public.profiles for insert to authenticated with check (public.is_admin());
create policy "Admins can update profiles" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete profiles" on public.profiles for delete to authenticated using (public.is_admin());

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
