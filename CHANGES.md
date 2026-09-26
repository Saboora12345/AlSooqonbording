# Changes — `claude/cool-goldberg-kgdqbs` (PR #14)

Three bodies of work on this branch: a UI/UX skill install, a design-system
redesign of the six prototype pages, and a modular MCP server for the ecosystem.

## 1 · UI/UX Pro Max skill
Installed the [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
suite into `.claude/skills/` (7 skills, 262 files) so Claude Code loads it in this
repo. The generated design system is saved to
`design-system/alsooq-unified/MASTER.md`.

## 2 · Design-system redesign (6 pages)
Elevated the existing sand/clay/gold brand through the skill's system — a layered
elevation scale (`--sh-1..4`), gold trust-accent tokens, gradient trust-forward
primary buttons, and a credibility proof strip on the landing hero. Brand, RTL and
reduced-motion preserved; `html-validate` error counts unchanged vs. base.

| File | Change |
| --- | --- |
| `landing.html` | +44 −10 — elevation, gradient CTA, proof strip, `type=button` fix |
| `index.html` | +11 −4 — elevation tokens + gradient CTA |
| `dashboard.html` | +9 −2 — deeper card elevation |
| `merchant-onboarding.html` | +11 −4 — elevation + gradient CTA |
| `merchant-workspace.html` | +9 −2 — elevation tokens |
| `mowasalaty.html` | +8 −2 — matching blue elevation scale |

## 3 · MCP server (`mcp/`)
A buildable TypeScript MCP server exposing the ecosystem as 8 tools across three
domain modules, behind one async connector seam (`EcosystemRepo`).

| Module | Tools |
| --- | --- |
| `marketplace/` | `marketplace_search_catalog`, `marketplace_get_service` |
| `mobility/` | `mobility_search_trips`, `mobility_fleet_status` |
| `logistics/` | `logistics_quote_shipment`, `logistics_create_waybill`, `escrow_hold`, `escrow_release_on_scan` |

- **Connector seam:** `DATABASE_URL` unset → `InMemoryRepo` (seeded); set →
  `PostgresRepo` (`mcp/src/lib/pg.ts`) with `mcp/schema.sql`.
- Registered as a project connector in `.mcp.json` (server `alsooq`).
- Verified: `tsc` build clean; an MCP client exercises all 8 tools.

Run: `cd mcp && npm install && npm run build && npm start`

## Verification
- `html-validate` error counts unchanged vs. base on every page.
- MCP server builds and all tools respond over the protocol.
- Isolated from the static prototype and its Vercel deployment.
