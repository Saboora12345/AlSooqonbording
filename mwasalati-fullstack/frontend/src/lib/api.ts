import type { Booking, RouteSummary, Trip, WalletSummary } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${path}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getRoutes: () => request<RouteSummary[]>("/api/routes"),
  getRoute: (id: string) => request<RouteSummary>(`/api/routes/${id}`),
  getTripsForRoute: (routeId: string) => request<Trip[]>(`/api/routes/${routeId}/trips`),
  getTrip: (tripId: string) => request<Trip & { route: RouteSummary }>(`/api/trips/${tripId}`),
  holdSeats: (tripId: string, seatCount: number, boardingStopId: string) =>
    request<Booking>(`/api/bookings`, {
      method: "POST",
      body: JSON.stringify({ tripId, seatCount, boardingStopId }),
    }),
  getBooking: (bookingId: string) => request<Booking>(`/api/bookings/${bookingId}`),
  confirmBooking: (bookingId: string) =>
    request<Booking>(`/api/bookings/${bookingId}/confirm`, { method: "POST" }),
  getWallet: () => request<WalletSummary>("/api/wallet"),
};

/**
 * AlSooq marketplace client — separate base URL and bearer token, per the
 * project convention that credentials are never hardcoded. Both come from
 * .env.local only (see .env.example); this file must not gain a fallback
 * literal token, even for local testing.
 */
export async function alsooqRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = import.meta.env.VITE_ALSOQ_BEARER_TOKEN;
  const base = import.meta.env.VITE_ALSOQ_API_BASE_URL;
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`AlSooq API ${res.status} ${path}`);
  return res.json() as Promise<T>;
}
