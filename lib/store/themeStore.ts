'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  setTheme: (isDark: boolean) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,

      setTheme: (isDark) => set({ isDark }),

      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: 'lh-theme-storage',
    }
  )
);
