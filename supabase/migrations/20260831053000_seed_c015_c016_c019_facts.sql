-- C-015 / C-016 / C-019 sourced facts. Do not rewrite 20260830120100.
-- Mirrors ZONE_MAGNET_REG_FACTS in lib/c015-c016-c019-facts.ts.

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
    'district',
    'limestone-county',
    'zone_locator_url',
    'https://www.lcsk12.org/page/school-zone-map',
    'https://www.lcsk12.org/page/school-zone-map',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'huntsville-city',
    'how_to_check_before_lease',
    'Use Huntsville City Schools'' official My Schools Locator to match an address to a school before signing a lease. Realtor or listing maps are not the district tool.',
    'https://maps.huntsvilleal.gov/myschools/',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'madison-city',
    'how_to_check_before_lease',
    'Use Madison City Schools'' official School Locator (ArcGIS address lookup) before signing a lease. The district school-zones page also lists addresses that are not zoned for Madison City Schools.',
    'https://www.madisoncity.k12.al.us/school-zones-2',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'madison-city',
    'rezoning_status',
    'Continuous high growth requires frequent rezoning as populations shift and new schools are built. Beginning enrollment for 2026 is expected to be over 13,300 students across two high schools, three middle schools, and eight K-5 elementary schools, including the new Russell Branch Elementary.',
    'https://www.madisoncity.k12.al.us/vision-mission',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'madison-city',
    'residency_rule',
    'School-age children who reside within Madison City School Zone may be admitted to Madison City Schools. The residence of the student will be the residence of the custodial parent or legal guardian.',
    'https://www.madisoncity.k12.al.us/221371_3',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'madison-county',
    'how_to_check_before_lease',
    'Use Madison County Schools'' official school-zone page to confirm the zoned school for an address before signing a lease. Realtor or listing maps are not the district tool.',
    'https://www.mcssk12.org/enrollment/school-zone',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'limestone-county',
    'how_to_check_before_lease',
    'Use Limestone County Schools'' official School Zone Map before signing a lease. Madison City Schools also links this map from its school-zones page. Realtor or listing maps are not the district tool.',
    'https://www.lcsk12.org/page/school-zone-map',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'athens-city',
    'zone_check_instruction',
    'Athens City Schools does not publish an interactive zone locator. The enroll page says: Is your address zoned for Athens City School District? Call (256) 233-6600. Confirm zoning with the district before signing a lease.',
    'https://www.acs-k12.org/enroll',
    '2026-08-31',
    'official_page'
  ),
  (
    'program',
    'hcs-magnets',
    'name',
    'Huntsville City Schools Magnet Programs',
    'https://www.huntsvillecityschools.org/magnet',
    '2026-08-31',
    'official_page'
  ),
  (
    'program',
    'hcs-magnets',
    'website',
    'https://www.huntsvillecityschools.org/magnet',
    'https://www.huntsvillecityschools.org/magnet',
    '2026-08-31',
    'official_page'
  ),
  (
    'program',
    'hcs-magnets',
    'magnet_office_phone',
    '256-924-1113',
    'https://www.huntsvillecityschools.org/article/1282865',
    '2026-08-31',
    'official_page'
  ),
  (
    'program',
    'hcs-magnets',
    'magnet_office_email',
    'magnet@hsv-k12.org',
    'https://www.huntsvillecityschools.org/article/1282865',
    '2026-08-31',
    'official_page'
  ),
  (
    'program',
    'hcs-magnets',
    'application_portal',
    'The HCS magnet application window is currently closed. Applications will reopen in early June 2026 for any programs / grade levels with availability.',
    'https://magnet-hcs.lfdmypick.com/',
    '2026-08-31',
    'official_page'
  ),
  (
    'program',
    'hcs-magnets',
    'application_mechanics',
    '⟦VERIFY: one application per student ID, lottery, PK–5 results in 4–6 weeks, 6–12 essay/interview/audition and committee review, sibling priority, transportation, and IEP applicants — confirm on the live HCS magnet page; the page body was not readable as of 2026-08-31⟧',
    'https://www.huntsvillecityschools.org/magnet',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'new-century-technology',
    'name',
    'New Century Technology High School',
    'https://www.huntsvillecityschools.org/o/ncths',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'new-century-technology',
    'website',
    'https://www.huntsvillecityschools.org/o/ncths',
    'https://www.huntsvillecityschools.org/o/ncths',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'new-century-technology',
    'focus',
    'Huntsville''s only full magnet high school, focused on preparing students for STEM careers; concentrations named by the principal are biomedical science, computer science, and engineering.',
    'https://www.axios.com/local/huntsville/2025/09/25/huntsville-magnet-high-school-stem-application-2026',
    '2026-08-31',
    'secondary'
  ),
  (
    'school',
    'new-century-technology',
    'application_window_2026_27',
    'Applications for the 2026 school year opened October 17, 2025.',
    'https://www.axios.com/local/huntsville/2025/09/25/huntsville-magnet-high-school-stem-application-2026',
    '2026-08-31',
    'secondary'
  ),
  (
    'school',
    'new-century-technology',
    'seats_2026_27',
    '135 freshman spots',
    'https://www.axios.com/local/huntsville/2025/09/25/huntsville-magnet-high-school-stem-application-2026',
    '2026-08-31',
    'secondary'
  ),
  (
    'school',
    'new-century-technology',
    'applications_2026_27',
    'Just under 400 applications the prior year',
    'https://www.axios.com/local/huntsville/2025/09/25/huntsville-magnet-high-school-stem-application-2026',
    '2026-08-31',
    'secondary'
  ),
  (
    'school',
    'new-century-technology',
    'gpa_target',
    'Eighth graders with a 3.0 GPA apply',
    'https://www.axios.com/local/huntsville/2025/09/25/huntsville-magnet-high-school-stem-application-2026',
    '2026-08-31',
    'secondary'
  ),
  (
    'school',
    'new-century-technology',
    'residency_requirement',
    'Students must live within the Huntsville City Schools district.',
    'https://www.axios.com/local/huntsville/2025/09/25/huntsville-magnet-high-school-stem-application-2026',
    '2026-08-31',
    'secondary'
  ),
  (
    'school',
    'new-century-technology',
    'lottery',
    'Applications are put into a lottery and a computer makes the selection.',
    'https://www.axios.com/local/huntsville/2025/09/25/huntsville-magnet-high-school-stem-application-2026',
    '2026-08-31',
    'secondary'
  ),
  (
    'school',
    'new-century-technology',
    'application_window_2027_28',
    '⟦VERIFY: fall 2026 application window for 2027–28 entry⟧',
    'https://www.huntsvillecityschools.org/magnet',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'aaa-magnet',
    'name',
    'Academy for Academics and Arts',
    'https://www.huntsvillecityschools.org/article/1282865',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'aaa-magnet',
    'website',
    'https://www.huntsvillecityschools.org/o/aaaes',
    'https://www.huntsvillecityschools.org/o/aaaes',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'aaa-magnet',
    'focus',
    'HCS arts magnet with an elementary campus and a middle campus. Official elementary offerings: dance, visual arts, strings, music, choir, theatre. Official middle pathways: dance, visual arts, creative arts, voice and instrumental, theatre/tech theatre, and a variety of arts electives.',
    'https://www.huntsvillecityschools.org/article/1282865',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'aaa-magnet',
    'grades',
    'Elementary and middle (separate official school sites). ⟦VERIFY: published grade span on the live HCS magnet page⟧',
    'https://www.huntsvillecityschools.org/o/aaams',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'lee-capa',
    'name',
    'Creative and Performing Arts Magnet Program at Lee High School',
    'https://www.huntsvillecityschools.org/article/1282865',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'lee-capa',
    'website',
    'https://www.huntsvillecityschools.org/magnet',
    'https://www.huntsvillecityschools.org/magnet',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'lee-capa',
    'focus',
    'Nine arts concentrations: dance; theatre; technical theatre; media arts (film and video); media arts (creative writing); performance arts (instrumental); performance arts (vocal); visual arts; photography.',
    'https://www.huntsvillecityschools.org/article/1282865',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'asfl-magnet',
    'name',
    'Academy for Science & Foreign Language',
    'https://www.huntsvillecityschools.org/o/asflms',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'asfl-magnet',
    'website',
    'https://www.huntsvillecityschools.org/o/asflms',
    'https://www.huntsvillecityschools.org/o/asflms',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'asfl-magnet',
    'elementary_campus_url',
    'https://www.huntsvillecityschools.org/o/asfle',
    'https://www.huntsvillecityschools.org/o/asfle',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'asfl-magnet',
    'focus',
    'Official HCS school sites publish Academy for Science & Foreign Language Elementary School and Academy for Science & Foreign Language Middle School. Official elementary news also publishes IB Students of the Month / IB learner-profile articles. ⟦VERIFY: current-year IB PYP/MYP program naming on the live HCS magnet page or a current ASFL program page⟧',
    'https://www.huntsvillecityschools.org/o/asfle',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'columbia-ib',
    'name',
    'IB Diploma Programme at Columbia High School',
    'https://www.huntsvillecityschools.org/magnet',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'columbia-ib',
    'website',
    'https://www.huntsvillecityschools.org/o/chs',
    'https://www.huntsvillecityschools.org/o/chs',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'columbia-ib',
    'focus',
    '⟦VERIFY: whether Columbia High still publishes an IB Diploma magnet on the live HCS magnet page — the current Columbia High site did not list IB as of 2026-08-31⟧',
    'https://www.huntsvillecityschools.org/o/chs',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'williams-agt',
    'name',
    'Williams Magnet Program',
    'https://www.huntsvillecityschools.org/o/wlms/page/williams-magnet-program',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'williams-agt',
    'website',
    'https://www.huntsvillecityschools.org/o/wlms/page/williams-magnet-program',
    'https://www.huntsvillecityschools.org/o/wlms/page/williams-magnet-program',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'williams-agt',
    'also_known_as',
    'Official Williams Middle articles refer to the program as AGT (Academy for Gifted and Talented).',
    'https://www.huntsvillecityschools.org/o/wlms/article/1900083',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'jemison-college-academy',
    'name',
    'Jemison Magnet Program',
    'https://www.huntsvillecityschools.org/o/jhs/page/jemison-magnet-program',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'jemison-college-academy',
    'website',
    'https://www.huntsvillecityschools.org/o/jhs/page/jemison-magnet-program',
    'https://www.huntsvillecityschools.org/o/jhs/page/jemison-magnet-program',
    '2026-08-31',
    'official_page'
  ),
  (
    'school',
    'jemison-college-academy',
    'also_known_as',
    'Official Williams Middle coverage calls the program College Academy at Mae Jemison High School and describes a UAH campus component.',
    'https://www.huntsvillecityschools.org/o/wlms/article/1900046',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'madison-city',
    'registration_documents',
    'Birth certificate; Alabama immunization record; photo ID of the enrolling parent/guardian; custody documentation if applicable; transcript or most recent report card; proof of residency — owners: current property tax receipt or deed in their name plus a current gas, water, or electric utility bill or start-of-service receipt (no cable or cell bills); renters: current lease or month-to-month lease with names, terms, address, and landlord/tenant signatures plus the same utility proof; new construction: builder''s or sales contract plus the Sales Contract Transfer Request form inside online enrollment.',
    'https://www.madisoncity.k12.al.us/221371_3',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'madison-city',
    'enrollment_path',
    'All enrollment applications are submitted online via PowerSchool. 2026–2027 English and Spanish enrollment application links are published on the district enrollment page.',
    'https://www.madisoncity.k12.al.us/221371_3',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'madison-city',
    'transfer_policy',
    'Published admission language is limited to school-age children who reside within Madison City School Zone. No open-enrollment mechanism is published on the enrollment page. ⟦VERIFY: confirm zero exceptions by phone⟧',
    'https://www.madisoncity.k12.al.us/221371_3',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'madison-county',
    'enrollment',
    'ALL students, new and returning, must enroll through the PowerSchool Enrollment Portal. Enrollment can be completed at any time. The 2026–2027 new-student and returning-student portals are linked from the district PowerSchool Enrollment page.',
    'https://www.mcssk12.org/enrollment/powerschool-enrollment',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'madison-county',
    'registration_documents',
    'District residency page: signed lease, mortgage statement, deed, or property tax bill in the parent/guardian''s name; a recent Huntsville Utilities bill dated within 60 days (gas, water, cable/internet, or cell bills are not accepted); and a valid government-issued photo ID. Shared-housing families must also provide the homeowner''s driver''s license, lease/deed/mortgage, and Huntsville utility bill, plus two of: expired lease or utility bill, previous-year W2, or a pay stub no older than 45 days. The 2025–26 new-student page also lists age verification (birth certificate or passport/VISA), Alabama Certificate of Immunization or exemption, updated custody documents when applicable, and a transcript if transferring.',
    'https://www.mcssk12.org/department/instruction/powerschool-enrollment/residency-requirements',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'madison-county',
    'registration_timeline',
    '⟦VERIFY: 2026–27 start-of-year processing dates (complete standard registration 48–72 hours before July 30, 2026 for an August 5, 2026 start; Shared Residency Affidavit cases 10–14 business days before July 20, 2026 or risk a waitlist) roll annually — reconfirm on the district enrollment page, not a school-site copy⟧',
    'https://www.mcssk12.org/enrollment/powerschool-enrollment',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'madison-county',
    'transfer_policy',
    'A transcript is required if transferring from another school system (2025–26 new-student page). Residency is defined as the student and parent/guardian physically residing full-time weekdays, weeknights, and weekends at a dwelling inside Madison County Schools boundaries.',
    'https://www.mcssk12.org/department/instruction/powerschool-enrollment/2025-2026-powerschool-enrollment/new-student-2025-2026',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'huntsville-city',
    'enrollment_path',
    'Huntsville City Schools publishes enrollment at huntsvillecityschools.org/page/enrollment. Returning-student registration uses a PowerSchool snapcode from the parent portal.',
    'https://www.huntsvillecityschools.org/page/enrollment',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'huntsville-city',
    'registration_documents',
    '⟦VERIFY: Huntsville City Schools new-student document checklist — the enrollment page body did not list documents as of 2026-08-31⟧',
    'https://www.huntsvillecityschools.org/page/enrollment',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'athens-city',
    'enrollment_path',
    'Official pathways: Kindergarten registration (opens in the spring); new-student enrollment for grades 1–12 (any time during the year); Pre-K; returning-student re-enrollment (typically each spring); and Non-Resident Student Admission. 2026–2027 new-student registration is online via PowerSchool. Office computers and help are available at 455 US Hwy. 31 N.; call (256) 233-6600.',
    'https://www.acs-k12.org/enroll',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'athens-city',
    'registration_documents',
    'Parent/guardian picture ID; birth certificate (or alternative documentation); Social Security card (optional; ALSDE assigns a temporary number if needed); Alabama immunization record; proof of residence (current utility bill, mortgage statement, or rent lease; a landlord letter when two families share an address); proof of custody/guardianship through the judge''s office when the student does not live with both birth parents (Delegation of Parental Authority, Power of Attorney, and a notarized signature are not accepted); last report card (K–8) or unofficial transcript (9–12); withdrawal form if coming from another school.',
    'https://www.acs-k12.org/fs/pages/1818',
    '2026-08-31',
    'official_page'
  ),
  (
    'policy',
    'athens-city',
    'non_resident_policy',
    'Board Policy JBCB: a child must generally be a bona fide resident to attend; the Board may admit non-residents case by case. Tuition is $1,200.00 per year, due in advance, and non-refundable unless the Superintendent and Board approve an exception. No tuition for children of school-system employees. The system does not provide transportation or homebound instruction outside Athens City attendance zones. A copy of the child''s last report card must be submitted with the non-resident application. Contact Mike O''Rear, Student Services, 256.233.6600 or mike.orear@acs-k12.org. ⟦VERIFY: capacity limits and current-year tuition by phone⟧',
    'https://www.acs-k12.org/fs/pages/1825',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'limestone-county',
    'enrollment_path',
    'Limestone County Schools publishes enrollment at lcsk12.org/o/lcs/page/enrollment.',
    'https://www.lcsk12.org/o/lcs/page/enrollment',
    '2026-08-31',
    'official_page'
  ),
  (
    'district',
    'limestone-county',
    'registration_documents',
    '⟦VERIFY: Limestone County Schools new-student document checklist — the enrollment page body did not list documents as of 2026-08-31⟧',
    'https://www.lcsk12.org/o/lcs/page/enrollment',
    '2026-08-31',
    'official_page'
  )
on conflict (entity_type, entity_slug, field) do update set
  value = excluded.value,
  source_url = excluded.source_url,
  verified_at = excluded.verified_at,
  verification_method = excluded.verification_method;
