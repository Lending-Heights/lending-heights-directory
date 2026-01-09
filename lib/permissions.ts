/**
 * Permission Utilities
 * Helper functions for role-based access control
 */

import { permissions as permissionsApi, userRoles } from '@/lib/api/talentflow';

export type PermissionLevel = 'none' | 'view' | 'edit' | 'admin';
export type RoleName = 'Admin' | 'Manager' | 'Employee' | 'Executive';

/**
 * Check if a user has permission for an app at a specific level
 */
export async function checkPermission(
  userEmail: string,
  appSlug: string,
  requiredLevel: 'view' | 'edit' | 'admin' = 'view'
): Promise<boolean> {
  try {
    return await permissionsApi.check(userEmail, appSlug, requiredLevel);
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
}

/**
 * Get user's role
 */
export async function getUserRole(userEmail: string): Promise<RoleName | null> {
  try {
    const userRole = await userRoles.getByEmail(userEmail);
    return userRole?.roles?.name as RoleName || null;
  } catch (error) {
    console.error('Get user role failed:', error);
    return null;
  }
}

/**
 * Check if user is admin
 */
export async function isAdmin(userEmail: string): Promise<boolean> {
  const role = await getUserRole(userEmail);
  return role === 'Admin' || role === 'Executive';
}

/**
 * Check if user is manager
 */
export async function isManager(userEmail: string): Promise<boolean> {
  const role = await getUserRole(userEmail);
  return role === 'Manager';
}

/**
 * Check if user is employee
 */
export async function isEmployee(userEmail: string): Promise<boolean> {
  const role = await getUserRole(userEmail);
  return role === 'Employee';
}

/**
 * Get permission level as a comparable number
 * none: 0, view: 1, edit: 2, admin: 3
 */
export function permissionLevelToNumber(level: PermissionLevel): number {
  const levels: Record<PermissionLevel, number> = {
    none: 0,
    view: 1,
    edit: 2,
    admin: 3,
  };
  return levels[level];
}

/**
 * Compare two permission levels
 * Returns true if userLevel >= requiredLevel
 */
export function hasPermissionLevel(
  userLevel: PermissionLevel,
  requiredLevel: PermissionLevel
): boolean {
  return permissionLevelToNumber(userLevel) >= permissionLevelToNumber(requiredLevel);
}

/**
 * Permission Matrix helpers for UI
 */
export const PermissionMatrix = {
  levels: ['none', 'view', 'edit', 'admin'] as PermissionLevel[],

  getLevelColor(level: PermissionLevel): string {
    const colors: Record<PermissionLevel, string> = {
      none: 'bg-red-50 text-red-700',
      view: 'bg-gray-50 text-gray-700',
      edit: 'bg-blue-50 text-blue-700',
      admin: 'bg-green-50 text-green-700',
    };
    return colors[level];
  },

  getLevelIcon(level: PermissionLevel): string {
    const icons: Record<PermissionLevel, string> = {
      none: '×',
      view: '👁',
      edit: '✏️',
      admin: '✓',
    };
    return icons[level];
  },

  getLevelLabel(level: PermissionLevel): string {
    const labels: Record<PermissionLevel, string> = {
      none: 'No access',
      view: 'Read only',
      edit: 'Can modify',
      admin: 'Full access',
    };
    return labels[level];
  },
};
