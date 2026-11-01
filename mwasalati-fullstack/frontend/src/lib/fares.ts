import type { FareTier } from "../types";

/**
 * Locked fare baseline (confirmed 2026-09-13): fixed, non-negotiable per-seat
 * fares. Keep this in sync with backend/src/services/fare.service.ts — the
 * two are kept as separate, deliberately duplicated sources of truth so the
 * frontend can render fares instantly, with the backend as the final word at
 * booking time.
 */
export const FARE_TIERS: Record<FareTier, number> = {
  short: 3000,
  medium: 10000,
  long: 15000,
};

export const SEATS_PER_VAN = 14;

export function fareForTier(tier: FareTier): number {
  return FARE_TIERS[tier];
}

export function totalFare(tier: FareTier, seatCount: number): number {
  return fareForTier(tier) * seatCount;
}

export function formatSdg(amount: number, locale: "ar" | "en" = "ar"): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SD" : "en-US").format(amount) + " SDG";
}
