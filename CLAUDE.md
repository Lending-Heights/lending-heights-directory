# Lending Heights Hub - Project Documentation

## Current Status (Updated: December 22, 2024)

### Deployment Status: LIVE
- **GitHub:** https://github.com/Lending-Heights/lending-heights-directory (Public)
- **Vercel:** Auto-deploys from `main` branch
- **Supabase:** Connected and working
- **Build:** Passing

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

**Team Directory (Active App):**
- Directory page with search, filters, view toggle (gallery/table)
- Profile pages with full teammate details
- Create teammate functionality (modal form)
- Edit teammate functionality (modal on profile page)
- Delete teammate with confirmation dialog
- CSV export
- Supabase database integration

**Placeholder Apps (Coming Soon):**
- Calendar, TalentFlow, Partner CRM, Checklists, Marketing Hub

### What's Remaining

**HIGH PRIORITY:**
1. **Add DELETE RLS Policy** - Required for delete to work in production
   - Location: Supabase Dashboard > SQL Editor
   - SQL: `CREATE POLICY "Allow public delete" ON teammates FOR DELETE TO public USING (true);`

**MEDIUM PRIORITY:**
- Image upload for headshots (currently URL-only)
- Dark mode toggle implementation
- Real-time updates (Supabase subscriptions)

**LOW PRIORITY (Future):**
- Microsoft Entra ID authentication
- Build out Calendar app
- Build out other placeholder apps
- Tag/License management interfaces
- Bulk CSV import
- Org chart view
- Analytics dashboard

---

## Project Structure

```
app/(hub)/
  ├── layout.tsx              # Hub wrapper with sidebar + header
  ├── page.tsx                # Dashboard with app grid
  ├── directory/              # Team Directory
  │   ├── page.tsx            # Listing with search/filters
  │   └── [id]/page.tsx       # Profile detail with Edit/Delete
  ├── calendar/               # Placeholder
  ├── talentflow/             # Placeholder
  ├── crm/                    # Placeholder
  ├── checklists/             # Placeholder
  ├── marketing/              # Placeholder
  ├── admin/                  # Admin section (role-protected)
  │   ├── page.tsx            # Overview
  │   ├── users/page.tsx
  │   ├── permissions/page.tsx
  │   └── audit/page.tsx
  ├── profile/page.tsx        # User settings
  └── notifications/page.tsx  # Notification center

components/
  ├── ui/                     # shadcn/ui components
  ├── layout/                 # Header, Sidebar
  ├── dashboard/              # AppCard, AppGrid, WelcomeHeader, QuickActions
  ├── shared/                 # PageHeader, EmptyState
  ├── TeammateCard.tsx        # Gallery view card
  ├── TeammateTable.tsx       # Table view
  └── TeammateModal.tsx       # Modal wrapper

lib/
  ├── api/teammates.ts        # All Supabase CRUD operations
  ├── supabase.ts             # Supabase client
  ├── utils.ts                # Utility functions (cn)
  └── store/                  # Zustand stores
      ├── authStore.ts        # User/role state
      └── sidebarStore.ts     # Sidebar UI state

config/
  ├── navigation.ts           # Sidebar nav structure
  └── apps.ts                 # App catalog for dashboard
```

---

## Deployment Info

### Environment Variables (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://ppywhyoxuiucwsgiyqzx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweXdoeW94dWl1Y3dzZ2l5cXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MDg3NTMsImV4cCI6MjA4MTQ4NDc1M30.Kv3HN-0aL5fLRaZq1nFVA6xPT4dTQ_0suadVx4SqxTQ
```

### Git Info
- **User:** Vinny Naccarelli (vnaccarelli@lhloans.com)
- **Org:** Lending-Heights

---

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18 with TypeScript
- **Components:** shadcn/ui + Radix UI primitives
- **Styling:** Tailwind CSS with CSS variables
- **State:** Zustand (persisted stores)
- **Database:** Supabase (PostgreSQL)
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

- TypeScript for type safety
- Functional components with hooks
- Tailwind utility classes for styling
- `@/` path alias for imports
- Supabase queries wrapped in try/catch
- Zustand for client-side state with persistence
- shadcn/ui components in `components/ui/`

---

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Notes for Claude

- Build locally with `npm run build` before pushing
- TypeScript strict mode is OFF - some Supabase types use `as any`
- CRUD functions in `lib/api/teammates.ts` are fully implemented
- Vercel auto-deploys on push to `main`
- User is experienced with React/Next.js - use technical language
- shadcn/ui components installed: button, card, avatar, dropdown-menu, sheet, tooltip, badge, separator, input, progress
