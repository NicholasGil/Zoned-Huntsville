import {
  FIVE_SYSTEM_SLUGS,
  PRIVATE_SCHOOL_SLUGS,
  type SeedFact,
} from "@/lib/seed-facts";

export type GuideModule = {
  slug: string;
  number: number;
  title: string;
  purpose: string;
  unverified: readonly string[];
  matchesFact: (fact: SeedFact) => boolean;
};

const fiveSystemSlugs: readonly string[] = FIVE_SYSTEM_SLUGS;
const privateSchoolSlugs: readonly string[] = PRIVATE_SCHOOL_SLUGS;

export const GUIDE_MODULES: readonly GuideModule[] = [
  {
    slug: "start-here",
    number: 1,
    title: "Start Here: The 10-Minute Shortlist",
    purpose:
      "commute → budget → public/private/homeschool → 3-school shortlist",
    unverified: [
      "10-minute shortlist worksheet and the commute or budget thresholds it uses",
    ],
    matchesFact: () => false,
  },
  {
    slug: "five-systems",
    number: 2,
    title: "The Five Systems",
    purpose:
      "Huntsville City, Madison City, Madison County, Athens City, Limestone County",
    unverified: [
      "Madison City superintendent, mailing address, and non-resident admission policy text",
      "Limestone County superintendent and official zone locator",
    ],
    matchesFact: (fact) =>
      (fact.entity_type === "district" || fact.entity_type === "policy") &&
      fiveSystemSlugs.includes(fact.entity_slug),
  },
  {
    slug: "zones-and-addresses",
    number: 3,
    title: "Zones and Addresses",
    purpose:
      "What each system publishes for matching an address to a school, and where to confirm it.",
    unverified: [
      "Athens City and Limestone County official zone locators",
    ],
    matchesFact: (fact) => fact.field === "zone_locator_url",
  },
  {
    slug: "magnets-and-specialty",
    number: 4,
    title: "Magnets and Specialty Programs",
    purpose:
      "District magnet and specialty programs, plus statewide specialty schools that serve this metro.",
    unverified: [
      "magnet and specialty application windows for each district",
    ],
    matchesFact: (fact) =>
      fact.entity_type === "school" && fact.entity_slug === "ascte",
  },
  {
    slug: "private-and-parochial",
    number: 5,
    title: "Private and Parochial",
    purpose:
      "Named private and parochial schools already verified in the seed. Tuition figures stay unpublished.",
    unverified: [
      "published tuition for each private school that releases a figure",
    ],
    matchesFact: (fact) =>
      fact.entity_type === "school" &&
      privateSchoolSlugs.includes(fact.entity_slug),
  },
  {
    slug: "homeschool-and-cover-schools",
    number: 6,
    title: "Homeschool and Cover Schools",
    purpose:
      "How Alabama homeschool and cover-school enrollment works for families in this metro.",
    unverified: [
      "Alabama homeschool statute, cover-school list, and declaration process",
    ],
    matchesFact: () => false,
  },
  {
    slug: "paying-for-it",
    number: 7,
    title: "Paying For It: CHOOSE Act and SGOs",
    purpose:
      "State ESA (CHOOSE Act) and scholarship-granting organizations, sourced when an official figure exists.",
    unverified: [
      "CHOOSE Act award amounts and SGO list for the current year",
    ],
    matchesFact: () => false,
  },
  {
    slug: "registration-mechanics",
    number: 8,
    title: "Registration Mechanics",
    purpose:
      "How each district says to enroll, and which documents they ask for.",
    unverified: [
      "registration windows and document checklists for each district",
    ],
    matchesFact: (fact) => fact.field === "enrollment",
  },
];

export type GuideModuleSlug = (typeof GUIDE_MODULES)[number]["slug"];

export function getGuideModule(slug: string): GuideModule | null {
  return GUIDE_MODULES.find((module) => module.slug === slug) ?? null;
}

export function isGuideModuleSlug(slug: string): slug is GuideModuleSlug {
  return getGuideModule(slug) !== null;
}
