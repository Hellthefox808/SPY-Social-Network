# SocialGraph Atlas
Enterprise OSINT and Geointelligence Mapping Platform.

## Architecture
- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS.
- **Backend**: Next.js API Routes.
- **Database**: PostgreSQL (via Prisma).
- **Extraction Adapters**: GitHub, Reddit, Standard Web.
- **Geocoding**: OpenStreetMap Nominatim.

## Getting Started
1. `npm install`
2. Create `.env` from `.env.example`.
3. `npx prisma db push`
4. `npm run dev`
