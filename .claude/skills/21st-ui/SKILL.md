---
name: 21st-ui
description: Pull UI components and inspiration from the 21st.dev MCP server and port them into the alSooq / Mowasalaty HTML pages. Use when adding or upgrading a section (hero, pricing, cards, nav, stats, forms) on any page in this repo, or when the user says "use 21st", "magic component", or asks to enhance a page's UI.
---

# 21st.dev components for alSooq

The `21st` MCP server is registered in `.mcp.json` (HTTP, `https://21st.dev/api/mcp`).
It reads the key from the `API_KEY_21ST` environment variable. Never paste the key
into `.mcp.json`, a page, or a commit.

If the server's tools are missing, check `/mcp`. The usual cause is that
`API_KEY_21ST` is not set in the shell (local) or in the environment's variables (cloud).

## How to use it here

21st.dev returns React + Tailwind. This repo ships **no build step**: every page is one
self-contained `.html` file with inlined CSS and vanilla JS. So a component is a
reference, not a drop-in.

1. Ask the MCP for the component that matches the section (e.g. "animated stats row",
   "pricing cards with toggle"). Pick one, read its markup and motion.
2. Rewrite it as plain HTML + CSS + vanilla JS inside the target page. No React, no
   Tailwind CDN, no new npm dependencies.
3. Map its colours to the page's existing CSS custom properties. Do not bring in the
   component's palette:
   - alSooq pages (`index`, `landing`, `dashboard`, `merchant-*`, `fractional`, `accounts`):
     sand / ink / clay / palm / gold. Clay is the accent, palm only for settled money,
     gold only for the Mowasalaty identity.
   - `mowasalaty.html`: the Mowasalaty blue/cyan tokens already defined in that file.
4. Fonts stay IBM Plex Sans + IBM Plex Sans Arabic.
5. Bilingual: every string gets its Arabic and English version using the page's existing
   language toggle pattern. Layout must work in both `dir="rtl"` and `dir="ltr"`. Use
   logical properties (`margin-inline-start`, `inset-inline-end`) instead of left/right.
6. Motion: decelerating easing only, and wrap it in
   `@media (prefers-reduced-motion: no-preference)` or honour the page's existing
   reduced-motion guard.
7. No secrets in client code. The AlSooq API Bearer token stays server-side (see README).

## Before committing

```bash
npm test   # html-validate + prettier --check
npm run format
```

Open the page and check it at phone width (360px) in both Arabic and English.
