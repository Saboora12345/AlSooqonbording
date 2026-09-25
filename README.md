# السوق — Unified App · alSooq Unified App

One front door across the **Hawil ecosystem**. A self-contained, bilingual
(Arabic RTL / English LTR) prototype that ties the whole souk together and lets
you move along a single journey:

> **Category → Service → Role → App**

Browse the five categories, open a service, choose how you enter, and jump — in
one tap — into the **Customer app**, the **Merchant app**, or the embedded
**Bank** console.

## Pages

| File | What it is |
| --- | --- |
| `landing.html` | The **final marketing landing page** — the public entry point. Hero, the journey, categories, the three apps, Suda Express & embedded-banking spotlights, a live-metrics dashboard teaser, and CTAs into the app. Motion-rich: scroll reveals, animated counters, floating orbit, self-drawing widgets. |
| `index.html` | The **unified app** — the view-router product itself (Marketplace → Services → Customer / Merchant / Bank). Supports hash deep-links: `index.html#customer`, `#merchant`, `#merchant:express`, `#bank`. |
| `dashboard.html` | A **trendy, animated analytics dashboard** for the whole ecosystem — live KPIs with count-up + sparklines, a self-drawing GMV area chart, revenue bars, an animated escrow ring, remittance-corridor bars, Suda Express gauges, and a streaming live-activity feed. |
| `merchant-onboarding.html` | A **6-step merchant onboarding wizard** — choose a type (standard merchant / Suda Express), enter business details, verify identity (KYC via a partner bank), set up banking & escrow-settled payouts, configure type-specific operations, then review and launch. Live profile preview, per-step validation, animated stepper/progress, and a celebratory success screen that deep-links into the merchant console. |
| `mowasalaty.html` | The **Mowasalaty mobility console** — the transport module of the ecosystem (🚍 مواصلاتي). A tabbed, bilingual app: a **Dashboard** (trips overview, ticket-sales bars, fleet-status donut, top routes), a **Booking** flow (From / To / Date / Time → live trip search with fares & seats, booked through alSooq), **Tracking** (an animated live route map with a moving coach, stop markers, ETA and a status timeline), and **Fleet management** (vehicles table + maintenance schedule). Includes the public storefront **iframe** embed, **alSooq catalog sync**, and cross-traffic (an alSooq promo strip + market links). Uses the Mowasalaty blue/cyan brand on IBM Plex. *The AlSooq API Bearer token is never placed in client code — booking is documented to call `api.alsooq.com/mowasalaty/trips` through a server-side proxy.* |
| `mowasalaty-promax.html` | The **Mowasalaty ProMax** consumer app — a full-fidelity, phone-framed mobile prototype for the mobility passenger. A device-in-studio mockup with a live status bar, dynamic island and bottom tab bar, routing across ten interactive screens: **Home** (ProMax membership card, quick actions, a live next-trip card, popular routes), **Search** (From/To swap, date & class chips), **Results** (operator trips with ProMax pricing, seats and durations), an interactive **Seat map** (front-row ProMax seats, taken/selected states, live fare), **Checkout** (escrow-settled payment methods, ProMax discount breakdown), a **Boarding pass** (generated QR, gate/seat, live status), **Live tracking** (animated map with a moving coach along a route path, ETA ring and a trip timeline), the **Hawil wallet**, the **ProMax** membership tier, and a **Profile**. Bilingual RTL/LTR, keyboard-accessible cards, respects `prefers-reduced-motion`. Cross-links into the alSooq market (`index.html#customer`). Shares the Mowasalaty blue/cyan brand on IBM Plex, with gold reserved for the ProMax premium identity. |
| `merchant-workspace.html` | The **merchant's daily operating console** — the workspace an onboarded merchant lives in. Built around the ecosystem transaction flow **Request → Offer → Settlement → Trust**: an animated four-stage flow ribbon, a **live transaction board** where orders move through the stages, KPI tiles (sales, open orders, escrow-held, trust score), a **Hawil wallet** (balance, escrow, credit line, transfers), **usage-linked financing** offers scored on souk history, a **transparency & trust** panel (identity assertion, verification, escrow, animated trust ring), and an **expatriate-remittance** corridor view converting remittances into direct orders. |

The pages link to each other: landing → app + dashboard, dashboard → app + landing, and the app / onboarding / workspace hand off into the merchant console (`index.html#merchant` / `#merchant:express`).

## Run it

Open `landing.html` (or `index.html`) in any modern browser. No build step, no
dependencies — all CSS, JavaScript and icons are inlined per file. Fonts
(IBM Plex Sans / Sans Arabic) load from Google Fonts and fall back to system
fonts offline. Everything respects `prefers-reduced-motion`.

## What's inside `index.html`

The app is a small view-router with five surfaces that share one brand core and
one wallet.

| Surface | What it does |
| --- | --- |
| **Marketplace** (home) | Hero, search, the five category gateways, and the "choose how you enter" role cards (Customer / Merchant / Bank). |
| **Services** (drill-down) | Opens a category; each service exposes entry actions that route you to the right app — *as customer*, *as merchant*, *Suda Express*, or *as bank*. |
| **Customer app** | Phone mock: unified catalog, live Suda Express delivery tracking, and a Hawil wallet with escrow. |
| **Merchant app** | Phone mock with a **two-type switch**: the **standard merchant** (storefront, products, orders, escrow-settled payouts) and **Suda Express** (instant quote, waybill + QR, live jobs board, earnings). |
| **Bank console** | Embedded **Banking-as-a-Service**: accounts, escrow, remittance corridors, financing/BNPL, card issuing, KYC, and a BaaS API panel — plus partner-bank strip. |

### The two merchant types

- **تاجر عادي · Standard merchant** — runs a storefront: add products, take
  incoming orders, prepare and hand off to Suda Express, and receive
  escrow-settled payouts.
- **سودا إكسبريس · Suda Express** — the logistics partner: quotes shipments by
  weight and destination, issues waybills, runs a live jobs board, and confirms
  scan-to-handover (which releases the escrow hold).

### Embedded bank / financial services

A partner bank plugs its services into the souk so every customer and merchant
becomes a banking customer without leaving it — escrow-as-a-service (held until
handover, released on scan), diaspora remittance corridors with automated KYC,
rebuild financing/instalments scored on souk history, and card issuing.

## Design system

Follows the canonical alSooq brand shared with the rest of the site: the
**sand / ink / clay / palm / gold** palette, **IBM Plex Sans + Sans Arabic**,
fully bilingual RTL/LTR, clay as the accent, palm-green reserved for settled
money, and gold reserved for the Mwasalati mobility identity. Motion is
decelerating-only and respects `prefers-reduced-motion`.

## `site/` — reference prototypes

The original alSooq site set (public site, catalog SDK, order lifecycle, the
Suda Express merchant SDK, Mwasalati route atlas & negotiation, onboarding
motion, and the pitch/board decks) lives under [`site/`](./site) for context and
cross-linking. See [`site/README.md`](./site/README.md) for its structure.

---

*Prototype for review. All balances, figures and fares are illustrative; partner
and bank logos are added only after agreements.*
