import { isPricingTierId, type PricingTierId } from "@/lib/site";

export type EntitlementFlags = {
  hasGuide: boolean;
  hasToolkit: boolean;
  hasCall: boolean;
};

export function flagsForTier(tier: PricingTierId): EntitlementFlags {
  if (tier === "79") {
    return { hasGuide: true, hasToolkit: false, hasCall: false };
  }
  if (tier === "149") {
    return { hasGuide: true, hasToolkit: true, hasCall: false };
  }
  return { hasGuide: true, hasToolkit: true, hasCall: true };
}

export function flagsFromPaidTiers(
  tiers: readonly string[],
): EntitlementFlags {
  let hasGuide = false;
  let hasToolkit = false;
  let hasCall = false;

  for (const raw of tiers) {
    if (!isPricingTierId(raw)) {
      continue;
    }
    const flags = flagsForTier(raw);
    hasGuide = hasGuide || flags.hasGuide;
    hasToolkit = hasToolkit || flags.hasToolkit;
    hasCall = hasCall || flags.hasCall;
  }

  return { hasGuide, hasToolkit, hasCall };
}

export function utcMonthStart(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}
