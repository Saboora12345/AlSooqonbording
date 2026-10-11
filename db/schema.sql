-- =============================================================================
-- MOWASALATI MOBILITY EXCHANGE — Canonical PostgreSQL schema
-- مواصلاتي · سوق سعة الحركة — نموذج البيانات المرجعي
--
-- Thesis: transportation capacity is tradable digital inventory. A seat is NOT
-- sold once per trip — each leg a passenger rides is its own revenue event, so
-- the SAME seat generates MULTIPLE income events in a single journey
-- (seat_revenue_events is the ledger that makes this a structural fact).
--
-- Core tables below follow the owner-authored shapes exactly; a clearly marked
-- "platform extensions" section adds RBAC, provider-agnostic money, pricing and
-- the investor financial model. Figures from the views are illustrative until
-- real operating data is loaded. Target: Sudan (Khartoum / Bahri / Omdurman);
-- expansion-ready for Egypt, Saudi Arabia, East Africa.
--
-- Conventions: UUID PKs (pgcrypto), timestamptz, snake_case, schema `mobility`,
-- NUMERIC(14,2) money (SDG default). PostGIS optional (lat/lng kept as columns
-- per the authored spec; a geography layer can be added later for GIS/dispatch).
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;              -- gen_random_uuid()

CREATE SCHEMA IF NOT EXISTS mobility;
SET search_path TO mobility, public;

-- -----------------------------------------------------------------------------
-- Enumerated types
-- -----------------------------------------------------------------------------
CREATE TYPE user_role      AS ENUM ('passenger','driver','operator','dispatcher','analyst','admin','superadmin');
CREATE TYPE entity_status   AS ENUM ('active','inactive','suspended','pending');
CREATE TYPE vehicle_status  AS ENUM ('idle','enroute','boarding','maintenance','offline');
CREATE TYPE trip_status_t   AS ENUM ('scheduled','boarding','enroute','completed','cancelled');
CREATE TYPE booking_status_t AS ENUM ('pending','confirmed','onboard','completed','cancelled','refunded');
CREATE TYPE demand_status_t  AS ENUM ('open','matched','served','expired');
CREATE TYPE payment_status   AS ENUM ('initiated','authorized','captured','failed','refunded');
CREATE TYPE ledger_direction AS ENUM ('credit','debit');

-- #############################################################################
-- A. CORE DOMAIN  ·  النطاق الأساسي  (owner-authored table shapes)
-- #############################################################################

-- users ------------------------------------------------------------------------
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name    TEXT        NOT NULL,
    last_name     TEXT        NOT NULL,
    mobile        TEXT        NOT NULL UNIQUE,
    email         TEXT        UNIQUE,
    role          user_role   NOT NULL DEFAULT 'passenger',
    password_hash TEXT        NOT NULL,
    status        entity_status NOT NULL DEFAULT 'active',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- passengers -------------------------------------------------------------------
CREATE TABLE passengers (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    national_id       TEXT,
    wallet_balance    NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (wallet_balance >= 0),
    subscription_plan TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- drivers (referenced by trips.driver_id; Admin: Drivers / Operator app) --------
CREATE TABLE drivers (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    license_no  TEXT NOT NULL,
    status      entity_status NOT NULL DEFAULT 'active',
    rating      NUMERIC(3,2) NOT NULL DEFAULT 5.00 CHECK (rating BETWEEN 0 AND 5),
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- vehicles ---------------------------------------------------------------------
CREATE TABLE vehicles (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plate_number  TEXT NOT NULL UNIQUE,
    vehicle_code  TEXT NOT NULL UNIQUE,              -- Bus-01, Bus-02, ...
    brand         TEXT,
    model         TEXT,
    year          INT CHECK (year BETWEEN 1970 AND 2100),
    seat_capacity INT  NOT NULL CHECK (seat_capacity > 0),
    status        vehicle_status NOT NULL DEFAULT 'idle',
    current_lat   DOUBLE PRECISION,
    current_lng   DOUBLE PRECISION,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- seats ------------------------------------------------------------------------
CREATE TABLE seats (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    seat_no    TEXT NOT NULL,                        -- A07, B12, ...
    status     entity_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (vehicle_id, seat_no)
);

-- routes -----------------------------------------------------------------------
CREATE TABLE routes (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_name       TEXT NOT NULL,
    start_point      TEXT NOT NULL,
    end_point        TEXT NOT NULL,
    distance_km      NUMERIC(8,2) NOT NULL CHECK (distance_km > 0),
    expected_duration INTERVAL,
    status           entity_status NOT NULL DEFAULT 'active',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- route_stops (ordered; consecutive stops imply the sellable segments) ---------
CREATE TABLE route_stops (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id    UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    stop_name   TEXT NOT NULL,
    lat         DOUBLE PRECISION NOT NULL,
    lng         DOUBLE PRECISION NOT NULL,
    sequence_no INT  NOT NULL,
    UNIQUE (route_id, sequence_no)
);

-- trips ------------------------------------------------------------------------
CREATE TABLE trips (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id     UUID NOT NULL REFERENCES vehicles(id),
    driver_id      UUID REFERENCES drivers(id),
    route_id       UUID NOT NULL REFERENCES routes(id),
    departure_time TIMESTAMPTZ NOT NULL,
    arrival_time   TIMESTAMPTZ,
    trip_status    trip_status_t NOT NULL DEFAULT 'scheduled'
);
CREATE INDEX idx_trips_route_dep ON trips(route_id, departure_time);

-- bookings (one seat over a stop range; the same seat is rebooked downstream) ---
CREATE TABLE bookings (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id        UUID NOT NULL REFERENCES trips(id),
    passenger_id   UUID NOT NULL REFERENCES passengers(id),
    seat_id        UUID NOT NULL REFERENCES seats(id),
    boarding_stop  UUID NOT NULL REFERENCES route_stops(id),
    dropoff_stop   UUID NOT NULL REFERENCES route_stops(id),
    fare           NUMERIC(14,2) NOT NULL CHECK (fare >= 0),
    booking_status booking_status_t NOT NULL DEFAULT 'pending',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bookings_trip_seat ON bookings(trip_id, seat_id);

-- seat_revenue_events — the ledger that proves "one seat, many revenue events".
-- One row per leg a seat is sold for on a trip; seat turnover = count of events
-- (distinct bookings) for a (seat_id, trip_id).
CREATE TABLE seat_revenue_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seat_id         UUID NOT NULL REFERENCES seats(id),
    trip_id         UUID NOT NULL REFERENCES trips(id),
    booking_id      UUID NOT NULL REFERENCES bookings(id),
    revenue         NUMERIC(14,2) NOT NULL CHECK (revenue >= 0),
    start_stop      UUID NOT NULL REFERENCES route_stops(id),
    end_stop        UUID NOT NULL REFERENCES route_stops(id),
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sre_seat_trip ON seat_revenue_events(trip_id, seat_id);
CREATE INDEX idx_sre_time ON seat_revenue_events(event_timestamp);

-- demand_requests — origin→destination signals feeding clustering/heatmaps ------
CREATE TABLE demand_requests (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    origin         TEXT NOT NULL,
    destination    TEXT NOT NULL,
    lat            DOUBLE PRECISION,
    lng            DOUBLE PRECISION,
    requested_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    status         demand_status_t NOT NULL DEFAULT 'open'
);
CREATE INDEX idx_demand_time ON demand_requests(requested_time);

-- subscriptions ----------------------------------------------------------------
CREATE TABLE subscriptions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    passenger_id UUID NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
    plan_type    TEXT NOT NULL,
    start_date   DATE NOT NULL,
    end_date     DATE,
    amount       NUMERIC(14,2) NOT NULL CHECK (amount >= 0)
);

-- ratings (Rider: Rating) ------------------------------------------------------
CREATE TABLE ratings (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    score      INT  NOT NULL CHECK (score BETWEEN 1 AND 5),
    comment    TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- #############################################################################
-- B. PLATFORM EXTENSIONS  ·  امتدادات المنصة
--    RBAC · provider-agnostic money · pricing · financial model · config
-- #############################################################################

-- RBAC (Admin: Permissions) ----------------------------------------------------
CREATE TABLE permissions (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,                 -- 'pricing.write','fleet.read',...
    description TEXT
);
CREATE TABLE role_permissions (
    role          user_role NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role, permission_id)
);

-- Provider-agnostic money (NOT tied to one financial service) -------------------
CREATE TABLE payment_providers (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code    TEXT NOT NULL UNIQUE,              -- 'wallet','card','cash','entro','bilbo',...
    name    TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true
);
CREATE TABLE payment_intents (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id  UUID NOT NULL REFERENCES bookings(id),
    provider_id UUID NOT NULL REFERENCES payment_providers(id),
    amount      NUMERIC(14,2) NOT NULL,
    status      payment_status NOT NULL DEFAULT 'initiated',
    external_ref TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Double-entry wallet ledger (passengers.wallet_balance is the materialized sum)
CREATE TABLE wallet_transactions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    passenger_id UUID NOT NULL REFERENCES passengers(id),
    direction    ledger_direction NOT NULL,
    amount       NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    reason       TEXT NOT NULL,                -- topup / fare / refund / subscription
    booking_id   UUID REFERENCES bookings(id),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Operator payouts: gross collected minus Exchange take, per period
CREATE TABLE settlements (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id    UUID REFERENCES drivers(id),
    period_start DATE NOT NULL,
    period_end   DATE NOT NULL,
    gross_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
    fee_amount   NUMERIC(14,2) NOT NULL DEFAULT 0,
    net_amount   NUMERIC(14,2) NOT NULL DEFAULT 0,
    status       payment_status NOT NULL DEFAULT 'initiated',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pricing (Admin: Pricing / dynamic revenue management) ------------------------
CREATE TABLE pricing_rules (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope        TEXT NOT NULL,                -- 'route' | 'stop_pair' | 'global'
    route_id     UUID REFERENCES routes(id),
    from_stop    UUID REFERENCES route_stops(id),
    to_stop      UUID REFERENCES route_stops(id),
    base_fare    NUMERIC(14,2),
    surge_factor NUMERIC(5,2) NOT NULL DEFAULT 1.00 CHECK (surge_factor >= 0),
    active       BOOLEAN NOT NULL DEFAULT true,
    valid_from   TIMESTAMPTZ NOT NULL DEFAULT now(),
    valid_to     TIMESTAMPTZ
);

-- Config (Admin: Configuration) ------------------------------------------------
CREATE TABLE app_config (key TEXT PRIMARY KEY, value TEXT NOT NULL);
INSERT INTO app_config(key, value) VALUES ('cost_per_km','45') ON CONFLICT DO NOTHING;  -- illustrative

-- Investor financial model (ROI/IRR/NPV/scenarios) -----------------------------
CREATE TABLE financial_scenarios (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    discount_rate NUMERIC(6,4) NOT NULL DEFAULT 0.20,
    assumptions   JSONB NOT NULL DEFAULT '{}',   -- fleet growth, take rate, turnover...
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE financial_cashflows (
    scenario_id UUID NOT NULL REFERENCES financial_scenarios(id) ON DELETE CASCADE,
    period      INT  NOT NULL,                  -- 0 = initial outlay (negative)
    amount      NUMERIC(16,2) NOT NULL,
    PRIMARY KEY (scenario_id, period)
);

CREATE OR REPLACE FUNCTION npv(p_rate NUMERIC, p_scenario UUID)
RETURNS NUMERIC LANGUAGE sql STABLE AS $$
    SELECT COALESCE(SUM(amount / power(1 + p_rate, period)), 0)
    FROM mobility.financial_cashflows WHERE scenario_id = p_scenario;
$$;

CREATE OR REPLACE FUNCTION irr(p_scenario UUID)
RETURNS NUMERIC LANGUAGE plpgsql STABLE AS $$
DECLARE lo NUMERIC := -0.9; hi NUMERIC := 1.0; mid NUMERIC; v NUMERIC; i INT := 0;
BEGIN
    IF npv(lo, p_scenario) * npv(hi, p_scenario) > 0 THEN RETURN NULL; END IF;  -- no sign change
    WHILE i < 100 LOOP
        mid := (lo + hi) / 2; v := npv(mid, p_scenario);
        IF abs(v) < 0.01 THEN RETURN round(mid, 6); END IF;
        IF npv(lo, p_scenario) * v < 0 THEN hi := mid; ELSE lo := mid; END IF;
        i := i + 1;
    END LOOP;
    RETURN round(mid, 6);
END; $$;

-- #############################################################################
-- C. AUTO-COMPUTED METRICS  ·  المؤشرات المحسوبة تلقائياً  (views)
--    Seat Turnover · Revenue/Seat · Revenue/KM · Revenue/Vehicle ·
--    Revenue/Route · Revenue/Driver · Demand Density · Route Profitability
-- #############################################################################

-- Seat turnover & revenue per seat (per trip, per seat).
CREATE OR REPLACE VIEW v_seat_turnover AS
SELECT sre.trip_id,
       sre.seat_id,
       COUNT(DISTINCT sre.booking_id) AS seat_turnover,       -- resale count on this trip
       SUM(sre.revenue)               AS revenue_per_seat
FROM seat_revenue_events sre
GROUP BY sre.trip_id, sre.seat_id;

-- Per-trip economics (revenue, revenue/km against the route distance, turnover).
CREATE OR REPLACE VIEW v_trip_metrics AS
SELECT t.id AS trip_id, t.route_id, t.vehicle_id, t.driver_id,
       COALESCE(SUM(sre.revenue), 0)                                   AS revenue,
       r.distance_km,
       ROUND(COALESCE(SUM(sre.revenue),0) / NULLIF(r.distance_km,0),2) AS revenue_per_km,
       COUNT(DISTINCT sre.booking_id)::NUMERIC
             / NULLIF(COUNT(DISTINCT sre.seat_id),0)                   AS avg_seat_turnover,
       COUNT(DISTINCT sre.seat_id)::NUMERIC
             / NULLIF(v.seat_capacity,0)                              AS occupancy
FROM trips t
JOIN routes r   ON r.id = t.route_id
JOIN vehicles v ON v.id = t.vehicle_id
LEFT JOIN seat_revenue_events sre ON sre.trip_id = t.id
GROUP BY t.id, t.route_id, t.vehicle_id, t.driver_id, r.distance_km, v.seat_capacity;

CREATE OR REPLACE VIEW v_revenue_per_vehicle AS
SELECT vehicle_id, SUM(revenue) AS revenue, ROUND(AVG(avg_seat_turnover),2) AS avg_turnover
FROM v_trip_metrics GROUP BY vehicle_id;

CREATE OR REPLACE VIEW v_revenue_per_route AS
SELECT route_id, SUM(revenue) AS revenue, ROUND(AVG(revenue_per_km),2) AS avg_revenue_per_km
FROM v_trip_metrics GROUP BY route_id;

CREATE OR REPLACE VIEW v_revenue_per_driver AS
SELECT driver_id, SUM(revenue) AS revenue, COUNT(*) AS trips
FROM v_trip_metrics WHERE driver_id IS NOT NULL GROUP BY driver_id;

-- Demand Density Score per origin (rolling window chosen by the caller).
CREATE OR REPLACE VIEW v_demand_density AS
SELECT origin,
       COUNT(*)                                            AS requests,
       COUNT(*) FILTER (WHERE status IN ('open','matched')) AS live_requests,
       ROUND(COUNT(*)::NUMERIC
             / NULLIF(COUNT(DISTINCT date_trunc('hour', requested_time)),0), 2) AS demand_density_score
FROM demand_requests
GROUP BY origin;

-- Route Profitability Score = (revenue - distance*cost_per_km) per km.
CREATE OR REPLACE VIEW v_route_profitability AS
SELECT t.route_id,
       SUM(t.revenue)                                                             AS revenue,
       MAX(t.distance_km)                                                         AS distance_km,
       SUM(t.revenue) - MAX(t.distance_km) * (SELECT value::NUMERIC FROM app_config WHERE key='cost_per_km')
                                                                                  AS gross_margin,
       ROUND((SUM(t.revenue) - MAX(t.distance_km) * (SELECT value::NUMERIC FROM app_config WHERE key='cost_per_km'))
             / NULLIF(MAX(t.distance_km),0), 2)                                   AS route_profitability_score
FROM v_trip_metrics t
GROUP BY t.route_id;

-- Investor headline tiles (Revenue today/month/year, turnover, fleet, occupancy).
CREATE OR REPLACE VIEW v_investor_metrics AS
SELECT
  (SELECT COALESCE(SUM(revenue),0) FROM seat_revenue_events
     WHERE event_timestamp >= date_trunc('day', now()))                      AS revenue_today,
  (SELECT COALESCE(SUM(revenue),0) FROM seat_revenue_events
     WHERE event_timestamp >= date_trunc('month', now()))                    AS revenue_month,
  (SELECT COALESCE(SUM(revenue),0) FROM seat_revenue_events
     WHERE event_timestamp >= date_trunc('year', now()))                     AS revenue_year,
  (SELECT ROUND(AVG(avg_seat_turnover),2) FROM v_trip_metrics)               AS avg_seat_turnover,
  (SELECT ROUND(AVG(occupancy),3) FROM v_trip_metrics)                       AS avg_occupancy,
  (SELECT COUNT(*) FROM vehicles WHERE status <> 'offline')                  AS active_vehicles,
  (SELECT COUNT(*) FROM drivers  WHERE status = 'active')                    AS active_drivers;

-- =============================================================================
-- WORKED EXAMPLE  ·  مثال المقعد A07  (the seat lifecycle, as rows)
-- Riyadh→Amarat 4,000 · Amarat→Jackson 3,000 · Jackson→Mogran 3,000 ·
-- Mogran→Sudan University 4,000  →  one seat, one journey, 14,000 SDG:
-- four bookings on the same (trip_id, seat_id='A07'), four seat_revenue_events.
-- v_seat_turnover then returns seat_turnover = 4, revenue_per_seat = 14,000.
-- (Seed rows live in db/seed_example.sql.)
-- =============================================================================
