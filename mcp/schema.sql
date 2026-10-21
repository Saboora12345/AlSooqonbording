-- alSooq MCP — Postgres schema for the PostgresRepo adapter.
-- Apply with:  psql "$DATABASE_URL" -f mcp/schema.sql

create table if not exists services (
  id        text primary key,
  category  text not null check (category in ('shop','build','travel','education','money')),
  name_ar   text not null,
  name_en   text not null,
  price_sdg integer not null,
  merchant  text not null,
  verified  boolean not null default false
);

create table if not exists trips (
  id         text primary key,
  "from"     text not null,
  "to"       text not null,
  depart     text not null,           -- "YYYY-MM-DD HH:mm"
  fare_sdg   integer not null,
  seats_left integer not null,
  operator   text not null
);

create table if not exists vehicles (
  id    text primary key,
  plate text not null,
  route text not null,
  state text not null check (state in ('in_service','idle','maintenance'))
);

create table if not exists waybills (
  id         bigserial primary key,
  order_ref  text not null,
  quote      jsonb not null,
  state      text not null default 'issued' check (state in ('issued','picked_up','delivered')),
  created_at timestamptz not null default now()
);

create table if not exists escrow_holds (
  id         bigserial primary key,
  order_ref  text not null,
  amount_sdg integer not null,
  release_on text not null default 'handover.scan',
  state      text not null default 'held' check (state in ('held','released','refunded')),
  created_at timestamptz not null default now()
);
create index if not exists escrow_holds_order_idx on escrow_holds (order_ref, state);

-- Seed (mirrors the in-memory adapter; illustrative figures)
insert into services (id, category, name_ar, name_en, price_sdg, merchant, verified) values
  ('svc-shop-01','shop','سلة تسوّق منزلية','Household basket',42000,'Nile Retail',true),
  ('svc-build-01','build','أسمنت بورتلاندي (طن)','Portland cement (ton)',68000,'Atbara Materials',true),
  ('svc-travel-01','travel','تذكرة الخرطوم → بورتسودان','Khartoum → Port Sudan ticket',21000,'Mowasalaty',true),
  ('svc-edu-01','education','رسوم فصل جامعي','University term fees',150000,'U. of Khartoum',true),
  ('svc-money-01','money','حوالة الإمارات → الخرطوم','Remittance UAE → Khartoum',5000,'Hawil Bank',true)
on conflict (id) do nothing;

insert into trips (id, "from", "to", depart, fare_sdg, seats_left, operator) values
  ('trip-01','Khartoum','Port Sudan','2026-09-22 07:00',21000,12,'Mowasalaty'),
  ('trip-02','Khartoum','Atbara','2026-09-22 09:30',12000,4,'Mowasalaty'),
  ('trip-03','Khartoum','Wad Madani','2026-09-22 08:15',9000,21,'Mowasalaty'),
  ('trip-04','Port Sudan','Khartoum','2026-09-22 18:00',21000,9,'Mowasalaty')
on conflict (id) do nothing;

insert into vehicles (id, plate, route, state) values
  ('veh-01','KRT-1201','Khartoum ↔ Port Sudan','in_service'),
  ('veh-02','KRT-3320','Khartoum ↔ Atbara','in_service'),
  ('veh-03','KRT-5541','Khartoum ↔ Wad Madani','idle'),
  ('veh-04','KRT-7789','Reserve','maintenance')
on conflict (id) do nothing;
