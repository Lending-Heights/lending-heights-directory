# Lending Heights Hub - Project Documentation

## Current Status (Updated: January 5, 2026)

### Deployment Status: LIVE
- **GitHub:** https://github.com/Lending-Heights/lending-heights-directory (Public)
- **Vercel:** Auto-deploys from `main` branch
- **Supabase:** Connected and working
- **Build:** Passing
- **Auth:** Microsoft Entra ID via Supabase (configured)

### What's Complete

**Hub Infrastructure:**
- Dashboard with app grid and quick actions
- Collapsible sidebar with role-based navigation
- Header with search, role switcher (demo), notifications
- Route group `(hub)` organization
- Admin section (users, permissions, audit) - role protected
- Profile settings and notification center pages
- Mobile responsive with sheet menu
- Dark mode CSS variables (ready for implementation)
- Microsoft Entra ID authentication (Azure AD) - LIVE

**Team Directory (Active App):**
- Directory page with search, filters, view toggle (gallery/table)
- Profile pages with full teammate details
- Create/Edit/Delete teammate functionality
- CSV export
- Supabase database integration

**Closings Dashboard (Active App):**
- Full closings analytics dashboard with metrics
- MTD/YTD closings, volume, loan officer rankings
- **CSV Upload Feature** - Import ARIVE Pipeline Reports
  - Drag-and-drop upload UI
  - 220 columns mapped (SSN excluded for security)
  - Upsert logic (updates existing, adds new loans)
  - Import statistics and progress tracking
- Loans table expanded with full schema (migration run 2026-01-05)
- RLS policies for authenticated users

**ARIVE Integration Status:**
- Direct API NOT available (api-connect.arive.com is private/internal)
- CSV upload is the working solution
- ARIVE credentials in Vercel (not used, kept for future reference)

### What's Remaining

**READY TO TEST:**
1. **CSV Upload** - Go to Closings page, upload Pipeline Reports.csv
   - SQL migration already run in Supabase
   - Code deployed to production

**MEDIUM PRIORITY:**
- Dark mode toggle implementation
- Real-time updates (Supabase subscriptions)
- Marketing Hub buildout (partially complete)

**LOW PRIORITY (Future):**
- Build out Calendar app
- Build out TalentFlow, Partner CRM, Checklists
- Tag/License management interfaces
- Org chart view
- LO Scorecard dashboard (planned)

---

## Project Structure

```
app/(hub)/
  ├── layout.tsx              # Hub wrapper with sidebar + header
  ├── page.tsx                # Dashboard with app grid
  ├── directory/              # Team Directory
  │   ├── page.tsx            # Listing with search/filters
  │   └── [id]/page.tsx       # Profile detail with Edit/Delete
  ├── closings/               # Closings Dashboard
  │   ├── page.tsx            # Server component (data fetching)
  │   ├── ClosingsDashboard.tsx  # Client dashboard component
  │   └── CSVUploadWrapper.tsx   # CSV upload wrapper
  ├── calendar/               # Calendar (functional)
  ├── talentflow/             # Placeholder
  ├── crm/                    # Placeholder
  ├── checklists/             # Placeholder
  ├── marketing/              # Marketing Hub (partial)
  ├── admin/                  # Admin section (role-protected)
  ├── profile/page.tsx        # User settings
  └── notifications/page.tsx  # Notification center

app/actions/
  ├── import-csv.ts           # CSV import server action
  ├── sync-arive.ts           # ARIVE sync (not working - API private)
  └── auth.ts                 # Auth helpers

app/auth/
  └── callback/route.ts       # OAuth callback handler

components/
  ├── ui/                     # shadcn/ui components
  ├── layout/                 # Header, Sidebar
  ├── dashboard/              # AppCard, AppGrid, etc.
  ├── shared/                 # PageHeader, EmptyState
  ├── closings/               # CSVUpload component
  └── providers/              # AuthProvider

lib/
  ├── api/
  │   ├── teammates.ts        # Teammate CRUD
  │   ├── closings.ts         # Closings queries
  │   ├── arive.ts            # ARIVE API client (not working)
  │   └── marketing.ts        # Marketing queries
  ├── config/
  │   └── csv-column-mapping.ts  # CSV to DB column mapping
  ├── supabase/               # Supabase clients (client, server, middleware)
  └── store/                  # Zustand stores

supabase/
  └── migrations/
      └── 20260103_expand_loans_table.sql  # Loans table expansion (RAN)
```

---

## Key Files for CSV Upload Feature

1. **components/closings/CSVUpload.tsx** - Upload UI with drag-drop
2. **app/actions/import-csv.ts** - Server action for parsing/upserting
3. **lib/config/csv-column-mapping.ts** - Maps 222 CSV columns to DB (SSN excluded)
4. **supabase/migrations/20260103_expand_loans_table.sql** - Schema migration (ALREADY RUN)

---

## Deployment Info

### Environment Variables (Vercel - Production)
```
NEXT_PUBLIC_SUPABASE_URL=https://ppywhyoxuiucwsgiyqzx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ARIVE_CLIENT_ID=778en38voe5bcfiii76glil7ja
ARIVE_SECRET=***
ARIVE_API_KEY=***

# Azure/Entra ID (configured in Supabase)
# Redirect URLs configured for:
# - https://ppywhyoxuiucwsgiyqzx.supabase.co/auth/v1/callback
# - https://lending-heights-directory-lemon.vercel.app/auth/callback
```

### Git Info
- **User:** Vinny Naccarelli (vnaccarelli@lhloans.com)
- **Org:** Lending-Heights
- **Main Branch:** `main`

---

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18 with TypeScript
- **Components:** shadcn/ui + Radix UI primitives
- **Styling:** Tailwind CSS with CSS variables
- **State:** Zustand (persisted stores)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Microsoft Entra ID via Supabase
- **Deployment:** Vercel
- **Icons:** Lucide React

---

## Brand Identity

### Colors
- **Primary Blue:** `#0058A9` - Main brand color
- **Red:** `#FF2260` - Accent color
- **Yellow:** `#E2C20A` - Secondary accent

### Typography
- **Font Family:** Poppins (all weights)

---

## Code Conventions

- TypeScript for type safety (strict mode OFF for Supabase compatibility)
- Functional components with hooks
- Tailwind utility classes for styling
- `@/` path alias for imports
- Supabase queries wrapped in try/catch, use `as any` for new columns
- Zustand for client-side state with persistence
- shadcn/ui components in `components/ui/`
- CSV files in `.gitignore` (PII protection)

---

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npx tsc --noEmit # Type check without building
```

---

## Notes for Claude

- Build locally with `npm run build` before pushing (or at least `npx tsc --noEmit`)
- Vercel auto-deploys on push to `main`
- User (Vinny) is experienced with React/Next.js - use technical language
- ARIVE API is NOT publicly accessible - use CSV upload instead
- Pipeline Reports.csv is in `.gitignore` - never commit CSV files with PII
- Loans table has 220+ columns now - types in `types/database.ts` may be outdated
- RLS policies require authenticated users for loans table access
