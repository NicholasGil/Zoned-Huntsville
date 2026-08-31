import type { SeedFact } from "./seed-facts.ts";

const AS_OF = "2026-08-31";

const HCS_MAGNET =
  "https://www.huntsvillecityschools.org/magnet";
const HCS_MAGNET_ARTS =
  "https://www.huntsvillecityschools.org/article/1282865";
const HCS_MAGNET_PORTAL = "https://magnet-hcs.lfdmypick.com/";
const HCS_ENROLLMENT = "https://www.huntsvillecityschools.org/page/enrollment";
const HCS_MY_SCHOOLS = "https://maps.huntsvilleal.gov/myschools/";
const MCS_ZONES = "https://www.madisoncity.k12.al.us/school-zones-2";
const MCS_ENROLLMENT = "https://www.madisoncity.k12.al.us/221371_3";
const MCS_VISION = "https://www.madisoncity.k12.al.us/vision-mission";
const MCSS_ZONE = "https://www.mcssk12.org/enrollment/school-zone";
const MCSS_ENROLL =
  "https://www.mcssk12.org/enrollment/powerschool-enrollment";
const MCSS_RESIDENCY =
  "https://www.mcssk12.org/department/instruction/powerschool-enrollment/residency-requirements";
const MCSS_NEW_STUDENT_2025 =
  "https://www.mcssk12.org/department/instruction/powerschool-enrollment/2025-2026-powerschool-enrollment/new-student-2025-2026";
const ACS_ENROLL = "https://www.acs-k12.org/enroll";
const ACS_NEW_STUDENT = "https://www.acs-k12.org/fs/pages/1818";
const ACS_NONRESIDENT = "https://www.acs-k12.org/fs/pages/1825";
const LCS_ZONE_MAP = "https://www.lcsk12.org/page/school-zone-map";
const LCS_ENROLLMENT = "https://www.lcsk12.org/o/lcs/page/enrollment";
const AXIOS_NCTHS =
  "https://www.axios.com/local/huntsville/2025/09/25/huntsville-magnet-high-school-stem-application-2026";
const NCTHS = "https://www.huntsvillecityschools.org/o/ncths";
const AAA_ELEM = "https://www.huntsvillecityschools.org/o/aaaes";
const AAA_MID = "https://www.huntsvillecityschools.org/o/aaams";
const ASFL_MID = "https://www.huntsvillecityschools.org/o/asflms";
const WILLIAMS_MAGNET =
  "https://www.huntsvillecityschools.org/o/wlms/page/williams-magnet-program";
const WILLIAMS_AGT_ARTICLE =
  "https://www.huntsvillecityschools.org/o/wlms/article/1900083";
const JEMISON_MAGNET =
  "https://www.huntsvillecityschools.org/o/jhs/page/jemison-magnet-program";
const COLLEGE_ACADEMY_ARTICLE =
  "https://www.huntsvillecityschools.org/o/wlms/article/1900046";
const COLUMBIA = "https://www.huntsvillecityschools.org/o/chs";

function official(
  entity_type: SeedFact["entity_type"],
  entity_slug: string,
  field: string,
  value: string,
  source_url: string,
): SeedFact {
  return {
    entity_type,
    entity_slug,
    field,
    value,
    source_url,
    verified_at: AS_OF,
    verification_method: "official_page",
  };
}

function secondary(
  entity_type: SeedFact["entity_type"],
  entity_slug: string,
  field: string,
  value: string,
  source_url: string,
): SeedFact {
  return {
    entity_type,
    entity_slug,
    field,
    value,
    source_url,
    verified_at: AS_OF,
    verification_method: "secondary",
  };
}

// Mirrors supabase/migrations/20260831053000_seed_c015_c016_c019_facts.sql.
export const ZONE_MAGNET_REG_FACTS: readonly SeedFact[] = [
  official(
    "district",
    "limestone-county",
    "zone_locator_url",
    LCS_ZONE_MAP,
    LCS_ZONE_MAP,
  ),
  official(
    "district",
    "huntsville-city",
    "how_to_check_before_lease",
    "Use Huntsville City Schools' official My Schools Locator to match an address to a school before signing a lease. Realtor or listing maps are not the district tool.",
    HCS_MY_SCHOOLS,
  ),
  official(
    "district",
    "madison-city",
    "how_to_check_before_lease",
    "Use Madison City Schools' official School Locator (ArcGIS address lookup) before signing a lease. The district school-zones page also lists addresses that are not zoned for Madison City Schools.",
    MCS_ZONES,
  ),
  official(
    "district",
    "madison-city",
    "rezoning_status",
    "Continuous high growth requires frequent rezoning as populations shift and new schools are built. Beginning enrollment for 2026 is expected to be over 13,300 students across two high schools, three middle schools, and eight K-5 elementary schools, including the new Russell Branch Elementary.",
    MCS_VISION,
  ),
  official(
    "district",
    "madison-city",
    "residency_rule",
    "School-age children who reside within Madison City School Zone may be admitted to Madison City Schools. The residence of the student will be the residence of the custodial parent or legal guardian.",
    MCS_ENROLLMENT,
  ),
  official(
    "district",
    "madison-county",
    "how_to_check_before_lease",
    "Use Madison County Schools' official school-zone page to confirm the zoned school for an address before signing a lease. Realtor or listing maps are not the district tool.",
    MCSS_ZONE,
  ),
  official(
    "district",
    "limestone-county",
    "how_to_check_before_lease",
    "Use Limestone County Schools' official School Zone Map before signing a lease. Madison City Schools also links this map from its school-zones page. Realtor or listing maps are not the district tool.",
    LCS_ZONE_MAP,
  ),
  official(
    "district",
    "athens-city",
    "zone_check_instruction",
    "Athens City Schools does not publish an interactive zone locator. The enroll page says: Is your address zoned for Athens City School District? Call (256) 233-6600. Confirm zoning with the district before signing a lease.",
    ACS_ENROLL,
  ),

  official(
    "program",
    "hcs-magnets",
    "name",
    "Huntsville City Schools Magnet Programs",
    HCS_MAGNET,
  ),
  official(
    "program",
    "hcs-magnets",
    "website",
    HCS_MAGNET,
    HCS_MAGNET,
  ),
  official(
    "program",
    "hcs-magnets",
    "magnet_office_phone",
    "256-924-1113",
    HCS_MAGNET_ARTS,
  ),
  official(
    "program",
    "hcs-magnets",
    "magnet_office_email",
    "magnet@hsv-k12.org",
    HCS_MAGNET_ARTS,
  ),
  official(
    "program",
    "hcs-magnets",
    "application_portal",
    "The HCS magnet application window is currently closed. Applications will reopen in early June 2026 for any programs / grade levels with availability.",
    HCS_MAGNET_PORTAL,
  ),
  official(
    "program",
    "hcs-magnets",
    "application_mechanics",
    "⟦VERIFY: one application per student ID, lottery, PK–5 results in 4–6 weeks, 6–12 essay/interview/audition and committee review, sibling priority, transportation, and IEP applicants — confirm on the live HCS magnet page; the page body was not readable as of 2026-08-31⟧",
    HCS_MAGNET,
  ),

  official(
    "school",
    "new-century-technology",
    "name",
    "New Century Technology High School",
    NCTHS,
  ),
  official(
    "school",
    "new-century-technology",
    "website",
    NCTHS,
    NCTHS,
  ),
  secondary(
    "school",
    "new-century-technology",
    "focus",
    "Huntsville's only full magnet high school, focused on preparing students for STEM careers; concentrations named by the principal are biomedical science, computer science, and engineering.",
    AXIOS_NCTHS,
  ),
  secondary(
    "school",
    "new-century-technology",
    "application_window_2026_27",
    "Applications for the 2026 school year opened October 17, 2025.",
    AXIOS_NCTHS,
  ),
  secondary(
    "school",
    "new-century-technology",
    "seats_2026_27",
    "135 freshman spots",
    AXIOS_NCTHS,
  ),
  secondary(
    "school",
    "new-century-technology",
    "applications_2026_27",
    "Just under 400 applications the prior year",
    AXIOS_NCTHS,
  ),
  secondary(
    "school",
    "new-century-technology",
    "gpa_target",
    "Eighth graders with a 3.0 GPA apply",
    AXIOS_NCTHS,
  ),
  secondary(
    "school",
    "new-century-technology",
    "residency_requirement",
    "Students must live within the Huntsville City Schools district.",
    AXIOS_NCTHS,
  ),
  secondary(
    "school",
    "new-century-technology",
    "lottery",
    "Applications are put into a lottery and a computer makes the selection.",
    AXIOS_NCTHS,
  ),
  official(
    "school",
    "new-century-technology",
    "application_window_2027_28",
    "⟦VERIFY: fall 2026 application window for 2027–28 entry⟧",
    HCS_MAGNET,
  ),

  official(
    "school",
    "aaa-magnet",
    "name",
    "Academy for Academics and Arts",
    HCS_MAGNET_ARTS,
  ),
  official(
    "school",
    "aaa-magnet",
    "website",
    AAA_ELEM,
    AAA_ELEM,
  ),
  official(
    "school",
    "aaa-magnet",
    "focus",
    "HCS arts magnet with an elementary campus and a middle campus. Official elementary offerings: dance, visual arts, strings, music, choir, theatre. Official middle pathways: dance, visual arts, creative arts, voice and instrumental, theatre/tech theatre, and a variety of arts electives.",
    HCS_MAGNET_ARTS,
  ),
  official(
    "school",
    "aaa-magnet",
    "grades",
    "Elementary and middle (separate official school sites). ⟦VERIFY: published grade span on the live HCS magnet page⟧",
    AAA_MID,
  ),

  official(
    "school",
    "lee-capa",
    "name",
    "Creative and Performing Arts Magnet Program at Lee High School",
    HCS_MAGNET_ARTS,
  ),
  official(
    "school",
    "lee-capa",
    "website",
    HCS_MAGNET,
    HCS_MAGNET,
  ),
  official(
    "school",
    "lee-capa",
    "focus",
    "Nine arts concentrations: dance; theatre; technical theatre; media arts (film and video); media arts (creative writing); performance arts (instrumental); performance arts (vocal); visual arts; photography.",
    HCS_MAGNET_ARTS,
  ),

  official(
    "school",
    "asfl-magnet",
    "name",
    "Academy for Science & Foreign Language",
    ASFL_MID,
  ),
  official(
    "school",
    "asfl-magnet",
    "website",
    ASFL_MID,
    ASFL_MID,
  ),
  official(
    "school",
    "asfl-magnet",
    "focus",
    "Official HCS school site publishes Academy for Science & Foreign Language Middle School. ⟦VERIFY: elementary campus URL, STEM + language / IB PYP/MYP wording on the live HCS magnet page⟧",
    ASFL_MID,
  ),

  official(
    "school",
    "columbia-ib",
    "name",
    "IB Diploma Programme at Columbia High School",
    HCS_MAGNET,
  ),
  official(
    "school",
    "columbia-ib",
    "website",
    COLUMBIA,
    COLUMBIA,
  ),
  official(
    "school",
    "columbia-ib",
    "focus",
    "⟦VERIFY: whether Columbia High still publishes an IB Diploma magnet on the live HCS magnet page — the current Columbia High site did not list IB as of 2026-08-31⟧",
    COLUMBIA,
  ),

  official(
    "school",
    "williams-agt",
    "name",
    "Williams Magnet Program",
    WILLIAMS_MAGNET,
  ),
  official(
    "school",
    "williams-agt",
    "website",
    WILLIAMS_MAGNET,
    WILLIAMS_MAGNET,
  ),
  official(
    "school",
    "williams-agt",
    "also_known_as",
    "Official Williams Middle articles refer to the program as AGT (Academy for Gifted and Talented).",
    WILLIAMS_AGT_ARTICLE,
  ),

  official(
    "school",
    "jemison-college-academy",
    "name",
    "Jemison Magnet Program",
    JEMISON_MAGNET,
  ),
  official(
    "school",
    "jemison-college-academy",
    "website",
    JEMISON_MAGNET,
    JEMISON_MAGNET,
  ),
  official(
    "school",
    "jemison-college-academy",
    "also_known_as",
    "Official Williams Middle coverage calls the program College Academy at Mae Jemison High School and describes a UAH campus component.",
    COLLEGE_ACADEMY_ARTICLE,
  ),

  official(
    "district",
    "madison-city",
    "registration_documents",
    "Birth certificate; Alabama immunization record; photo ID of the enrolling parent/guardian; custody documentation if applicable; transcript or most recent report card; proof of residency — owners: current property tax receipt or deed in their name plus a current gas, water, or electric utility bill or start-of-service receipt (no cable or cell bills); renters: current lease or month-to-month lease with names, terms, address, and landlord/tenant signatures plus the same utility proof; new construction: builder's or sales contract plus the Sales Contract Transfer Request form inside online enrollment.",
    MCS_ENROLLMENT,
  ),
  official(
    "district",
    "madison-city",
    "enrollment_path",
    "All enrollment applications are submitted online via PowerSchool. 2026–2027 English and Spanish enrollment application links are published on the district enrollment page.",
    MCS_ENROLLMENT,
  ),
  official(
    "district",
    "madison-city",
    "transfer_policy",
    "Published admission language is limited to school-age children who reside within Madison City School Zone. No open-enrollment mechanism is published on the enrollment page. ⟦VERIFY: confirm zero exceptions by phone⟧",
    MCS_ENROLLMENT,
  ),

  official(
    "district",
    "madison-county",
    "enrollment",
    "ALL students, new and returning, must enroll through the PowerSchool Enrollment Portal. Enrollment can be completed at any time. The 2026–2027 new-student and returning-student portals are linked from the district PowerSchool Enrollment page.",
    MCSS_ENROLL,
  ),
  official(
    "district",
    "madison-county",
    "registration_documents",
    "District residency page: signed lease, mortgage statement, deed, or property tax bill in the parent/guardian's name; a recent Huntsville Utilities bill dated within 60 days (gas, water, cable/internet, or cell bills are not accepted); and a valid government-issued photo ID. Shared-housing families must also provide the homeowner's driver's license, lease/deed/mortgage, and Huntsville utility bill, plus two of: expired lease or utility bill, previous-year W2, or a pay stub no older than 45 days. The 2025–26 new-student page also lists age verification (birth certificate or passport/VISA), Alabama Certificate of Immunization or exemption, updated custody documents when applicable, and a transcript if transferring.",
    MCSS_RESIDENCY,
  ),
  official(
    "district",
    "madison-county",
    "registration_timeline",
    "⟦VERIFY: 2026–27 start-of-year processing dates (complete standard registration 48–72 hours before July 30, 2026 for an August 5, 2026 start; Shared Residency Affidavit cases 10–14 business days before July 20, 2026 or risk a waitlist) roll annually — reconfirm on the district enrollment page, not a school-site copy⟧",
    MCSS_ENROLL,
  ),
  official(
    "district",
    "madison-county",
    "transfer_policy",
    "A transcript is required if transferring from another school system (2025–26 new-student page). Residency is defined as the student and parent/guardian physically residing full-time weekdays, weeknights, and weekends at a dwelling inside Madison County Schools boundaries.",
    MCSS_NEW_STUDENT_2025,
  ),

  official(
    "district",
    "huntsville-city",
    "enrollment_path",
    "Huntsville City Schools publishes enrollment at huntsvillecityschools.org/page/enrollment. Returning-student registration uses a PowerSchool snapcode from the parent portal.",
    HCS_ENROLLMENT,
  ),
  official(
    "district",
    "huntsville-city",
    "registration_documents",
    "⟦VERIFY: Huntsville City Schools new-student document checklist — the enrollment page body did not list documents as of 2026-08-31⟧",
    HCS_ENROLLMENT,
  ),

  official(
    "district",
    "athens-city",
    "enrollment_path",
    "Official pathways: Kindergarten registration (opens in the spring); new-student enrollment for grades 1–12 (any time during the year); Pre-K; returning-student re-enrollment (typically each spring); and Non-Resident Student Admission. 2026–2027 new-student registration is online via PowerSchool. Office computers and help are available at 455 US Hwy. 31 N.; call (256) 233-6600.",
    ACS_ENROLL,
  ),
  official(
    "district",
    "athens-city",
    "registration_documents",
    "Parent/guardian picture ID; birth certificate (or alternative documentation); Social Security card (optional; ALSDE assigns a temporary number if needed); Alabama immunization record; proof of residence (current utility bill, mortgage statement, or rent lease; a landlord letter when two families share an address); proof of custody/guardianship through the judge's office when the student does not live with both birth parents (Delegation of Parental Authority, Power of Attorney, and a notarized signature are not accepted); last report card (K–8) or unofficial transcript (9–12); withdrawal form if coming from another school.",
    ACS_NEW_STUDENT,
  ),
  official(
    "policy",
    "athens-city",
    "non_resident_policy",
    "Board Policy JBCB: a child must generally be a bona fide resident to attend; the Board may admit non-residents case by case. Tuition is $1,200.00 per year, due in advance, and non-refundable unless the Superintendent and Board approve an exception. No tuition for children of school-system employees. The system does not provide transportation or homebound instruction outside Athens City attendance zones. A copy of the child's last report card must be submitted with the non-resident application. Contact Mike O'Rear, Student Services, 256.233.6600 or mike.orear@acs-k12.org. ⟦VERIFY: capacity limits and current-year tuition by phone⟧",
    ACS_NONRESIDENT,
  ),

  official(
    "district",
    "limestone-county",
    "enrollment_path",
    "Limestone County Schools publishes enrollment at lcsk12.org/o/lcs/page/enrollment.",
    LCS_ENROLLMENT,
  ),
  official(
    "district",
    "limestone-county",
    "registration_documents",
    "⟦VERIFY: Limestone County Schools new-student document checklist — the enrollment page body did not list documents as of 2026-08-31⟧",
    LCS_ENROLLMENT,
  ),
];
