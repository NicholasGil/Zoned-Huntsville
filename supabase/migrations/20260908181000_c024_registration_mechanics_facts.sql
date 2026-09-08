-- C-024: clear registration-mechanics VERIFY tokens from sourced district pages.

delete from facts
where entity_type = 'district'
  and entity_slug = 'huntsville-city'
  and field = 'registration_documents';

delete from facts
where entity_type = 'district'
  and entity_slug = 'limestone-county'
  and field = 'registration_documents';

insert into facts (
  entity_type,
  entity_slug,
  field,
  value,
  source_url,
  verified_at,
  verification_method
)
values
  (
    'district',
    'madison-city',
    'transfer_policy',
    'Published admission language is limited to school-age children who reside within Madison City School Zone. No open-enrollment mechanism is published on the enrollment page.',
    'https://www.madisoncity.k12.al.us/221371_3',
    '2026-09-08',
    'official_page'
  ),
  (
    'district',
    'madison-county',
    'registration_timeline',
    'During peak enrollment periods (late spring and summer), standard enrollment/registration typically takes 5–10 business days; Shared Residency Affidavit (SRA) cases typically take 10–14 business days. Failure to complete standard enrollment/registration within 48–72 hours before July 30, 2026 means the student will not start on the first day of school (August 5, 2026). Failure to complete SRA registration within 10–14 business days before July 20, 2026 may place the student on a waitlist for home visits and verification, and the student will not start on the first day of school (August 5, 2026).',
    'https://www.mcssk12.org/fs/pages/14605',
    '2026-09-08',
    'official_page'
  ),
  (
    'policy',
    'athens-city',
    'non_resident_policy',
    'Board Policy JBCB: a child must generally be a bona fide resident to attend; the Board may admit non-residents case by case. Tuition is $1,200.00 per year, due in advance, and non-refundable unless the Superintendent and Board approve an exception. No tuition for children of school-system employees. The system does not provide transportation or homebound instruction outside Athens City attendance zones. A copy of the child''s last report card must be submitted with the non-resident application. The Board reserves the right to annually establish capacities of programs, classes, grade levels, and buildings. Contact Mike O''Rear, Student Services, 256.233.6600 or mike.orear@acs-k12.org.',
    'https://www.acs-k12.org/fs/pages/1825',
    '2026-09-08',
    'official_page'
  )
on conflict (entity_type, entity_slug, field) do update set
  value = excluded.value,
  source_url = excluded.source_url,
  verified_at = excluded.verified_at,
  verification_method = excluded.verification_method;

insert into facts (
  entity_type,
  entity_slug,
  field,
  value,
  source_url,
  verified_at,
  verification_method
)
values
  (
    'district',
    'madison-city',
    'non_resident_path',
    'Published admission language is limited to school-age children who reside within Madison City School Zone. Madison City Schools welcome all students who live within the district''s boundaries and meet state age and health requirements. No open-enrollment mechanism is published on the enrollment page.',
    'https://www.madisoncity.k12.al.us/221371_3',
    '2026-09-08',
    'official_page'
  )
on conflict (entity_type, entity_slug, field) do update set
  value = excluded.value,
  source_url = excluded.source_url,
  verified_at = excluded.verified_at,
  verification_method = excluded.verification_method;
