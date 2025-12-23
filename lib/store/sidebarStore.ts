'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  expandedItems: string[];
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobile: () => void;
  setMobileOpen: (open: boolean) => void;
  toggleExpanded: (itemId: string) => void;
  setExpandedItems: (items: string[]) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,
      expandedItems: [],

      toggleCollapse: () => set((state) => ({
        isCollapsed: !state.isCollapsed,
        // Collapse all expanded items when sidebar collapses
        expandedItems: state.isCollapsed ? state.expandedItems : []
      })),

      setCollapsed: (collapsed) => set({
        isCollapsed: collapsed,
        expandedItems: collapsed ? [] : []
      }),

      toggleMobile: () => set((state) => ({
        isMobileOpen: !state.isMobileOpen
      })),

      setMobileOpen: (open) => set({
        isMobileOpen: open
      }),

      toggleExpanded: (itemId) => set((state) => ({
        expandedItems: state.expandedItems.includes(itemId)
          ? state.expandedItems.filter((id) => id !== itemId)
          : [...state.expandedItems, itemId]
      })),

      setExpandedItems: (items) => set({
        expandedItems: items
      }),
    }),
    {
      name: 'lh-sidebar-storage',
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
        expandedItems: state.expandedItems
      }),
    }
  )
);
