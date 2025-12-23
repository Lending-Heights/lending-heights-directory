'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useSidebarStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 transition-all duration-300',
          'lg:ml-[var(--sidebar-width)]',
          isCollapsed && 'lg:ml-[var(--sidebar-collapsed-width)]'
        )}
      >
        <div className="container mx-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
