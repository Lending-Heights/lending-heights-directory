'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuthStore, useSidebarStore, type UserRole } from '@/lib/store';
import { useAuth } from '@/components/providers/AuthProvider';
import { MobileSidebar } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Shield,
  LogIn,
} from 'lucide-react';

const roleLabels: Record<UserRole, string> = {
  user: 'User',
  manager: 'Manager',
  admin: 'Admin',
  executive: 'Executive',
};

const roleColors: Record<UserRole, string> = {
  user: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  manager: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  executive: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
};

function RoleSwitcher() {
  const { role, setRole } = useAuthStore();

  const roles: UserRole[] = ['user', 'manager', 'admin', 'executive'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">{roleLabels[role]}</span>
          <Badge variant="secondary" className={cn('hidden sm:flex', roleColors[role])}>
            Demo
          </Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((r) => (
          <DropdownMenuItem
            key={r}
            onClick={() => setRole(r)}
            className={cn(role === r && 'bg-accent')}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  r === 'user' && 'bg-gray-400',
                  r === 'manager' && 'bg-blue-500',
                  r === 'admin' && 'bg-purple-500',
                  r === 'executive' && 'bg-amber-500'
                )}
              />
              {roleLabels[r]}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Breadcrumbs() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">Dashboard</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
        Home
      </Link>
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

        return (
          <div key={href} className="flex items-center gap-2">
            <span className="text-muted-foreground">/</span>
            {isLast ? (
              <span className="font-medium">{label}</span>
            ) : (
              <Link
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function UserMenu() {
  const { user: storeUser } = useAuthStore();
  const { user: authUser, signOut, isLoading } = useAuth();

  // Use real auth user if available, fall back to store user (demo mode)
  const isAuthenticated = !!authUser;
  const displayUser = authUser
    ? {
        displayName: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email,
        email: authUser.email,
        firstName: authUser.user_metadata?.full_name?.split(' ')[0] || authUser.email?.[0]?.toUpperCase(),
        lastName: authUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        avatarUrl: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture,
      }
    : storeUser;

  // Show login button if not authenticated
  if (!isAuthenticated && !storeUser) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/login" className="gap-2">
          <LogIn className="h-4 w-4" />
          Sign In
        </Link>
      </Button>
    );
  }

  const handleLogout = async () => {
    if (isAuthenticated) {
      await signOut();
    } else {
      // Demo mode logout
      useAuthStore.getState().logout();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={displayUser?.avatarUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {displayUser?.firstName?.[0]}
              {displayUser?.lastName?.[0] || displayUser?.firstName?.[1]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{displayUser?.displayName}</p>
            <p className="text-xs text-muted-foreground">{displayUser?.email}</p>
            {!isAuthenticated && (
              <Badge variant="secondary" className="w-fit text-xs mt-1">Demo Mode</Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          {isAuthenticated ? 'Sign out' : 'Exit Demo'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const { isCollapsed } = useSidebarStore();

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 lg:px-6',
        'left-0 lg:left-[var(--sidebar-width)]',
        isCollapsed && 'lg:left-[var(--sidebar-collapsed-width)]',
        'transition-all duration-300'
      )}
    >
      {/* Mobile Menu */}
      <MobileSidebar />

      {/* Breadcrumbs */}
      <div className="hidden md:block">
        <Breadcrumbs />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
        <Search className="h-4 w-4" />
        <span className="text-muted-foreground">Search...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </Button>

      {/* Role Switcher */}
      <RoleSwitcher />

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-lh-red text-[10px] font-medium text-white">
          3
        </span>
        <span className="sr-only">Notifications</span>
      </Button>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* User Menu */}
      <UserMenu />
    </header>
  );
}

export default Header;
