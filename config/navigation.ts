import {
  LayoutDashboard,
  Users,
  Calendar,
  UserPlus,
  Building2,
  CheckSquare,
  Megaphone,
  Settings,
  UserCircle,
  Bell,
  Shield,
  FileText,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  adminOnly?: boolean;
  children?: NavChildItem[];
}

export interface NavChildItem {
  name: string;
  href: string;
  icon?: LucideIcon;
}

export const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Directory',
    href: '/directory',
    icon: Users,
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar,
  },
  {
    name: 'TalentFlow',
    href: '/talentflow',
    icon: UserPlus,
  },
  {
    name: 'CRM',
    href: '/crm',
    icon: Building2,
  },
  {
    name: 'Checklists',
    href: '/checklists',
    icon: CheckSquare,
  },
  {
    name: 'Marketing',
    href: '/marketing',
    icon: Megaphone,
  },
];

export const adminNavigation: NavItem[] = [
  {
    name: 'Admin',
    href: '/admin',
    icon: Settings,
    adminOnly: true,
    children: [
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Permissions', href: '/admin/permissions', icon: Shield },
      { name: 'Audit Log', href: '/admin/audit', icon: FileText },
    ],
  },
];

export const userNavigation: NavItem[] = [
  {
    name: 'Profile',
    href: '/profile',
    icon: UserCircle,
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
];

export const allNavigation = [...navigation, ...adminNavigation, ...userNavigation];
