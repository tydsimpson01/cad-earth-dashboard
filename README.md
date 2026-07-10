# CAD Earth Dashboard Prototype

A static front-end prototype for the CAD Earth amateur League of Legends team.

## Included

- Team overview
- Player development pages
- Match review cards
- Composition library
- Weekly goals
- Browser-local coach notes
- Responsive mobile layout
- CAD / CTRL ALT DEL-inspired visual identity

## Important

All statistics are placeholder demo data. Riot API integration, persistent database storage, authentication, and secure coach-note editing are not included in this prototype.

## Run locally

Open `index.html` directly in a browser, or use a simple local server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Free hosting

### Vercel

1. Create a free Vercel account.
2. Create a new project.
3. Upload this folder or connect a GitHub repository containing it.
4. Deploy.
5. Vercel will provide a free address similar to `cad-earth.vercel.app`.

### Netlify

You can also drag the unzipped folder into Netlify Drop for a quick public prototype.

## Recommended production upgrade

- Next.js application
- Supabase PostgreSQL database
- Supabase authentication for coach/admin editing
- Riot Games API integration
- Scheduled match synchronization
- Secure server-side API key handling
- Data Dragon champion and item assets
