# Lending Heights Team Directory - Project Documentation

## Current Status (Updated: December 20, 2024)

### Deployment Status: LIVE
- **GitHub:** https://github.com/Lending-Heights/lending-heights-directory (Public)
- **Vercel:** Auto-deploys from `main` branch
- **Supabase:** Connected and working
- **Build:** Passing (TypeScript errors resolved)

### What's Complete
- Directory page with search, filters, view toggle (gallery/table)
- Profile pages for each teammate
- Create teammate functionality (modal form)
- CSV export
- Supabase database integration
- Responsive design
- Vercel deployment pipeline

### What's Remaining

**HIGH PRIORITY (Core Features):**
1. **Connect Edit Functionality** - Button exists on profile page, not wired up
   - Location: `app/teammate/[id]/page.tsx`
   - Need: Open modal with pre-filled data, call `updateTeammate()`

2. **Add Delete Functionality** - Not implemented
   - Location: Profile page sidebar
   - Need: Delete button, confirmation dialog, `deleteTeammate()` call

3. **Add DELETE RLS Policy** - Required for delete to work
   - Location: Supabase Dashboard > Authentication > Policies
   - SQL: `CREATE POLICY "Allow public delete" ON teammates FOR DELETE TO public USING (true);`

**MEDIUM PRIORITY (Enhancements):**
- Image upload for headshots (currently URL-only)
- Comprehensive testing across browsers/devices

**LOW PRIORITY (Future):**
- Microsoft Entra ID authentication
- Tag management interface
- License management interface
- Bulk CSV import
- Org chart view
- Analytics dashboard

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

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main directory page (search, filters, gallery/table) |
| `app/teammate/[id]/page.tsx` | Profile page (needs Edit/Delete wiring) |
| `lib/api/teammates.ts` | All Supabase CRUD operations |
| `lib/supabase.ts` | Supabase client initialization |
| `components/TeammateModal.tsx` | Create/Edit modal component |
| `components/TeammateCard.tsx` | Card component for gallery view |
| `components/TeammateTable.tsx` | Table component for table view |
| `types/database.ts` | Supabase database types |
| `types/index.ts` | Frontend TypeScript types |

---

## Brand Identity

### Colors
- **Primary Blue:** `#0058A9` - Main brand color
- **Red:** `#FF2260` - Accent color
- **Yellow:** `#E2C20A` - Secondary accent

### Typography
- **Font Family:** Poppins (all weights)

### Brand Values
- Excellence in service
- Support for loan officers
- Professional, trustworthy, modern

---

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Icons:** Lucide React

---

## Code Conventions

- TypeScript for type safety
- Functional components with hooks
- Tailwind utility classes for styling
- `@/` path alias for imports
- Supabase queries wrapped in try/catch with error handling

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

- Build locally with `npm run build` before pushing to catch errors
- TypeScript strict mode is OFF (`tsconfig.json`) - some Supabase types use `as any`
- The `updateTeammate()` and `deleteTeammate()` functions exist in `lib/api/teammates.ts`
- Vercel auto-deploys on push to `main`
- User is experienced with React/Next.js - use technical language
