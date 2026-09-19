---
name: sudan-express-brand-ops
description: Create, refine, package, and deploy professional Sudan Express/Billion Express cargo assets and operational documents. Use for Egypt-to-Sudan per-kilo shipping menus, branded PDFs, All-Inclusive price materials, receipt-aligned layouts, WhatsApp/social/print collateral, consolidation and finance documents, or cloud deployment prompts for Alsooq and Mowasalaty.
---

# Sudan Express — Brand & Ops

Toolkit for producing Sudan Express / Billion Express cargo collateral (Egypt → Sudan)
and the operational documents around it. Owner: Abbas (abbas_sabir@hotmail.com).

## Honesty rules (do not skip)
- **Never invent prices, weights, transit times, fees, addresses, or phone numbers.**
  Take them from the owner or from a real receipt/price list. Until supplied, keep every
  such value as a bracketed placeholder — `[PRICE/KG EGP]`, `[ALL-INCLUSIVE EGP]`,
  `[WHATSAPP]`, `[CAIRO OFFICE]` — and say in the reply that placeholders remain.
- Brand assets not yet confirmed → mark them: `[LOGO]`, `[BRAND HEX]`. Do not trace or
  guess a logo.
- If the source is a receipt image/PDF, transcribe values exactly; flag anything unreadable.

## Brand tokens (fill these once, then reuse everywhere)
Confirm with owner, then replace across templates:
- Primary `[BRAND PRIMARY HEX]` · Accent `[BRAND ACCENT HEX]` · Ground `#FFFFFF` / ivory.
- Logo file: `[LOGO PATH]` (SVG/PNG, transparent preferred). Place on a white chip on
  dark grounds.
- Typography: IBM Plex Sans + IBM Plex Sans Arabic (Arabic-first, full RTL), Plex Mono
  for tracking numbers / weights / prices. (Matches the wider AlSooq ecosystem.)
- Contact block: WhatsApp `[WHATSAPP]`, Cairo office `[CAIRO ADDRESS]`, Khartoum office
  `[KHARTOUM ADDRESS]`.

## Asset catalog (each has/should have a template under `assets/`)
- **Per-kilo shipping menu** — `sudan-express.html` at the web root (built; deployed at
  `/sudan-express.html`). Cairo → Khartoum rate table by cargo class, min weight, transit,
  All-Inclusive highlight. Bilingual, print A4. All numbers are bracketed placeholders.
- **All-Inclusive price sheet** — one-price offer (pickup + customs + delivery). TODO.
- **Receipt-aligned layout** — mirrors the paper receipt fields for reconciliation. TODO.
- **WhatsApp / social card** — 1080×1350 or 1080×1080 promo. TODO.
- **Consolidation doc** — combine multiple senders into one shipment; per-sender split. TODO.
- **Finance doc** — cost/margin per shipment; settlement summary. TODO.

## Workflow
1. **Gather inputs** — ask for (or read from receipts): rates per kg by class, min weight,
   transit times, All-Inclusive price, prohibited items, insurance %, contact block, brand
   hex + logo. Do not proceed to final numbers without them.
2. **Pick the asset** from the catalog; copy its `assets/` template.
3. **Build** — bilingual AR/EN, RTL-correct, values from step 1 (else labeled placeholders).
   Apply the `taste` skill for layout; one accent color, generous whitespace, tabular
   numerals for prices/weights.
4. **Export** — print assets are A4/print-ready HTML; for a real `.pdf` use the `pdf` skill.
   Social cards export as PNG at the stated pixel size.
5. **Deploy (optional)** — to publish under Alsooq/Mowasalaty (Vercel): drop the print
   asset at a route (e.g. `/cargo/menu`), commit on the working branch, let Vercel build,
   share the preview URL. Public preview URLs need no login; note that to the owner.

## Notes
- Keep prices in EGP and/or SDG as the receipt states; show both numeral systems where the
  audience expects (٥٠٠ / 500).
- This skill is checked into the repo, so it loads in future Claude Code sessions here.
