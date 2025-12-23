-- ============================================================================
-- IMPORT SAMPLE TEAMMATE DATA
-- ============================================================================
-- This script imports the 12 sample teammates from your app into the database
-- Run this AFTER running 001_initial_schema.sql
-- ============================================================================

-- Insert teammates (without manager_id for now - we'll update after all are inserted)
INSERT INTO teammates (
  first_name,
  last_name,
  email,
  phone,
  position,
  department,
  branch,
  nmls,
  headshot_url,
  start_date,
  birthday_date,
  onboarding_status,
  linkedin_url,
  calendly_link
) VALUES
  -- Sarah Mitchell (CEO)
  (
    'Sarah',
    'Mitchell',
    'sarah.mitchell@lendingheights.com',
    '(412) 555-0123',
    'Chief Executive Officer',
    'Leadership',
    '🌉 Pittsburgh (HQ)',
    'NMLS #123456',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    '2020-01-15',
    '1985-03-22',
    'Done',
    'https://linkedin.com/in/sarahmitchell',
    NULL
  ),
  -- Marcus Thompson
  (
    'Marcus',
    'Thompson',
    'marcus.thompson@lendingheights.com',
    '(412) 555-0124',
    'Senior Loan Officer',
    'Sales',
    '🌉 Pittsburgh (HQ)',
    'NMLS #234567',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    '2021-03-10',
    '1990-07-15',
    'Done',
    NULL,
    'https://calendly.com/marcusthompson'
  ),
  -- Jennifer Rodriguez
  (
    'Jennifer',
    'Rodriguez',
    'jennifer.rodriguez@lendingheights.com',
    '(912) 555-0125',
    'Branch Manager',
    'Leadership',
    '🍑 Savannah',
    'NMLS #345678',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    '2020-06-01',
    '1988-11-03',
    'Done',
    'https://linkedin.com/in/jenniferrodriguez',
    NULL
  ),
  -- David Chen
  (
    'David',
    'Chen',
    'david.chen@lendingheights.com',
    '(215) 555-0126',
    'Loan Processor',
    'Operations',
    '🔔 Philadelphia',
    NULL,
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    '2022-01-15',
    '1993-05-18',
    'Done',
    NULL,
    NULL
  ),
  -- Amanda Williams
  (
    'Amanda',
    'Williams',
    'amanda.williams@lendingheights.com',
    '(412) 555-0127',
    'Marketing Director',
    'Operations',
    '🌉 Pittsburgh (HQ)',
    NULL,
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    '2021-08-20',
    '1991-09-25',
    'Done',
    'https://linkedin.com/in/amandawilliams',
    NULL
  ),
  -- Robert Johnson
  (
    'Robert',
    'Johnson',
    'robert.johnson@lendingheights.com',
    '(412) 555-0128',
    'Loan Officer',
    'Sales',
    '🌉 Pittsburgh (HQ)',
    'NMLS #456789',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    '2022-04-01',
    '1987-02-14',
    'Done',
    NULL,
    'https://calendly.com/robertjohnson'
  ),
  -- Lisa Anderson
  (
    'Lisa',
    'Anderson',
    'lisa.anderson@lendingheights.com',
    '(814) 555-0129',
    'Underwriter',
    'Operations',
    '🌊 Erie PA',
    NULL,
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    '2021-11-10',
    '1989-12-08',
    'Done',
    NULL,
    NULL
  ),
  -- Michael Davis
  (
    'Michael',
    'Davis',
    'michael.davis@lendingheights.com',
    '(912) 555-0130',
    'Loan Officer',
    'Sales',
    '🍑 Savannah',
    'NMLS #567890',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    '2022-06-15',
    '1992-04-30',
    'Done',
    NULL,
    'https://calendly.com/michaeldavis'
  ),
  -- Emily Taylor
  (
    'Emily',
    'Taylor',
    'emily.taylor@lendingheights.com',
    '(215) 555-0131',
    'Closing Coordinator',
    'Operations',
    '🔔 Philadelphia',
    NULL,
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    '2022-09-01',
    '1994-06-12',
    'Done',
    NULL,
    NULL
  ),
  -- James Martinez
  (
    'James',
    'Martinez',
    'james.martinez@lendingheights.com',
    '(412) 555-0132',
    'Technology Specialist',
    'Operations',
    '🌉 Pittsburgh (HQ)',
    NULL,
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    '2023-01-10',
    '1995-08-22',
    'In progress',
    NULL,
    NULL
  ),
  -- Jessica Brown
  (
    'Jessica',
    'Brown',
    'jessica.brown@lendingheights.com',
    '(619) 555-0133',
    'Loan Officer',
    'Sales',
    '🌅 LH California',
    'NMLS #678901',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    '2023-02-01',
    '1990-10-05',
    'In progress',
    NULL,
    NULL
  ),
  -- Christopher Garcia
  (
    'Christopher',
    'Garcia',
    'christopher.garcia@lendingheights.com',
    '(412) 555-0134',
    'Compliance Officer',
    'Operations',
    '🌉 Pittsburgh (HQ)',
    NULL,
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    '2021-05-20',
    '1986-01-17',
    'Done',
    NULL,
    NULL
  );

-- Update manager relationships
-- Sarah Mitchell is CEO (no manager)
-- Marcus Thompson reports to Sarah
-- Jennifer Rodriguez reports to Sarah
-- Others report to Sarah or their branch manager

UPDATE teammates SET manager_id = (SELECT id FROM teammates WHERE email = 'sarah.mitchell@lendingheights.com')
WHERE email IN (
  'marcus.thompson@lendingheights.com',
  'jennifer.rodriguez@lendingheights.com',
  'david.chen@lendingheights.com',
  'amanda.williams@lendingheights.com',
  'lisa.anderson@lendingheights.com',
  'james.martinez@lendingheights.com',
  'christopher.garcia@lendingheights.com'
);

-- Robert Johnson reports to Marcus Thompson
UPDATE teammates SET manager_id = (SELECT id FROM teammates WHERE email = 'marcus.thompson@lendingheights.com')
WHERE email = 'robert.johnson@lendingheights.com';

-- Michael Davis reports to Jennifer Rodriguez
UPDATE teammates SET manager_id = (SELECT id FROM teammates WHERE email = 'jennifer.rodriguez@lendingheights.com')
WHERE email = 'michael.davis@lendingheights.com';

-- Add tags for teammates
INSERT INTO teammate_tags (teammate_id, tag_name)
SELECT t.id, tag.name
FROM teammates t
CROSS JOIN (
  SELECT 'Leadership' as name UNION ALL
  SELECT 'P&L' UNION ALL
  SELECT 'HR'
) tag
WHERE t.email = 'sarah.mitchell@lendingheights.com';

INSERT INTO teammate_tags (teammate_id, tag_name)
SELECT t.id, tag.name
FROM teammates t
CROSS JOIN (
  SELECT 'Sales' as name UNION ALL
  SELECT 'sales'
) tag
WHERE t.email IN ('marcus.thompson@lendingheights.com', 'robert.johnson@lendingheights.com', 'michael.davis@lendingheights.com', 'jessica.brown@lendingheights.com');

INSERT INTO teammate_tags (teammate_id, tag_name)
SELECT t.id, tag.name
FROM teammates t
CROSS JOIN (
  SELECT 'branch manager' as name UNION ALL
  SELECT 'P&L' UNION ALL
  SELECT 'sales'
) tag
WHERE t.email = 'jennifer.rodriguez@lendingheights.com';

INSERT INTO teammate_tags (teammate_id, tag_name)
SELECT t.id, tag.name
FROM teammates t
CROSS JOIN (
  SELECT 'processing' as name UNION ALL
  SELECT 'tech/ support'
) tag
WHERE t.email = 'david.chen@lendingheights.com';

INSERT INTO teammate_tags (teammate_id, tag_name)
SELECT t.id, tag.name
FROM teammates t
CROSS JOIN (
  SELECT 'marketing' as name UNION ALL
  SELECT 'HR'
) tag
WHERE t.email = 'amanda.williams@lendingheights.com';

INSERT INTO teammate_tags (teammate_id, tag_name)
SELECT t.id, tag.name
FROM teammates t
CROSS JOIN (
  SELECT 'underwriting questions' as name UNION ALL
  SELECT 'guidelines'
) tag
WHERE t.email = 'lisa.anderson@lendingheights.com';

INSERT INTO teammate_tags (teammate_id, tag_name)
SELECT t.id, tag.name
FROM teammates t
CROSS JOIN (
  SELECT 'closing' as name UNION ALL
  SELECT 'ctc' UNION ALL
  SELECT 'title'
) tag
WHERE t.email = 'emily.taylor@lendingheights.com';

INSERT INTO teammate_tags (teammate_id, tag_name)
SELECT t.id, tag.name
FROM teammates t
CROSS JOIN (
  SELECT 'tech/ support' as name UNION ALL
  SELECT 'ARIVE'
) tag
WHERE t.email = 'james.martinez@lendingheights.com';

INSERT INTO teammate_tags (teammate_id, tag_name)
SELECT t.id, tag.name
FROM teammates t
CROSS JOIN (
  SELECT 'HR' as name UNION ALL
  SELECT 'payroll' UNION ALL
  SELECT 'guidelines'
) tag
WHERE t.email = 'christopher.garcia@lendingheights.com';

-- Verify data imported
SELECT 
  full_name,
  position,
  department,
  branch,
  onboarding_status,
  (SELECT full_name FROM teammates m WHERE m.id = t.manager_id) as manager_name
FROM teammates t
ORDER BY full_name;

-- Show tag counts
SELECT 
  t.full_name,
  COUNT(tt.id) as tag_count,
  STRING_AGG(tt.tag_name, ', ' ORDER BY tt.tag_name) as tags
FROM teammates t
LEFT JOIN teammate_tags tt ON t.id = tt.teammate_id
GROUP BY t.id, t.full_name
ORDER BY t.full_name;
