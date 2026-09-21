// Logistics module (Suda Express + escrow) — the Request → Offer → Settlement → Trust flow.
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { EcosystemRepo, ShipmentQuote } from "../lib/types.js";
import { ok, fail, sdg } from "../lib/format.js";

export function registerLogisticsTools(server: McpServer, repo: EcosystemRepo): void {
  server.registerTool(
    "logistics_quote_shipment",
    {
      title: "Quote a Suda Express shipment",
      description: "Price a shipment by weight and destination. Returns zone, base + per-kg breakdown, total and ETA.",
      inputSchema: {
        weight_kg: z.number().positive().max(2000).describe("Shipment weight in kilograms."),
        destination: z.string().describe("Destination city, e.g. Port Sudan."),
      },
      outputSchema: {
        weight_kg: z.number(),
        destination: z.string(),
        zone: z.string(),
        base_sdg: z.number(),
        per_kg_sdg: z.number(),
        total_sdg: z.number(),
        eta_hours: z.number(),
      },
      annotations: { readOnlyHint: true, openWorldHint: false, idempotentHint: true },
    },
    async ({ weight_kg, destination }) => {
      const q = repo.quoteShipment(weight_kg, destination);
      return ok(
        `${weight_kg} kg → ${destination} [${q.zone}]: ${sdg(q.total_sdg)} (base ${sdg(q.base_sdg)} + ${sdg(q.per_kg_sdg)}/kg), ETA ~${q.eta_hours}h`,
        q as unknown as Record<string, unknown>,
      );
    },
  );

  server.registerTool(
    "logistics_create_waybill",
    {
      title: "Issue a Suda Express waybill",
      description:
        "Create a waybill (with QR) for an order, quoting it by weight and destination. " +
        "Scanning the QR at handover is what releases the matching escrow hold.",
      inputSchema: {
        order: z.string().describe("Order reference, e.g. SX-4471."),
        weight_kg: z.number().positive().max(2000),
        destination: z.string(),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async ({ order, weight_kg, destination }) => {
      const quote: ShipmentQuote = repo.quoteShipment(weight_kg, destination);
      const wb = repo.createWaybill(order, quote);
      return ok(`Waybill ${wb.id} issued for ${order} — ${wb.qr}, ${sdg(quote.total_sdg)}.`, { waybill: wb });
    },
  );

  server.registerTool(
    "escrow_hold",
    {
      title: "Place an escrow hold",
      description: "Hold funds for an order until a release condition is met (default: handover.scan).",
      inputSchema: {
        order: z.string().describe("Order reference the hold secures."),
        amount_sdg: z.number().positive().describe("Amount to hold, in SDG."),
        release_on: z.string().default("handover.scan").describe("Release trigger, e.g. handover.scan."),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async ({ order, amount_sdg, release_on }) => {
      const hold = repo.escrowHold(order, amount_sdg, release_on);
      return ok(`Escrow ${hold.id} holding ${sdg(amount_sdg)} for ${order} (release on ${release_on}).`, { hold });
    },
  );

  server.registerTool(
    "escrow_release_on_scan",
    {
      title: "Release escrow on handover scan",
      description: "Release the held funds for an order once the waybill QR is scanned at handover.",
      inputSchema: { order: z.string().describe("Order reference whose held escrow to release.") },
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ order }) => {
      const hold = repo.escrowReleaseByOrder(order);
      if (!hold) return fail(`No held escrow found for order "${order}".`);
      return ok(`Escrow ${hold.id} released ${sdg(hold.amount_sdg)} for ${order}.`, { hold });
    },
  );
}
