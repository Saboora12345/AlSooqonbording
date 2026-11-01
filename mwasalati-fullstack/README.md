# Mwasalati (مواصلاتي) — Full-Stack Starter

A ready-to-run scaffold for the Mwasalati ride/transport platform: a React + TypeScript
frontend and a Node + TypeScript backend, wired together with the fare and booking rules
already locked for the project, and the official brand applied throughout.

This is a **starting point**, not the production app — it exists so a team can `npm install`
in both folders and immediately see a working, on-brand, bilingual booking flow instead of
a blank Vite template.

## What's in here

```
mwasalati-fullstack/
├── frontend/     React 18 + TypeScript + Vite + Tailwind + react-leaflet + i18next
└── backend/      Node + Express + TypeScript + Prisma (SQLite by default)
```

### Frontend

- Bilingual Arabic/English from the ground up: `i18next` + `react-i18next`, with a
  `useDirection` hook that flips `dir="rtl"/"ltr"` and swaps Montserrat ⇄ Noto Sans Arabic
  automatically when the language changes. No page reload needed.
- Brand tokens (`tailwind.config.js` + `src/styles/globals.css`) taken directly from the
  Mwasalati brand guideline: brown `#6D4C41`, cream `#F2E8D5`, gold `#C7A35A`,
  off-white `#FAF9F6`.
- A five-screen flow that matches the confirmed product mechanics: Home → Route Selection
  (map-based, react-leaflet) → Seat Booking → Ticket (QR) → Wallet.
- Fixed-fare logic (`src/lib/fares.ts`) mirrors the locked baseline: Short 3,000 SDG,
  Medium 10,000 SDG, Long 15,000 SDG, 14-seat cap per van, hold-to-confirm booking
  (no fare negotiation).
- `src/lib/api.ts` is a thin fetch wrapper pointed at the backend below, and at the AlSooq
  API via `VITE_ALSOQ_BEARER_TOKEN` — **never hardcode that token**; it's read from
  `.env.local` only (see `.env.example`).

### Backend

- Express + TypeScript, layered as routes → controllers → services, so business rules
  (fare calculation, seat holds) live in one testable place.
- Prisma schema modeling Route, Trip, Vehicle (14-seat cap), Booking, and Wallet, seeded
  with three illustrative routes (University Line, Bahri Crossing, East Nile Link) at the
  confirmed fare tiers.
- SQLite by default (zero setup) — swap the `DATABASE_URL` in `.env` for Postgres/MySQL
  later without touching application code, since Prisma abstracts the driver.

## Quick start

```bash
# backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev            # http://localhost:4000

# frontend (new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev            # http://localhost:3000
```

The frontend dev server is pinned to port 3000 (not Vite's default 5173) to match the
existing Mwasalati sandbox convention — see `vite.config.ts`.

## Conventions carried over from the existing Mwasalati codebase

- Vite dev server on port **3000**.
- `src/vite-env.d.ts` is committed so `import.meta.env.VITE_*` type-checks.
- react-leaflet's default marker icons are overridden with explicit CDN URLs
  (`src/components/map/RouteMap.tsx`) — the bundler otherwise breaks Leaflet's default
  icon paths.
- No secrets in source. `VITE_ALSOQ_BEARER_TOKEN` and `DATABASE_URL` live only in
  `.env` / `.env.local`, both git-ignored.

## Extending it

- Add a new screen: drop a component in `frontend/src/pages`, register it in
  `frontend/src/routes/router.tsx`.
- Add a new API resource: add a Prisma model, a service, a controller, a route file, then
  mount it in `backend/src/app.ts` — the existing four resources are the template to copy.
- Change the fare table: edit `FARE_TIERS` in `frontend/src/lib/fares.ts` **and**
  `backend/src/services/fare.service.ts` (kept in sync deliberately rather than shared
  over the wire, since the frontend needs it for instant UI feedback before the booking
  round-trip confirms it).
