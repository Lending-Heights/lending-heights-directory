'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/authStore';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setUser: setStoreUser, logout: storeLogout } = useAuthStore();

  const supabase = createClient();

  // Sync Supabase user with Zustand store
  const syncUserToStore = useCallback((supabaseUser: User | null) => {
    if (supabaseUser) {
      // Extract user metadata from Supabase user
      const metadata = supabaseUser.user_metadata || {};
      setStoreUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        firstName: metadata.full_name?.split(' ')[0] || metadata.name?.split(' ')[0] || '',
        lastName: metadata.full_name?.split(' ').slice(1).join(' ') || metadata.name?.split(' ').slice(1).join(' ') || '',
        displayName: metadata.full_name || metadata.name || supabaseUser.email || '',
        role: 'user', // Default role - can be enhanced with database lookup
        avatarUrl: metadata.avatar_url || metadata.picture,
      });
    } else {
      storeLogout();
    }
  }, [setStoreUser, storeLogout]);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        syncUserToStore(user);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      syncUserToStore(newUser);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, syncUserToStore]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      syncUserToStore(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
