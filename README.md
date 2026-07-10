# CAD Earth Dashboard

A production-ready Next.js foundation for the CAD Earth amateur League of Legends coaching dashboard. The current app preserves the original prototype's CAD / CTRL ALT DEL visual identity, mock roster, match review cards, composition library, weekly goals, and browser-local coach notes while moving the codebase to a typed, componentized architecture.

## Current scope

- Next.js App Router application
- TypeScript with strict mode enabled
- Reusable React components for the dashboard shell, cards, navigation, and notes
- Typed models for players, matches, compositions, goals, team metrics, and coach notes
- Dedicated mock data module
- Coach notes persisted through a storage abstraction backed by browser `localStorage`
- Responsive CSS carried forward from the prototype
- Vercel-compatible project structure

## Not included yet

Riot API integration, Supabase authentication, persistent database storage, scheduled match synchronization, and secure coach-note editing are intentionally not connected yet. Use `.env.example` as the placeholder contract for future credentials and never commit real secrets.

## Local setup

1. Install Node.js 20 or newer.
2. Install dependencies:

```bash
npm install
```

3. Copy the environment template and fill values only when integrations are implemented:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

5. Open the app:

```text
http://localhost:3000
```

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
app/                  Next.js App Router entry points and global styles
components/           Reusable React UI components
data/                 Mock dashboard data
types/                Shared TypeScript domain models
lib/                  Client-side storage abstractions
.env.example          Future Riot and Supabase environment placeholders
```

## Future production milestones

1. Add Supabase auth and database persistence.
2. Add Riot account lookup, match ingestion, and scheduled sync.
3. Add Data Dragon champion and item assets.
4. Build real coaching analytics from normalized match data.
5. Add monitoring, deployment checks, and role-based admin editing.
