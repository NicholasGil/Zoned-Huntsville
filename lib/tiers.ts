import { isPricingTierId, type PricingTierId } from "@/lib/site";
import type { EntitlementTier } from "@/lib/database";

export const CALL_SLOTS_PER_MONTH = 4;

export type EntitlementFlags = {
  hasGuide: boolean;
  hasToolkit: boolean;
  hasCall: boolean;
};

export function productTierFromPrice(price: PricingTierId): EntitlementTier {
  if (price === "79") {
    return "guide";
  }
  if (price === "149") {
    return "toolkit";
  }
  return "call";
}

export function flagsForProductTier(tier: EntitlementTier): EntitlementFlags {
  if (tier === "guide") {
    return { hasGuide: true, hasToolkit: false, hasCall: false };
  }
  if (tier === "toolkit") {
    return { hasGuide: true, hasToolkit: true, hasCall: false };
  }
  return { hasGuide: true, hasToolkit: true, hasCall: true };
}

export function flagsFromProductTiers(
  tiers: readonly string[],
): EntitlementFlags {
  let hasGuide = false;
  let hasToolkit = false;
  let hasCall = false;

  for (const raw of tiers) {
    if (raw !== "guide" && raw !== "toolkit" && raw !== "call") {
      continue;
    }
    const flags = flagsForProductTier(raw);
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

export function isPriceTierMetadata(value: string): value is PricingTierId {
  return isPricingTierId(value);
}
