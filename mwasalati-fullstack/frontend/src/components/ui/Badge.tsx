import type { FareTier } from "../../types";

const tierStyles: Record<FareTier, string> = {
  short: "bg-brand-gold/20 text-brand-brown",
  medium: "bg-brand-gold/40 text-brand-brown",
  long: "bg-brand-brown text-brand-white",
};

export function TierBadge({ tier, label }: { tier: FareTier; label: string }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${tierStyles[tier]}`}>
      {label}
    </span>
  );
}
