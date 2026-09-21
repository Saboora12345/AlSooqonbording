// Shared domain types for the alSooq / Hawil ecosystem.
// These mirror the surfaces in the HTML prototype (marketplace, mobility, logistics)
// so the MCP tools speak the same language as the product.

export type CategoryId = "shop" | "build" | "travel" | "education" | "money";

export interface Service {
  id: string;
  category: CategoryId;
  name_ar: string;
  name_en: string;
  price_sdg: number; // illustrative, prototype figures
  merchant: string;
  verified: boolean;
}

export interface Trip {
  id: string;
  from: string;
  to: string;
  depart: string; // ISO-ish "YYYY-MM-DD HH:mm"
  fare_sdg: number;
  seats_left: number;
  operator: string;
}

export type VehicleState = "in_service" | "idle" | "maintenance";

export interface Vehicle {
  id: string;
  plate: string;
  route: string;
  state: VehicleState;
}

export type EscrowState = "held" | "released" | "refunded";

export interface EscrowHold {
  id: string;
  order: string;
  amount_sdg: number;
  release_on: string; // e.g. "handover.scan"
  state: EscrowState;
  created_at: string;
}

export interface ShipmentQuote {
  weight_kg: number;
  destination: string;
  zone: string;
  base_sdg: number;
  per_kg_sdg: number;
  total_sdg: number;
  eta_hours: number;
}

export interface Waybill {
  id: string;
  order: string;
  quote: ShipmentQuote;
  qr: string;
  state: "issued" | "picked_up" | "delivered";
  created_at: string;
}

// Repository seam — swap the in-memory adapter for Postgres / a REST API
// by implementing this interface. Nothing else in the server changes.
export interface EcosystemRepo {
  listCategories(): CategoryId[];
  searchServices(q: { category?: CategoryId; query?: string; limit: number }): Service[];
  getService(id: string): Service | undefined;

  searchTrips(q: { from?: string; to?: string; date?: string; limit: number }): Trip[];
  fleet(state?: VehicleState): Vehicle[];

  quoteShipment(weight_kg: number, destination: string): ShipmentQuote;
  createWaybill(order: string, quote: ShipmentQuote): Waybill;

  escrowHold(order: string, amount_sdg: number, release_on: string): EscrowHold;
  escrowReleaseByOrder(order: string): EscrowHold | undefined;
  getEscrow(id: string): EscrowHold | undefined;
}
