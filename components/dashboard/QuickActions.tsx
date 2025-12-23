'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Users, CheckSquare, Plus } from 'lucide-react';

const quickActions = [
  {
    label: 'View Calendar',
    href: '/calendar',
    icon: Calendar,
    variant: 'outline' as const,
  },
  {
    label: 'Team Directory',
    href: '/directory',
    icon: Users,
    variant: 'outline' as const,
  },
  {
    label: 'Checklists',
    href: '/checklists',
    icon: CheckSquare,
    variant: 'outline' as const,
  },
];

export function QuickActions() {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-medium text-muted-foreground mb-3">
        Quick Actions
      </h2>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <Button
            key={action.href}
            variant={action.variant}
            size="sm"
            asChild
            className="gap-2"
          >
            <Link href={action.href}>
              <action.icon className="h-4 w-4" />
              {action.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
