import {
  FIVE_SYSTEM_PROFILE_FIELDS,
  FIVE_SYSTEM_SLUGS,
  HCS_MAGNET_SLUGS,
  PRIVATE_SCHOOL_SLUGS,
  type SeedFact,
} from "./seed-facts.ts";

export type GuideModule = {
  slug: string;
  number: number;
  title: string;
  purpose: string;
  unverified: readonly string[];
  matchesFact: (fact: SeedFact) => boolean;
};

const fiveSystemSlugs: readonly string[] = FIVE_SYSTEM_SLUGS;
const fiveSystemProfileFields: readonly string[] = FIVE_SYSTEM_PROFILE_FIELDS;
const privateSchoolSlugs: readonly string[] = PRIVATE_SCHOOL_SLUGS;
const hcsMagnetSlugs: readonly string[] = HCS_MAGNET_SLUGS;

const ZONE_FIELDS = [
  "zone_locator_url",
  "how_to_check_before_lease",
  "zone_check_instruction",
  "rezoning_status",
  "residency_rule",
] as const;

const REGISTRATION_FIELDS = [
  "enrollment",
  "enrollment_path",
  "registration_documents",
  "registration_timeline",
  "transfer_policy",
  "non_resident_path",
  "non_resident_tuition",
  "non_resident_policy",
  "residency_rule",
] as const;

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
    matchesFact: (fact) =>
      fact.entity_type === "district" &&
      fiveSystemSlugs.includes(fact.entity_slug) &&
      (fact.field === "name" ||
        fact.field === "website" ||
        fact.field === "zone_locator_url"),
  },
  {
    slug: "five-systems",
    number: 2,
    title: "The Five Systems",
    purpose:
      "Huntsville City, Madison City, Madison County, Athens City, Limestone County",
    unverified: [
      "Madison City superintendent, mailing address, and non-resident admission policy text",
      "Limestone County superintendent",
    ],
    matchesFact: (fact) =>
      (fact.entity_type === "district" || fact.entity_type === "policy") &&
      fiveSystemSlugs.includes(fact.entity_slug) &&
      fiveSystemProfileFields.includes(fact.field),
  },
  {
    slug: "zones-and-addresses",
    number: 3,
    title: "Zones and Addresses",
    purpose:
      "What each system publishes for matching an address to a school, and where to confirm it.",
    unverified: [
      "Athens City official interactive zone locator — the district tells families to call (256) 233-6600",
      "confirm zero Madison City non-resident exceptions by phone",
    ],
    matchesFact: (fact) =>
      (ZONE_FIELDS as readonly string[]).includes(fact.field),
  },
  {
    slug: "magnets-and-specialty",
    number: 4,
    title: "Magnets and Specialty Programs",
    purpose:
      "District magnet and specialty programs, plus statewide specialty schools that serve this metro.",
    unverified: [
      "one-application / lottery / PK–5 vs 6–12 essay-interview-audition mechanics, sibling priority, transportation, and IEP applicants on the live HCS magnet page",
      "fall 2026 application window for 2027–28 magnet entry",
      "whether Columbia High still publishes an IB Diploma magnet",
      "current-year IB PYP/MYP program naming on the live HCS magnet page or a current ASFL program page",
      "magnet office phone (256) 428-6987 from older secondary copy — live HCS arts article published 256-924-1113",
    ],
    matchesFact: (fact) =>
      (fact.entity_type === "school" && fact.entity_slug === "ascte") ||
      fact.entity_slug === "hcs-magnets" ||
      hcsMagnetSlugs.includes(fact.entity_slug),
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
      "Huntsville-area cover-school list",
      "confirm section numbers against the current Alabama Legislature codebook — the legislature amends this title regularly",
      "spec 4.2 wording that families file enrollment/attendance documentation with the cover school — confirm against the current codebook whether the filing is with the cover school, the local superintendent, or both",
    ],
    matchesFact: (fact) => fact.entity_slug === "alabama-homeschool",
  },
  {
    slug: "paying-for-it",
    number: 7,
    title: "Paying For It: CHOOSE Act and SGOs",
    purpose:
      "State ESA (CHOOSE Act) and scholarship-granting organizations, sourced when an official figure exists.",
    unverified: [
      "exact date the next CHOOSE Act cycle opens in January 2027",
      "funding and implementation details for the 2027–28 income-cap removal were still being finalized in 2026 reporting",
      "current Alabama Accountability Act SGO award and credit figures",
    ],
    matchesFact: (fact) =>
      fact.entity_slug === "alabama-choose-act" ||
      fact.entity_slug === "alabama-accountability-act",
  },
  {
    slug: "registration-mechanics",
    number: 8,
    title: "Registration Mechanics",
    purpose:
      "How each district says to enroll, and which documents they ask for.",
    unverified: [
      "Huntsville City Schools new-student document checklist",
      "Limestone County Schools new-student document checklist",
      "Madison County 2026–27 start-of-year processing dates — they roll annually; reconfirm on the district page",
      "Athens City capacity limits and current-year non-resident tuition by phone",
      "Madison City non-resident exceptions, if any, by phone",
    ],
    matchesFact: (fact) =>
      fiveSystemSlugs.includes(fact.entity_slug) &&
      (REGISTRATION_FIELDS as readonly string[]).includes(fact.field),
  },
];

export type GuideModuleSlug = (typeof GUIDE_MODULES)[number]["slug"];

export function getGuideModule(slug: string): GuideModule | null {
  return GUIDE_MODULES.find((module) => module.slug === slug) ?? null;
}

export function isGuideModuleSlug(slug: string): slug is GuideModuleSlug {
  return getGuideModule(slug) !== null;
}
