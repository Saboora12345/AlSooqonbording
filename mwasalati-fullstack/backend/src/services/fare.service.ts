import type { FareTier } from "../types/index.js";

/**
 * Locked fare baseline (confirmed 2026-09-13): fixed, non-negotiable per-seat
 * fares. Keep this in sync with frontend/src/lib/fares.ts — see that file's
 * comment for why the duplication is deliberate.
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
