import { pricingTiers, site, type PricingTierId } from "./site.ts";

export const PRODUCT_NAME = site.name;

export const TIER_BUYER_LABEL = {
  guide: "Guide",
  toolkit: "Toolkit",
  call: "Call",
} as const;

const PRODUCT_TIER_BY_PRICE = {
  "79": "guide",
  "149": "toolkit",
  "349": "call",
} as const;

export type BuyerProductTier = keyof typeof TIER_BUYER_LABEL;

export function productTierFromPriceId(priceId: PricingTierId): BuyerProductTier {
  return PRODUCT_TIER_BY_PRICE[priceId];
}

export function buyerTierLabel(tier: BuyerProductTier): string {
  return TIER_BUYER_LABEL[tier];
}

export function checkoutOffer(tierId: PricingTierId) {
  const tier = pricingTiers.find((item) => item.id === tierId);
  if (!tier) {
    throw new Error(`Unknown pricing tier ${tierId}`);
  }

  const productTier = productTierFromPriceId(tierId);
  const tierLabel = buyerTierLabel(productTier);

  return {
    productName: PRODUCT_NAME,
    productTier,
    tierLabel,
    amountUsd: tier.amountUsd,
    unitAmountCents: tier.amountUsd * 100,
  };
}

export function catalogAmountUsdForTier(tier: BuyerProductTier): number {
  const priceId =
    tier === "guide" ? "79" : tier === "toolkit" ? "149" : "349";
  return checkoutOffer(priceId).amountUsd;
}

export function stripeCheckoutLineItem(tierId: PricingTierId) {
  const offer = checkoutOffer(tierId);
  return {
    quantity: 1 as const,
    price_data: {
      currency: "usd" as const,
      unit_amount: offer.unitAmountCents,
      product_data: {
        name: `${offer.productName} — ${offer.tierLabel}`,
        description: offer.tierLabel,
      },
    },
  };
}
