'use client';

import { useAuthStore } from '@/lib/store';

export function WelcomeHeader() {
  const { user } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        {getGreeting()}, {user?.firstName || 'there'}!
      </h1>
      <p className="mt-1 text-muted-foreground">
        Welcome to your Lending Heights Hub. Here&apos;s what&apos;s happening today.
      </p>
    </div>
  );
}

export default WelcomeHeader;
