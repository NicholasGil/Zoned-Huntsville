export const site = {
  name: "The Huntsville School Guide",
  domain: "huntsvilleschoolguide.com",
  url: "https://huntsvilleschoolguide.com",
  client: "Nicholas Gil",
} as const;

export const hero = {
  headline:
    "Huntsville has five school systems. Your address decides which one you get — and the map isn't the one you think.",
  subhead:
    "Every district, every magnet, every private school, every deadline, and every registration document in one place — each fact linked to its official source and stamped with the date we verified it. Built for families moving here on a ninety-day clock.",
  cta: "Get the Guide — $79",
  guarantee: "30-day money-back guarantee",
  credibility:
    "Sourced from the Alabama State Department of Education report card, NCES, each district's own published policy, and the schools themselves. Every claim is linked. Nothing here is a star rating.",
} as const;

export const pricingTiers = [
  { id: "79", amountUsd: 79, prominence: "default" },
  { id: "149", amountUsd: 149, prominence: "target" },
  { id: "349", amountUsd: 349, prominence: "default" },
] as const;

export type PricingTierId = (typeof pricingTiers)[number]["id"];

export function isPricingTierId(value: string): value is PricingTierId {
  return value === "79" || value === "149" || value === "349";
}
