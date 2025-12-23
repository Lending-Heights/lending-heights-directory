'use client';

import { useAuthStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Settings, Users, Shield, FileText, AlertTriangle } from 'lucide-react';

const adminTabs = [
  { name: 'Overview', href: '/admin', icon: Settings },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Permissions', href: '/admin/permissions', icon: Shield },
  { name: 'Audit Log', href: '/admin/audit', icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = role === 'admin' || role === 'executive';

  // Redirect non-admins
  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <Card className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">
          You don&apos;t have permission to view this page.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Navigation Tabs */}
      <div className="border-b">
        <nav className="flex gap-4 -mb-px overflow-x-auto">
          {adminTabs.map((tab) => {
            const isActive = pathname === tab.href ||
              (tab.href !== '/admin' && pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}
