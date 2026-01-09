# TalentFlow Setup Guide

## Step 1: Run Database Schema

1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/ppywhyoxuiucwsgiyqzx
2. Go to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase-schema-talentflow.sql`
5. Paste and click **Run**
6. Verify success - you should see "Success. No rows returned"

## Step 2: Assign Admin Roles

After running the schema, assign admin roles to yourself and your team:

```sql
-- Run this in Supabase SQL Editor to make users admins
INSERT INTO user_roles (user_email, role_id)
SELECT
  email,
  (SELECT id FROM roles WHERE name = 'Admin')
FROM (
  VALUES
    ('vnaccarelli@lhloans.com'),  -- Vinny (you)
    ('jason@lhloans.com'),         -- Jason (update with real email)
    ('matt@lhloans.com'),          -- Matt (update with real email)
    ('ann@lhloans.com')            -- Ann (update with real email)
) AS admin_emails(email)
ON CONFLICT (user_email)
DO UPDATE SET role_id = (SELECT id FROM roles WHERE name = 'Admin');
```

## Step 3: Verify Tables Created

Check that all tables exist:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'roles', 'user_roles', 'applications', 'permissions',
    'applicants', 'employees', 'playbooks', 'onboardings',
    'tasks', 'notifications', 'notes', 'knowledge_articles',
    'email_templates', 'automation_rules'
  )
ORDER BY table_name;
```

You should see all 14 tables.

## Step 4: Test Permission System

Test if permission checks work:

```sql
-- Check your role
SELECT get_user_role('vnaccarelli@lhloans.com');
-- Should return: 'Admin'

-- Check if you have TalentFlow access
SELECT has_permission('vnaccarelli@lhloans.com', 'talentflow', 'admin');
-- Should return: true
```

## Step 5: Optional - Seed Test Data

If you want some test data to start:

```sql
-- Insert a test employee
INSERT INTO employees (name, email, position, department, hire_date, status)
VALUES ('Test Employee', 'test@lhloans.com', 'Loan Officer', 'Sales', CURRENT_DATE, 'active')
RETURNING *;

-- Create a simple playbook
INSERT INTO playbooks (title, description, status, milestones)
VALUES (
  'Standard Onboarding',
  'Default onboarding process for new hires',
  'active',
  '[
    {
      "id": "m1",
      "title": "Week 1 - Setup",
      "description": "Get employee setup with tools and access",
      "duration_days": 7,
      "stage": "week-1",
      "tasks": [
        {
          "id": "t1",
          "title": "Complete HR paperwork",
          "description": "Fill out all new hire documents",
          "assigned_to": "employee",
          "requires_approval": true,
          "due_offset_days": 1,
          "priority": "high"
        },
        {
          "id": "t2",
          "title": "Setup computer and accounts",
          "description": "Provide laptop, email, and system access",
          "assigned_to": "admin",
          "requires_approval": false,
          "due_offset_days": 1,
          "priority": "high"
        }
      ]
    },
    {
      "id": "m2",
      "title": "Week 2 - Training",
      "description": "Complete initial training modules",
      "duration_days": 7,
      "stage": "week-2",
      "tasks": [
        {
          "id": "t3",
          "title": "Complete compliance training",
          "description": "Finish all required compliance courses",
          "assigned_to": "employee",
          "requires_approval": false,
          "due_offset_days": 14,
          "priority": "medium"
        }
      ]
    }
  ]'::jsonb
)
RETURNING *;
```

## Database Schema Overview

### Core Tables

1. **roles** - Role definitions (Admin, Manager, Employee, Executive)
2. **user_roles** - User → Role assignment
3. **applications** - Hub apps (Directory, TalentFlow, CRM, etc.)
4. **permissions** - Role → App → Permission level

5. **applicants** - Job applicants (pre-hire)
6. **employees** - All employees (merges with Team Directory)
7. **playbooks** - Onboarding templates
8. **onboardings** - Active onboarding instances
9. **tasks** - Individual onboarding tasks

10. **notifications** - In-app notifications
11. **notes** - Internal notes/documentation
12. **knowledge_articles** - Knowledge base articles
13. **email_templates** - Email templates
14. **automation_rules** - Automated workflows

### Helper Functions

- `get_user_role(email)` - Get user's role name
- `has_permission(email, app_slug, level)` - Check if user has permission
- `calculate_onboarding_progress(onboarding_id)` - Calculate % complete
- `get_overdue_tasks_count()` - Count overdue tasks
- `get_tasks_due_this_week_count()` - Count tasks due this week

### Auto-Calculated Fields

- **onboarding.progress** - Automatically updates when tasks are completed
- **updated_at** - Automatically updates on all tables

## Next Steps

After database is set up:
1. ✅ Build API layer (`lib/api/talentflow.ts`)
2. ✅ Create TalentFlow routes (`app/(hub)/talentflow/`)
3. ✅ Build permission checking utilities
4. ✅ Build dashboard widgets
5. ✅ Build All Tasks page
6. ✅ Build Employee Portal

---

## Troubleshooting

**Error: relation already exists**
- Some tables may already exist. Drop them first if you need to recreate:
```sql
DROP TABLE IF EXISTS automation_rules, email_templates, knowledge_articles,
  notes, notifications, tasks, onboardings, playbooks, employees, applicants,
  permissions, applications, user_roles, roles CASCADE;
```

**Permission denied**
- Make sure RLS policies are created correctly
- Check that you're using the anon key in your app, not the service role key

**Functions not working**
- Verify functions were created: `\df` in psql or check Database > Functions in Supabase UI
