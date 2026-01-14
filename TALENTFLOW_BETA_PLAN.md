# TalentFlow BETA Launch Plan

## Status: READY TO IMPLEMENT

**Last Updated:** January 14, 2026
**Branch:** `talentflow-mvp-phase1` (all code is here, NOT yet merged to main)

---

## What's Already Built ✅

| Page | URL | Status |
|------|-----|--------|
| Dashboard | `/talentflow` | ✅ Complete |
| All Tasks | `/talentflow/tasks` | ✅ Complete |
| Onboardings List | `/talentflow/onboardings` | ✅ Complete |
| Onboarding Detail | `/talentflow/onboardings/[id]` | ✅ Complete |
| Playbooks List | `/talentflow/playbooks` | ✅ Complete |
| Playbook Detail | `/talentflow/playbooks/[id]` | ✅ Complete |
| Employee Portal | `/talentflow/portal` | ✅ Complete |
| Applications | `/talentflow/applications` | ✅ Complete |

**Components:** CreateOnboardingModal, EditOnboardingModal, CreatePlaybookModal
**API Layer:** Complete CRUD for all entities in `lib/api/talentflow.ts`
**Database:** 14 Supabase tables with test data

---

## BETA Implementation Steps

### Step 1: Merge & Deploy (5 min)
```bash
git checkout main
git merge talentflow-mvp-phase1
git push origin main
```
Vercel auto-deploys. Verify all 8 TalentFlow pages work at production URL.

---

### Step 2: Add Create Applicant Modal (30 min)

**Create:** `components/CreateApplicantModal.tsx`

```tsx
// Form fields needed:
// - name (required)
// - email (required)
// - phone
// - position_applied
// - application_date (default: today)
// - resume_url
// - notes
// - status (default: "applied")
```

**Modify:** `app/(hub)/talentflow/applications/page.tsx`
- Add state: `const [showCreateModal, setShowCreateModal] = useState(false);`
- Wire button: `onClick={() => setShowCreateModal(true)}`
- Add modal at bottom of return

---

### Step 3: Playbook Task Editor (1 hour)

**Create:** `components/AddPlaybookTaskModal.tsx`

```tsx
// Form fields:
// - title (required)
// - description
// - milestone (dropdown: Week 1, Week 2, Week 3, Week 4, Ongoing)
// - day_number (1-30)
// - category (dropdown: HR, IT, Training, Compliance, Admin)
// - priority (dropdown: low, medium, high, critical)
// - assigned_to (dropdown: admin, employee, manager)
```

**Modify:** `app/(hub)/talentflow/playbooks/[id]/page.tsx`
- Add state for tasks list
- Fetch tasks for playbook on load
- Display tasks grouped by milestone
- Add "Add Task" button that opens modal
- Add edit/delete buttons on each task

**Modify:** `app/(hub)/talentflow/playbooks/page.tsx`
- Fix line 210: Change `<span>0 tasks</span>` to show actual task count

---

### Step 4: Connect to Team Directory (30 min)

**Modify:** `components/CreateOnboardingModal.tsx`

```tsx
// Change this:
import { employees as employeesApi } from "@/lib/api/talentflow";
const employeesData = await employeesApi.list();

// To this:
import { getTeammates } from "@/lib/api/teammates";
const employeesData = await getTeammates(); // Use existing Directory data
```

Or create a sync function to copy teammates to employees table.

---

### Step 5: Task Assignment UI (45 min)

**Modify:** `app/(hub)/talentflow/onboardings/[id]/page.tsx`
- Add assignee dropdown to each task row
- Show current assignee name

**Modify:** `app/(hub)/talentflow/tasks/page.tsx`
- Add "Assignee" column to table
- Add "My Tasks" filter that filters by current user email

---

### Step 6: Applicant Status Updates (30 min)

**Modify:** `app/(hub)/talentflow/applications/page.tsx`

Add status dropdown to each applicant card:
```tsx
<Select value={applicant.status} onValueChange={(val) => handleStatusChange(applicant.id, val)}>
  <SelectItem value="applied">Applied</SelectItem>
  <SelectItem value="screening">Screening</SelectItem>
  <SelectItem value="interviewing">Interviewing</SelectItem>
  <SelectItem value="offered">Offered</SelectItem>
  <SelectItem value="hired">Hired</SelectItem>
  <SelectItem value="rejected">Rejected</SelectItem>
</Select>
```

---

### Step 7: Basic Permission Checks (45 min)

**Create:** `lib/hooks/usePermissions.ts`

```tsx
import { useAuthStore } from "@/lib/store/authStore";

export function useIsAdmin() {
  const { role } = useAuthStore();
  return role === "Admin" || role === "Manager" || role === "Executive";
}

export function useCanAccessTalentFlow() {
  const { role } = useAuthStore();
  return ["Admin", "Manager", "Executive", "Employee"].includes(role);
}
```

**Modify all TalentFlow pages:**
- Wrap admin sections with `{isAdmin && <AdminContent />}`
- Employee Portal should filter to only show logged-in user's onboarding

---

### Step 8: Final Commit & Push

```bash
git add .
git commit -m "feat: TalentFlow BETA ready - full feature set

- Add Create Applicant modal
- Add Playbook task editor
- Connect employees to Team Directory
- Add task assignment UI
- Add applicant status updates
- Add role-based permission checks

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

---

## Verification Checklist

After completing all steps, verify:

- [ ] All 6 TalentFlow pages load on production URL
- [ ] Can create new applicant with form
- [ ] Can add tasks to playbook template
- [ ] Playbook cards show correct task count
- [ ] Employee dropdown shows Team Directory data
- [ ] Can assign tasks to admins
- [ ] Can change applicant status (Applied → Hired)
- [ ] Employee users only see Portal page
- [ ] Admin users see all pages

---

## Files Summary

### New Files to Create
| File | Purpose |
|------|---------|
| `components/CreateApplicantModal.tsx` | Add new job applicants |
| `components/AddPlaybookTaskModal.tsx` | Add tasks to playbook templates |
| `lib/hooks/usePermissions.ts` | Role-based access control hook |

### Files to Modify
| File | Changes |
|------|---------|
| `app/(hub)/talentflow/applications/page.tsx` | Modal + status dropdown |
| `app/(hub)/talentflow/playbooks/[id]/page.tsx` | Task list + editor |
| `app/(hub)/talentflow/playbooks/page.tsx` | Fix task count |
| `app/(hub)/talentflow/onboardings/[id]/page.tsx` | Assignee dropdown |
| `app/(hub)/talentflow/tasks/page.tsx` | Assignee column + My Tasks |
| `components/CreateOnboardingModal.tsx` | Directory sync |

---

## Deferred to Post-BETA

These features are NOT needed for BETA launch:
- Email notifications/reminders
- Bulk task operations
- File uploads for resumes
- Knowledge base integration
- Export/reporting
- Mobile optimization
- Manager dashboard

---

## Quick Start for Home PC

```bash
# 1. Pull latest
cd lending-heights-directory-main
git fetch origin
git checkout talentflow-mvp-phase1
git pull

# 2. Install deps (if needed)
npm install

# 3. Start dev server
npm run dev

# 4. View at http://localhost:3000/talentflow
```

Then follow the steps above to complete BETA implementation!
