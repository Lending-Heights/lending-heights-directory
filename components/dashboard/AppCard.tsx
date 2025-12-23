'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { App } from '@/config/apps';

interface AppCardProps {
  app: App;
  notificationCount?: number;
}

export function AppCard({ app, notificationCount }: AppCardProps) {
  const Icon = app.icon;

  return (
    <Link href={app.href}>
      <Card
        className={cn(
          'group relative overflow-hidden transition-all duration-200',
          'hover:shadow-lg hover:-translate-y-1',
          'border-2 border-transparent hover:border-primary/20'
        )}
      >
        <CardContent className="p-6">
          {/* Icon and Badge Row */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
                app.bgColor
              )}
              style={{ color: app.color }}
            >
              <Icon className="h-6 w-6" />
            </div>

            <div className="flex items-center gap-2">
              {app.comingSoon && (
                <Badge variant="secondary" className="text-xs">
                  Coming Soon
                </Badge>
              )}
              {notificationCount && notificationCount > 0 && (
                <Badge className="bg-lh-red hover:bg-lh-red/90">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
              )}
            </div>
          </div>

          {/* Title and Description */}
          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {app.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {app.description}
          </p>

          {/* Hover Indicator */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 h-1 transition-all duration-200',
              'opacity-0 group-hover:opacity-100'
            )}
            style={{ backgroundColor: app.color }}
          />
        </CardContent>
      </Card>
    </Link>
  );
}

export default AppCard;
