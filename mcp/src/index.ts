#!/usr/bin/env node
// alSooq / Hawil ecosystem MCP server.
// Wires the three domain modules (marketplace, mobility, logistics) over stdio.
// Swap InMemoryRepo for a Postgres/REST adapter (implementing EcosystemRepo) to go live.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { EcosystemRepo } from "./lib/types.js";
import { InMemoryRepo } from "./lib/data.js";
import { registerMarketplaceTools } from "./marketplace/tools.js";
import { registerMobilityTools } from "./mobility/tools.js";
import { registerLogisticsTools } from "./logistics/tools.js";

// Connector selection: use Postgres when DATABASE_URL is set, else in-memory.
// pg is imported dynamically so the in-memory path has no hard dependency on it.
async function makeRepo(): Promise<EcosystemRepo> {
  const url = process.env.DATABASE_URL;
  if (!url) return new InMemoryRepo();
  const { PostgresRepo } = await import("./lib/pg.js");
  const repo = new PostgresRepo(url);
  await repo.init?.();
  console.error("alsooq-mcp: connected to Postgres");
  return repo;
}

async function main(): Promise<void> {
  const server = new McpServer({ name: "alsooq-mcp", version: "0.1.0" });
  const repo = await makeRepo();

  registerMarketplaceTools(server, repo);
  registerMobilityTools(server, repo);
  registerLogisticsTools(server, repo);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stdio servers must not write to stdout; use stderr for logs.
  console.error("alsooq-mcp running on stdio");

  const shutdown = async () => {
    await repo.close?.();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
