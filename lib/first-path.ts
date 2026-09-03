import { getGuideModule, type GuideModule } from "./guide-modules.ts";

/**
 * The first 15 minutes after purchase. Three modules, in reading order,
 * chosen because each one already ships sourced content with no VERIFY-only
 * stub: the shortlist tool, the five system profiles, and the lease check.
 */
export const FIRST_PATH_SLUGS = [
  "start-here",
  "five-systems",
  "zones-and-addresses",
] as const;

export type FirstPathSlug = (typeof FIRST_PATH_SLUGS)[number];

export type FirstPathStep = {
  slug: FirstPathSlug;
  /** Short label used on the landing and in "Next" links. */
  label: string;
  /** What the buyer walks away with. No school facts; those live on the page. */
  outcome: string;
  /** Rough reading time for planning the first sitting. */
  minutes: string;
};

export const FIRST_PATH: readonly FirstPathStep[] = [
  {
    slug: "start-here",
    label: "The 10-minute shortlist",
    outcome:
      "Enter where you'll commute from and what you'll spend, pick public, private, or homeschool, and leave with a three-item shortlist. Every item on it links to an official page.",
    minutes: "10 min",
  },
  {
    slug: "five-systems",
    label: "The Five Systems",
    outcome:
      "Huntsville City, Madison City, Madison County, Athens City, and Limestone County: phone, website, superintendent, and zone locator, each with its source and the date it was checked.",
    minutes: "5 min",
  },
  {
    slug: "zones-and-addresses",
    label: "Check the zone before you sign",
    outcome:
      "The official locator each system publishes for matching an address to a school, and what Athens City tells families to do instead.",
    minutes: "5 min",
  },
];

export function isFirstPathSlug(slug: string): slug is FirstPathSlug {
  return (FIRST_PATH_SLUGS as readonly string[]).includes(slug);
}

export function firstPathStep(slug: string): FirstPathStep | null {
  return FIRST_PATH.find((step) => step.slug === slug) ?? null;
}

/** The step that follows `slug` on the first path, or null at the end. */
export function nextFirstPathStep(slug: string): FirstPathStep | null {
  const index = FIRST_PATH.findIndex((step) => step.slug === slug);
  if (index === -1) {
    return null;
  }
  return FIRST_PATH[index + 1] ?? null;
}

export function firstPathModules(): GuideModule[] {
  return FIRST_PATH.map((step) => {
    const guideModule = getGuideModule(step.slug);
    if (!guideModule) {
      throw new Error(`first path step ${step.slug} is not a guide module`);
    }
    return guideModule;
  });
}
