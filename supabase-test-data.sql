-- =====================================================
-- TALENTFLOW TEST DATA
-- =====================================================
-- Run this in Supabase SQL Editor to populate with test data
-- This creates realistic onboarding scenarios to test the dashboard

-- =====================================================
-- 1. TEST EMPLOYEES
-- =====================================================

INSERT INTO employees (name, email, work_email, phone, position, department, manager, hire_date, status) VALUES
  ('Sarah Johnson', 'sjohnson@lhloans.com', 'sjohnson@lhloans.com', '555-0101', 'Loan Officer', 'Sales', 'Vinny Naccarelli', '2026-01-05', 'active'),
  ('Michael Chen', 'mchen@lhloans.com', 'mchen@lhloans.com', '555-0102', 'Loan Processor', 'Operations', 'Jason Cecco', '2026-01-10', 'active'),
  ('Emily Davis', 'edavis@lhloans.com', 'edavis@lhloans.com', '555-0103', 'Account Executive', 'Sales', 'Matt Pfrommer', '2026-01-15', 'active'),
  ('John Smith', 'jsmith@lhloans.com', 'jsmith@lhloans.com', '555-0104', 'Marketing Coordinator', 'Marketing', 'Ann Sullivan', '2025-12-20', 'active')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 2. TEST PLAYBOOK
-- =====================================================

INSERT INTO playbooks (title, description, status, owner, milestones) VALUES
(
  'Standard Onboarding - 90 Days',
  'Complete onboarding process for new hires covering first 90 days',
  'active',
  'vnaccarelli@lhloans.com',
  '[
    {
      "id": "pre-start",
      "title": "Pre-Start Preparation",
      "description": "Tasks to complete before first day",
      "duration_days": 7,
      "stage": "pre-start",
      "tasks": [
        {
          "id": "t1",
          "title": "Send welcome email",
          "description": "Send new hire welcome packet with start date, time, and what to expect",
          "assigned_to": "admin",
          "requires_approval": false,
          "due_offset_days": -7,
          "priority": "high",
          "category": "Communication"
        },
        {
          "id": "t2",
          "title": "Order IT equipment",
          "description": "Order laptop, phone, and any other necessary equipment",
          "assigned_to": "admin",
          "requires_approval": false,
          "due_offset_days": -5,
          "priority": "high",
          "category": "IT Setup"
        },
        {
          "id": "t3",
          "title": "Complete new hire paperwork",
          "description": "Fill out I-9, W-4, direct deposit, emergency contacts",
          "assigned_to": "employee",
          "requires_approval": true,
          "due_offset_days": -1,
          "priority": "high",
          "category": "HR & Compliance"
        }
      ]
    },
    {
      "id": "week-1",
      "title": "Week 1 - Getting Started",
      "description": "First week orientation and setup",
      "duration_days": 7,
      "stage": "week-1",
      "tasks": [
        {
          "id": "t4",
          "title": "Complete IT setup",
          "description": "Set up laptop, email, system access, and software installations",
          "assigned_to": "admin",
          "requires_approval": false,
          "due_offset_days": 1,
          "priority": "high",
          "category": "IT Setup",
          "dependencies": ["t2"]
        },
        {
          "id": "t5",
          "title": "Attend orientation meeting",
          "description": "Meet with team, tour office, review company culture and values",
          "assigned_to": "employee",
          "requires_approval": false,
          "due_offset_days": 1,
          "priority": "high",
          "category": "Orientation"
        },
        {
          "id": "t6",
          "title": "Complete compliance training",
          "description": "Finish all required NMLS and compliance courses",
          "assigned_to": "employee",
          "requires_approval": true,
          "due_offset_days": 5,
          "priority": "high",
          "category": "Training"
        },
        {
          "id": "t7",
          "title": "Shadow experienced team member",
          "description": "Spend 2 days shadowing to learn workflows",
          "assigned_to": "employee",
          "requires_approval": false,
          "due_offset_days": 7,
          "priority": "medium",
          "category": "Training"
        }
      ]
    },
    {
      "id": "week-2",
      "title": "Week 2 - Systems Training",
      "description": "Learn key systems and processes",
      "duration_days": 7,
      "stage": "week-2",
      "tasks": [
        {
          "id": "t8",
          "title": "Complete LOS system training",
          "description": "Learn loan origination system basics",
          "assigned_to": "employee",
          "requires_approval": false,
          "due_offset_days": 10,
          "priority": "high",
          "category": "Training"
        },
        {
          "id": "t9",
          "title": "Review product guidelines",
          "description": "Study loan products and underwriting guidelines",
          "assigned_to": "employee",
          "requires_approval": false,
          "due_offset_days": 12,
          "priority": "medium",
          "category": "Training"
        },
        {
          "id": "t10",
          "title": "First check-in meeting",
          "description": "30-minute check-in with manager on progress",
          "assigned_to": "employee",
          "requires_approval": false,
          "due_offset_days": 14,
          "priority": "medium",
          "category": "Management"
        }
      ]
    },
    {
      "id": "30-days",
      "title": "30 Day Review",
      "description": "First month assessment",
      "duration_days": 7,
      "stage": "30-days",
      "tasks": [
        {
          "id": "t11",
          "title": "Complete 30-day self assessment",
          "description": "Reflect on first month, challenges, wins, questions",
          "assigned_to": "employee",
          "requires_approval": true,
          "due_offset_days": 30,
          "priority": "high",
          "category": "Review"
        },
        {
          "id": "t12",
          "title": "30-day review meeting",
          "description": "Performance review and goal setting with manager",
          "assigned_to": "employee",
          "requires_approval": false,
          "due_offset_days": 30,
          "priority": "high",
          "category": "Review",
          "dependencies": ["t11"]
        }
      ]
    },
    {
      "id": "60-days",
      "title": "60 Day Review",
      "description": "Two month check-in",
      "duration_days": 7,
      "stage": "60-days",
      "tasks": [
        {
          "id": "t13",
          "title": "60-day progress review",
          "description": "Assess progress on goals set at 30 days",
          "assigned_to": "employee",
          "requires_approval": true,
          "due_offset_days": 60,
          "priority": "medium",
          "category": "Review"
        }
      ]
    },
    {
      "id": "90-days",
      "title": "90 Day Review",
      "description": "End of onboarding assessment",
      "duration_days": 7,
      "stage": "90-days",
      "tasks": [
        {
          "id": "t14",
          "title": "Complete 90-day evaluation",
          "description": "Final onboarding review and transition to regular employee",
          "assigned_to": "employee",
          "requires_approval": true,
          "due_offset_days": 90,
          "priority": "high",
          "category": "Review"
        },
        {
          "id": "t15",
          "title": "Celebrate completion!",
          "description": "Congratulations on completing onboarding!",
          "assigned_to": "employee",
          "requires_approval": false,
          "due_offset_days": 90,
          "priority": "low",
          "category": "Celebration"
        }
      ]
    }
  ]'::jsonb
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. TEST ONBOARDINGS
-- =====================================================

-- Get IDs for reference
DO $$
DECLARE
  playbook_id UUID;
  sarah_id UUID;
  michael_id UUID;
  emily_id UUID;
  john_id UUID;
  onboarding1_id UUID;
  onboarding2_id UUID;
  onboarding3_id UUID;
  onboarding4_id UUID;
BEGIN
  -- Get playbook ID
  SELECT id INTO playbook_id FROM playbooks WHERE title = 'Standard Onboarding - 90 Days' LIMIT 1;

  -- Get employee IDs
  SELECT id INTO sarah_id FROM employees WHERE email = 'sjohnson@lhloans.com';
  SELECT id INTO michael_id FROM employees WHERE email = 'mchen@lhloans.com';
  SELECT id INTO emily_id FROM employees WHERE email = 'edavis@lhloans.com';
  SELECT id INTO john_id FROM employees WHERE email = 'jsmith@lhloans.com';

  -- Create onboardings
  INSERT INTO onboardings (employee_id, playbook_id, start_date, status, current_stage, progress)
  VALUES
    (sarah_id, playbook_id, '2026-01-05', 'on-track', 'week-2', 45),
    (michael_id, playbook_id, '2026-01-10', 'on-track', 'week-1', 30),
    (emily_id, playbook_id, '2026-01-15', 'pending', 'pre-start', 10),
    (john_id, playbook_id, '2025-12-20', 'completed', '90-days', 100)
  ON CONFLICT DO NOTHING;

  -- Get onboarding IDs
  SELECT id INTO onboarding1_id FROM onboardings WHERE employee_id = sarah_id LIMIT 1;
  SELECT id INTO onboarding2_id FROM onboardings WHERE employee_id = michael_id LIMIT 1;
  SELECT id INTO onboarding3_id FROM onboardings WHERE employee_id = emily_id LIMIT 1;
  SELECT id INTO onboarding4_id FROM onboardings WHERE employee_id = john_id LIMIT 1;

  -- Create tasks for Sarah (Week 2 - some overdue)
  INSERT INTO tasks (onboarding_id, milestone_id, title, description, assigned_to, due_date, completed, requires_approval, priority, category)
  VALUES
    (onboarding1_id, 'week-1', 'Complete IT setup', 'Set up laptop, email, system access', 'admin', '2026-01-06', true, false, 'high', 'IT Setup'),
    (onboarding1_id, 'week-1', 'Attend orientation meeting', 'Meet team and tour office', 'employee', '2026-01-06', true, false, 'high', 'Orientation'),
    (onboarding1_id, 'week-1', 'Complete compliance training', 'Finish NMLS courses', 'employee', '2026-01-10', false, true, 'high', 'Training'),
    (onboarding1_id, 'week-2', 'Complete LOS system training', 'Learn loan origination system', 'employee', '2026-01-15', false, false, 'high', 'Training'),
    (onboarding1_id, 'week-2', 'Review product guidelines', 'Study loan products', 'employee', '2026-01-17', false, false, 'medium', 'Training'),
    (onboarding1_id, 'week-2', 'First check-in meeting', 'Check-in with manager', 'employee', '2026-01-19', false, false, 'medium', 'Management')
  ON CONFLICT DO NOTHING;

  -- Create tasks for Michael (Week 1)
  INSERT INTO tasks (onboarding_id, milestone_id, title, description, assigned_to, due_date, completed, requires_approval, priority, category)
  VALUES
    (onboarding2_id, 'week-1', 'Complete IT setup', 'Set up laptop and email', 'admin', '2026-01-11', true, false, 'high', 'IT Setup'),
    (onboarding2_id, 'week-1', 'Attend orientation meeting', 'Meet team', 'employee', '2026-01-11', true, false, 'high', 'Orientation'),
    (onboarding2_id, 'week-1', 'Complete compliance training', 'Finish NMLS courses', 'employee', '2026-01-15', false, true, 'high', 'Training'),
    (onboarding2_id, 'week-1', 'Shadow experienced team member', 'Shadow for 2 days', 'employee', '2026-01-17', false, false, 'medium', 'Training')
  ON CONFLICT DO NOTHING;

  -- Create tasks for Emily (Pre-start)
  INSERT INTO tasks (onboarding_id, milestone_id, title, description, assigned_to, due_date, completed, requires_approval, priority, category)
  VALUES
    (onboarding3_id, 'pre-start', 'Send welcome email', 'Send welcome packet', 'admin', '2026-01-08', true, false, 'high', 'Communication'),
    (onboarding3_id, 'pre-start', 'Order IT equipment', 'Order laptop and phone', 'admin', '2026-01-10', true, false, 'high', 'IT Setup'),
    (onboarding3_id, 'pre-start', 'Complete new hire paperwork', 'Fill out I-9, W-4', 'employee', '2026-01-14', false, true, 'high', 'HR & Compliance')
  ON CONFLICT DO NOTHING;

  -- Create some overdue tasks
  INSERT INTO tasks (onboarding_id, milestone_id, title, description, assigned_to, due_date, completed, requires_approval, priority, category, blocked, blocked_reason)
  VALUES
    (onboarding1_id, 'week-1', 'Shadow experienced team member', 'Shadow for 2 days', 'employee', '2026-01-08', false, false, 'medium', 'Training', true, 'Waiting for team member availability'),
    (onboarding2_id, 'pre-start', 'Complete new hire paperwork', 'Fill out I-9, W-4', 'employee', '2026-01-09', false, true, 'high', 'HR & Compliance', false, null)
  ON CONFLICT DO NOTHING;

  -- Create pending approval tasks (completed but needs approval)
  INSERT INTO tasks (onboarding_id, milestone_id, title, description, assigned_to, due_date, completed, completed_date, requires_approval, approval_status, priority, category)
  VALUES
    (onboarding1_id, 'pre-start', 'Complete new hire paperwork', 'Fill out I-9, W-4', 'employee', '2026-01-04', true, '2026-01-04 14:30:00', true, 'pending', 'high', 'HR & Compliance')
  ON CONFLICT DO NOTHING;

END $$;

-- =====================================================
-- 4. TEST APPLICANTS
-- =====================================================

INSERT INTO applicants (name, email, phone, position_applied, status, application_date, notes)
VALUES
  ('Jessica Martinez', 'jmartinez@gmail.com', '555-0201', 'Loan Officer', 'new', NOW() - INTERVAL '2 days', 'Strong background in mortgage lending'),
  ('David Wilson', 'dwilson@yahoo.com', '555-0202', 'Processor', 'new', NOW() - INTERVAL '1 day', 'Previously worked at Wells Fargo'),
  ('Amanda Brown', 'abrown@gmail.com', '555-0203', 'Account Executive', 'reviewing', NOW() - INTERVAL '5 days', 'Great sales experience'),
  ('Robert Taylor', 'rtaylor@outlook.com', '555-0204', 'Marketing Manager', 'approved', NOW() - INTERVAL '10 days', 'Start date to be scheduled')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. TEST NOTIFICATIONS
-- =====================================================

INSERT INTO notifications (user_email, title, message, type, read, action_url)
VALUES
  ('vnaccarelli@lhloans.com', 'New approval needed', 'Sarah Johnson completed "Complete new hire paperwork" and needs your approval', 'approval', false, '/talentflow/approvals'),
  ('vnaccarelli@lhloans.com', 'Task overdue', 'Sarah Johnson has an overdue task: "Shadow experienced team member"', 'task', false, '/talentflow/tasks?filter=overdue'),
  ('vnaccarelli@lhloans.com', 'New application', 'Jessica Martinez applied for Loan Officer position', 'info', false, '/talentflow/applications'),
  ('sjohnson@lhloans.com', 'Task due soon', 'Your task "Complete compliance training" is due in 2 days', 'task', false, '/talentflow/portal')
ON CONFLICT DO NOTHING;

-- =====================================================
-- DONE!
-- =====================================================

SELECT
  'Test data created successfully!' as message,
  (SELECT COUNT(*) FROM employees WHERE status = 'active') as employees,
  (SELECT COUNT(*) FROM playbooks WHERE status = 'active') as playbooks,
  (SELECT COUNT(*) FROM onboardings) as onboardings,
  (SELECT COUNT(*) FROM tasks) as tasks,
  (SELECT COUNT(*) FROM applicants) as applicants,
  (SELECT COUNT(*) FROM notifications) as notifications;
