export const site = {
  name: "The Huntsville School Guide",
  domain: "huntsvilleschoolguide.com",
  url: "https://huntsvilleschoolguide.com",
  client: "Nicholas Gil",
} as const;

export const edition = "2026–27" as const;

export const officialPortals = [
  {
    label: "Alabama Achieves Reports & Data",
    href: "https://www.alabamaachieves.org/reports-data/",
  },
  {
    label: "ALSDE State Report Card",
    href: "https://statereportcard.alsde.edu",
  },
  {
    label: "ALSDE School Report Card",
    href: "https://reportcard.alsde.edu/SelectSchool.aspx",
  },
  {
    label: "NCES district search",
    href: "https://nces.ed.gov/ccd/districtsearch/",
  },
] as const;

export const namedSources = {
  alsdeReportCard: {
    label: "Alabama State Department of Education report card",
    href: "https://statereportcard.alsde.edu",
  },
  nces: {
    label: "NCES",
    href: "https://nces.ed.gov/ccd/districtsearch/",
  },
} as const;

export const hero = {
  headline: "Want the zone details before you sign?",
  proofLineAboveFold:
    "The address decides the district — not the city name on the listing.",
  proofBeatsBelowFold: [
    "Built for PCS / Redstone moves and local parents (Huntsville · Madison · Athens · Limestone)",
    "Official, dated sources over star-rating fluff",
  ] as const,
  proofBeats: [
    "The address decides the district — not the city name on the listing.",
    "Built for PCS / Redstone moves and local parents (Huntsville · Madison · Athens · Limestone)",
    "Official, dated sources over star-rating fluff",
  ] as const,
  subhead:
    "The 2026–27 Guide: what Huntsville's five systems publish, linked and dated. Not a ranking.",
  cta: "I want the details — $79",
  stickyMobileCta: "Get the School Guide — $79",
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
      "The Guide: sourced 2026–27 modules across Five Systems, zones, registration, and more. Every published fact is linked and dated.",
      "Web-based, mobile-readable, lifetime access to the 2026–27 edition.",
    ],
  },
  {
    id: "149",
    amountUsd: 149,
    prominence: "target",
    name: "Guide + Toolkit",
    includes: [
      "Everything in the Guide.",
      "Toolkit access.",
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
