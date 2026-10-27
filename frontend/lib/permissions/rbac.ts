import { CivoraUser, AdminPermission, UserRole } from '@/types';

export const ADMIN_ROLE_PERMISSIONS: Record<UserRole, AdminPermission[]> = {
  platform_admin: [
    'system.read',
    'users.read',
    'users.manage',
    'roles.read',
    'roles.manage',
    'invitations.read',
    'invitations.manage',
    'access_reviews.read',
    'organizations.read',
    'organizations.manage',
    'projects.read',
    'projects.manage',
    'memberships.read',
    'memberships.manage',
    'provisioning.manage',
    'integrations.read',
    'integrations.manage',
    'ingestion.read',
    'ingestion.manage',
    'data_quality.read',
    'data_quality.manage',
    'governance.read',
    'governance.manage',
    'audit.read',
    'security.read',
    'policies.read',
    'policies.manage',
    'settings.read',
    'settings.manage',
  ],
  project_engineer: [
    'system.read',
    'projects.read',
    'data_quality.read',
    'governance.read',
  ],
  read_only_stakeholder: [
    'system.read',
    'projects.read',
    'governance.read',
    'audit.read',
  ],
};

/**
 * Check if the user is authorized for a specific administrative permission.
 * Strictly denies by default if user is null or not platform_admin.
 */
export function canAdmin(
  user: CivoraUser | null | undefined,
  permission: AdminPermission
): boolean {
  if (!user || user.accountStatus !== 'active') {
    return false;
  }

  // Only platform_admin has administrative console management access
  if (user.role !== 'platform_admin') {
    return false;
  }

  const permissions = ADMIN_ROLE_PERMISSIONS[user.role] || [];
  return permissions.includes(permission);
}

/**
 * Check if a user has platform administrator role
 */
export function isPlatformAdmin(user: CivoraUser | null | undefined): boolean {
  return !!user && user.role === 'platform_admin' && user.accountStatus === 'active';
}
