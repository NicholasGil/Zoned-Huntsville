-- Sourced seed only. Missing values stay out or use ⟦VERIFY: …⟧.
-- Do not add Lincoln Academy or Madison Academy.
-- Do not add private-school tuition figures.

insert into public.facts (
  entity_type,
  entity_slug,
  field,
  value,
  source_url,
  verified_at,
  verification_method
) values
  ('district', 'huntsville-city', 'name', 'Huntsville City Schools', 'https://www.huntsvillecityschools.org', '2026-08-01', 'official_page'),
  ('district', 'huntsville-city', 'website', 'huntsvillecityschools.org', 'https://www.huntsvillecityschools.org', '2026-08-01', 'official_page'),
  ('district', 'huntsville-city', 'mailing_address', 'P.O. Box 1256 Huntsville AL 35807-4801', 'https://www.huntsvillecityschools.org', '2026-08-01', 'official_page'),
  ('district', 'huntsville-city', 'phone', '(256) 428-6800', 'https://www.huntsvillecityschools.org', '2026-08-01', 'official_page'),
  ('district', 'huntsville-city', 'superintendent', 'Dr. Clarence Sutton Jr.', 'https://www.huntsvillecityschools.org', '2026-08-01', 'official_page'),
  ('district', 'huntsville-city', 'superintendent_approved_at', '2023-06-13', 'https://www.huntsvillecityschools.org', '2023-06-13', 'official_page'),
  ('district', 'huntsville-city', 'zone_locator_url', 'https://maps.huntsvilleal.gov/myschools/', 'https://maps.huntsvilleal.gov/myschools/', '2026-08-01', 'official_page'),

  ('district', 'madison-city', 'name', 'Madison City Schools', 'https://www.madisoncity.k12.al.us', '2026-08-01', 'official_page'),
  ('district', 'madison-city', 'website', 'madisoncity.k12.al.us', 'https://www.madisoncity.k12.al.us', '2026-08-01', 'official_page'),
  ('district', 'madison-city', 'phone', '(256) 464-8370', 'https://www.madisoncity.k12.al.us', '2026-08-01', 'official_page'),
  (
    'district',
    'madison-city',
    'zone_locator_url',
    'https://hmphoar.maps.arcgis.com/apps/instant/lookup/index.html?appid=f32249aa33ef4de9b10a5a6bddcfc1b3',
    'https://hmphoar.maps.arcgis.com/apps/instant/lookup/index.html?appid=f32249aa33ef4de9b10a5a6bddcfc1b3',
    '2026-08-01',
    'official_page'
  ),
  ('district', 'madison-city', 'enrollment', '100% online via PowerSchool', 'https://www.madisoncity.k12.al.us', '2026-08-01', 'official_page'),

  ('district', 'madison-county', 'name', 'Madison County Schools', 'https://www.mcssk12.org', '2026-08-01', 'official_page'),
  ('district', 'madison-county', 'website', 'mcssk12.org', 'https://www.mcssk12.org', '2026-08-01', 'official_page'),
  ('district', 'madison-county', 'address', '1275 Jordan Road Huntsville AL 35811', 'https://www.mcssk12.org', '2026-08-01', 'official_page'),
  ('district', 'madison-county', 'phone', '(256) 852-2557', 'https://www.mcssk12.org', '2026-08-01', 'official_page'),
  ('district', 'madison-county', 'superintendent', 'Ken Kubik', 'https://www.mcssk12.org', '2026-08-01', 'official_page'),
  ('district', 'madison-county', 'zone_locator_url', 'https://www.mcssk12.org/enrollment/school-zone', 'https://www.mcssk12.org/enrollment/school-zone', '2026-08-01', 'official_page'),

  ('district', 'athens-city', 'name', 'Athens City Schools', 'https://www.acs-k12.org', '2026-08-01', 'official_page'),
  ('district', 'athens-city', 'website', 'acs-k12.org', 'https://www.acs-k12.org', '2026-08-01', 'official_page'),
  ('district', 'athens-city', 'address', '455 US Hwy 31 N Athens AL 35611', 'https://www.acs-k12.org', '2026-08-01', 'official_page'),
  ('district', 'athens-city', 'phone', '(256) 233-6600', 'https://www.acs-k12.org', '2026-08-01', 'official_page'),
  ('district', 'athens-city', 'superintendent', 'Beth Patton', 'https://www.acs-k12.org', '2026-08-01', 'official_page'),
  ('district', 'athens-city', 'superintendent_since', '2020', 'https://www.acs-k12.org', '2026-08-01', 'official_page'),
  ('policy', 'athens-city', 'non_resident_path', 'Board Policy JCBC', 'https://www.acs-k12.org', '2026-08-01', 'official_page'),
  ('policy', 'athens-city', 'non_resident_tuition', '$1,200 non-refundable annual non-resident tuition', 'https://www.acs-k12.org', '2026-08-01', 'official_page'),

  ('district', 'limestone-county', 'name', 'Limestone County Schools', 'https://www.lcssk12.org', '2026-08-01', 'official_page'),
  ('district', 'limestone-county', 'website', 'lcssk12.org', 'https://www.lcssk12.org', '2026-08-01', 'official_page'),
  ('district', 'limestone-county', 'address', '300 South Jefferson Street Athens AL 35611', 'https://www.lcssk12.org', '2026-08-01', 'official_page'),
  ('district', 'limestone-county', 'phone', '(256) 232-5353', 'https://www.lcssk12.org', '2026-08-01', 'official_page'),

  ('school', 'randolph', 'name', 'Randolph School', 'https://www.randolphschool.net', '2026-08-01', 'official_page'),
  ('school', 'randolph', 'website', 'randolphschool.net', 'https://www.randolphschool.net', '2026-08-01', 'official_page'),
  ('school', 'randolph', 'phone', '256-799-6104', 'https://www.randolphschool.net', '2026-08-01', 'official_page'),

  ('school', 'westminster', 'name', 'Westminster Christian Academy', 'https://www.wca-hsv.org', '2026-08-01', 'official_page'),
  ('school', 'westminster', 'website', 'wca-hsv.org', 'https://www.wca-hsv.org', '2026-08-01', 'official_page'),
  ('school', 'westminster', 'grades', 'K3-12', 'https://www.wca-hsv.org', '2026-08-01', 'official_page'),

  ('school', 'whitesburg-christian', 'name', 'Whitesburg Christian Academy', 'https://www.whitesburgchristianacademy.org', '2026-08-01', 'official_page'),
  ('school', 'whitesburg-christian', 'website', 'whitesburgchristianacademy.org', 'https://www.whitesburgchristianacademy.org', '2026-08-01', 'official_page'),
  ('school', 'whitesburg-christian', 'phone', '256-704-7373', 'https://www.whitesburgchristianacademy.org', '2026-08-01', 'official_page'),

  ('school', 'st-john-the-baptist-madison', 'name', 'St. John the Baptist Catholic School, Madison', 'https://www.stjohnb.com', '2026-08-01', 'official_page'),
  ('school', 'st-john-the-baptist-madison', 'website', 'stjohnb.com', 'https://www.stjohnb.com', '2026-08-01', 'official_page'),
  ('school', 'st-john-the-baptist-madison', 'phone', '256-722-0772', 'https://www.stjohnb.com', '2026-08-01', 'official_page'),

  ('school', 'holy-spirit-regional', 'name', 'Holy Spirit Regional Catholic School', '⟦VERIFY: Holy Spirit Regional diocesan prospectus URL⟧', '2026-08-01', 'secondary'),
  ('school', 'holy-spirit-regional', 'grades', 'PreK-4 through 8', '⟦VERIFY: Holy Spirit Regional diocesan prospectus URL⟧', '2026-08-01', 'secondary'),

  ('school', 'grace-lutheran', 'name', 'Grace Lutheran School', 'https://www.gls-hsv.org', '2026-08-01', 'official_page'),
  ('school', 'grace-lutheran', 'website', 'gls-hsv.org', 'https://www.gls-hsv.org', '2026-08-01', 'official_page'),
  ('school', 'grace-lutheran', 'phone', '256-881-0553', 'https://www.gls-hsv.org', '2026-08-01', 'official_page'),

  ('school', 'providence-classical', 'name', 'Providence Classical School', 'https://www.providenceclassical.org', '2026-08-01', 'official_page'),
  ('school', 'providence-classical', 'website', 'providenceclassical.org', 'https://www.providenceclassical.org', '2026-08-01', 'official_page'),
  ('school', 'providence-classical', 'phone', '256-852-8884', 'https://www.providenceclassical.org', '2026-08-01', 'official_page'),

  ('school', 'ascte', 'name', 'Alabama School of Cyber Technology and Engineering', 'https://www.ascte.org', '2026-08-01', 'official_page'),
  ('school', 'ascte', 'website', 'ascte.org', 'https://www.ascte.org', '2026-08-01', 'official_page'),
  ('school', 'ascte', 'phone', '256-489-3700', 'https://www.ascte.org', '2026-08-01', 'official_page'),
  ('school', 'ascte', 'admissions_email', 'admissions@ascte.org', 'https://www.ascte.org', '2026-08-01', 'official_page');
