'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'user' | 'manager' | 'admin' | 'executive';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: UserRole;
  department?: string;
  jobTitle?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

// Default demo user for development
const defaultUser: User = {
  id: 'demo-user-1',
  email: 'demo@lendingheights.com',
  firstName: 'Demo',
  lastName: 'User',
  displayName: 'Demo User',
  role: 'admin',
  department: 'Operations',
  jobTitle: 'Administrator',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: defaultUser,
      role: 'admin',
      isAuthenticated: true,

      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        role: user?.role || 'user'
      }),

      setRole: (role) => set((state) => ({
        role,
        user: state.user ? { ...state.user, role } : null
      })),

      logout: () => set({
        user: null,
        role: 'user',
        isAuthenticated: false
      }),
    }),
    {
      name: 'lh-auth-storage',
      partialize: (state) => ({ role: state.role }),
    }
  )
);
