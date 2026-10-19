# Mowasalati Mobility Exchange — API & Realtime Spec

> سوق سعة الحركة — واجهات البرمجة والبث اللحظي
>
> **Status: draft / schematic.** Illustrative contract for the national mobility
> marketplace. Core idea: transportation capacity is tradable digital inventory —
> a seat is not sold once; each leg is a revenue event (`seat_revenue_events`).
> Backs the data model in [`db/schema.sql`](./../db/schema.sql). All money is
> SDG unless stated. Bilingual payloads: fields carry `*_ar` / `*_en` where the
> value is user-facing text.

Base URL: `/api` · JSON over HTTPS · Bearer JWT in `Authorization`. Errors use
`{ "error": { "code": "...", "message_ar": "...", "message_en": "..." } }` with
standard HTTP status codes. List endpoints accept `?page`, `?limit`, `?q`, and
resource-specific filters; responses wrap rows in `{ data, page, total }`.

---

## 1. Auth · المصادقة

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create a user (+ passenger profile). Body: `first_name, last_name, mobile, email?, password, role?`. |
| POST | `/api/auth/login` | Exchange `mobile`/`email` + `password` for `{ access_token, refresh_token, user }`. |
| POST | `/api/auth/logout` | Revoke the current refresh token. |

RBAC: `users.role` is the coarse grant; fine-grained rights come from
`permissions` / `role_permissions`. Every non-auth endpoint checks a permission
code (e.g. `pricing.write`, `fleet.read`, `analytics.read`).

## 2. Passengers · الركاب

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/passengers` | List (admin/dispatcher). Filter `?status`, `?q` (name/mobile). |
| GET | `/api/passengers/{id}` | One passenger + wallet + active subscription. |
| POST | `/api/passengers` | Create profile for an existing user. |
| PUT | `/api/passengers/{id}` | Update profile / `subscription_plan`. |
| DELETE | `/api/passengers/{id}` | Soft-delete (sets user `status='inactive'`). |

## 3. Drivers · السائقون

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/drivers` | List; filter `?status`. |
| POST | `/api/drivers` | Onboard a driver (links a user, `license_no`). |
| PUT | `/api/drivers/{id}` | Update status / license / rating. |

## 4. Vehicles & Fleet · الأسطول

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/vehicles` | List fleet; filter `?status`, `?class`. |
| POST | `/api/vehicles` | Register a vehicle (`plate_number`, `vehicle_code`, `seat_capacity`, …). |
| PUT | `/api/vehicles/{id}` | Update details / status. |
| GET | `/api/vehicles/live` | Snapshot of live positions `[{ vehicle_code, lat, lng, status, trip_id }]` for the map (push updates arrive over Socket.IO). |

## 5. Bookings · الحجوزات

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/bookings` | Book a seat over a stop range. Body: `trip_id, seat_id, boarding_stop, dropoff_stop`. Server prices each covered leg, writes the `booking` and the per-leg `seat_revenue_events`, and rejects if any covered leg is already sold (no double-sell on the same segment). |
| GET | `/api/bookings` | List (passenger sees own; staff see all). Filter `?trip_id`, `?passenger_id`, `?status`. |
| GET | `/api/bookings/{id}` | One booking + its revenue events + QR boarding token. |
| POST | `/api/bookings/{id}/cancel` | Cancel/refund; frees the covered legs for resale downstream. |

> Note: cancellation is modelled as `POST …/cancel` (there is no `CANCEL` HTTP
> verb); it sets `booking_status='cancelled'` and releases the legs.

## 6. Analytics · التحليلات

All read-only, permission `analytics.read`; accept `?from`, `?to`, `?route_id`,
`?vehicle_id`, `?driver_id`. Backed by the SQL views in `db/schema.sql`.

| Method | Path | Returns (view) |
| --- | --- | --- |
| GET | `/api/analytics/revenue` | Revenue today/month/year + per route/vehicle/driver (`v_revenue_per_*`, `v_investor_metrics`). |
| GET | `/api/analytics/seat-turnover` | Seat Turnover Ratio + Revenue Per Seat (`v_seat_turnover`, rolled up). |
| GET | `/api/analytics/occupancy` | Load factor / occupancy per trip & fleet-wide (`v_trip_metrics`). |
| GET | `/api/analytics/fleet` | Active vehicles/drivers, utilisation, status mix. |
| GET | `/api/analytics/investor` | ROI, IRR, NPV, EBITDA, cash flow, valuation, scenario analysis (`financial_scenarios` + `npv()`/`irr()`), plus the headline tiles. |

**Auto-computed metrics** the platform exposes: Seat Turnover Ratio · Revenue
Per Seat · Revenue Per Kilometer · Revenue Per Vehicle · Revenue Per Route ·
Revenue Per Driver · Demand Density Score · Route Profitability Score.

---

## 7. Realtime · Socket.IO (البث اللحظي)

Namespace `/realtime`, JWT handshake, room per scope (e.g. `city:KRT`,
`route:{id}`, `trip:{id}`, `role:dispatcher`, `role:investor`). The server emits:

| Event | Payload (shape) | Consumers |
| --- | --- | --- |
| `vehicle-location-update` | `{ vehicle_code, lat, lng, speed_kmh, trip_id, ts }` | Control tower map, rider tracking |
| `live-bookings` | `{ booking_id, trip_id, seat_no, boarding_stop, dropoff_stop, fare }` | Ops, analytics |
| `seat-events` | `{ seat_id, trip_id, kind: 'sold'\|'released', revenue?, ts }` | Seat-turnover live views |
| `trip-events` | `{ trip_id, status, at_stop?, ts }` | Dispatch, rider |
| `route-events` | `{ route_id, change: 'reshaped'\|'surge', detail }` | Dispatch, pricing |
| `heatmap-update` | `{ cells: [{ lat, lng, intensity }], window }` | Demand heatmap layer |
| `driver-status-update` | `{ driver_id, status, lat?, lng? }` | Ops, admin |
| `demand-updates` | `{ origin, destination, requests, cluster_id? }` | Demand clusters, routing |
| `investor-metrics-update` | `{ revenue_today, seat_turnover, revenue_per_km, occupancy, … }` | Investor dashboard |

Clients may emit `subscribe { rooms: [...] }` / `unsubscribe { rooms: [...] }`.

---

## 8. Dashboards (surfaces)

**Investor dashboard tiles:** Revenue Today · Revenue Month · Revenue Year ·
Seat Turnover · Revenue Per KM · Revenue Per Seat · Active Drivers · Active
Vehicles · Occupancy · EBITDA · ROI · IRR · NPV.

**Control tower (Leaflet map) layers:** Heatmap · Traffic · Demand · Vehicle ·
Depots · Live Trips — with Filters (city, route, status, time window). Map data
comes from `GET /api/vehicles/live` + the `heatmap-update` / `demand-updates` /
`vehicle-location-update` streams; base tiles from a dark basemap provider.

**App surfaces:** Rider (Book · Subscription · Wallet · Trip History · Rating) ·
Operator/Driver (Trips · Routes · Wallet · Vehicle Status · Passengers) · Admin
(User Management · Pricing · Fleet · Drivers · Permissions · Configuration) ·
Operations (Fleet Monitoring · Live Dispatch · Demand Clusters · Resource
Allocation · Heatmaps) · Investor (Revenue Analytics · ROI/IRR/NPV · Cash Flow ·
Fleet Growth · Valuation · Scenario Analysis · Funding Dashboard).

---

## 9. Money — provider-agnostic · المال (غير مرتبط بمزوّد واحد)

Payments route through `payment_providers` (wallet / card / cash / Entro / Bilbo
/ …), so the platform is **not tied to a single financial service**. Fares settle
into a double-entry `wallet_transactions` ledger; operator payouts run through
`settlements` (gross − Exchange take). KYC/AML and specific rails are pluggable
per country for the Sudan → Egypt / Saudi Arabia / East Africa rollout.

---

_All figures and routes here are **SCHEMATIC · NOT ACTUALS** and are replaced
with real data once the platform is connected._
