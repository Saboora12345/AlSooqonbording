// Postgres adapter for EcosystemRepo. Activated when DATABASE_URL is set
// (see src/index.ts). Reads catalog/trips/fleet and writes waybills + escrow.
// Pricing zones stay in code (business config), matching the in-memory adapter.

import { Pool } from "pg";
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

const ZONES: Record<string, { zone: string; base: number; perKg: number; eta: number }> = {
  khartoum: { zone: "metro", base: 1500, perKg: 300, eta: 6 },
  "wad madani": { zone: "central", base: 2500, perKg: 450, eta: 12 },
  atbara: { zone: "north", base: 3500, perKg: 600, eta: 20 },
  "port sudan": { zone: "coast", base: 5000, perKg: 800, eta: 30 },
};
const zoneFor = (d: string) =>
  ZONES[d.trim().toLowerCase()] ?? { zone: "outer", base: 6000, perKg: 950, eta: 40 };

export class PostgresRepo implements EcosystemRepo {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async init(): Promise<void> {
    await this.pool.query("select 1");
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  async listCategories(): Promise<CategoryId[]> {
    return ["shop", "build", "travel", "education", "money"];
  }

  async searchServices(q: { category?: CategoryId; query?: string; limit: number }): Promise<Service[]> {
    const { rows } = await this.pool.query<Service>(
      `select id, category, name_ar, name_en, price_sdg, merchant, verified
         from services
        where ($1::text is null or category = $1)
          and ($2::text is null or (name_ar || ' ' || name_en || ' ' || merchant) ilike '%' || $2 || '%')
        order by id
        limit $3`,
      [q.category ?? null, q.query?.trim() || null, q.limit],
    );
    return rows;
  }

  async getService(id: string): Promise<Service | undefined> {
    const { rows } = await this.pool.query<Service>(
      `select id, category, name_ar, name_en, price_sdg, merchant, verified from services where id = $1`,
      [id],
    );
    return rows[0];
  }

  async searchTrips(q: { from?: string; to?: string; date?: string; limit: number }): Promise<Trip[]> {
    const { rows } = await this.pool.query<Trip>(
      `select id, "from", "to", depart, fare_sdg, seats_left, operator
         from trips
        where ($1::text is null or lower("from") = lower($1))
          and ($2::text is null or lower("to")   = lower($2))
          and ($3::text is null or depart like $3 || '%')
        order by depart
        limit $4`,
      [q.from ?? null, q.to ?? null, q.date?.trim() || null, q.limit],
    );
    return rows;
  }

  async fleet(state?: VehicleState): Promise<Vehicle[]> {
    const { rows } = await this.pool.query<Vehicle>(
      `select id, plate, route, state from vehicles where ($1::text is null or state = $1) order by id`,
      [state ?? null],
    );
    return rows;
  }

  async quoteShipment(weight_kg: number, destination: string): Promise<ShipmentQuote> {
    const z = zoneFor(destination);
    const total = Math.round(z.base + z.perKg * weight_kg);
    return { weight_kg, destination, zone: z.zone, base_sdg: z.base, per_kg_sdg: z.perKg, total_sdg: total, eta_hours: z.eta };
  }

  async createWaybill(order: string, quote: ShipmentQuote): Promise<Waybill> {
    const { rows } = await this.pool.query<{ id: string; created_at: string }>(
      `insert into waybills (order_ref, quote, state) values ($1, $2, 'issued')
       returning id, created_at`,
      [order, JSON.stringify(quote)],
    );
    const id = `SX-${rows[0].id}`;
    return { id, order, quote, qr: `QR:${id}`, state: "issued", created_at: rows[0].created_at };
  }

  async escrowHold(order: string, amount_sdg: number, release_on: string): Promise<EscrowHold> {
    const { rows } = await this.pool.query<{ id: string; created_at: string }>(
      `insert into escrow_holds (order_ref, amount_sdg, release_on, state)
       values ($1, $2, $3, 'held') returning id, created_at`,
      [order, amount_sdg, release_on],
    );
    return { id: `esc-${rows[0].id}`, order, amount_sdg, release_on, state: "held", created_at: rows[0].created_at };
  }

  async escrowReleaseByOrder(order: string): Promise<EscrowHold | undefined> {
    const { rows } = await this.pool.query<EscrowHold & { id: number; order_ref: string }>(
      `update escrow_holds set state = 'released'
        where id = (select id from escrow_holds where order_ref = $1 and state = 'held' order by id limit 1)
       returning id, order_ref as order, amount_sdg, release_on, state, created_at`,
      [order],
    );
    if (!rows[0]) return undefined;
    return { ...rows[0], id: `esc-${rows[0].id}` };
  }

  async getEscrow(id: string): Promise<EscrowHold | undefined> {
    const numeric = id.replace(/^esc-/, "");
    const { rows } = await this.pool.query<EscrowHold & { id: number; order_ref: string }>(
      `select id, order_ref as order, amount_sdg, release_on, state, created_at from escrow_holds where id = $1`,
      [numeric],
    );
    if (!rows[0]) return undefined;
    return { ...rows[0], id: `esc-${rows[0].id}` };
  }
}
