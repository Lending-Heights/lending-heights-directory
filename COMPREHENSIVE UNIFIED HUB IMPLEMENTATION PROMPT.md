# 🎯 **COMPREHENSIVE UNIFIED HUB IMPLEMENTATION PROMPT**


```
You are an expert full-stack developer specializing in Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui, Supabase, and Microsoft authentication. You will build a complete Unified Hub application for Lending Heights Mortgage following these exact specifications.

# PROJECT OVERVIEW

**Project Name:** Lending Heights Hub
**Primary URL:** hub.lendingheights.com
**Purpose:** Single sign-on portal providing role-based access to all internal applications
**Timeline:** 8-10 weeks
**Team Size:** <10 employees (small mortgage company)

# TECH STACK (NON-NEGOTIABLE)

- **Frontend Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3.x
- **Component Library:** shadcn/ui (install all components as needed)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Microsoft Entra ID (Azure AD) + Supabase Auth
- **Hosting:** Vercel
- **State Management:** React Context + Server Components
- **Icons:** lucide-react

# BRAND GUIDELINES (MUST FOLLOW EXACTLY)

**Typography:**
- Font Family: 'Poppins' (import from Google Fonts)
- Weights: 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold)

**Color Palette:**
```typescript
// tailwind.config.ts colors
{
  primary: {
    blue: '#0058A9',      // Main brand color
    red: '#FF2250',       // Secondary/alerts
    yellow: '#E2C20A',    // Accent
    'light-blue': '#00B0FF', // Tertiary
    'dark-blue': '#002547',  // Dark variant
  },
  text: {
    primary: '#1E1E1E',   // Main text
    secondary: '#667085', // Muted text
  },
  border: '#E5E7EB',
  background: {
    default: '#FFFFFF',
    muted: '#F8FAFC',
  },
}
```

**Typography Scale:**
- Display: 64px / 76px line-height / extrabold / -2% tracking
- H1: 56px / 62px / extrabold / -2% tracking
- H2: 40px / 46px / bold / -1% tracking
- H3: 32px / 38px / bold / 0% tracking
- H4: 24px / 30px / semibold / 0% tracking
- Body: 14px / 24px / regular / 0% tracking
- Small: 12px / 18px / regular / 0% tracking

# DATABASE SCHEMA (SUPABASE)

Create these tables in Supabase with Row Level Security (RLS) enabled:

## 1. hub_users
```sql
CREATE TABLE hub_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  microsoft_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'manager', 'admin', 'executive')),
  department TEXT,
  job_title TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hub_users_email ON hub_users(email);
CREATE INDEX idx_hub_users_microsoft_id ON hub_users(microsoft_id);
CREATE INDEX idx_hub_users_role ON hub_users(role);
CREATE INDEX idx_hub_users_active ON hub_users(is_active) WHERE is_active = true;

-- RLS Policies
ALTER TABLE hub_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON hub_users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON hub_users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can manage all users" ON hub_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM hub_users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );
```

## 2. applications
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('employee', 'operations', 'crm', 'marketing')),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_external BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_applications_active_sort ON applications(is_active, sort_order);
CREATE INDEX idx_applications_category ON applications(category);

-- Seed data
INSERT INTO applications (app_key, name, description, icon, color, url, category, sort_order) VALUES
('talentflow', 'TalentFlow', 'Employee onboarding and management', 'Users', '#0058A9', '/apps/talentflow', 'operations', 1),
('calendar', 'Company Calendar', 'Events, holidays, and payroll dates', 'Calendar', '#FF2250', '/apps/calendar', 'employee', 2),
('directory', 'Team Directory', 'Employee profiles and org chart', 'Users2', '#0058A9', '/apps/directory', 'employee', 3),
('crm', 'Partner CRM', 'Manage realtor partnerships and pipeline', 'Building2', '#E2C20A', '/apps/crm', 'crm', 4),
('checklists', 'Project Checklists', 'Launch readiness and project tracking', 'CheckSquare', '#00B0FF', '/apps/checklists', 'operations', 5),
('marketing', 'Marketing Hub', 'Brand assets and campaign materials', 'Megaphone', '#FF2250', '/apps/marketing', 'marketing', 6);

-- RLS Policies
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active applications" ON applications
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage applications" ON applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM hub_users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );
```

## 3. permissions
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES hub_users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  access_level TEXT NOT NULL DEFAULT 'view' CHECK (access_level IN ('none', 'view', 'edit', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, application_id)
);

CREATE INDEX idx_permissions_user_app ON permissions(user_id, application_id);

-- RLS Policies
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own permissions" ON permissions
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Admins can manage all permissions" ON permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM hub_users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );
```

## 4. role_permissions
```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL CHECK (role IN ('employee', 'manager', 'admin', 'executive')),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  access_level TEXT NOT NULL DEFAULT 'view' CHECK (access_level IN ('none', 'view', 'edit', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, application_id)
);

-- Seed default permissions
INSERT INTO role_permissions (role, application_id, access_level)
SELECT 'employee', id, 'view' FROM applications WHERE category = 'employee';

INSERT INTO role_permissions (role, application_id, access_level)
SELECT 'manager', id, 'edit' FROM applications WHERE category IN ('employee', 'operations');

INSERT INTO role_permissions (role, application_id, access_level)
SELECT 'admin', id, 'admin' FROM applications;

-- RLS Policies
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view role permissions" ON role_permissions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage role permissions" ON role_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM hub_users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );
```

## 5. notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES hub_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);
```

## 6. user_preferences
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES hub_users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  default_view TEXT DEFAULT 'grid' CHECK (default_view IN ('grid', 'list')),
  pinned_apps JSONB DEFAULT '[]',
  recent_apps JSONB DEFAULT '[]',
  notification_settings JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (user_id::text = auth.uid()::text);
```

## 7. audit_log
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES hub_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user_created ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_log_action_created ON audit_log(action, created_at DESC);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);

-- RLS Policies
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM hub_users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

CREATE POLICY "System can create audit logs" ON audit_log
  FOR INSERT WITH CHECK (true);
```

# PROJECT STRUCTURE

```
lending-heights-hub/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── route.ts
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (main dashboard)
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── users/
│   │       │   └── page.tsx
│   │       ├── applications/
│   │       │   └── page.tsx
│   │       ├── permissions/
│   │       │   └── page.tsx
│   │       └── audit/
│   │           └── page.tsx
│   ├── apps/
│   │   ├── talentflow/
│   │   │   └── page.tsx
│   │   ├── calendar/
│   │   │   └── page.tsx
│   │   ├── directory/
│   │   │   └── page.tsx
│   │   ├── crm/
│   │   │   └── page.tsx
│   │   ├── checklists/
│   │   │   └── page.tsx
│   │   └── marketing/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── callback/
│   │   │   │   └── route.ts
│   │   │   └── logout/
│   │   │       └── route.ts
│   │   ├── users/
│   │   │   ├── me/
│   │   │   │   └── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── applications/
│   │   │   └── route.ts
│   │   ├── permissions/
│   │   │   ├── route.ts
│   │   │   └── check/
│   │   │       └── route.ts
│   │   ├── notifications/
│   │   │   ├── route.ts
│   │   │   └── mark-read/
│   │   │       └── route.ts
│   │   └── search/
│   │       └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── auth/
│   │   └── MicrosoftLoginButton.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── UserMenu.tsx
│   │   └── MobileNav.tsx
│   ├── dashboard/
│   │   ├── AppGrid.tsx
│   │   ├── AppCard.tsx
│   │   ├── QuickActions.tsx
│   │   └── RecentActivity.tsx
│   ├── search/
│   │   ├── GlobalSearch.tsx
│   │   └── SearchResults.tsx
│   ├── notifications/
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationList.tsx
│   │   └── NotificationItem.tsx
│   ├── profile/
│   │   ├── ProfileForm.tsx
│   │   ├── PreferencesForm.tsx
│   │   └── SecuritySettings.tsx
│   ├── admin/
│   │   ├── UserTable.tsx
│   │   ├── UserForm.tsx
│   │   ├── PermissionMatrix.tsx
│   │   └── AuditLogViewer.tsx
│   └── ui/ (shadcn components)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── tabs.tsx
│       ├── toast.tsx
│       ├── navigation-menu.tsx
│       ├── breadcrumb.tsx
│       └── skeleton.tsx
├── lib/
│   ├── auth/
│   │   ├── AuthProvider.tsx
│   │   ├── entra-id.ts
│   │   ├── sync-user.ts
│   │   ├── get-current-user.ts
│   │   ├── require-role.ts
│   │   └── use-auth.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── integrations/
│   │   └── iframe-bridge.ts
│   ├── search/
│   │   └── search-engine.ts
│   ├── notifications/
│   │   └── notification-service.ts
│   └── utils.ts
├── middleware.ts
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── package.json
└── .env.local
```

# AUTHENTICATION FLOW

## Microsoft Entra ID Setup

**Environment Variables Required:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Microsoft Entra ID
AZURE_CLIENT_ID=your-app-client-id
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_SECRET=your-client-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Authentication Implementation

```typescript
// lib/auth/entra-id.ts
import { ConfidentialClientApplication } from '@azure/msal-node';

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET!,
  },
};

const msalClient = new ConfidentialClientApplication(msalConfig);

export async function handleLogin() {
  const authUrl = await msalClient.getAuthCodeUrl({
    scopes: ['User.Read', 'profile', 'email', 'openid'],
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
  });
  return authUrl;
}

export async function handleCallback(code: string) {
  const tokenResponse = await msalClient.acquireTokenByCode({
    code,
    scopes: ['User.Read'],
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
  });
  return tokenResponse;
}
```

```typescript
// lib/auth/sync-user.ts
import { createClient } from '@/lib/supabase/server';
import { GraphClient } from '@microsoft/microsoft-graph-client';

export async function syncUserFromEntraID(accessToken: string) {
  const graphClient = GraphClient.init({
    authProvider: (done) => done(null, accessToken),
  });
  
  const graphUser = await graphClient.api('/me').get();
  
  const supabase = createClient();
  const { data: user, error } = await supabase
    .from('hub_users')
    .upsert({
      microsoft_id: graphUser.id,
      email: graphUser.mail || graphUser.userPrincipalName,
      first_name: graphUser.givenName,
      last_name: graphUser.surname,
      display_name: graphUser.displayName,
      last_login_at: new Date().toISOString(),
    }, {
      onConflict: 'microsoft_id'
    })
    .select()
    .single();
    
  if (error) throw error;
  return user;
}
```

## API Routes

```typescript
// app/api/auth/login/route.ts
import { handleLogin } from '@/lib/auth/entra-id';

export async function GET() {
  const authUrl = await handleLogin();
  return Response.redirect(authUrl);
}
```

```typescript
// app/api/auth/callback/route.ts
import { handleCallback, syncUserFromEntraID } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return Response.redirect('/login?error=no_code');
  }
  
  try {
    const tokenResponse = await handleCallback(code);
    const user = await syncUserFromEntraID(tokenResponse.accessToken);
    
    const supabase = createClient();
    await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.microsoft_id,
    });
    
    await supabase.from('audit_log').insert({
      user_id: user.id,
      action: 'login',
      details: { method: 'microsoft_sso' },
    });
    
    return Response.redirect('/dashboard');
  } catch (error) {
    console.error('Auth callback error:', error);
    return Response.redirect('/login?error=auth_failed');
  }
}
```

# PAGE SPECIFICATIONS

## Login Page (app/login/page.tsx)

**Design:**
- Centered card with Lending Heights logo
- "Welcome to Lending Heights" heading (H1)
- "Sign in with Microsoft" button (primary blue, full width)
- "Secure access to all your tools" subtext
- Clean white background with subtle blue gradient

**Features:**
- Click button → redirect to Microsoft SSO
- Loading state during redirect
- Error handling (display error from query params)

## Dashboard Page (app/dashboard/page.tsx)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Main Content Area                         │
│            │                                             │
│ [Logo]     │  Welcome back, [First Name]! 👋           │
│            │  Your workspace                             │
│ Nav Items  │                                             │
│            │  Quick Actions Bar                          │
│ [Profile]  │  [View Calendar] [Check CRM] [Directory]   │
│            │                                             │
│            │  My Applications                            │
│            │  ┌────────┐ ┌────────┐ ┌────────┐         │
│            │  │ [Icon] │ │ [Icon] │ │ [Icon] │         │
│            │  │  Name  │ │  Name  │ │  Name  │         │
│            │  │ Badge  │ │        │ │        │         │
│            │  └────────┘ └────────┘ └────────┘         │
│            │                                             │
│            │  Recent Activity                            │
│            │  • Activity item 1                          │
│            │  • Activity item 2                          │
│            │  • Activity item 3                          │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Personalized greeting with user's first name
- Grid of application cards (3-4 columns on desktop, 1 on mobile)
- Each card shows: icon, name, description, badge (if notifications)
- Filter apps by user role + permissions
- Quick actions bar with 3-4 most common actions
- Recent activity feed (last 5 activities)
- Fully responsive (mobile-first)

**Data Fetching:**
- Server Component fetching user data
- Fetch accessible applications based on role
- Fetch recent audit log entries

## App Integration Pages (app/apps/[app]/page.tsx)

**Purpose:** Embed existing applications in iframes

**Layout:**
- Full-screen iframe
- Loading skeleton while iframe loads
- Error boundary if iframe fails
- PostMessage communication for auth token passing

**Example:**
```typescript
// app/apps/talentflow/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth/use-auth';
import { sendAuthToApp } from '@/lib/integrations/iframe-bridge';

export default function TalentFlowPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { user, token } = useAuth();
  
  useEffect(() => {
    if (iframeRef.current && token) {
      sendAuthToApp(iframeRef.current, token);
    }
  }, [token]);
  
  return (
    <div className="h-screen w-full">
      <iframe
        ref={iframeRef}
        src={process.env.NEXT_PUBLIC_TALENTFLOW_URL}
        className="w-full h-full border-0"
        title="TalentFlow"
      />
    </div>
  );
}
```

## Global Search (Command Palette)

**Trigger:** Cmd/Ctrl + K

**UI:**
- Modal overlay (dark transparent background)
- Centered search card
- Search input at top
- Results grouped by category (Applications, People, Recent)
- Keyboard navigation (↑↓ to navigate, Enter to select, Esc to close)

**Search Logic:**
- Debounced search (300ms)
- Search across: application names, user names, recent items
- Fuzzy matching
- Max 5 results per category

## Notifications Page (app/notifications/page.tsx)

**Layout:**
- Header with "Notifications" title
- Filter tabs: All, Unread, By Application
- List of notification items
- Each item: icon (colored dot), title, message, timestamp, read status
- Mark as read button
- Mark all as read button

**Features:**
- Real-time updates (Supabase Realtime)
- Click notification → navigate to action_url
- Unread count badge in sidebar
- Filter and sort functionality

## User Profile Page (app/profile/page.tsx)

**Sections:**
1. **Personal Information**
   - Avatar (upload capability)
   - Name, email (read-only from Entra ID)
   - Job title, department

2. **Preferences**
   - Theme: Light / Dark / Auto (radio buttons)
   - Default view: Grid / List (radio buttons)
   - Notification settings (checkboxes)

3. **Pinned Applications**
   - Drag-and-drop reorderable list
   - Add/remove pins

4. **Security**
   - Last login timestamp
   - Login history (last 10 logins)
   - Link to admin audit log (if admin)

## Admin Panel (app/admin/*)

**Layout:**
- Admin-specific sidebar navigation
- Tabs for: Users, Applications, Permissions, Audit Log
- Only accessible to users with role = 'admin'

### Users Management (app/admin/users/page.tsx)

**Features:**
- Data table with columns: Name, Email, Role, Department, Status, Actions
- Search by name or email
- Filter by role or status
- Sort by any column
- Click row → open edit modal
- "Add User" button → open create modal

**User Form:**
- First name, last name (required)
- Email (required, must match Entra ID)
- Role dropdown (employee, manager, admin, executive)
- Department, job title
- Active/inactive toggle

### Permissions Management (app/admin/permissions/page.tsx)

**UI:** Permission matrix (grid)
- Rows: Roles (employee, manager, admin, executive)
- Columns: Applications
- Cells: Dropdown (none, view, edit, admin)

**Features:**
- Inline editing
- Bulk actions
- Save changes button
- Reset to defaults button

### Audit Log (app/admin/audit/page.tsx)

**Features:**
- Searchable/filterable table
- Filter by: user, action, date range, resource type
- Export to CSV
- Pagination (50 per page)
- Click row → view detailed JSON

# COMPONENT SPECIFICATIONS

## AppCard Component

```typescript
interface AppCardProps {
  app: {
    id: string;
    app_key: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    url: string;
    category: string;
  };
  notificationCount?: number;
}

// Features:
// - Icon from lucide-react
// - Colored border/accent (use app.color)
// - Badge showing notification count (if > 0)
// - Hover state (lift effect, shadow)
// - Click → navigate to app.url
```

## NotificationBell Component

```typescript
// Features:
// - Bell icon from lucide-react
// - Red badge with unread count (if > 0)
// - Click → open notifications dropdown
// - Dropdown shows last 5 notifications
// - "View All" link at bottom
// - Mark all as read button
```

## Sidebar Component

**Structure:**
```
┌─────────────────┐
│  [Logo]         │
│                 │
│  Dashboard      │
│  Notifications  │
│  Profile        │
│                 │
│  ─────────────  │
│                 │
│  Admin          │ (if admin role)
│  • Users        │
│  • Permissions  │
│                 │
│  [Search Icon]  │ Cmd+K
│                 │
│  [User Menu]    │
└─────────────────┘
```

**Features:**
- Fixed position on desktop
- Collapsible on mobile (hamburger menu)
- Active route highlighting
- Logo at top (clickable → dashboard)
- User menu at bottom (avatar, name, role)

# MOBILE RESPONSIVENESS

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Adaptations:**
- Sidebar → Hamburger menu
- App grid → Single column
- Tables → Horizontal scroll or card view
- Search → Full screen modal
- Admin tables → Simplified card view

# PERFORMANCE REQUIREMENTS

- Page load time: < 2 seconds
- Time to Interactive: < 3 seconds
- Lighthouse Performance score: > 90
- Mobile-friendly: 100% responsive
- Accessibility: WCAG 2.1 AA compliant

# SECURITY REQUIREMENTS

- All API routes must check authentication
- Implement role-based access checks
- Use parameterized queries (Supabase handles this)
- Enable RLS on all tables
- Sanitize user inputs
- HTTPS only in production
- Implement rate limiting on auth endpoints
- Log all admin actions

# DEPLOYMENT CHECKLIST

**Vercel Setup:**
1. Connect GitHub repository
2. Configure environment variables
3. Set custom domain: hub.lendingheights.com
4. Enable automatic deployments on main branch

**Pre-Launch:**
- [ ] All database tables created with RLS
- [ ] Environment variables configured
- [ ] Microsoft Entra ID redirect URIs updated
- [ ] All pages load without errors
- [ ] Authentication flow tested end-to-end
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit passed
- [ ] Performance benchmarks met

# IMPLEMENTATION PHASES

## Phase 1: Foundation (Week 1-2)
- [ ] Project setup (Next.js, Tailwind, shadcn/ui)
- [ ] Supabase database schema
- [ ] Microsoft Entra ID authentication
- [ ] Basic layout (sidebar, header)
- [ ] Login page

## Phase 2: Core Features (Week 3-4)
- [ ] Dashboard page with app grid
- [ ] App integration (iframe embedding)
- [ ] Global search (Cmd+K)
- [ ] Notifications system
- [ ] User profile page

## Phase 3: Admin Features (Week 5-6)
- [ ] Admin panel layout
- [ ] User management
- [ ] Permission matrix
- [ ] Audit log viewer

## Phase 4: Polish & Deploy (Week 7-8)
- [ ] Mobile optimization
- [ ] Loading states and error handling
- [ ] Accessibility improvements
- [ ] Testing (unit, integration, e2e)
- [ ] Production deployment

# STYLE GUIDELINES

**Component Styling:**
- Use Tailwind utility classes (no custom CSS unless necessary)
- Follow mobile-first approach
- Use Lending Heights color palette exclusively
- Consistent spacing (4px, 8px, 12px, 16px, 24px, 32px, 48px)
- Rounded corners: 8px for cards, 6px for buttons, 4px for inputs
- Shadows: Use Tailwind's shadow-sm, shadow-md, shadow-lg

**Animation:**
- Subtle hover effects (scale, shadow)
- Smooth transitions (150-300ms)
- Loading skeletons (avoid spinners)
- Toast notifications for success/error states

**Accessibility:**
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators (visible focus rings)
- Color contrast ratio ≥ 4.5:1

# ERROR HANDLING

**User-Facing Errors:**
- Show toast notification with error message
- Provide actionable next steps
- Log detailed error to console/monitoring

**API Error Responses:**
```typescript
// Standard error format
{
  error: string,           // User-friendly message
  code: string,            // Error code (e.g., 'AUTH_FAILED')
  details?: any,           // Additional context (dev only)
  timestamp: string        // ISO timestamp
}
```

**Error Boundaries:**
- Wrap entire app in error boundary
- Catch and display errors gracefully
- Provide "Try again" or "Go home" actions

# TESTING REQUIREMENTS

**Unit Tests:**
- All utility functions
- Authentication logic
- Permission checking functions

**Integration Tests:**
- API routes
- Database operations
- Authentication flow

**E2E Tests (Playwright):**
- Login flow
- Dashboard navigation
- App access
- Admin operations
- Search functionality

# DOCUMENTATION REQUIREMENTS

Create markdown files:
- README.md (project overview, setup instructions)
- SETUP.md (local development guide)
- API.md (API endpoint documentation)
- DEPLOYMENT.md (production deployment steps)

# SUCCESS CRITERIA

**Functional:**
- ✅ Users can log in with Microsoft SSO
- ✅ Dashboard shows apps based on role
- ✅ All apps accessible via iframe
- ✅ Search works across apps and people
- ✅ Notifications display and update in real-time
- ✅ Admins can manage users and permissions
- ✅ Audit log captures all admin actions

**Non-Functional:**
- ✅ Page loads < 2 seconds
- ✅ Mobile responsive (all devices)
- ✅ Accessible (WCAG 2.1 AA)
- ✅ Secure (RLS, auth checks)
- ✅ Performant (Lighthouse > 90)

# FINAL NOTES

- Follow Next.js 14 best practices (App Router, Server Components)
- Use TypeScript strict mode
- Implement proper error boundaries
- Add loading states everywhere
- Use Supabase Realtime for live updates where appropriate
- Keep components small and focused
- Write clean, self-documenting code
- Add comments only where logic is complex

Build this incrementally, testing each feature before moving to the next. Start with Phase 1 and work through systematically. Prioritize working code over perfect code—we can refactor later.

Now, begin implementation starting with project setup and database schema.


---
## **💡 IDEA 1: Unified Lending Heights Hub with SSO & Role-Based Access**

### **The Concept**

Create **one central dashboard** that serves as the single entry point for all your internal applications, with Microsoft Entra ID SSO and role-based access control.

### **What This Integrates**

- TalentFlow (employee onboarding & management)
- Teammate Directory (employee profiles & org chart)
- Company Calendar (events, holidays, payroll)
- CRM Dashboard (partner & borrower management)
- Launch Readiness Checklists (project tracking)
- Marketing Resources Hub (brand assets, templates)

### **Architecture**

```
Landing Page: hub.lendingheights.com
├── Employee Portal (All Staff)
│   ├── My Profile (from Teammate Directory)
│   ├── Company Calendar
│   ├── My Onboarding (if applicable)
│   └── Team Directory
├── Operations Portal (Managers + Admins)
│   ├── TalentFlow Admin
│   ├── Calendar Management
│   └── Project Checklists
├── CRM Portal (Loan Officers + Leadership)
│   ├── Partner Dashboard
│   ├── Borrower Pipeline
│   └── Analytics & Reports
└── Marketing Portal (Marketing Team + Leadership)
    ├── Realtor Partnership Materials
    ├── Brand Assets Library
    └── Campaign Tracking
```

### **Efficiency Gains**

- ✅ **One login** for everything (Microsoft SSO)
- ✅ **Personalized homepage** showing only relevant apps per role
- ✅ **Shared navigation** - consistent UX across all tools
- ✅ **Unified search** across all applications
- ✅ **Single notification center** for all updates

### **Tech Stack**

- Next.js 14+ with App Router
- Tailwind CSS + shadcn/ui
- Supabase (existing infrastructure)
- Microsoft Entra ID (already configured)
- Vercel hosting

## **Design Preferences & Brand Guidelines**

### **Brand Font**

- **Primary Typeface**: Poppins (Google Fonts)
- **Weights**: 400 (Regular), 600 (Semibold), 700 (Bold), 800 (Extrabold)

### **Color Palette**

**Primary Colors:**

- **LH Blue** - `#0058A9` (Primary brand color)
- **LH Red** - `#FF2260` (Primary accent)
- **LH Dark Red** - `#CE003B` (Secondary accent)
- **LH Yellow** - `#E2C20A` (Primary accent)
- **LH Light Blue** - `#00B0FF` (Accent)
- **LH Dark Blue** - `#002547` (Dark variant)

**Supporting Colors:**

- **Text Primary** - `#1E1E1E` (Near black)
- **Text Secondary** - `#667085` (Muted gray)
- **Border** - `#E5E7EB` (Light gray)
- **Background** - `#F8FAFC` (Soft muted)
- **White** - `#FFFFFF`

**Gradients:**

- **Primary Gradient**: 90° from `#0058A9` → `#CE003B`
- **Secondary Gradient**: 90° from `#FAA819` → `#FF2260`

### **Layout & Design Preferences**

- **Style**: Modern, clean, professional with tech-forward aesthetic
- **Spacing**: Generous whitespace, uncluttered layouts
- **Components**: Rounded corners (8px standard), subtle shadows
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG 2.1 AA compliant
- **Scalability**: Designed to support 50-person team and multi-state operations

### **Specific Features**

- Consistent branding across all internal applications and client-facing materials
- Integration with Microsoft ecosystem (Teams, OneDrive, SharePoint, Entra ID)
- Role-based access controls for team hierarchy
- Real-time collaborative functionality across 14-state operations
- Enterprise-grade security visual indicators
- Professional dashboards and data visualization
- Multi-state compliance features

### **Brand Voice**

- Professional and established
- Clear and transparent
- Tech-savvy and efficient
- Partnership-oriented
- Compliance-conscious
- Regionally knowledgeable with national reach

### **Tech Stack**

- Next.js 14+ with App Router
- Tailwind CSS + shadcn/ui
- Supabase