'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useSidebarStore, useAuthStore } from '@/lib/store';
import { navigation, adminNavigation, userNavigation, type NavItem } from '@/config/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  LogOut,
} from 'lucide-react';

function SidebarLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 px-3 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lh-blue">
        <span className="text-lg font-bold text-white">LH</span>
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground">Lending Heights</span>
          <span className="text-xs text-muted-foreground">Hub</span>
        </div>
      )}
    </Link>
  );
}

function NavItemComponent({
  item,
  collapsed,
  isActive,
  isExpanded,
  onToggleExpand,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  const content = (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
        'hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-primary/10 text-primary',
        collapsed && 'justify-center px-2'
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
      {!collapsed && (
        <>
          <span className="flex-1">{item.name}</span>
          {item.badge && item.badge > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-lh-red px-1.5 text-xs font-medium text-white">
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          )}
        </>
      )}
    </div>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link href={item.href}>{content}</Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.name}
          {item.badge && item.badge > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-lh-red px-1.5 text-xs font-medium text-white">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  if (hasChildren) {
    return (
      <div>
        <button onClick={onToggleExpand} className="w-full">
          {content}
        </button>
        {isExpanded && (
          <div className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
            {item.children!.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all',
                  'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {child.icon && <child.icon className="h-4 w-4" />}
                <span>{child.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <Link href={item.href}>{content}</Link>;
}

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const { role, user } = useAuthStore();
  const { expandedItems, toggleExpanded } = useSidebarStore();

  const isAdmin = role === 'admin' || role === 'executive';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <SidebarLogo collapsed={collapsed} />

        <Separator className="mb-2" />

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-2 overflow-y-auto">
          {navigation.map((item) => (
            <NavItemComponent
              key={item.href}
              item={item}
              collapsed={collapsed}
              isActive={isActive(item.href)}
              isExpanded={expandedItems.includes(item.name)}
              onToggleExpand={() => toggleExpanded(item.name)}
            />
          ))}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <Separator className="my-3" />
              {adminNavigation.map((item) => (
                <NavItemComponent
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  isActive={isActive(item.href)}
                  isExpanded={expandedItems.includes(item.name)}
                  onToggleExpand={() => toggleExpanded(item.name)}
                />
              ))}
            </>
          )}
        </nav>

        <Separator className="mt-2" />

        {/* User Section */}
        <div className="p-2 space-y-1">
          {userNavigation.map((item) => (
            <NavItemComponent
              key={item.href}
              item={item}
              collapsed={collapsed}
              isActive={isActive(item.href)}
              isExpanded={expandedItems.includes(item.name)}
              onToggleExpand={() => toggleExpanded(item.name)}
            />
          ))}
        </div>

        <Separator />

        {/* User Profile */}
        <div className={cn('p-3', collapsed && 'px-2')}>
          <div
            className={cn(
              'flex items-center gap-3',
              collapsed && 'justify-center'
            )}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{user?.displayName}</p>
                <p className="truncate text-xs text-muted-foreground capitalize">
                  {role}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export function Sidebar() {
  const { isCollapsed, toggleCollapse } = useSidebarStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300',
        'hidden lg:flex lg:flex-col',
        isCollapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]'
      )}
    >
      <SidebarContent collapsed={isCollapsed} />

      {/* Collapse Toggle Button */}
      <button
        onClick={toggleCollapse}
        className={cn(
          'absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full',
          'border border-border bg-card shadow-sm transition-colors hover:bg-accent'
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}

export function MobileSidebar() {
  const { isMobileOpen, setMobileOpen } = useSidebarStore();

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[var(--sidebar-width)] p-0">
        <SidebarContent collapsed={false} />
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
