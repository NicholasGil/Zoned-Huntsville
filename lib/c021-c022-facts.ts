import type { SeedFact } from "./seed-facts.ts";

const AS_OF = "2026-08-31";

const MCS_SUPERINTENDENT =
  "https://www.madisoncity.k12.al.us/superintendents-message";
const MCS_ENROLLMENT = "https://www.madisoncity.k12.al.us/221371_3";
const MCS_TITLE_IX =
  "https://www.madisoncity.k12.al.us/district-title-ix-information";
const LCS_STAFF = "https://www.lcsk12.org/staff";
const HOLY_SPIRIT = "https://hstigers.org/";
const HOLY_SPIRIT_ADMISSIONS = "https://hstigers.org/prospective-parents/";
const HOLY_SPIRIT_GRADES = "https://hstigers.org/career-opportunities/";
const HOLY_SPIRIT_TUITION = "https://hstigers.org/tuition-scholarships/";
const RANDOLPH_ADMISSIONS = "https://www.randolphschool.net/admissions/";
const RANDOLPH_TUITION =
  "https://www.randolphschool.net/tuition-and-financial-aid";
const WESTMINSTER_ADMISSIONS = "https://wca-hsv.org/admissions/";
const WHITESBURG_APPLY =
  "https://www.whitesburgchristianacademy.org/admissions/apply-now";
const ST_JOHN_ADMIT = "https://www.stjohnb.com/admit.html";
const GRACE_APPLY = "https://www.gls-hsv.org/how-to-apply/";
const PROVIDENCE_HOME = "https://www.providenceclassical.org/";
const PROVIDENCE_ADMISSIONS =
  "https://www.providenceclassical.org/admission-procedures";

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

// Mirrors supabase/migrations/20260831121500_seed_c021_c022_c011_facts.sql.
export const LEFTOVER_S2_FACTS: readonly SeedFact[] = [
  official(
    "district",
    "madison-city",
    "superintendent",
    "Eric Terrell",
    MCS_SUPERINTENDENT,
  ),
  official(
    "district",
    "madison-city",
    "address",
    "211 Celtic Drive, Madison, AL 35758",
    MCS_TITLE_IX,
  ),
  official(
    "district",
    "madison-city",
    "non_resident_path",
    "Published admission language is limited to school-age children who reside within Madison City School Zone. Madison City Schools welcome all students who live within the district's boundaries and meet state age and health requirements. No open-enrollment mechanism is published on the enrollment page. ⟦VERIFY: confirm zero exceptions by phone⟧",
    MCS_ENROLLMENT,
  ),
  official(
    "district",
    "limestone-county",
    "superintendent",
    "Randy Shearouse",
    LCS_STAFF,
  ),

  official(
    "school",
    "holy-spirit-regional",
    "name",
    "Holy Spirit Regional Catholic School",
    HOLY_SPIRIT,
  ),
  official(
    "school",
    "holy-spirit-regional",
    "website",
    "hstigers.org",
    HOLY_SPIRIT,
  ),
  official(
    "school",
    "holy-spirit-regional",
    "grades",
    "PreK through Grade 8",
    HOLY_SPIRIT_GRADES,
  ),
  official(
    "school",
    "holy-spirit-regional",
    "phone",
    "(256) 881-4852",
    HOLY_SPIRIT,
  ),
  official(
    "school",
    "holy-spirit-regional",
    "address",
    "619 Airport Road SW, Huntsville, AL 35802",
    HOLY_SPIRIT,
  ),
  official(
    "school",
    "holy-spirit-regional",
    "admissions_process",
    "Apply online (RenWeb). A non-refundable $75 fee is submitted with each application. After applying, schedule an Educational Success Consultation with the Enrollment Manager, then complete the online enrollment packet. Families may request more information and the Admissions Office will contact them. Contact Taylor Romanczuk at 256-881-4852. Kindergarten children must be five years of age as of September 1. ⟦VERIFY: applications-open date — not published on the prospective-parents page⟧",
    HOLY_SPIRIT_ADMISSIONS,
  ),
  official(
    "school",
    "holy-spirit-regional",
    "tuition_publication",
    "This edition does not publish a tuition figure. Holy Spirit lists a Tuition & Scholarships page on its official site; the figure is not copied here.",
    HOLY_SPIRIT_TUITION,
  ),

  official(
    "school",
    "randolph",
    "admissions_process",
    "Schedule a campus tour. Submit an application through Randolph's online admissions portal; the admissions team then helps gather teacher recommendations, transcripts, or assessments. After the application is complete, the admissions team coordinates a visit day and remaining evaluations. Completing all steps allows the school to make an enrollment decision. Contact admissions@randolphschool.net. ⟦VERIFY: applications-open date — not published on the admissions page⟧",
    RANDOLPH_ADMISSIONS,
  ),
  official(
    "school",
    "randolph",
    "tuition_publication",
    "This edition does not publish a tuition figure. Randolph's official Tailored Tuition page publishes a 2026–27 tuition-and-fees table and PDF; Tailored Tuition is Randolph's financial assistance program and adjusts the cost based on a family's financial circumstances through a FACTS review. The figure is not copied here.",
    RANDOLPH_TUITION,
  ),

  official(
    "school",
    "westminster",
    "admissions_process",
    "Get to know the school (call (855) 846-2287, take a tour, or schedule a shadow day). Apply with an application form, pastoral recommendation, covenantal agreement, and academic review. At least one parent or guardian must have a relationship with Jesus Christ; families must actively participate in a local church; families and students must adhere to Christian beliefs in the WCA statement of faith. Academic review uses teacher recommendations and report cards, an admissions assessment, and satisfactory conduct records. Contact Erica Hammond, admissions@wca-hsv.org.",
    WESTMINSTER_ADMISSIONS,
  ),
  official(
    "school",
    "westminster",
    "next_cycle",
    "Applications for the 2027–2028 school year open November 16th.",
    WESTMINSTER_ADMISSIONS,
  ),
  official(
    "school",
    "westminster",
    "tuition_publication",
    "This edition does not publish a tuition figure. Westminster publishes a downloadable tuition & fee schedule PDF on its official admissions page. Blackbaud Financial Aid Management calculates how much a family can afford to pay. Tuition assistance applications for the upcoming school year are accepted January 1st through March 31st. New applicants should contact the Director of Admissions before applying for assistance. The figure is not copied here.",
    WESTMINSTER_ADMISSIONS,
  ),

  official(
    "school",
    "whitesburg-christian",
    "admissions_process",
    "Steps: submit the online application and application fee ($100) with required documents; shadow a student (TK/Kindergarten may attend a group shadow day); test for admissions; Admissions Committee reviews the packet; email letter of acceptance or the Admissions Director notifies of non-acceptance; complete online enrollment ($200 enrollment fee). TK: 4 years old by September 1st. Kindergarten: 5 years old by September 1st. Grades 1–12: grade-level or above on the admissions test, favorable teacher and pastoral recommendations, shadow day, prior records showing competency (cumulative GPA of 2.0 or higher for a high school student), exemplary behavior, at least one Christian parent and a church home, and Admissions Committee approval.",
    WHITESBURG_APPLY,
  ),
  official(
    "school",
    "whitesburg-christian",
    "applications_2026_27",
    "For 2026–27: January 7, 2026 priority re-enrollment for current Academy students in good standing (spots guaranteed); sibling and Whitesburg Baptist Church applications accepted that day (spots not guaranteed; priority given). January 30, 2026: open grades posted; new students may submit applications for open grades only (spots not guaranteed).",
    WHITESBURG_APPLY,
  ),
  official(
    "school",
    "whitesburg-christian",
    "tuition_publication",
    "This edition does not publish a tuition figure. The official apply-now page does not list a tuition amount.",
    WHITESBURG_APPLY,
  ),

  official(
    "school",
    "st-john-the-baptist-madison",
    "grades",
    "K4-8th grade",
    ST_JOHN_ADMIT,
  ),
  official(
    "school",
    "st-john-the-baptist-madison",
    "admissions_process",
    "Fill out the 2026–2027 application and return it to the front office or email applications@stjohnb.com. A $150 per student non-refundable fee is due upon acceptance. To complete registration: original state birth certificate, current report card and standardized test scores, Alabama Certificate of Immunization (current shot record, not an exemption); the school contacts the previous school for transcripts. K5 students must be 5 by September 1st. K4 students must be 4 by September 1st and fully potty-trained. K5–8th grade wear Lands' End uniforms; K4 students do not. ⟦VERIFY: applications-open date — the admissions page publishes the 2026–2027 application, not an open date⟧",
    ST_JOHN_ADMIT,
  ),
  official(
    "school",
    "st-john-the-baptist-madison",
    "tuition_publication",
    "This edition does not publish a tuition figure. St. John publishes 2026–2027 tuition rates as a PDF on its official admissions page. The figure is not copied here.",
    ST_JOHN_ADMIT,
  ),

  official(
    "school",
    "grace-lutheran",
    "admissions_process",
    "Grace Lutheran School provides a general education for prekindergarten through 8th grade and is currently not equipped to teach students with learning disabilities. Class enrollment is limited to 18 in prekindergarten and kindergarten, 20 in grades 1–5, and 25 in grades 6–8. Admission may be denied due to space or the school's ability to meet a child's needs. Age by September 1 of the upcoming school year: PreK 4 years old; Kindergarten 5 years old; First Grade 6 years old. Request more information or apply online (RenWeb). ⟦VERIFY: applications-open date — not published on the how-to-apply page⟧",
    GRACE_APPLY,
  ),
  official(
    "school",
    "grace-lutheran",
    "tuition_publication",
    "This edition does not publish a tuition figure. The official how-to-apply page does not list a tuition amount.",
    GRACE_APPLY,
  ),

  official(
    "school",
    "providence-classical",
    "admissions_process",
    "Pre-admission (before an application): attend a Visitor Day and an Information Meeting; read Shepherding a Child's Heart by Tedd Tripp and Recovering the Lost Tools of Learning by Douglas Wilson; request an application packet, available only to families in which both parents attended both events, after each annual Information Meeting. Christian parents who meet application and family-requirements criteria may apply. Children must be preparing to enter kindergarten or first grade from public or private school, currently homeschooled, currently enrolled in a Christian school in grades K-2, or currently attending another ACCS member school; otherwise parents must homeschool for one school year before applying. Admission: complete the application packet and return it with the $50 per-family application fee; both parents (without children) attend an interview if scheduled; child interviewing and testing are scheduled later; families are contacted about enrollment after prayerful consideration. Enrollment preference: returning students, siblings, children of PCS teachers and other employees, children of PCS alumni, then new students. Kindergarten students must be at least 5 years old by September 1st. Contact admissions@providenceclassical.org.",
    PROVIDENCE_ADMISSIONS,
  ),
  official(
    "school",
    "providence-classical",
    "next_cycle",
    "Admissions for the 2026–2027 school year is closed. Families interested in 2027–2028 need to attend the Informational Meeting and a Visitor Day (dates and times posted in fall of 2026). The homepage also published Informational Meeting January 28th at 7:00 PM and Visitor Day January 29th, with registration for those events opening fall 2026.",
    PROVIDENCE_HOME,
  ),
  official(
    "school",
    "providence-classical",
    "tuition_publication",
    "This edition does not publish a tuition figure. Providence links a Fees and Tuition page from its official site. The figure is not copied here.",
    PROVIDENCE_HOME,
  ),
];
