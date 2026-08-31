import type { FactEntityType, VerificationMethod } from "@/lib/database";
import { ZONE_MAGNET_REG_FACTS } from "./c015-c016-c019-facts.ts";

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

export const HCS_MAGNET_SLUGS = [
  "new-century-technology",
  "aaa-magnet",
  "lee-capa",
  "asfl-magnet",
  "columbia-ib",
  "williams-agt",
  "jemison-college-academy",
] as const;

export const FIVE_SYSTEM_PROFILE_FIELDS = [
  "name",
  "website",
  "phone",
  "address",
  "mailing_address",
  "superintendent",
  "superintendent_approved_at",
  "superintendent_since",
  "zone_locator_url",
  "enrollment",
  "non_resident_path",
  "non_resident_tuition",
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
  church_school_definition: "Church school (cover school)",
  church_school_enrollment: "Church-school enrollment filing",
  private_tutor_notice: "Private-tutor notice",
  private_tutor_hours: "Private-tutor hours",
  attendance_register: "Attendance register",
  home_education_options: "Home-education options",
  official_portal: "Official portal",
  applications_2026_27: "2026–27 applications",
  approved_2026_27: "2026–27 approvals",
  esa_participating_school: "ESA — participating school",
  esa_home_education: "ESA — home education",
  application_window_2026_27: "2026–27 application window",
  next_cycle: "Next application cycle",
  income_cap_removal: "2027–28 income-cap removal",
  education_freedom_eo: "Federal Education Freedom EO",
  still_active: "Program status",
  individual_phone: "Individual inquiries",
  corporate_phone: "Corporate inquiries",
  how_to_check_before_lease: "How to check before a lease",
  zone_check_instruction: "How to check zoning",
  rezoning_status: "Rezoning",
  residency_rule: "Who may enroll",
  enrollment_path: "Enrollment path",
  registration_documents: "Documents",
  registration_timeline: "Timeline",
  transfer_policy: "Transfers / non-residents",
  non_resident_policy: "Non-resident policy",
  magnet_office_phone: "Magnet office",
  magnet_office_email: "Magnet email",
  application_portal: "Application portal",
  application_mechanics: "Application mechanics",
  application_window_2027_28: "2027–28 application window",
  seats_2026_27: "2026–27 freshman seats",
  gpa_target: "GPA target",
  residency_requirement: "Residency",
  lottery: "Selection",
  focus: "Focus",
  also_known_as: "Also called",
  elementary_campus_url: "Elementary campus",
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
const EXISTING_SEED_FACTS: readonly SeedFact[] = [
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

const ED_GOV_AL_HOMESCHOOL =
  "https://www.ed.gov/birth-grade-12-education/education-choice/state-regulation-of-private-and-home-schools/alabama-state-regulations-of-private-and-home-schools";
const IVEY_CHOOSE_APPLICATIONS_2026_04 =
  "https://governor.alabama.gov/newsroom/2026/04/governor-ivey-announces-record-choose-act-applications-for-2026-27-school-year/";
const IVEY_CHOOSE_FUNDING_2026_07 =
  "https://governor.alabama.gov/newsroom/2026/07/governor-ivey-announces-funding-for-choose-act-education-savings-accounts-for-2026-2027-school-year/";
const CHOOSE_ACT_2024_311 =
  "https://www.revenue.alabama.gov/wp-content/uploads/2024/03/CHOOSE-Act-2024-21.pdf";
const CHOOSE_PORTAL = "https://chooseact.alabama.gov";
const DOR_ACCOUNTABILITY_ACT =
  "https://www.revenue.alabama.gov/individual-corporate/alabama-accountability-act/";
const IVEY_EDUCATION_FREEDOM_EO =
  "https://governor.alabama.gov/newsroom/2026/01/governor-ivey-signs-executive-order-confirming-alabamas-participation-in-federal-education-freedom-tax-credit-program/";

// Mirrors supabase/migrations/20260831040000_seed_c014_c017_c018_facts.sql.
export const MODULE_FILL_FACTS: readonly SeedFact[] = [
  {
    entity_type: "policy",
    entity_slug: "alabama-homeschool",
    field: "name",
    value: "Alabama homeschool and cover schools",
    source_url: ED_GOV_AL_HOMESCHOOL,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-homeschool",
    field: "home_education_options",
    value:
      "A home school can seek qualification as a private school, a church school, or under the private tutor option (Code of Alabama 1975 §§16-28-1(1), 16-28-1(2), 16-28-5).",
    source_url: ED_GOV_AL_HOMESCHOOL,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-homeschool",
    field: "church_school_definition",
    value:
      "A church school (often called a cover school) is a school operated on-site or through home programs as a ministry of a local church, group of churches, denomination, and/or association of churches that does not receive any state or federal funding (Code of Alabama 1975 §16-28-1(2)).",
    source_url: ED_GOV_AL_HOMESCHOOL,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-homeschool",
    field: "church_school_enrollment",
    value:
      "Documentation of a child's enrollment and attendance in a church school must be filed with the local public school superintendent by the parent or guardian on a form provided by the superintendent or his agent (Code of Alabama 1975 §16-28-7).",
    source_url: ED_GOV_AL_HOMESCHOOL,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-homeschool",
    field: "private_tutor_notice",
    value:
      "Before private-tutor instruction begins, a statement must be filed with the local county or city superintendent showing the child or children to be instructed, the subjects to be taught, and the period of instruction (Code of Alabama 1975 §16-28-5).",
    source_url: ED_GOV_AL_HOMESCHOOL,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-homeschool",
    field: "private_tutor_hours",
    value:
      "Private-tutor instruction must be at least three hours a day for 140 days each calendar year, between 8:00 A.M. and 4:00 P.M., in English, by a person who holds a certificate issued by the state superintendent of education (Code of Alabama 1975 §16-28-5).",
    source_url: ED_GOV_AL_HOMESCHOOL,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-homeschool",
    field: "attendance_register",
    value:
      "The principal teacher of private and church schools must keep an attendance register showing the enrollment of the school and every absence of each enrolled child from school for a half-day or more (Code of Alabama 1975 §16-28-8).",
    source_url: ED_GOV_AL_HOMESCHOOL,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-choose-act",
    field: "name",
    value: "Alabama CHOOSE Act",
    source_url: CHOOSE_PORTAL,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-choose-act",
    field: "official_portal",
    value:
      "chooseact.alabama.gov redirects to ClassWallet at https://classwallet.com/alchoose/",
    source_url: CHOOSE_PORTAL,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-choose-act",
    field: "applications_2026_27",
    value:
      "29,341 applications representing 48,927 students for 2026–27",
    source_url: IVEY_CHOOSE_APPLICATIONS_2026_04,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-choose-act",
    field: "approved_2026_27",
    value:
      "Over 34,000 students approved, equating to over $174 million in ESAs for 2026–27",
    source_url: IVEY_CHOOSE_FUNDING_2026_07,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-choose-act",
    field: "esa_participating_school",
    value:
      "$7,000 per participating student enrolled in a participating school",
    source_url: IVEY_CHOOSE_FUNDING_2026_07,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-choose-act",
    field: "esa_home_education",
    value:
      "$2,000 per participating student enrolled in a home education program (maximum of $4,000 per family)",
    source_url: IVEY_CHOOSE_FUNDING_2026_07,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-choose-act",
    field: "application_window_2026_27",
    value:
      "The 2026–27 application officially closed at midnight on March 31, 2026",
    source_url: IVEY_CHOOSE_APPLICATIONS_2026_04,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-choose-act",
    field: "next_cycle",
    value:
      "The application process for the 2027–28 academic year will begin in January 2027",
    source_url: IVEY_CHOOSE_FUNDING_2026_07,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-choose-act",
    field: "income_cap_removal",
    value:
      "For years beginning January 1, 2025 and January 1, 2026 the credit is available to a parent of an eligible student whose family AGI did not exceed 300 percent of the federal poverty level for the preceding tax year. For years beginning on or after January 1, 2027 the credit is available to any parent of an eligible student; income is an allocation priority, not an eligibility gate (HB129, Ala. Act 2024-311).",
    source_url: CHOOSE_ACT_2024_311,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-choose-act",
    field: "education_freedom_eo",
    value:
      "Governor Ivey signed Executive Order No. 742 in January 2026 confirming Alabama participation in a federal Education Freedom tax credit program. This edition does not publish program amounts or rules while that federal program is still evolving.",
    source_url: IVEY_EDUCATION_FREEDOM_EO,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-accountability-act",
    field: "name",
    value: "Alabama Accountability Act",
    source_url: DOR_ACCOUNTABILITY_ACT,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-accountability-act",
    field: "still_active",
    value:
      "The Alabama Accountability Act remains in effect. It established a scholarship program for low income students to attend public or private schools. Tax-deductible donations for scholarships are managed by Scholarship Granting Organizations (SGOs).",
    source_url: DOR_ACCOUNTABILITY_ACT,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-accountability-act",
    field: "individual_phone",
    value:
      "334-353-0602 / 334-353-9770 (individual taxpayers needing assistance with My Alabama Taxes or reserving an SGO tax credit)",
    source_url: DOR_ACCOUNTABILITY_ACT,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
  {
    entity_type: "policy",
    entity_slug: "alabama-accountability-act",
    field: "corporate_phone",
    value:
      "334-242-1200 (corporate taxpayers needing assistance with My Alabama Taxes or reserving an SGO tax credit)",
    source_url: DOR_ACCOUNTABILITY_ACT,
    verified_at: "2026-08-31",
    verification_method: "official_page",
  },
];

export { ZONE_MAGNET_REG_FACTS } from "./c015-c016-c019-facts.ts";

export const seedFacts: readonly SeedFact[] = [
  ...EXISTING_SEED_FACTS,
  ...MODULE_FILL_FACTS,
  ...ZONE_MAGNET_REG_FACTS,
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
