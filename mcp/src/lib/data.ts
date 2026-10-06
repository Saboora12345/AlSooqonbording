// In-memory adapter for EcosystemRepo. Seeded with the prototype's illustrative
// figures. To go live, implement EcosystemRepo against Postgres or the alSooq
// REST API and pass that instance to the tool registrars in src/index.ts.

import type {
  CategoryId,
  EcosystemRepo,
  EscrowHold,
  Service,
  ShipmentQuote,
  Trip,
  Vehicle,
  VehicleState,
  Waybill,
} from "./types.js";

const SERVICES: Service[] = [
  { id: "svc-shop-01", category: "shop", name_ar: "سلة تسوّق منزلية", name_en: "Household basket", price_sdg: 42000, merchant: "Nile Retail", verified: true },
  { id: "svc-build-01", category: "build", name_ar: "أسمنت بورتلاندي (طن)", name_en: "Portland cement (ton)", price_sdg: 68000, merchant: "Atbara Materials", verified: true },
  { id: "svc-travel-01", category: "travel", name_ar: "تذكرة الخرطوم → بورتسودان", name_en: "Khartoum → Port Sudan ticket", price_sdg: 21000, merchant: "Mowasalaty", verified: true },
  { id: "svc-edu-01", category: "education", name_ar: "رسوم فصل جامعي", name_en: "University term fees", price_sdg: 150000, merchant: "U. of Khartoum", verified: true },
  { id: "svc-money-01", category: "money", name_ar: "حوالة الإمارات → الخرطوم", name_en: "Remittance UAE → Khartoum", price_sdg: 5000, merchant: "Hawil Bank", verified: true },
];

const TRIPS: Trip[] = [
  { id: "trip-01", from: "Khartoum", to: "Port Sudan", depart: "2026-09-22 07:00", fare_sdg: 21000, seats_left: 12, operator: "Mowasalaty" },
  { id: "trip-02", from: "Khartoum", to: "Atbara", depart: "2026-09-22 09:30", fare_sdg: 12000, seats_left: 4, operator: "Mowasalaty" },
  { id: "trip-03", from: "Khartoum", to: "Wad Madani", depart: "2026-09-22 08:15", fare_sdg: 9000, seats_left: 21, operator: "Mowasalaty" },
  { id: "trip-04", from: "Port Sudan", to: "Khartoum", depart: "2026-09-22 18:00", fare_sdg: 21000, seats_left: 9, operator: "Mowasalaty" },
];

const FLEET: Vehicle[] = [
  { id: "veh-01", plate: "KRT-1201", route: "Khartoum ↔ Port Sudan", state: "in_service" },
  { id: "veh-02", plate: "KRT-3320", route: "Khartoum ↔ Atbara", state: "in_service" },
  { id: "veh-03", plate: "KRT-5541", route: "Khartoum ↔ Wad Madani", state: "idle" },
  { id: "veh-04", plate: "KRT-7789", route: "Reserve", state: "maintenance" },
];

// Zone-based shipment pricing (Suda Express). Destination → { zone, base, per-kg, eta }.
const ZONES: Record<string, { zone: string; base: number; perKg: number; eta: number }> = {
  khartoum: { zone: "metro", base: 1500, perKg: 300, eta: 6 },
  "wad madani": { zone: "central", base: 2500, perKg: 450, eta: 12 },
  atbara: { zone: "north", base: 3500, perKg: 600, eta: 20 },
  "port sudan": { zone: "coast", base: 5000, perKg: 800, eta: 30 },
};

function zoneFor(destination: string) {
  return ZONES[destination.trim().toLowerCase()] ?? { zone: "outer", base: 6000, perKg: 950, eta: 40 };
}

let seq = 1000;
const nextId = (p: string) => `${p}-${++seq}`;
const now = () => new Date().toISOString();

export class InMemoryRepo implements EcosystemRepo {
  private escrows = new Map<string, EscrowHold>();
  private waybills = new Map<string, Waybill>();

  async listCategories(): Promise<CategoryId[]> {
    return ["shop", "build", "travel", "education", "money"];
  }

  async searchServices(q: { category?: CategoryId; query?: string; limit: number }): Promise<Service[]> {
    const needle = q.query?.trim().toLowerCase();
    return SERVICES.filter((s) => {
      if (q.category && s.category !== q.category) return false;
      if (needle && !(`${s.name_ar} ${s.name_en} ${s.merchant}`.toLowerCase().includes(needle))) return false;
      return true;
    }).slice(0, q.limit);
  }

  async getService(id: string): Promise<Service | undefined> {
    return SERVICES.find((s) => s.id === id);
  }

  async searchTrips(q: { from?: string; to?: string; date?: string; limit: number }): Promise<Trip[]> {
    const eq = (a: string, b?: string) => !b || a.toLowerCase() === b.trim().toLowerCase();
    return TRIPS.filter(
      (t) => eq(t.from, q.from) && eq(t.to, q.to) && (!q.date || t.depart.startsWith(q.date.trim())),
    ).slice(0, q.limit);
  }

  async fleet(state?: VehicleState): Promise<Vehicle[]> {
    return state ? FLEET.filter((v) => v.state === state) : FLEET;
  }

  async quoteShipment(weight_kg: number, destination: string): Promise<ShipmentQuote> {
    const z = zoneFor(destination);
    const total = Math.round(z.base + z.perKg * weight_kg);
    return { weight_kg, destination, zone: z.zone, base_sdg: z.base, per_kg_sdg: z.perKg, total_sdg: total, eta_hours: z.eta };
  }

  async createWaybill(order: string, quote: ShipmentQuote): Promise<Waybill> {
    const id = nextId("SX");
    const wb: Waybill = { id, order, quote, qr: `QR:${id}`, state: "issued", created_at: now() };
    this.waybills.set(id, wb);
    return wb;
  }

  async escrowHold(order: string, amount_sdg: number, release_on: string): Promise<EscrowHold> {
    const id = nextId("esc");
    const hold: EscrowHold = { id, order, amount_sdg, release_on, state: "held", created_at: now() };
    this.escrows.set(id, hold);
    return hold;
  }

  async escrowReleaseByOrder(order: string): Promise<EscrowHold | undefined> {
    const hold = [...this.escrows.values()].find((e) => e.order === order && e.state === "held");
    if (hold) hold.state = "released";
    return hold;
  }

  async getEscrow(id: string): Promise<EscrowHold | undefined> {
    return this.escrows.get(id);
  }
}
