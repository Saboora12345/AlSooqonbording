// Marketplace module — catalog search and service lookup across the five gateways.
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { EcosystemRepo } from "../lib/types.js";
import { ok, fail, sdg } from "../lib/format.js";

const CATEGORY = z.enum(["shop", "build", "travel", "education", "money"]);

export function registerMarketplaceTools(server: McpServer, repo: EcosystemRepo): void {
  server.registerTool(
    "marketplace_search_catalog",
    {
      title: "Search the alSooq catalog",
      description:
        "Search services and products across the five gateways (shop, build, travel, education, money). " +
        "Optionally filter by category and a free-text query. Returns verified merchants and illustrative prices.",
      inputSchema: {
        category: CATEGORY.optional().describe("Restrict to one gateway; omit to search all five."),
        query: z.string().max(120).optional().describe("Free-text match on name (AR/EN) or merchant."),
        limit: z.number().int().min(1).max(20).default(10).describe("Max results (1-20)."),
      },
      outputSchema: {
        count: z.number(),
        results: z.array(
          z.object({
            id: z.string(),
            category: CATEGORY,
            name_ar: z.string(),
            name_en: z.string(),
            price_sdg: z.number(),
            merchant: z.string(),
            verified: z.boolean(),
          }),
        ),
      },
      annotations: { readOnlyHint: true, openWorldHint: false, idempotentHint: true },
    },
    async ({ category, query, limit }) => {
      const results = repo.searchServices({ category, query, limit });
      const lines = results.map((s) => `• ${s.name_en} — ${sdg(s.price_sdg)} · ${s.merchant}${s.verified ? " ✓" : ""}`);
      return ok(
        results.length ? `Found ${results.length} result(s):\n${lines.join("\n")}` : "No matching services.",
        { count: results.length, results },
      );
    },
  );

  server.registerTool(
    "marketplace_get_service",
    {
      title: "Get one catalog service",
      description: "Fetch a single service/product by id (e.g. from marketplace_search_catalog results).",
      inputSchema: { id: z.string().describe("Service id, e.g. svc-shop-01.") },
      annotations: { readOnlyHint: true, openWorldHint: false, idempotentHint: true },
    },
    async ({ id }) => {
      const s = repo.getService(id);
      if (!s) return fail(`No service with id "${id}". Try marketplace_search_catalog first.`);
      return ok(`${s.name_en} (${s.name_ar}) — ${sdg(s.price_sdg)} · ${s.merchant}`, { service: s });
    },
  );
}
