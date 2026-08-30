import type { FactEntityType, VerificationMethod } from "@/lib/database";

export type SeedFact = {
  entity_type: FactEntityType;
  entity_slug: string;
  field: string;
  value: string;
  source_url: string;
  verified_at: string;
  verification_method: VerificationMethod;
};

export const FIVE_SYSTEM_SLUGS = [
  "huntsville-city",
  "madison-city",
  "madison-county",
  "athens-city",
  "limestone-county",
] as const;

export const PRIVATE_SCHOOL_SLUGS = [
  "randolph",
  "westminster",
  "whitesburg-christian",
  "st-john-the-baptist-madison",
  "holy-spirit-regional",
  "grace-lutheran",
  "providence-classical",
] as const;

export const HUNTSVILLE_CITY_SAMPLE_FIELDS = [
  "name",
  "website",
  "mailing_address",
  "phone",
  "superintendent",
  "superintendent_approved_at",
  "zone_locator_url",
] as const;

export const FACT_FIELD_LABELS: Record<string, string> = {
  name: "Name",
  website: "Website",
  mailing_address: "Mailing address",
  address: "Address",
  phone: "Phone",
  superintendent: "Superintendent",
  superintendent_approved_at: "Superintendent approved",
  superintendent_since: "Superintendent since",
  zone_locator_url: "Zone locator",
  enrollment: "Enrollment",
  non_resident_path: "Non-resident path",
  non_resident_tuition: "Non-resident tuition",
  grades: "Grades",
  admissions_email: "Admissions email",
};

export function fieldLabel(field: string): string {
  return FACT_FIELD_LABELS[field] ?? field.replaceAll("_", " ");
}

export function slugOrder(
  slug: string,
  order: readonly string[],
): number {
  const index = order.findIndex((item) => item === slug);
  return index === -1 ? order.length : index;
}

export function factKey(
  fact: Pick<SeedFact, "entity_type" | "entity_slug" | "field">,
): string {
  return `${fact.entity_type}:${fact.entity_slug}:${fact.field}`;
}

export function isHttpUrl(value: string): boolean {
  return value.startsWith("https://") || value.startsWith("http://");
}

// Mirrors supabase/migrations/20260830120100_seed_sourced_facts.sql.
// Static pages read this catalog so they never call cookies() or the gated facts table.
export const seedFacts: readonly SeedFact[] = [
  {
    entity_type: "district",
    entity_slug: "huntsville-city",
    field: "name",
    value: "Huntsville City Schools",
    source_url: "https://www.huntsvillecityschools.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "huntsville-city",
    field: "website",
    value: "huntsvillecityschools.org",
    source_url: "https://www.huntsvillecityschools.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "huntsville-city",
    field: "mailing_address",
    value: "P.O. Box 1256 Huntsville AL 35807-4801",
    source_url: "https://www.huntsvillecityschools.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "huntsville-city",
    field: "phone",
    value: "(256) 428-6800",
    source_url: "https://www.huntsvillecityschools.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "huntsville-city",
    field: "superintendent",
    value: "Dr. Clarence Sutton Jr.",
    source_url: "https://www.huntsvillecityschools.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "huntsville-city",
    field: "superintendent_approved_at",
    value: "2023-06-13",
    source_url: "https://www.huntsvillecityschools.org",
    verified_at: "2023-06-13",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "huntsville-city",
    field: "zone_locator_url",
    value: "https://maps.huntsvilleal.gov/myschools/",
    source_url: "https://maps.huntsvilleal.gov/myschools/",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "madison-city",
    field: "name",
    value: "Madison City Schools",
    source_url: "https://www.madisoncity.k12.al.us",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "madison-city",
    field: "website",
    value: "madisoncity.k12.al.us",
    source_url: "https://www.madisoncity.k12.al.us",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "madison-city",
    field: "phone",
    value: "(256) 464-8370",
    source_url: "https://www.madisoncity.k12.al.us",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "madison-city",
    field: "zone_locator_url",
    value:
      "https://hmphoar.maps.arcgis.com/apps/instant/lookup/index.html?appid=f32249aa33ef4de9b10a5a6bddcfc1b3",
    source_url:
      "https://hmphoar.maps.arcgis.com/apps/instant/lookup/index.html?appid=f32249aa33ef4de9b10a5a6bddcfc1b3",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "madison-city",
    field: "enrollment",
    value: "100% online via PowerSchool",
    source_url: "https://www.madisoncity.k12.al.us",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "madison-county",
    field: "name",
    value: "Madison County Schools",
    source_url: "https://www.mcssk12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "madison-county",
    field: "website",
    value: "mcssk12.org",
    source_url: "https://www.mcssk12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "madison-county",
    field: "address",
    value: "1275 Jordan Road Huntsville AL 35811",
    source_url: "https://www.mcssk12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "madison-county",
    field: "phone",
    value: "(256) 852-2557",
    source_url: "https://www.mcssk12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "madison-county",
    field: "superintendent",
    value: "Ken Kubik",
    source_url: "https://www.mcssk12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "madison-county",
    field: "zone_locator_url",
    value: "https://www.mcssk12.org/enrollment/school-zone",
    source_url: "https://www.mcssk12.org/enrollment/school-zone",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "athens-city",
    field: "name",
    value: "Athens City Schools",
    source_url: "https://www.acs-k12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "athens-city",
    field: "website",
    value: "acs-k12.org",
    source_url: "https://www.acs-k12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "athens-city",
    field: "address",
    value: "455 US Hwy 31 N Athens AL 35611",
    source_url: "https://www.acs-k12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "athens-city",
    field: "phone",
    value: "(256) 233-6600",
    source_url: "https://www.acs-k12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "athens-city",
    field: "superintendent",
    value: "Beth Patton",
    source_url: "https://www.acs-k12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "athens-city",
    field: "superintendent_since",
    value: "2020",
    source_url: "https://www.acs-k12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "athens-city",
    field: "non_resident_path",
    value: "Board Policy JCBC",
    source_url: "https://www.acs-k12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "athens-city",
    field: "non_resident_tuition",
    value: "$1,200 non-refundable annual non-resident tuition",
    source_url: "https://www.acs-k12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "limestone-county",
    field: "name",
    value: "Limestone County Schools",
    source_url: "https://www.lcssk12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "limestone-county",
    field: "website",
    value: "lcssk12.org",
    source_url: "https://www.lcssk12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "limestone-county",
    field: "address",
    value: "300 South Jefferson Street Athens AL 35611",
    source_url: "https://www.lcssk12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "district",
    entity_slug: "limestone-county",
    field: "phone",
    value: "(256) 232-5353",
    source_url: "https://www.lcssk12.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "randolph",
    field: "name",
    value: "Randolph School",
    source_url: "https://www.randolphschool.net",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "randolph",
    field: "website",
    value: "randolphschool.net",
    source_url: "https://www.randolphschool.net",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "randolph",
    field: "phone",
    value: "256-799-6104",
    source_url: "https://www.randolphschool.net",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "westminster",
    field: "name",
    value: "Westminster Christian Academy",
    source_url: "https://www.wca-hsv.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "westminster",
    field: "website",
    value: "wca-hsv.org",
    source_url: "https://www.wca-hsv.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "westminster",
    field: "grades",
    value: "K3-12",
    source_url: "https://www.wca-hsv.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "whitesburg-christian",
    field: "name",
    value: "Whitesburg Christian Academy",
    source_url: "https://www.whitesburgchristianacademy.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "whitesburg-christian",
    field: "website",
    value: "whitesburgchristianacademy.org",
    source_url: "https://www.whitesburgchristianacademy.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "whitesburg-christian",
    field: "phone",
    value: "256-704-7373",
    source_url: "https://www.whitesburgchristianacademy.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "st-john-the-baptist-madison",
    field: "name",
    value: "St. John the Baptist Catholic School, Madison",
    source_url: "https://www.stjohnb.com",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "st-john-the-baptist-madison",
    field: "website",
    value: "stjohnb.com",
    source_url: "https://www.stjohnb.com",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "st-john-the-baptist-madison",
    field: "phone",
    value: "256-722-0772",
    source_url: "https://www.stjohnb.com",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "holy-spirit-regional",
    field: "name",
    value: "Holy Spirit Regional Catholic School",
    source_url: "⟦VERIFY: Holy Spirit Regional diocesan prospectus URL⟧",
    verified_at: "2026-08-01",
    verification_method: "secondary",
  },
  {
    entity_type: "school",
    entity_slug: "holy-spirit-regional",
    field: "grades",
    value: "PreK-4 through 8",
    source_url: "⟦VERIFY: Holy Spirit Regional diocesan prospectus URL⟧",
    verified_at: "2026-08-01",
    verification_method: "secondary",
  },
  {
    entity_type: "school",
    entity_slug: "grace-lutheran",
    field: "name",
    value: "Grace Lutheran School",
    source_url: "https://www.gls-hsv.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "grace-lutheran",
    field: "website",
    value: "gls-hsv.org",
    source_url: "https://www.gls-hsv.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "grace-lutheran",
    field: "phone",
    value: "256-881-0553",
    source_url: "https://www.gls-hsv.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "providence-classical",
    field: "name",
    value: "Providence Classical School",
    source_url: "https://www.providenceclassical.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "providence-classical",
    field: "website",
    value: "providenceclassical.org",
    source_url: "https://www.providenceclassical.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "providence-classical",
    field: "phone",
    value: "256-852-8884",
    source_url: "https://www.providenceclassical.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "ascte",
    field: "name",
    value: "Alabama School of Cyber Technology and Engineering",
    source_url: "https://www.ascte.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "ascte",
    field: "website",
    value: "ascte.org",
    source_url: "https://www.ascte.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "ascte",
    field: "phone",
    value: "256-489-3700",
    source_url: "https://www.ascte.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
  {
    entity_type: "school",
    entity_slug: "ascte",
    field: "admissions_email",
    value: "admissions@ascte.org",
    source_url: "https://www.ascte.org",
    verified_at: "2026-08-01",
    verification_method: "official_page",
  },
];

export function seedFactsMatching(
  matches: (fact: SeedFact) => boolean,
): SeedFact[] {
  return seedFacts.filter(matches);
}

export function huntsvilleCitySampleFacts(): SeedFact[] {
  const wanted = new Set<string>(HUNTSVILLE_CITY_SAMPLE_FIELDS);
  const found = seedFactsMatching(
    (fact) =>
      fact.entity_type === "district" &&
      fact.entity_slug === "huntsville-city" &&
      wanted.has(fact.field),
  );
  return [...found].sort(
    (a, b) =>
      HUNTSVILLE_CITY_SAMPLE_FIELDS.indexOf(
        a.field as (typeof HUNTSVILLE_CITY_SAMPLE_FIELDS)[number],
      ) -
      HUNTSVILLE_CITY_SAMPLE_FIELDS.indexOf(
        b.field as (typeof HUNTSVILLE_CITY_SAMPLE_FIELDS)[number],
      ),
  );
}
