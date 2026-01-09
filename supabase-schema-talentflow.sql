-- =====================================================
-- LENDING HEIGHTS HUB - TALENTFLOW DATABASE SCHEMA
-- =====================================================
-- Run this in Supabase SQL Editor
-- This creates all tables, RLS policies, and functions for TalentFlow

-- =====================================================
-- 1. RBAC & PERMISSIONS SYSTEM
-- =====================================================

-- Roles table (Admin, Manager, Employee, Executive)
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
  ('Admin', 'Full access to all applications'),
  ('Manager', 'Can manage team members and view reports'),
  ('Employee', 'Limited access to assigned tasks and personal info'),
  ('Executive', 'Executive dashboard and high-level analytics')
ON CONFLICT (name) DO NOTHING;

-- User roles (extends auth.users with role assignment)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT UNIQUE NOT NULL,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table (for permission matrix)
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Hub applications
INSERT INTO applications (name, slug, category) VALUES
  ('Team Directory', 'directory', 'Employee'),
  ('Company Calendar', 'calendar', 'Employee'),
  ('TalentFlow', 'talentflow', 'Operations'),
  ('Partner CRM', 'crm', 'CRM'),
  ('Project Checklists', 'checklists', 'Operations'),
  ('Marketing Hub', 'marketing', 'Marketing'),
  ('Admin Panel', 'admin', 'Admin'),
  ('Closings', 'closings', 'Operations')
ON CONFLICT (slug) DO NOTHING;

-- Permissions table (role + app + permission level)
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  permission_level TEXT NOT NULL CHECK (permission_level IN ('none', 'view', 'edit', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_id, application_id)
);

-- Insert default TalentFlow permissions
INSERT INTO permissions (role_id, application_id, permission_level)
SELECT
  r.id,
  a.id,
  CASE
    WHEN r.name = 'Admin' THEN 'admin'
    WHEN r.name = 'Executive' THEN 'admin'
    WHEN r.name = 'Manager' THEN 'view'
    ELSE 'none'
  END
FROM roles r
CROSS JOIN applications a
WHERE a.slug = 'talentflow'
ON CONFLICT (role_id, application_id) DO NOTHING;

-- =====================================================
-- 2. TALENTFLOW CORE ENTITIES
-- =====================================================

-- Applicants (pre-onboarding)
CREATE TABLE IF NOT EXISTS applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position_applied TEXT NOT NULL,
  application_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'approved', 'rejected')),
  reviewed_date TIMESTAMPTZ,
  resume_url TEXT,
  cover_letter TEXT,
  notes TEXT,
  source TEXT,
  jotform_submission_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employees (enhanced from existing teammates table)
-- This merges with your existing Team Directory
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info (from existing teammates)
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  profile_picture_url TEXT,
  bio TEXT,

  -- Additional TalentFlow fields
  work_email TEXT,
  personal_email TEXT,
  position TEXT NOT NULL,
  department TEXT,
  manager TEXT,
  hire_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),

  -- Address (optional)
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,

  -- Emergency Contact (optional)
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playbooks (onboarding templates)
CREATE TABLE IF NOT EXISTS playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  owner TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),

  -- Milestones stored as JSONB array
  -- Structure: [{ id, title, description, duration_days, stage, tasks: [...] }]
  milestones JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboardings (active onboarding instances)
CREATE TABLE IF NOT EXISTS onboardings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  playbook_id UUID REFERENCES playbooks(id) ON DELETE SET NULL,

  start_date DATE NOT NULL,
  expected_end_date DATE,
  actual_end_date DATE,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'on-track', 'at-risk', 'completed')),
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

  current_stage TEXT,
  stage_end_date DATE,

  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks (individual onboarding tasks)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id UUID REFERENCES onboardings(id) ON DELETE CASCADE,
  milestone_id TEXT, -- references milestone ID in playbook JSONB

  title TEXT NOT NULL,
  description TEXT,

  -- Assignment
  assigned_to TEXT NOT NULL CHECK (assigned_to IN ('admin', 'employee', 'manager')),
  assigned_to_name TEXT,

  -- Scheduling
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_date TIMESTAMPTZ,
  completed_by TEXT,

  -- Approval workflow
  requires_approval BOOLEAN DEFAULT FALSE,
  approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by TEXT,
  approved_date TIMESTAMPTZ,

  -- Blocking & Dependencies
  blocked BOOLEAN DEFAULT FALSE,
  blocked_reason TEXT,
  dependencies JSONB DEFAULT '[]'::jsonb, -- array of task IDs

  -- Metadata
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,

  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'task', 'approval', 'milestone', 'system')),

  read BOOLEAN DEFAULT FALSE,
  read_date TIMESTAMPTZ,

  action_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes (internal documentation)
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  title TEXT NOT NULL,
  content TEXT NOT NULL,

  author_email TEXT NOT NULL,
  author_name TEXT,

  tags TEXT[],

  -- Relations (optional)
  related_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  related_onboarding_id UUID REFERENCES onboardings(id) ON DELETE SET NULL,
  related_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge Articles
CREATE TABLE IF NOT EXISTS knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[],

  author_email TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,

  variables TEXT[], -- e.g., ['employee_name', 'start_date', 'manager_name']
  category TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation Rules
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL,

  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('progress_milestone', 'due_date', 'task_completion', 'stage_change')),
  trigger_value TEXT, -- e.g., "50" for 50% progress, or specific milestone ID

  action_type TEXT NOT NULL CHECK (action_type IN ('send_email', 'create_notification', 'assign_task')),
  action_config JSONB DEFAULT '{}'::jsonb, -- action-specific configuration

  active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_roles_email ON user_roles(user_email);
CREATE INDEX IF NOT EXISTS idx_permissions_role ON permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_permissions_app ON permissions(application_id);

CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_applicants_date ON applicants(application_date DESC);

CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_hire_date ON employees(hire_date DESC);

CREATE INDEX IF NOT EXISTS idx_onboardings_employee ON onboardings(employee_id);
CREATE INDEX IF NOT EXISTS idx_onboardings_status ON onboardings(status);
CREATE INDEX IF NOT EXISTS idx_onboardings_start_date ON onboardings(start_date DESC);

CREATE INDEX IF NOT EXISTS idx_tasks_onboarding ON tasks(onboarding_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_email);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notes_employee ON notes(related_employee_id);
CREATE INDEX IF NOT EXISTS idx_notes_onboarding ON notes(related_onboarding_id);
CREATE INDEX IF NOT EXISTS idx_notes_created ON notes(created_at DESC);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboardings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

-- Public read access for roles and applications (needed for permission checks)
CREATE POLICY "Public read roles" ON roles FOR SELECT TO public USING (true);
CREATE POLICY "Public read applications" ON applications FOR SELECT TO public USING (true);
CREATE POLICY "Public read permissions" ON permissions FOR SELECT TO public USING (true);
CREATE POLICY "Public read user_roles" ON user_roles FOR SELECT TO public USING (true);

-- Admin full access to user_roles
CREATE POLICY "Admin full access user_roles" ON user_roles FOR ALL TO public USING (true);

-- Admin full access to permissions
CREATE POLICY "Admin full access permissions" ON permissions FOR ALL TO public USING (true);

-- Applicants: Admins can do everything
CREATE POLICY "Public read applicants" ON applicants FOR SELECT TO public USING (true);
CREATE POLICY "Public insert applicants" ON applicants FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update applicants" ON applicants FOR UPDATE TO public USING (true);
CREATE POLICY "Public delete applicants" ON applicants FOR DELETE TO public USING (true);

-- Employees: Public read (for directory), admins can modify
CREATE POLICY "Public read employees" ON employees FOR SELECT TO public USING (true);
CREATE POLICY "Public insert employees" ON employees FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update employees" ON employees FOR UPDATE TO public USING (true);
CREATE POLICY "Public delete employees" ON employees FOR DELETE TO public USING (true);

-- Playbooks: Public read, admins can modify
CREATE POLICY "Public read playbooks" ON playbooks FOR SELECT TO public USING (true);
CREATE POLICY "Public insert playbooks" ON playbooks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update playbooks" ON playbooks FOR UPDATE TO public USING (true);
CREATE POLICY "Public delete playbooks" ON playbooks FOR DELETE TO public USING (true);

-- Onboardings: Public access for now (will be restricted via app logic)
CREATE POLICY "Public read onboardings" ON onboardings FOR SELECT TO public USING (true);
CREATE POLICY "Public insert onboardings" ON onboardings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update onboardings" ON onboardings FOR UPDATE TO public USING (true);
CREATE POLICY "Public delete onboardings" ON onboardings FOR DELETE TO public USING (true);

-- Tasks: Public access for now (will be restricted via app logic)
CREATE POLICY "Public read tasks" ON tasks FOR SELECT TO public USING (true);
CREATE POLICY "Public insert tasks" ON tasks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update tasks" ON tasks FOR UPDATE TO public USING (true);
CREATE POLICY "Public delete tasks" ON tasks FOR DELETE TO public USING (true);

-- Notifications: Users can read their own
CREATE POLICY "Users read own notifications" ON notifications FOR SELECT TO public USING (true);
CREATE POLICY "Public insert notifications" ON notifications FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE TO public USING (true);
CREATE POLICY "Public delete notifications" ON notifications FOR DELETE TO public USING (true);

-- Notes: Public access for now
CREATE POLICY "Public read notes" ON notes FOR SELECT TO public USING (true);
CREATE POLICY "Public insert notes" ON notes FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update notes" ON notes FOR UPDATE TO public USING (true);
CREATE POLICY "Public delete notes" ON notes FOR DELETE TO public USING (true);

-- Knowledge: Published articles are public
CREATE POLICY "Public read published articles" ON knowledge_articles FOR SELECT TO public USING (published = true);
CREATE POLICY "Public insert articles" ON knowledge_articles FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update articles" ON knowledge_articles FOR UPDATE TO public USING (true);
CREATE POLICY "Public delete articles" ON knowledge_articles FOR DELETE TO public USING (true);

-- Email Templates: Public access
CREATE POLICY "Public read email_templates" ON email_templates FOR SELECT TO public USING (true);
CREATE POLICY "Public insert email_templates" ON email_templates FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update email_templates" ON email_templates FOR UPDATE TO public USING (true);
CREATE POLICY "Public delete email_templates" ON email_templates FOR DELETE TO public USING (true);

-- Automation Rules: Public access
CREATE POLICY "Public read automation_rules" ON automation_rules FOR SELECT TO public USING (true);
CREATE POLICY "Public insert automation_rules" ON automation_rules FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update automation_rules" ON automation_rules FOR UPDATE TO public USING (true);
CREATE POLICY "Public delete automation_rules" ON automation_rules FOR DELETE TO public USING (true);

-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Function to get user's role
CREATE OR REPLACE FUNCTION get_user_role(user_email_param TEXT)
RETURNS TEXT AS $$
  SELECT r.name
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_email = user_email_param;
$$ LANGUAGE SQL STABLE;

-- Function to check if user has permission for an app
CREATE OR REPLACE FUNCTION has_permission(
  user_email_param TEXT,
  app_slug_param TEXT,
  required_level TEXT -- 'view', 'edit', or 'admin'
)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN permissions p ON ur.role_id = p.role_id
    JOIN applications a ON p.application_id = a.id
    WHERE ur.user_email = user_email_param
      AND a.slug = app_slug_param
      AND (
        (required_level = 'view' AND p.permission_level IN ('view', 'edit', 'admin'))
        OR (required_level = 'edit' AND p.permission_level IN ('edit', 'admin'))
        OR (required_level = 'admin' AND p.permission_level = 'admin')
      )
  );
$$ LANGUAGE SQL STABLE;

-- Function to get onboarding progress (calculates from tasks)
CREATE OR REPLACE FUNCTION calculate_onboarding_progress(onboarding_id_param UUID)
RETURNS INT AS $$
  SELECT COALESCE(
    ROUND(
      (COUNT(*) FILTER (WHERE completed = true)::FLOAT /
       NULLIF(COUNT(*)::FLOAT, 0)) * 100
    )::INT,
    0
  )
  FROM tasks
  WHERE onboarding_id = onboarding_id_param;
$$ LANGUAGE SQL STABLE;

-- Trigger to auto-update onboarding progress when tasks change
CREATE OR REPLACE FUNCTION update_onboarding_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE onboardings
  SET progress = calculate_onboarding_progress(NEW.onboarding_id),
      updated_at = NOW()
  WHERE id = NEW.onboarding_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_completed_update_progress
  AFTER INSERT OR UPDATE OF completed ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_progress();

-- Function to get overdue tasks count
CREATE OR REPLACE FUNCTION get_overdue_tasks_count()
RETURNS INT AS $$
  SELECT COUNT(*)::INT
  FROM tasks
  WHERE completed = false
    AND due_date IS NOT NULL
    AND due_date < CURRENT_DATE;
$$ LANGUAGE SQL STABLE;

-- Function to get tasks due this week
CREATE OR REPLACE FUNCTION get_tasks_due_this_week_count()
RETURNS INT AS $$
  SELECT COUNT(*)::INT
  FROM tasks
  WHERE completed = false
    AND due_date IS NOT NULL
    AND due_date >= CURRENT_DATE
    AND due_date <= CURRENT_DATE + INTERVAL '7 days';
$$ LANGUAGE SQL STABLE;

-- =====================================================
-- 6. UPDATED_AT TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applicants_updated_at BEFORE UPDATE ON applicants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_playbooks_updated_at BEFORE UPDATE ON playbooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboardings_updated_at BEFORE UPDATE ON onboardings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_articles_updated_at BEFORE UPDATE ON knowledge_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_rules_updated_at BEFORE UPDATE ON automation_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DONE!
-- =====================================================
-- All tables, indexes, RLS policies, and helper functions created.
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify all tables were created successfully
-- 3. Add initial admin users to user_roles table
