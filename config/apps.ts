import {
  Users,
  Calendar,
  UserPlus,
  Building2,
  CheckSquare,
  Megaphone,
  type LucideIcon,
} from 'lucide-react';

export interface App {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  category: 'employee' | 'operations' | 'crm' | 'marketing';
  isActive: boolean;
  comingSoon?: boolean;
}

export const apps: App[] = [
  {
    id: 'directory',
    name: 'Team Directory',
    description: 'Employee profiles, contact info, and org structure',
    href: '/directory',
    icon: Users,
    color: '#0058A9',
    bgColor: 'bg-blue-50',
    category: 'employee',
    isActive: true,
  },
  {
    id: 'calendar',
    name: 'Company Calendar',
    description: 'Events, holidays, and important dates',
    href: '/calendar',
    icon: Calendar,
    color: '#FF2260',
    bgColor: 'bg-red-50',
    category: 'employee',
    isActive: true,
    comingSoon: true,
  },
  {
    id: 'talentflow',
    name: 'TalentFlow',
    description: 'Employee onboarding and management',
    href: '/talentflow',
    icon: UserPlus,
    color: '#00B0FF',
    bgColor: 'bg-cyan-50',
    category: 'operations',
    isActive: true,
    comingSoon: true,
  },
  {
    id: 'crm',
    name: 'Partner CRM',
    description: 'Realtor partnerships and pipeline management',
    href: '/crm',
    icon: Building2,
    color: '#E2C20A',
    bgColor: 'bg-yellow-50',
    category: 'crm',
    isActive: true,
    comingSoon: true,
  },
  {
    id: 'checklists',
    name: 'Project Checklists',
    description: 'Launch readiness and project tracking',
    href: '/checklists',
    icon: CheckSquare,
    color: '#10B981',
    bgColor: 'bg-emerald-50',
    category: 'operations',
    isActive: true,
    comingSoon: true,
  },
  {
    id: 'marketing',
    name: 'Marketing Hub',
    description: 'Brand assets, templates, and campaigns',
    href: '/marketing',
    icon: Megaphone,
    color: '#8B5CF6',
    bgColor: 'bg-violet-50',
    category: 'marketing',
    isActive: true,
    comingSoon: true,
  },
];

export const getAppsByCategory = () => {
  const categories: Record<string, App[]> = {};
  apps.forEach((app) => {
    if (!categories[app.category]) {
      categories[app.category] = [];
    }
    categories[app.category].push(app);
  });
  return categories;
};

export const getActiveApps = () => apps.filter((app) => app.isActive);
