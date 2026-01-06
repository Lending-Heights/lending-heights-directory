# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Lending Heights Hub - Project Documentation

## Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build (run before pushing)
npm run start    # Start production server
npm run lint     # Run ESLint
npx tsc --noEmit # Type check without building (TypeScript strict mode is OFF)
```

**Pre-push checklist:** Always run `npm run build` or at least `npx tsc --noEmit` before pushing to catch type errors.

---

## Architecture Overview

### Next.js App Router Structure

This is a **Next.js 14 App Router** application with route groups. The main application lives in `app/(hub)/` which wraps all pages with a shared sidebar/header layout.

**Key architectural patterns:**

#### 1. Server vs Client Components
- **Server Components (default):** Pages that fetch data (e.g., `app/(hub)/closings/page.tsx`)
  - Use `async` functions
  - Import from `lib/supabase/server.ts`
  - Cannot use hooks or browser APIs

- **Client Components:** Interactive UI (marked with `'use client'`)
  - Use React hooks (useState, useEffect, etc.)
  - Import from `lib/supabase/client.ts`
  - Handle user interactions, animations, state

**Pattern example:** `app/(hub)/closings/` has:
- `page.tsx` (Server Component) - fetches data via `createClient()` from `lib/supabase/server.ts`
- `ClosingsDashboard.tsx` (Client Component) - renders charts and handles interactions
- Server Component passes data as props to Client Component

#### 2. Supabase Client Instantiation

**CRITICAL:** There are THREE different Supabase client factories. You must use the correct one:

| Context | Import | Usage |
|---------|--------|-------|
| **Server Components** | `lib/supabase/server.ts` | `const supabase = await createClient()` (async!) |
| **Client Components** | `lib/supabase/client.ts` | `const supabase = createClient()` (sync) |
| **Middleware** | `lib/supabase/middleware.ts` | Used in `middleware.ts` for auth checks |

**Why three?** Server clients handle cookies server-side via Next.js `cookies()` API. Client components use browser storage. Middleware has special session refresh logic.

#### 3. Server Actions Pattern

Server Actions (in `app/actions/`) are async functions marked with `'use server'` for form submissions and mutations:

```typescript
// app/actions/import-csv.ts
'use server'
export async function importCSV(formData: FormData) {
  const supabase = await createClient() // from lib/supabase/server.ts
  // ... mutation logic
}
```

Called from Client Components via form actions or direct invocation.

#### 4. Authentication & Route Protection

**Flow:**
1. User logs in via Microsoft Entra ID (Azure AD)
2. OAuth callback → `app/auth/callback/route.ts` exchanges code for session
3. Session stored in cookies
4. `middleware.ts` runs on every request:
   - Refreshes session via `updateSession()`
   - Checks if route is in `protectedRoutes` array
   - Redirects to `/login` if unauthenticated

**Protected routes:** `/closings`, `/admin` (see `middleware.ts:5-9`)

**Public routes:** Most other routes are public (see `middleware.ts:15-26`)

**Role-based access:** Currently demo/placeholder. Future implementation will check user roles from Supabase `profiles` table.

#### 5. Database Patterns

**Type safety:** Import from `@/types/database.ts` (auto-generated from Supabase schema)

**Querying:**
```typescript
const { data, error } = await supabase
  .from('loans')
  .select('*')
  .eq('loan_officer', officerName)
```

**New columns:** The `loans` table has 220+ columns. Types in `types/database.ts` may be outdated. Use `as any` for new columns added via migrations:

```typescript
const loan = data[0] as any
const value = loan.new_column_name
```

**RLS (Row Level Security):** All tables require authenticated users. Unauthenticated queries will return empty results.

**Migrations:** Located in `supabase/migrations/`. Already run in production. Don't re-run.

---

## Current Status (Updated: January 5, 2026)

### Deployment: LIVE
- **GitHub:** https://github.com/Lending-Heights/lending-heights-directory
- **Vercel:** Auto-deploys from `main` branch
- **Supabase:** https://ppywhyoxuiucwsgiyqzx.supabase.co (RLS enabled)
- **Auth:** Microsoft Entra ID (Azure AD) via Supabase

### Active Features

**Team Directory:**
- Search, filter, gallery/table views
- CRUD operations for teammates
- CSV export
- Database: `teammates` table

**Closings Dashboard:**
- Analytics dashboard with MTD/YTD metrics
- **CSV Upload** for ARIVE Pipeline Reports
  - 220 columns mapped (SSN excluded)
  - Upsert logic (updates existing loans)
  - Files: `components/closings/CSVUpload.tsx`, `app/actions/import-csv.ts`, `lib/config/csv-column-mapping.ts`
- Database: `loans` table (220+ columns)

**Hub Infrastructure:**
- Sidebar navigation with role-based sections
- Header with search, role switcher, notifications
- Admin pages (users, permissions, audit) - role protected
- Profile and notification center pages
- Mobile responsive

### In Progress / Planned
- Dark mode toggle (CSS variables ready, toggle not wired)
- Real-time updates (Supabase subscriptions)
- Marketing Hub completion
- Calendar, TalentFlow, Partner CRM, Checklists apps (placeholders)
- LO Scorecard dashboard

---

## Project Structure

```
app/(hub)/                    # Main hub route group (shared layout)
  ├── layout.tsx              # Sidebar + header wrapper
  ├── page.tsx                # Dashboard home
  ├── directory/              # Team Directory app
  ├── closings/               # Closings Dashboard app
  ├── admin/                  # Admin section
  └── [other apps]/           # Calendar, Marketing, etc.

app/actions/                  # Server Actions ('use server')
  ├── import-csv.ts           # CSV upload for closings
  └── auth.ts                 # Auth helpers

app/auth/callback/            # OAuth callback handler

components/
  ├── ui/                     # shadcn/ui primitives
  ├── layout/                 # Header, Sidebar
  ├── dashboard/              # AppCard, AppGrid
  ├── closings/               # CSVUpload
  └── providers/              # AuthProvider

lib/
  ├── api/                    # Data fetching functions
  │   ├── teammates.ts        # Teammate CRUD
  │   ├── closings.ts         # Closings queries
  │   └── arive.ts            # ARIVE API (NOT working - API is private)
  ├── config/
  │   └── csv-column-mapping.ts  # CSV → DB field mapping
  ├── supabase/               # Supabase client factories (3 types!)
  │   ├── client.ts           # Browser client
  │   ├── server.ts           # Server client
  │   └── middleware.ts       # Middleware client
  └── store/                  # Zustand stores

supabase/migrations/          # SQL migrations (already run in prod)

middleware.ts                 # Auth + route protection
```

---

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode OFF for Supabase compatibility)
- **UI:** React 18 + shadcn/ui + Radix UI
- **Styling:** Tailwind CSS with CSS variables
- **State:** Zustand (client state with persistence)
- **Database:** Supabase (PostgreSQL with RLS)
- **Auth:** Microsoft Entra ID via Supabase
- **Deployment:** Vercel (auto-deploy from `main`)
- **Icons:** Lucide React

---

## Code Conventions

- **TypeScript:** Strict mode OFF (required for Supabase type compatibility)
- **Components:** Functional components with hooks
- **Styling:** Tailwind utility classes (avoid inline styles)
- **Imports:** Use `@/` path alias (e.g., `@/components/ui/button`)
- **Supabase queries:** Wrap in try/catch, use `as any` for new columns
- **Client state:** Zustand stores in `lib/store/`
- **UI components:** Use shadcn/ui from `components/ui/` (don't reinvent)
- **CSV files:** In `.gitignore` (PII protection - never commit)

---

## Brand Identity

**Colors:**
- Primary Blue: `#0058A9`
- Red Accent: `#FF2260`
- Yellow Accent: `#E2C20A`

**Typography:** Poppins (all weights)

CSS variables defined in `app/globals.css` for theme switching.

---

## Environment Variables

**Production (Vercel):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ppywhyoxuiucwsgiyqzx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ARIVE_CLIENT_ID=778en38voe5bcfiii76glil7ja  # Not used (API private)
ARIVE_SECRET=***                              # Not used
ARIVE_API_KEY=***                             # Not used
```

**Azure/Entra ID:** Configured in Supabase dashboard
- Redirect URLs configured for Supabase and Vercel

---

## Important Notes for Claude

### ARIVE Integration
- **Direct API is NOT available** - `api-connect.arive.com` is private/internal only
- **Use CSV upload instead** - Users export Pipeline Reports from ARIVE and upload via UI
- ARIVE credentials in Vercel are kept for reference but not functional

### Data Security
- **Never commit CSVs** - Pipeline Reports contain PII (names, SSNs, addresses)
- `Pipeline Reports.csv` and `*.csv` are in `.gitignore`
- SSN column explicitly excluded from CSV import mapping

### Type Safety
- Loans table has 220+ columns from ARIVE schema
- `types/database.ts` may not include all columns
- Safe to use `as any` for newly added columns not in types

### Git Workflow
- Main branch: `main`
- Vercel auto-deploys on push
- User: Vinny Naccarelli (vnaccarelli@lhloans.com)
- User is experienced with React/Next.js - use technical language

### README.md Status
- `README.md` is outdated - describes project as "team directory gallery view prototype"
- Project has evolved into full Lending Heights Hub with multiple apps
- CLAUDE.md is the source of truth

---

## Common Pitfalls

1. **Wrong Supabase client:** Using browser client in Server Component (or vice versa) causes auth issues
2. **Missing 'use server':** Server Actions need `'use server'` directive
3. **RLS blocking queries:** Unauthenticated queries return empty results (check auth state)
4. **Type errors on new columns:** Use `as any` for columns not in generated types
5. **Forgetting to await server client:** `lib/supabase/server.ts` exports async factory
6. **CSV in commits:** Always check `.gitignore` includes CSV files before committing

---

## Debugging Tips

**Auth issues:**
1. Check cookies in browser DevTools
2. Verify middleware is running (add console.logs)
3. Check Supabase dashboard → Authentication → Users
4. Verify redirect URLs in Azure Entra ID match Vercel/Supabase

**Empty query results:**
1. Check RLS policies in Supabase
2. Verify user is authenticated (`supabase.auth.getUser()`)
3. Check table permissions

**Build errors:**
1. Run `npx tsc --noEmit` to see type errors
2. Check for missing `'use client'` directives
3. Verify all imports use `@/` alias correctly
