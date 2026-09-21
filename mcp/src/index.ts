#!/usr/bin/env node
// alSooq / Hawil ecosystem MCP server.
// Wires the three domain modules (marketplace, mobility, logistics) over stdio.
// Swap InMemoryRepo for a Postgres/REST adapter (implementing EcosystemRepo) to go live.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { InMemoryRepo } from "./lib/data.js";
import { registerMarketplaceTools } from "./marketplace/tools.js";
import { registerMobilityTools } from "./mobility/tools.js";
import { registerLogisticsTools } from "./logistics/tools.js";

async function main(): Promise<void> {
  const server = new McpServer({ name: "alsooq-mcp", version: "0.1.0" });
  const repo = new InMemoryRepo();

  registerMarketplaceTools(server, repo);
  registerMobilityTools(server, repo);
  registerLogisticsTools(server, repo);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stdio servers must not write to stdout; use stderr for logs.
  console.error("alsooq-mcp running on stdio");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
