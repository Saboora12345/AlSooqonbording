---
name: AlSooq / Financial Inclusion Sudan
description: Arabic-first, RTL design system for AlSooq, Mwasalati, Sudani Express and the Gentle Care executive deck.
colors:
  # Warm system (AlSooq app, deck, sudan-express)
  ground: "#FBFAF7"
  sand: "#F6F1E7"
  line: "#DCCFBB"
  ink: "#2E241B"
  clay: "#8A4B2A"
  gold: "#B8862F"
  palm: "#2F6B4F"
  deck-sand: "#E7DFCD"
  deck-coffee: "#6A3E1E"
  deck-ochre: "#B4822C"
  deck-navy-card: "#151A2B"
  deck-espresso: "#3A2412"
  # Cool system (Mwasalati transport app)
  mw-bg: "#EDF4F8"
  mw-ink: "#0B2A38"
  mw-navy: "#123251"
  mw-blue: "#0077B6"
  mw-cyan: "#0096C7"
  mw-line: "#CFDEE8"
  mw-green: "#1B9E77"
  mw-amber: "#C77D0A"
  # Sudan Express page
  se-navy: "#123251"
  se-amber: "#C77D0A"
  se-amber-text: "#B26B08"
  # Dark "field" pages (accounts, merchant-app)
  dk-bg: "#0D0A08"
  dk-line: "#2A221D"
  dk-text: "#FBF7F1"
  dk-clay: "#D9824F"
  dk-gold: "#E0B563"
  dk-palm: "#5FB88A"
  # Gentle Care corporate (approximate, from logo JPG; confirm hex with owner)
  gc-royal: "#1E5AA8"
  gc-sky: "#3FA9DD"
  gc-teal: "#2FB4B0"
  gc-navy: "#1B3E7C"
  gc-ground: "#F1F3F5"
typography:
  body-en:
    fontFamily: "IBM Plex Sans"
  body-ar:
    fontFamily: "IBM Plex Sans Arabic"
  code:
    fontFamily: "IBM Plex Mono"
rounded:
  card: 14px
  card-lg: 16px
motion:
  ease: "cubic-bezier(.16,1,.3,1)"
  fast: 150ms
---

# Design system

## Overview

Static HTML prototypes for the Sudanese market. Arabic is the primary language, so layouts are designed in RTL first and mirrored for English, not the other way around. The tone is calm and trustworthy: money screens should feel like a well-kept ledger, not a fintech ad.

## Colors

Two systems coexist, one per product. Don't blend them on one screen.

- **Warm (AlSooq, deck, Sudani Express):** `ground`/`sand` surfaces, `ink` text, `clay` as the single brand accent, `gold` for emphasis and highlights, `palm` for success and confirmed states. Hairlines use `line`.
- **Cool (Mwasalati):** `mw-bg` surface, `mw-ink` text, `mw-blue` primary, `mw-cyan` secondary. `mw-green` is success, `mw-amber` is warning.
- **Sudan Express page:** `ground` surface with `se-navy` as the primary and `se-amber` as the accent (`se-amber-text` where amber sits on light and needs contrast).
- **Dark field pages (accounts, merchant-app):** near-black surfaces with the clay and gold lifted for contrast (`dk-clay`, `dk-gold`, `dk-palm`). Same hues as the warm system, brighter values.
- **Gentle Care (corporate decks and documents only):** royal blue is the one accent, the rest are tints. The deck keeps the warm palette and shows the Gentle Care logo as a blue accent on a white chip; it is not re-skinned to blue.

One accent per screen. Everything else is neutral or a tint of the accent.

## Typography

IBM Plex Sans for Latin, IBM Plex Sans Arabic for Arabic, IBM Plex Mono for codes, ticket IDs, and amounts that must align. Use the CSS variables `--en`, `--ar`, `--mono` rather than hardcoding families. Arabic body text needs roughly 10% more line height than Latin at the same size.

## Layout and shape

RTL by default (`dir="rtl"`); use logical properties (`margin-inline-start`, `inset-inline-end`) so English mirrors cleanly. Cards use 14–16px radius with a soft, low-contrast shadow tinted with the ink color, never pure black.

## Numbers and currency

- Inside app UI: Arabic-Indic numerals and **ج.س** for Sudanese pounds.
- In English contexts and the cargo price list: SDG / EGP with Western digits.
- Real inputs on file: cargo 88 EGP/kg (Cairo → Khartoum); Mwasalati fares 3,000 / 8,000 / 15,000 SDG.
- Any KPI or chart without supplied real data is labeled illustrative ("SCHEMATIC · NOT ACTUALS"). Never present invented figures as actuals.

## Brand usage

- Gentle Care brands corporate decks and documents. Dhabna brands app/product screens. Don't mix the marks on one surface unless it's a partnership slide.
- The Gentle Care logo (`deck/assets/gentle-care.jpg`) has a light, non-transparent background: place it on a white chip. There is no transparent or SVG version yet; do not redraw or trace the pictorial mark.
- Central Bank of Sudan references stay removed. The running deck header is "Financial Inclusion Sudan".

## Motion

Use `--ease` (`cubic-bezier(.16,1,.3,1)`) on every page with 150ms for micro-interactions and longer for entrances. Respect `prefers-reduced-motion`.

## Do's and don'ts

- Do keep one accent per screen and test contrast on `sand` backgrounds.
- Do write copy in a direct human voice, in both languages. No stock filler phrases.
- Don't add a build step or framework; pages stay plain HTML/CSS/JS.
- Don't use emoji as icons in product UI.
- Don't invent contact details; WhatsApp +20 137259068 is as supplied and still needs confirming.
