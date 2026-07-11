# CAD Earth Dashboard

A production-ready Next.js foundation for the CAD Earth amateur League of Legends coaching dashboard. The public dashboard still uses the mock roster, team statistics, match reviews, and starter player goals/compositions while Milestone 2 adds Supabase-backed authentication and storage for coach/admin editing.

## Current scope

- Next.js App Router application with TypeScript strict mode
- Publicly readable dashboard pages
- Mock team statistics and player roster preserved for the current milestone
- Supabase Auth login/logout for coach/admin users
- Supabase-backed coach notes replacing browser `localStorage`
- Admin-only create, update, and delete flows for coach notes, weekly goals, and saved compositions
- PostgreSQL migrations for `profiles`, `coach_notes`, `player_goals`, and `compositions`
- Row Level Security enabled on every application table with public `SELECT` and admin-only write policies

## Not included yet

Scheduled synchronization, database-backed Riot match ingestion, and Data Dragon assets are intentionally not connected yet. Never commit real secrets.

## Local setup

1. Install Node.js 20 or newer.
2. Install dependencies:

```bash
npm install
```

3. Copy the environment template:

```bash
cp .env.example .env.local
```

4. Fill in the Supabase values from your Supabase project settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

Only public Supabase client variables are used by the app. Do not add a Supabase service-role key to browser code or commit one to the repository.

5. Start the development server:

```bash
npm run dev
```

6. Open the public app at `http://localhost:3000` or the admin login at `http://localhost:3000/login`.

## Supabase setup

1. Create a Supabase project.
2. In Supabase Auth settings, configure your local and production Site URL / Redirect URLs.
3. Apply the migrations in `supabase/migrations` with the Supabase CLI:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Alternatively, run the SQL files in timestamp order in the Supabase SQL editor.

The migrations create:

- `profiles` for user metadata and the `is_admin` flag
- `coach_notes` for public coach-note display
- `player_goals` for editable weekly goals
- `compositions` for saved draft compositions

Every table has RLS enabled. Public dashboard reads are allowed through `SELECT` policies, while `INSERT`, `UPDATE`, and `DELETE` policies require an authenticated user whose profile has `is_admin = true`.

## Create the first admin user

1. The project owner signs up or creates the first coach user in Supabase Auth.
2. The `profiles` migration automatically creates a profile row for new Auth users.
3. The project owner manually opens the Supabase SQL Editor and promotes that first user to admin with the bootstrap SQL below, replacing `OWNER_EMAIL` with the owner's actual email address:

```sql
update public.profiles
set is_admin = true
where email = 'OWNER_EMAIL';
```

This bootstrap SQL is a one-time manual owner action in Supabase. It is not exposed through the application, and there is no public app flow for granting admin rights.

4. Sign in at `/login` with that user. Admin users can manage notes, weekly goals, and compositions at `/admin`.

## Available scripts

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Creates a production build suitable for Vercel.

```bash
npm run lint
```

Runs ESLint with the Next.js core web vitals configuration.

```bash
npm run typecheck
```

Runs the TypeScript compiler in no-emit mode.

## Project structure

```text
app/                  Next.js App Router routes, auth/admin pages, global styles
components/           Reusable React UI components
data/                 Mock dashboard data retained for current public views
lib/supabase/         Browser and server Supabase clients using @supabase/ssr
supabase/migrations/  PostgreSQL schema and RLS policy migrations
types/                Shared TypeScript domain and Supabase database types
.env.example          Public environment variable template
```


## Riot API read-only setup

Milestone 3 adds server-side, read-only Riot Account-v1 and Match-v5 connectivity for the CAD Earth roster. Riot requests are made only from Server Components and server actions. `RIOT_API_KEY` must stay server-only and must never be prefixed with `NEXT_PUBLIC_`.

### Environment variables

```bash
RIOT_API_KEY=RGAPI-your-development-or-production-key
RIOT_ROUTING_REGION=americas
RIOT_RECENT_MATCH_COUNT=3
```

- `RIOT_API_KEY` is read from the server environment for Account-v1 and Match-v5 calls.
- `RIOT_ROUTING_REGION` defaults to `americas`, which is required for the current North American roster.
- `RIOT_RECENT_MATCH_COUNT` is capped at five per player so local testing does not burn through a development key.

### Development-key expiration and rate limits

Riot development keys expire regularly and can return 401 or 403 when missing, expired, invalid, or disallowed. Generate a fresh key from the Riot developer portal and restart the Next.js server after changing `.env.local`.

The admin status page intentionally imports only a small recent-match sample per player. If Riot returns 429, wait for the `Retry-After` value shown in the UI before testing again.

### Testing the connection

1. Sign in as a Supabase admin.
2. Open `/admin/riot`.
3. Click **Test Riot connection**.
4. Confirm each roster Riot ID either resolves to a PUUID and recent Match-v5 sample or shows a clear error.

The Riot status page does not write to Supabase and does not overwrite existing coach notes, goals, compositions, profiles, RLS policies, or public dashboard data.
