import {
  checkoutSessionMetadata,
  checkoutSuccessUrl,
  type Attribution,
} from "./attribution.ts";
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

const STRIPE_LINE_SUFFIX = {
  "79": "Guide",
  "149": "Guide + Toolkit",
  "349": "Guide + Toolkit + Call",
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
  const stripeLineName = `${PRODUCT_NAME} — ${STRIPE_LINE_SUFFIX[tierId]}`;

  return {
    productName: PRODUCT_NAME,
    productTier,
    tierLabel,
    stripeLineName,
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
        name: offer.stripeLineName,
        description: STRIPE_LINE_SUFFIX[tierId],
      },
    },
  };
}

export function stripeCheckoutSessionParams(
  tierId: PricingTierId,
  siteUrl: string,
  attribution: Attribution = {},
) {
  const origin = siteUrl.replace(/\/+$/, "");
  return {
    mode: "payment" as const,
    line_items: [stripeCheckoutLineItem(tierId)],
    success_url: checkoutSuccessUrl(origin, attribution),
    cancel_url: `${origin}/#pricing`,
    metadata: checkoutSessionMetadata(tierId, attribution),
  };
}
