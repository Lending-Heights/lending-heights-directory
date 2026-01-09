# TalentFlow Migration Plan
## From Base44 (Vite/React) to Lending Heights Hub (Next.js/Supabase)

**Created:** January 9, 2026
**Status:** Planning Phase (80% Complete Application)

---

## Executive Summary

TalentFlow is a comprehensive employee onboarding management system built on Base44 (a backend-as-a-service platform) using Vite + React. This document outlines the strategy to migrate TalentFlow into the Lending Heights Hub as a fully integrated app.

### Key Differences
| Aspect | Current (Base44) | Target (Hub) |
|--------|------------------|--------------|
| Framework | Vite + React + React Router | Next.js 14 App Router |
| Backend | Base44 SDK | Supabase |
| Auth | Base44 Auth | Microsoft SSO (planned) |
| Routing | React Router DOM | Next.js file-based routing |
| State | React Query + Zustand | React Query + Zustand (keep) |
| Styling | Tailwind + CSS | Tailwind + CSS variables |
| UI Components | Radix UI + shadcn/ui | Radix UI + shadcn/ui (compatible) |

---

## Application Overview

### Core Features (Admin View)

#### 1. **Dashboard** (`/Dashboard`)
- Real-time metrics and KPIs
- Active onboardings overview
- Task statistics (overdue, due this week, completed)
- Priority feed and activity timeline
- Admin insights dashboard

#### 2. **Pipeline** (`/Pipeline`)
- Kanban board view of onboardings by stage
- Calendar view of all onboardings
- Stage-based organization (Pre-Start, Week 1-4, 30/60/90 Days)
- Drag-and-drop functionality
- Advanced filtering (status, stage, progress, overdue)
- Progress tracking with real-time task completion

#### 3. **Applications** (`/Applications`)
- Applicant tracking system
- Status management (New, Reviewing, Approved, Rejected)
- Application detail view with full information
- Integration with JotForm webhook for new applications
- Approval workflow to convert applicants to employees

#### 4. **Active Onboardings** (`/Onboardings`)
- Table view of all active onboardings
- Progress bars based on task completion
- Status filtering and search
- Quick actions (view, edit, delete)
- Onboarding drawer for detailed view

#### 5. **Pending Approvals** (`/PendingApprovals`)
- Task approval workflow
- Admin review and sign-off on employee-completed tasks
- Bulk approval capabilities
- Approval history tracking

#### 6. **All Tasks** (`/Tasks`)
- Comprehensive task management
- Multi-dimensional filtering (onboarding, milestone, status, assignee)
- Due date tracking and overdue alerts
- Task detail modal with full context
- Bulk task operations

#### 7. **Playbooks** (`/Playbooks`)
- Template management for onboarding processes
- Milestone-based structure with configurable stages
- Task templates with dependencies
- Playbook versioning (draft/active/archived)
- Duplication and cloning functionality
- Rich task configuration:
  - Task description and instructions
  - Assignee (admin/employee)
  - Approval requirements
  - Dependencies on other tasks
  - Due dates relative to start or other tasks
  - Categories/tags

#### 8. **Employee Database** (`/Employees`)
- Complete employee records
- Contact information (personal email, work email, phone)
- Employment details (hire date, department, position, manager)
- Status tracking (active/inactive)
- Integration with Team Directory
- Employee creation and editing

#### 9. **Team Directory** (`/TeamDirectory`)
- Public-facing employee directory
- Search and filter capabilities
- Profile pages with contact info
- Gallery and table views
- Export functionality

#### 10. **Email Builder** (`/EmailBuilder`)
- Custom email template creation
- Rich text editor with TipTap
- Variable placeholders for personalization
- Email preview
- Template library

#### 11. **Email Automation Matrix** (`/EmailAutomationMatrix`)
- Automated email triggers based on onboarding progress
- Milestone-based email sequences
- Progress percentage triggers
- Configurable email content per trigger

#### 12. **Knowledge Hub** (`/KnowledgeHub`)
- Centralized documentation and resources
- Searchable content library
- Categories and tags
- Document management
- Available to both admins and employees

#### 13. **Notes** (`/Notes`)
- Internal notes and documentation
- Rich text editor
- Tagging and categorization
- Search functionality
- Attachments support

### Employee Portal (`/EmployeePortal`)

**Key Features:**
- Personalized onboarding dashboard
- Task checklist with visual progress
- Milestone tracker with vertical progress bar
- Required documents upload section
- Onboarding chat for questions/support
- Task detail modal with instructions
- Deep-linking from email notifications
- Task filtering (all, incomplete, completed, overdue)
- Task sorting (due date, priority, milestone)
- Related notes display

**Employee Experience:**
- Auto-redirect to portal when they have active onboarding
- Limited navigation (only Portal, Directory, Knowledge Hub, Settings)
- Can't access admin tools
- Mobile-optimized interface
- Progress celebration (confetti on completion)

### Profile & Settings

#### Profile (`/Profile`)
- User profile management
- Profile picture upload
- Contact preferences
- Notification settings

#### Settings (`/Settings`)
- Application configuration
- User role management
- Integration settings
- Team Directory settings page

---

## Data Model (Base44 Entities)

### Core Entities

#### 1. **Applicant**
```typescript
{
  id: string
  name: string
  email: string
  phone?: string
  position_applied: string
  application_date: date
  status: 'new' | 'reviewing' | 'approved' | 'rejected'
  reviewed_date?: date
  resume_url?: string
  cover_letter?: string
  notes?: string
  // JotForm integration fields
  source?: string
  jotform_submission_id?: string
}
```

#### 2. **Employee**
```typescript
{
  id: string
  name: string
  email: string (primary)
  work_email?: string
  personal_email?: string
  phone?: string
  position: string
  department?: string
  hire_date: date
  manager?: string
  status: 'active' | 'inactive'
  profile_picture_url?: string
  bio?: string
  created_date: date
  updated_date: date
}
```

#### 3. **Onboarding**
```typescript
{
  id: string
  employee_id: string (FK -> Employee)
  playbook_id: string (FK -> Playbook)
  start_date: date
  expected_end_date?: date
  actual_end_date?: date
  status: 'pending' | 'on-track' | 'at-risk' | 'completed'
  progress: number (0-100)
  current_stage: string
  stage_end_date?: date
  notes?: string
  created_date: date
  updated_date: date
}
```

#### 4. **Playbook**
```typescript
{
  id: string
  title: string
  description?: string
  owner?: string
  status: 'draft' | 'active' | 'archived'
  milestones: Milestone[] (JSON)
  created_date: date
  updated_date: date
}

// Milestone structure (within playbooks JSON)
interface Milestone {
  id: string
  title: string
  description?: string
  duration_days: number
  stage: string // 'pre-start' | 'week-1' | 'week-2' | ... | '30-days' | '60-days' | '90-days'
  tasks: TaskTemplate[]
}

interface TaskTemplate {
  id: string
  title: string
  description?: string
  assigned_to: 'admin' | 'employee'
  requires_approval: boolean
  due_offset_days: number // days from milestone start
  category?: string
  dependencies?: string[] // task IDs
  priority?: 'low' | 'medium' | 'high'
}
```

#### 5. **Task**
```typescript
{
  id: string
  onboarding_id: string (FK -> Onboarding)
  milestone_id?: string
  title: string
  description?: string
  assigned_to: 'admin' | 'employee' | 'manager'
  assigned_to_name?: string
  due_date?: date
  completed: boolean
  completed_date?: date
  completed_by?: string
  requires_approval: boolean
  approval_status?: 'pending' | 'approved' | 'rejected'
  approved_by?: string
  approved_date?: date
  blocked: boolean
  blocked_reason?: string
  priority?: 'low' | 'medium' | 'high'
  category?: string
  dependencies?: string[] // other task IDs
  notes?: string
  created_date: date
  updated_date: date
}
```

#### 6. **Notification**
```typescript
{
  id: string
  user_email: string
  title: string
  message: string
  type: 'info' | 'task' | 'approval' | 'milestone' | 'system'
  read: boolean
  read_date?: date
  action_url?: string
  created_date: date
}
```

#### 7. **Note**
```typescript
{
  id: string
  title: string
  content: string (rich text HTML)
  author_email: string
  author_name: string
  tags?: string[]
  related_employee_id?: string
  related_onboarding_id?: string
  related_task_id?: string
  created_date: date
  updated_date: date
}
```

#### 8. **KnowledgeArticle**
```typescript
{
  id: string
  title: string
  content: string (markdown or rich text)
  category: string
  tags?: string[]
  author_email: string
  published: boolean
  views: number
  created_date: date
  updated_date: date
}
```

#### 9. **EmailTemplate**
```typescript
{
  id: string
  name: string
  subject: string
  body: string (HTML)
  variables: string[] // e.g., {{employee_name}}, {{start_date}}
  category?: string
  created_date: date
  updated_date: date
}
```

#### 10. **AutomationRule**
```typescript
{
  id: string
  name: string
  trigger_type: 'progress_milestone' | 'due_date' | 'task_completion' | 'stage_change'
  trigger_value: string | number
  action_type: 'send_email' | 'create_notification' | 'assign_task'
  action_config: object (JSON)
  active: boolean
  created_date: date
}
```

---

## Key Reusable Components

### Layout Components
- **Layout.jsx** - Main layout with sidebar, header, navigation
- **ImpersonationBanner** - Admin can impersonate employees
- **AdminEmployeeSelector** - Quick employee switcher in header
- **TailorFloatingWidget** - Help/support widget
- **NotificationDropdown** - Real-time notification center

### Dashboard Components
- **DashboardHero** - Welcome section with user greeting
- **MetricCard** - Stat cards with icons and trends
- **StatsCard** - Alternative stat card design
- **PriorityFeed** - Prioritized action items
- **ActivityTimeline** - Recent activity log
- **AdminInsightsDashboard** - Analytics and insights

### Onboarding Components
- **OnboardingDrawer** - Side drawer for onboarding details
- **OnboardingCalendar** - Calendar view of onboardings
- **NewOnboardingForm** - Create new onboarding wizard
- **KanbanBoard** - Drag-and-drop pipeline view
- **StageColumn** - Kanban column component

### Employee Portal Components
- **MilestoneVerticalProgress** - Visual milestone tracker
- **MilestoneProgressVerticalHeader** - Header with current stage
- **TaskChecklistTable** - Employee task list with checkboxes
- **OnboardingChat** - Chat interface for questions
- **RequiredDocuments** - Document upload section
- **TaskDetailModal** - Full task details and instructions

### Task Components
- **TaskCard** - Individual task display card
- **TaskTable** - Table view of tasks
- **TaskDetailModal** - Task detail modal with all info
- **TaskFilters** - Advanced filtering component
- **BulkTaskActions** - Bulk operations toolbar

### Playbook Components
- **PlaybookEditor** - Full playbook creation/editing interface
- **MilestoneEditor** - Milestone configuration
- **TaskTemplateEditor** - Task template builder
- **DependencySelector** - Task dependency picker

### Employee Components
- **EmployeeCard** - Employee profile card
- **EmployeeForm** - Create/edit employee
- **NewEmployeeForm** - New employee wizard

### Shared Components
- **ConfirmDialog** - Confirmation modal for destructive actions
- **SearchBar** - Debounced search input
- **FilterPanel** - Advanced filtering UI
- **EmptyState** - Empty state placeholders
- **ErrorBoundary** - Error handling wrapper
- **Skeletons** - Loading state skeletons

---

## Key Utilities & Hooks

### Utilities
- **stageCalculation.js** - Calculate current stage from dates
- **stageSynchronization.js** - Sync onboarding stages
- **taskInstantiation.js** - Create tasks from playbook templates
- **automatedEmailTriggers.js** - Email automation logic
- **userDisplayName.js** - Format user names and initials

### Custom Hooks
- **useNotificationPoller** - Poll for new notifications
- **useReminderChecker** - Check for due reminders
- **useImpersonation** - Admin impersonation context

### API Layer
- **base44Client.js** - Base44 SDK client
- **entities.js** - Entity type exports
- **integrations.js** - External integrations

---

## Cloud Functions (Backend Logic)

Located in `/functions`:

1. **checkOverdueTasks.ts** - Scheduled job to mark tasks overdue
2. **completeTaskByDescription.ts** - Bulk task completion helper
3. **dailyDigest.ts** - Send daily summary emails
4. **getOnboardingInsights.ts** - Calculate analytics
5. **jotformWebhook.ts** - Handle JotForm application submissions
6. **processReminders.ts** - Send reminder notifications
7. **weeklySummary.ts** - Weekly summary report

---

## Migration Strategy

### Phase 1: Database Setup
1. Create Supabase tables for all entities
2. Set up Row Level Security (RLS) policies
3. Create database functions for complex queries
4. Set up indexes for performance
5. Create triggers for automated updates

### Phase 2: Core Infrastructure
1. Create route structure in `app/(hub)/talentflow/`
2. Set up API layer with Supabase client
3. Migrate utility functions
4. Set up React Query configuration
5. Implement auth context (Microsoft SSO)

### Phase 3: Component Migration
1. Migrate shared UI components
2. Update imports from Base44 to Supabase
3. Adapt React Router to Next.js routing
4. Convert Vite-specific code to Next.js

### Phase 4: Feature Migration (Priority Order)
1. Dashboard (overview, metrics)
2. Employee Database (foundation for everything)
3. Playbooks (templates needed for onboardings)
4. Active Onboardings (core functionality)
5. Employee Portal (employee experience)
6. Pipeline (kanban + calendar)
7. Applications (applicant tracking)
8. Tasks (task management)
9. Pending Approvals (workflow)
10. Knowledge Hub (documentation)
11. Email Builder & Automation (notifications)
12. Notes (internal docs)

### Phase 5: Advanced Features
1. Notification system
2. Email automation
3. Admin impersonation
4. Real-time updates (Supabase subscriptions)
5. File upload for documents
6. Analytics and reporting

### Phase 6: Testing & Optimization
1. End-to-end testing
2. Performance optimization
3. Mobile responsiveness
4. Accessibility audit
5. User acceptance testing

---

## Technical Considerations

### Routing Conversion
```
Base44 (React Router)         →  Next.js App Router
/Dashboard                     →  /talentflow/page.tsx
/Pipeline                      →  /talentflow/pipeline/page.tsx
/Applications                  →  /talentflow/applications/page.tsx
/Onboardings                   →  /talentflow/onboardings/page.tsx
/EmployeePortal                →  /talentflow/portal/page.tsx
/Playbooks                     →  /talentflow/playbooks/page.tsx
/Employees                     →  /talentflow/employees/page.tsx
/Tasks                         →  /talentflow/tasks/page.tsx
/PendingApprovals              →  /talentflow/approvals/page.tsx
/KnowledgeHub                  →  /talentflow/knowledge/page.tsx
/EmailBuilder                  →  /talentflow/emails/builder/page.tsx
/EmailAutomationMatrix         →  /talentflow/emails/automation/page.tsx
/Notes                         →  /talentflow/notes/page.tsx
```

### API Conversion
```javascript
// Base44
base44.entities.Onboarding.list()
base44.entities.Onboarding.filter({ employee_id: 'x' })
base44.entities.Onboarding.create(data)
base44.entities.Onboarding.update(id, data)
base44.entities.Onboarding.delete(id)

// Supabase (to implement)
supabase.from('onboardings').select('*')
supabase.from('onboardings').select('*').eq('employee_id', 'x')
supabase.from('onboardings').insert(data)
supabase.from('onboardings').update(data).eq('id', id)
supabase.from('onboardings').delete().eq('id', id)
```

### Auth Conversion
```javascript
// Base44
base44.auth.me()

// Supabase + Microsoft SSO (to implement)
supabase.auth.getUser()
// OR use session from Microsoft SSO integration
```

### State Management
- Keep React Query for server state (already compatible)
- Keep Zustand for client state (already installed in Hub)
- Add specific stores as needed (e.g., impersonationStore, onboardingStore)

---

## Navigation Integration

Add to Hub's `config/navigation.ts`:

```typescript
{
  title: "TalentFlow",
  url: "/talentflow",
  icon: UserCheck,
  badge: "New",
  children: [
    {
      title: "Dashboard",
      url: "/talentflow",
      icon: LayoutDashboard,
    },
    {
      title: "My Onboarding",
      url: "/talentflow/portal",
      icon: Briefcase,
    },
    { type: "divider", label: "Onboarding" },
    {
      title: "Pipeline",
      url: "/talentflow/pipeline",
      icon: GitBranch,
    },
    {
      title: "Applications",
      url: "/talentflow/applications",
      icon: FileText,
    },
    {
      title: "Active Onboardings",
      url: "/talentflow/onboardings",
      icon: UserCheck,
    },
    {
      title: "Pending Approvals",
      url: "/talentflow/approvals",
      icon: AlarmClockCheck,
    },
    {
      title: "All Tasks",
      url: "/talentflow/tasks",
      icon: ListChecks,
    },
    {
      title: "Playbooks",
      url: "/talentflow/playbooks",
      icon: BookOpen,
    },
    { type: "divider", label: "Employees" },
    {
      title: "Employee Database",
      url: "/talentflow/employees",
      icon: Users,
    },
    { type: "divider", label: "Tools" },
    {
      title: "Knowledge Hub",
      url: "/talentflow/knowledge",
      icon: LibraryBig,
    },
    {
      title: "Email Tools",
      url: "/talentflow/emails",
      icon: Mail,
    },
    {
      title: "Notes",
      url: "/talentflow/notes",
      icon: MessageCirclePlus,
    },
  ]
}
```

---

## Dependencies to Add

Already in Hub:
- ✅ React Query (@tanstack/react-query)
- ✅ Zustand (installed in Hub)
- ✅ Radix UI primitives (most installed)
- ✅ Tailwind CSS
- ✅ Lucide React icons

Need to add:
```json
{
  "@hello-pangea/dnd": "^17.0.0",  // Drag and drop for Kanban
  "@tiptap/react": "^2.1.13",      // Rich text editor
  "@tiptap/starter-kit": "^2.1.13",
  "@tiptap/extension-mention": "^2.1.13",
  "@tiptap/extension-placeholder": "^2.1.13",
  "@tiptap/extension-link": "^2.1.13",
  "canvas-confetti": "^1.9.4",     // Celebration effects
  "date-fns": "^3.6.0",            // Date utilities
  "recharts": "^2.15.4",           // Charts for dashboard
  "sonner": "^2.0.1"               // Toast notifications (better than current)
}
```

---

## Next Steps

1. **Review this plan** - Confirm scope and approach
2. **Prioritize features** - Which features do you want first?
3. **Database design** - Review and approve entity schemas
4. **Start Phase 1** - Set up Supabase tables
5. **Build incrementally** - Start with Dashboard, then Employee Database

---

## Questions for Discussion

1. Do you want to migrate ALL features, or start with a subset?
2. Should we keep the Employee Database separate from Team Directory, or merge them?
3. Do you want to preserve the admin impersonation feature?
4. Should the Knowledge Hub be app-specific or shared across all Hub apps?
5. Priority on email automation - critical or can wait?
6. JotForm integration - is this webhook still active and needed?

---

## Estimated Scope

**Full migration:** Large project (3-4 weeks of focused development)
**MVP (core features only):** Medium project (1-2 weeks)

**Core MVP would include:**
- Dashboard
- Employee Database
- Playbooks
- Active Onboardings
- Employee Portal
- Basic task management

**Can be added later:**
- Pipeline Kanban view
- Applications/Applicant tracking
- Email builder and automation
- Advanced analytics
- Knowledge Hub
- Notes system
