# MDCMS Integration

This branch adds a live MDCMS integration and a small preview UI for Neurodigest-Podcast. It includes:

- lib/mdcms.ts — server wrapper that calls your MDCMS instance (Authorization: Bearer MDCMS_API_KEY)
- lib/markdownServer.ts — markdown -> sanitized HTML helpers (marked + dompurify + jsdom)
- lib/firebaseAdmin.ts + lib/firebaseClient.ts — Firebase init for server/client
- NextAuth route (app/api/auth/[...nextauth]/route.ts) — configured for Google provider (placeholders)
- Favorites API (app/api/favorites/route.ts) — Firestore-backed endpoints (JWT sessions)
- Episode page (app/episode/[slug]/page.tsx) — server component rendering show notes + audio waveform
- Preview page (app/mdcms-preview/page.tsx) — lists episodes from MDCMS or sample data
- components/PlayerWaveform.tsx — wavesurfer.js waveform + controls (client)
- components/EpisodeCard.tsx, components/Player.tsx
- data/mdcms-sample.json — sample data used when MDCMS env not provided

.env.example

Copy this file to `.env.local` and fill in your values:

MDCMS_BASE_URL=https://api.mdcms.ai
MDCMS_API_KEY=

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

Run locally:

1. npm install
2. cp .env.example .env.local and fill values (or leave MDCMS_API_KEY empty to use demo data)
3. npm run dev
4. Visit http://localhost:3000/mdcms-preview to preview episodes

Notes:
- Waveform generation requires CORS on audio sources. For non-CORS audio the player falls back to native audio controls.
- Do not commit private keys. Store them as repo/host secrets in production.
