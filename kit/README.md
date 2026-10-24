# alSooq UI kit — one design DNA, every vertical

Shared tokens and bilingual (Arabic RTL / English LTR) components, inherited by the
marketplace, mobility and logistics verticals plus the merchant console.
No build step: open `kit/index.html` in a browser; it is plain static files, so any static host serves it as-is.

```
kit/
  css/tokens.css      the ONLY place colours and fonts are defined
  css/base.css        reset, bilingual type, a11y, mobile-native baseline
  css/components.css  buttons, nav, hero, product card, checkout steps, workspace, footer
  js/alsooq-ui.js     <aq-nav> <aq-footer> <aq-product-card> <aq-checkout> <aq-workspace>
  js/sample-data.js   every figure, flagged confirmed / illustrative / null
  index.html          hub          marketplace.html   mobility.html
  logistics.html      merchant.html
  scripts/check-brand.mjs
```

## Use it in a page

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
<link rel="stylesheet" href="css/tokens.css"><link rel="stylesheet" href="css/base.css"><link rel="stylesheet" href="css/components.css">
<script defer src="js/sample-data.js"></script><script defer src="js/alsooq-ui.js"></script>

<body data-vertical="mobility">          <!-- marketplace (default) | mobility | logistics -->
  <aq-nav current="mobility"></aq-nav>
  <main id="main">…</main>
  <aq-footer></aq-footer>
```

| Block | Contract |
| --- | --- |
| `<aq-nav current="">` | Logo at inline-start, vertical switcher, AR/EN toggle, CTA at inline-end. |
| `<aq-product-card sku name-ar name-en price currency merchant verified icon tag-ar tag-en>` | Fires a bubbling `aq:add` with `{sku, ar, en, price, currency}`. |
| `<aq-checkout steps='[{id,ar,en,next_ar?,next_en?}]'>` | Children `<section data-step="id">` are the panels. Native validation first, then a cancelable `aq:validate`; emits `aq:step`; moves focus to the new step's `<h3>`. `el.goTo(id)`. |
| `<aq-workspace vertical="">` | Merchant console shell (KPIs, Request → Offer → Settlement → Trust ribbon, orders). |

Text: `data-ar` / `data-en` on leaf elements are swapped by `AQ.setLang()`. Use `AQ.money(n,'SDG')`
for amounts: Arabic-Indic digits with ج.س in AR, Latin digits with SDG in EN.

## How verticals inherit

A vertical swaps only the accent trio (`--aq-accent`, `--aq-accent-deep`, `--aq-accent-ink`) via
`[data-vertical]`. Everything derived from it (gradients, tints, glow) is re-declared on
`:root, [data-vertical]`, **which matters**: a derived token declared only on `:root` resolves
there and every vertical inherits the clay value. `check-brand` R5 guards this.

To add a vertical: one block in `tokens.css`, one page with `<body data-vertical="…">`.

## Enforcement

```bash
node kit/scripts/check-brand.mjs            # kit/ + next-commerce/, exit 1 on any violation
```

| Rule | Checks |
| --- | --- |
| R1 colour | no raw hex/rgb outside `tokens.css` (a `theme-color` meta is the one exemption) |
| R2 font | `font-family` only via `var(--aq-ar\|en\|mono)`; tokens define IBM Plex Sans + Arabic |
| R3 logical | no `left`/`right` CSS: RTL must mirror by construction |
| R4 hover | every `:hover` inside `@media (hover: hover) and (pointer: fine)` |
| R5 derived | tokens referencing the accent are declared where `[data-vertical]` can change them |
| R6 page | `lang`+`dir`, `viewport-fit=cover`, zoom never disabled, `tokens.css` linked |
| R7 honesty | no hard-coded phone numbers |

## Colour decisions (measured, not eyeballed)

| Choice | Why |
| --- | --- |
| `--aq-ink-3` is `#7A6A58`, not the pages' `#93826F` | 3.3:1 on sand fails AA for small text; 4.6:1 passes |
| gold is decoration; gold **text** uses `--aq-gold-ink` `#8C6420` | `#B8862F` on sand is 2.9:1 |
| amber is never a white-text fill | white on `#C77D0A` is 3.3:1 |
| mobility text uses `#023E8A` | `#0077B6` on sand is 4.3:1; fills with white text are fine (4.9:1) |

## Data honesty (owner rules from `CLAUDE.md`)

`js/sample-data.js` is the only place figures live. `confirmed: true` means the owner supplied it.
Everything else is labelled "Illustrative" / "SCHEMATIC · NOT ACTUALS", and anything not supplied is a
visible `[PLACEHOLDER]`, never a guess.

| Confirmed by owner | Still missing (shown as placeholders) |
| --- | --- |
| Sudan Express: 88 EGP/kg, Cairo → Khartoum, general cargo | minimum weight, transit time, all-inclusive price, WhatsApp number (the supplied one looks a digit short), office addresses |
| Mwasalati fare amounts 3,000 / 8,000 / 15,000 SDG | tier names, boarding points |

Also unconfirmed: the Sudan Express navy/amber hex (taken from `sudan-express.html`), and the product
catalog, merchants and workspace figures (illustrative). The repo spells the logistics brand three ways
(Sudan Express / Sudani Express / Suda Express); the kit follows the deployed page name.

## About "Phenomenon Studio"

The brief asked for that studio's structure. Its site is blocked from the build environment and no
reference file was supplied, so **nothing here copies it**. The structure comes from the four blocks the
brief names plus this repo's existing pages. Send a screenshot or URL and I'll align the section rhythm.

## Verified

Real Chromium, real IBM Plex, AR + EN, desktop + 390px: every flow end to end, vertical re-tinting
(checked on rendered gradients, not just tokens), no horizontal scroll, no sub-44px controls, no console
errors; `html-validate` clean; `check-brand` negative-tested rule by rule. Not verified: real hardware
(sticky hover, keyboard, safe areas need a phone) and screen readers.
