drop policy if exists "Admins can manage Riot matches"
  on public.riot_matches;

create policy "Admins can manage Riot matches"
  on public.riot_matches
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can manage Riot player matches"
  on public.riot_player_matches;

create policy "Admins can manage Riot player matches"
  on public.riot_player_matches
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());