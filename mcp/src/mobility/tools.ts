// Mobility module (Mowasalaty) — intercity trip search and fleet status.
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { EcosystemRepo } from "../lib/types.js";
import { ok, sdg } from "../lib/format.js";

const STATE = z.enum(["in_service", "idle", "maintenance"]);

export function registerMobilityTools(server: McpServer, repo: EcosystemRepo): void {
  server.registerTool(
    "mobility_search_trips",
    {
      title: "Search Mowasalaty trips",
      description:
        "Find intercity coach trips by origin, destination and date. Returns fare, seats left and operator. " +
        "Booking is documented to go through a server-side proxy to api.alsooq.com/mowasalaty/trips.",
      inputSchema: {
        from: z.string().optional().describe("Origin city, e.g. Khartoum."),
        to: z.string().optional().describe("Destination city, e.g. Port Sudan."),
        date: z.string().optional().describe("Departure date prefix, e.g. 2026-09-22."),
        limit: z.number().int().min(1).max(20).default(10),
      },
      outputSchema: {
        count: z.number(),
        trips: z.array(
          z.object({
            id: z.string(),
            from: z.string(),
            to: z.string(),
            depart: z.string(),
            fare_sdg: z.number(),
            seats_left: z.number(),
            operator: z.string(),
          }),
        ),
      },
      annotations: { readOnlyHint: true, openWorldHint: false, idempotentHint: true },
    },
    async ({ from, to, date, limit }) => {
      const trips = repo.searchTrips({ from, to, date, limit });
      const lines = trips.map((t) => `• ${t.from} → ${t.to} · ${t.depart} · ${sdg(t.fare_sdg)} · ${t.seats_left} seats`);
      return ok(trips.length ? `Found ${trips.length} trip(s):\n${lines.join("\n")}` : "No trips match.", {
        count: trips.length,
        trips,
      });
    },
  );

  server.registerTool(
    "mobility_fleet_status",
    {
      title: "Mowasalaty fleet status",
      description: "List fleet vehicles and their state (in_service / idle / maintenance). Optionally filter by state.",
      inputSchema: { state: STATE.optional().describe("Filter to one state; omit for the whole fleet.") },
      outputSchema: {
        total: z.number(),
        vehicles: z.array(z.object({ id: z.string(), plate: z.string(), route: z.string(), state: STATE })),
      },
      annotations: { readOnlyHint: true, openWorldHint: false, idempotentHint: true },
    },
    async ({ state }) => {
      const vehicles = repo.fleet(state);
      const lines = vehicles.map((v) => `• ${v.plate} — ${v.route} [${v.state}]`);
      return ok(`${vehicles.length} vehicle(s):\n${lines.join("\n")}`, { total: vehicles.length, vehicles });
    },
  );
}
