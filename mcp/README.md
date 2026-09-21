# alSooq MCP Server

An [MCP](https://modelcontextprotocol.io) server that exposes the **alSooq / Hawil
ecosystem** as tools an LLM can call. It turns the prototype's documented flows into a
modular, reusable server organised by domain.

## Modules

| Folder | Domain | Tools |
| --- | --- | --- |
| `src/marketplace/` | Catalog across the five gateways | `marketplace_search_catalog`, `marketplace_get_service` |
| `src/mobility/` | Mowasalaty intercity transport | `mobility_search_trips`, `mobility_fleet_status` |
| `src/logistics/` | Suda Express + escrow (Request → Offer → Settlement → Trust) | `logistics_quote_shipment`, `logistics_create_waybill`, `escrow_hold`, `escrow_release_on_scan` |

## Run

```bash
cd mcp
npm install
npm run build
npm start          # stdio server
npm run inspect    # open the MCP Inspector against it
```

## Connect (Claude Code / any MCP client)

```json
{
  "mcpServers": {
    "alsooq": {
      "command": "node",
      "args": ["mcp/dist/index.js"]
    }
  }
}
```

## Going live — the connector seam

All data flows through one interface: **`EcosystemRepo`** (`src/lib/types.ts`).
The default `InMemoryRepo` (`src/lib/data.ts`) is seeded with the prototype's
illustrative figures. To attach a real backend, implement `EcosystemRepo` against
Postgres or the alSooq REST API and pass that instance in `src/index.ts` — no tool
code changes:

```ts
// const repo = new InMemoryRepo();
const repo = new PostgresRepo(process.env.DATABASE_URL!); // implements EcosystemRepo
```

Keep secrets (DB URL, `api.alsooq.com` bearer token) in environment variables — never
in client code, matching the prototype's server-side-proxy rule for
`api.alsooq.com/mowasalaty/trips`.

## Notes

- stdio transport: logs go to **stderr**; stdout carries the protocol only.
- Every tool declares an input/output schema (Zod) and annotations
  (`readOnlyHint`, `destructiveHint`, `idempotentHint`).
- This folder is self-contained and does not affect the static prototype or its
  Vercel deployment.
