-- C-014 / C-017 / C-018 sourced facts. Do not rewrite 20260830120100.
-- Mirrors MODULE_FILL_FACTS in lib/seed-facts.ts.

insert into public.facts (
  entity_type,
  entity_slug,
  field,
  value,
  source_url,
  verified_at,
  verification_method
) values
  (
    'policy',
    'alabama-homeschool',
    'name',
    'Alabama homeschool and cover schools',
    'https://www.ed.gov/birth-grade-12-education/education-choice/state-regulation-of-private-and-home-schools/alabama-state-regulations-of-private-and-home-schools',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-homeschool',
    'home_education_options',
    'A home school can seek qualification as a private school, a church school, or under the private tutor option (Code of Alabama 1975 §§16-28-1(1), 16-28-1(2), 16-28-5).',
    'https://www.ed.gov/birth-grade-12-education/education-choice/state-regulation-of-private-and-home-schools/alabama-state-regulations-of-private-and-home-schools',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-homeschool',
    'church_school_definition',
    'A church school (often called a cover school) is a school operated on-site or through home programs as a ministry of a local church, group of churches, denomination, and/or association of churches that does not receive any state or federal funding (Code of Alabama 1975 §16-28-1(2)).',
    'https://www.ed.gov/birth-grade-12-education/education-choice/state-regulation-of-private-and-home-schools/alabama-state-regulations-of-private-and-home-schools',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-homeschool',
    'church_school_enrollment',
    'Documentation of a child''s enrollment and attendance in a church school must be filed with the local public school superintendent by the parent or guardian on a form provided by the superintendent or his agent (Code of Alabama 1975 §16-28-7).',
    'https://www.ed.gov/birth-grade-12-education/education-choice/state-regulation-of-private-and-home-schools/alabama-state-regulations-of-private-and-home-schools',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-homeschool',
    'private_tutor_notice',
    'Before private-tutor instruction begins, a statement must be filed with the local county or city superintendent showing the child or children to be instructed, the subjects to be taught, and the period of instruction (Code of Alabama 1975 §16-28-5).',
    'https://www.ed.gov/birth-grade-12-education/education-choice/state-regulation-of-private-and-home-schools/alabama-state-regulations-of-private-and-home-schools',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-homeschool',
    'private_tutor_hours',
    'Private-tutor instruction must be at least three hours a day for 140 days each calendar year, between 8:00 A.M. and 4:00 P.M., in English, by a person who holds a certificate issued by the state superintendent of education (Code of Alabama 1975 §16-28-5).',
    'https://www.ed.gov/birth-grade-12-education/education-choice/state-regulation-of-private-and-home-schools/alabama-state-regulations-of-private-and-home-schools',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-homeschool',
    'attendance_register',
    'The principal teacher of private and church schools must keep an attendance register showing the enrollment of the school and every absence of each enrolled child from school for a half-day or more (Code of Alabama 1975 §16-28-8).',
    'https://www.ed.gov/birth-grade-12-education/education-choice/state-regulation-of-private-and-home-schools/alabama-state-regulations-of-private-and-home-schools',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-choose-act',
    'name',
    'Alabama CHOOSE Act',
    'https://chooseact.alabama.gov',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-choose-act',
    'official_portal',
    'chooseact.alabama.gov redirects to ClassWallet at https://classwallet.com/alchoose/',
    'https://chooseact.alabama.gov',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-choose-act',
    'applications_2026_27',
    '29,341 applications representing 48,927 students for 2026–27',
    'https://governor.alabama.gov/newsroom/2026/04/governor-ivey-announces-record-choose-act-applications-for-2026-27-school-year/',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-choose-act',
    'approved_2026_27',
    'Over 34,000 students approved, equating to over $174 million in ESAs for 2026–27',
    'https://governor.alabama.gov/newsroom/2026/07/governor-ivey-announces-funding-for-choose-act-education-savings-accounts-for-2026-2027-school-year/',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-choose-act',
    'esa_participating_school',
    '$7,000 per participating student enrolled in a participating school',
    'https://governor.alabama.gov/newsroom/2026/07/governor-ivey-announces-funding-for-choose-act-education-savings-accounts-for-2026-2027-school-year/',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-choose-act',
    'esa_home_education',
    '$2,000 per participating student enrolled in a home education program (maximum of $4,000 per family)',
    'https://governor.alabama.gov/newsroom/2026/07/governor-ivey-announces-funding-for-choose-act-education-savings-accounts-for-2026-2027-school-year/',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-choose-act',
    'application_window_2026_27',
    'The 2026–27 application officially closed at midnight on March 31, 2026',
    'https://governor.alabama.gov/newsroom/2026/04/governor-ivey-announces-record-choose-act-applications-for-2026-27-school-year/',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-choose-act',
    'next_cycle',
    'The application process for the 2027–28 academic year will begin in January 2027',
    'https://governor.alabama.gov/newsroom/2026/07/governor-ivey-announces-funding-for-choose-act-education-savings-accounts-for-2026-2027-school-year/',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-choose-act',
    'income_cap_removal',
    'For years beginning January 1, 2025 and January 1, 2026 the credit is available to a parent of an eligible student whose family AGI did not exceed 300 percent of the federal poverty level for the preceding tax year. For years beginning on or after January 1, 2027 the credit is available to any parent of an eligible student; income is an allocation priority, not an eligibility gate (HB129, Ala. Act 2024-311).',
    'https://www.revenue.alabama.gov/wp-content/uploads/2024/03/CHOOSE-Act-2024-21.pdf',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-choose-act',
    'education_freedom_eo',
    'Governor Ivey signed Executive Order No. 742 in January 2026 confirming Alabama participation in a federal Education Freedom tax credit program. This edition does not publish program amounts or rules while that federal program is still evolving.',
    'https://governor.alabama.gov/newsroom/2026/01/governor-ivey-signs-executive-order-confirming-alabamas-participation-in-federal-education-freedom-tax-credit-program/',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-accountability-act',
    'name',
    'Alabama Accountability Act',
    'https://www.revenue.alabama.gov/individual-corporate/alabama-accountability-act/',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-accountability-act',
    'still_active',
    'The Alabama Accountability Act remains in effect. It established a scholarship program for low income students to attend public or private schools. Tax-deductible donations for scholarships are managed by Scholarship Granting Organizations (SGOs).',
    'https://www.revenue.alabama.gov/individual-corporate/alabama-accountability-act/',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-accountability-act',
    'individual_phone',
    '334-353-0602 / 334-353-9770 (individual taxpayers needing assistance with My Alabama Taxes or reserving an SGO tax credit)',
    'https://www.revenue.alabama.gov/individual-corporate/alabama-accountability-act/',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'alabama-accountability-act',
    'corporate_phone',
    '334-242-1200 (corporate taxpayers needing assistance with My Alabama Taxes or reserving an SGO tax credit)',
    'https://www.revenue.alabama.gov/individual-corporate/alabama-accountability-act/',
    '2026-08-31',
    'official_page'
  )
on conflict (entity_type, entity_slug, field) do update set
  value = excluded.value,
  source_url = excluded.source_url,
  verified_at = excluded.verified_at,
  verification_method = excluded.verification_method;
