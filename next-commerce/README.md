# alSooq · Next.js skeleton

The `kit/` design DNA as a typed Next.js app (App Router, React 19): same `aq-*` markup and CSS, a
commerce-provider seam for Vercel's Next.js Commerce, bilingual with correct `lang`/`dir` on first paint.

```bash
cd next-commerce
npm install
npm run dev          # http://localhost:3000   (predev syncs ../kit)
npm run build && npm start
npm run typecheck    # tsc
npm run check:brand  # same 7 rules as the kit, over kit/ + this app
```

## One source of truth

`scripts/sync-kit.mjs` runs before dev/build/typecheck. It copies `kit/css/*` into `app/_kit/` and turns
`kit/js/sample-data.js` into `app/_kit/sample.json`. `app/_kit/` is git-ignored: **edit `kit/`, never the copy.**

```
app/layout.tsx          cookie → <html lang dir>, next/font IBM Plex, viewport-fit=cover
app/[vertical]/page.tsx marketplace | mobility | logistics (unknown → 404)
app/merchant/page.tsx   workspace that re-tints per vertical
components/             Navbar · ProductCard · CheckoutSteps · MerchantWorkspace · Hero · flows/*
lib/commerce.ts         CommerceProvider seam (mock today)
```

## Plugging in Next.js Commerce (Shopify)

Pages only call `commerce.getProducts()` / `getProduct()`. To go live, copy `lib/shopify` from
`vercel/commerce`, map its product to `Product`, implement `CommerceProvider`, export it as `commerce`.
Nothing in `app/` or `components/` changes. **Not implemented here on purpose:** it can't be verified without a store.
`CartProvider` (`components/Cart.tsx`) is in-memory behind four members; swap it for the provider's cart the same way.

## Deploy on Vercel

New project → Root Directory `next-commerce`, framework Next.js. Keep **"Include source files outside of
the Root Directory"** enabled: `sync-kit` reads `../kit` (it fails loudly with this hint if it can't).
The existing static site at the repo root is unaffected.

**Trade-off:** reading the language cookie in the root layout makes routes render per request. That is the
price of no RTL↔LTR flash. For fully static pages, drop the cookie and default to `ar`.

## Verified / not verified

Verified: `next build` passes; production server driven in Chromium: SSR `lang/dir` per cookie, vertical
accents on rendered gradients, full marketplace flow (cart → delivery → escrow → confirmed), required-field
blocking, focus moves to the new step, language flip + persistence, seat gating, logistics quote
(12.5 kg × 88 = 1,100 EGP), merchant re-tint, no horizontal scroll on any route, no console errors.

Not verified: a deploy to Vercel (not run from here), a live Shopify store, real devices, screen readers.
