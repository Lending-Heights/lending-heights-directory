'use client';

import { AppCard } from './AppCard';
import { getActiveApps, type App } from '@/config/apps';

interface AppGridProps {
  apps?: App[];
}

export function AppGrid({ apps }: AppGridProps) {
  const displayApps = apps || getActiveApps();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {displayApps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}

export default AppGrid;
