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
  {
    id: "79",
    amountUsd: 79,
    prominence: "default",
    name: "The Guide",
    includes: [
      "Full guide, all districts, all schools, all programs.",
      "Web-based, mobile-readable, lifetime access to the current edition.",
    ],
  },
  {
    id: "149",
    amountUsd: 149,
    prominence: "target",
    name: "Guide + Toolkit",
    includes: [
      "Everything in the Guide.",
      "School Comparison Worksheet (pre-filled).",
      "Deadline Calendar.",
      "Registration Document Checklist per district.",
      "Call Script Pack.",
      "Zone-vs-Listing cross-check worksheet.",
    ],
  },
  {
    id: "349",
    amountUsd: 349,
    prominence: "default",
    name: "Guide + Toolkit + Call",
    includes: [
      "Everything in the Guide and Toolkit.",
      "One 45-minute video call with Nicholas.",
    ],
  },
] as const;

export type PricingTierId = (typeof pricingTiers)[number]["id"];

export function isPricingTierId(value: string): value is PricingTierId {
  return value === "79" || value === "149" || value === "349";
}
