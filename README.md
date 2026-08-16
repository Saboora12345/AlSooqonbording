# السوق — Unified App · alSooq Unified App

One front door across the **Hawil ecosystem**. A self-contained, bilingual
(Arabic RTL / English LTR) prototype that ties the whole souk together and lets
you move along a single journey:

> **Category → Service → Role → App**

Browse the five categories, open a service, choose how you enter, and jump — in
one tap — into the **Customer app**, the **Merchant app**, or the embedded
**Bank** console.

## Run it

Open `index.html` in any modern browser. No build step, no dependencies — all
CSS, JavaScript and icons are inlined in the single file. Fonts (IBM Plex Sans /
Sans Arabic) load from Google Fonts and fall back to system fonts offline.

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
