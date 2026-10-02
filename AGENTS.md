# Base44 Dev Environment — alSooq Unified App

## What this is
A collection of static HTML prototype pages (Arabic RTL / English LTR) for the Hawil / alSooq ecosystem. No backend, no build step, no framework — just HTML/CSS/JS files served directly.

## Running it
```bash
docker compose -f docker-compose.base44.yml up -d
```
Serves on port 3000 via nginx:alpine. Source is bind-mounted read-only; edits are reflected on preview reload (call `reload_preview`).

## Key details
- The repo directory has restrictive (700) permissions, so nginx must run as `user root;` (see `nginx.dev.conf`). Without this, the nginx worker gets 403.
- Healthcheck uses `127.0.0.1` (not `localhost`) to avoid IPv6 resolution issues inside the container.
- Landing page is `landing.html`; the app router is `index.html` (supports hash deep-links like `#customer`, `#merchant`, `#bank`).
- No external credentials or secrets are needed — this is a pure frontend prototype.
- `package.json` only has dev tooling (prettier, html-validate); no runtime dependencies.

## Pages
`landing.html` (marketing entry), `index.html` (unified app), `dashboard.html` (analytics), `merchant-onboarding.html`, `merchant-workspace.html`, `merchant-app.html`, `accounts.html`, `fractional.html`, `mowasalaty.html`, `mowasalaty-promax.html`, `cross-sell.html`, `ecosystem.html`, `sudan-express.html`, `deck/index.html` (interactive deck).

## Testing
```bash
npm test   # runs html-validate + prettier --check
```
