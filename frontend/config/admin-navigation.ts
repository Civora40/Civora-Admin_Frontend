import { AdminPermission } from '@/types';

export interface AdminNavItem {
  id: string;
  name: string;
  href: string;
  iconName: string;
  permission: AdminPermission;
  badgeKey?: string;
  description?: string;
}

export interface AdminNavGroup {
  id: string;
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAVIGATION: AdminNavGroup[] = [
  {
    id: 'platform',
    title: 'Platform Operations',
    items: [
      {
        id: 'overview',
        name: 'Overview',
        href: '/admin',
        iconName: 'LayoutDashboard',
        permission: 'system.read',
        description: 'Platform metrics, alerts, and operational summary',
      },
      {
        id: 'system-health',
        name: 'System Health',
        href: '/admin/system-health',
        iconName: 'Activity',
        permission: 'system.read',
        description: 'Service status, job queues, errors, and telemetry',
      },
      {
        id: 'activity',
        name: 'Activity Feed',
        href: '/admin/activity',
        iconName: 'ScrollText',
        permission: 'audit.read',
        description: 'Recent auditable platform events across projects',
      },
      {
        id: 'notifications',
        name: 'Notifications',
        href: '/admin/notifications',
        iconName: 'Bell',
        permission: 'system.read',
        badgeKey: 'unreadNotifications',
        description: 'Administrative alerts and security warnings',
      },
    ],
  },
  {
    id: 'access-identity',
    title: 'Access & Identity',
    items: [
      {
        id: 'users',
        name: 'Users',
        href: '/admin/users',
        iconName: 'Users',
        permission: 'users.read',
        description: 'Search and manage platform accounts and status',
      },
      {
        id: 'roles',
        name: 'Roles & Permissions',
        href: '/admin/access/roles',
        iconName: 'ShieldCheck',
        permission: 'roles.read',
        description: 'Review role definitions and permission mappings',
      },
      {
        id: 'invitations',
        name: 'Invitations',
        href: '/admin/access/invitations',
        iconName: 'MailPlus',
        permission: 'invitations.read',
        badgeKey: 'pendingInvitations',
        description: 'Create, inspect, revoke, and resend invitations',
      },
      {
        id: 'reviews',
        name: 'Access Reviews',
        href: '/admin/access/reviews',
        iconName: 'UserCheck',
        permission: 'access_reviews.read',
        description: 'Review privileged access and inactive accounts',
      },
    ],
  },
  {
    id: 'organizations-projects',
    title: 'Organizations & Projects',
    items: [
      {
        id: 'organizations',
        name: 'Organizations',
        href: '/admin/organizations',
        iconName: 'Building2',
        permission: 'organizations.read',
        description: 'Manage contractor, client, and agency entities',
      },
      {
        id: 'projects',
        name: 'Projects',
        href: '/admin/projects',
        iconName: 'Briefcase',
        permission: 'projects.read',
        description: 'Browse registry, LASBCA permits, and active states',
      },
      {
        id: 'memberships',
        name: 'Memberships',
        href: '/admin/memberships',
        iconName: 'Network',
        permission: 'memberships.read',
        description: 'Inspect user assignments to organizations and sites',
      },
      {
        id: 'provisioning',
        name: 'Provisioning',
        href: '/admin/provisioning',
        iconName: 'Sparkles',
        permission: 'provisioning.manage',
        description: 'Structured onboarding wizard with audit trail',
      },
    ],
  },
  {
    id: 'integrations-data',
    title: 'Integrations & Data',
    items: [
      {
        id: 'messaging',
        name: 'Messaging Integrations',
        href: '/admin/integrations/messaging',
        iconName: 'MessageSquareShare',
        permission: 'integrations.read',
        description: 'WhatsApp Cloud API & Telegram Bot telemetry',
      },
      {
        id: 'ingestion',
        name: 'Ingestion Runs',
        href: '/admin/integrations/ingestion',
        iconName: 'ListOrdered',
        permission: 'ingestion.read',
        badgeKey: 'failedIngestionRuns',
        description: 'Monitor inbound message batches and duplicate traps',
      },
      {
        id: 'data-quality',
        name: 'Data Quality',
        href: '/admin/data-quality',
        iconName: 'AlertTriangle',
        permission: 'data_quality.read',
        badgeKey: 'qualityIssues',
        description: 'Unresolved identities, missing metadata, OCR flags',
      },
    ],
  },
  {
    id: 'governance',
    title: 'Governance & Audit',
    items: [
      {
        id: 'report-templates',
        name: 'Report Templates',
        href: '/admin/governance/report-templates',
        iconName: 'FileText',
        permission: 'governance.read',
        description: 'Approved COREN, LASBCA, and statutory A4 templates',
      },
      {
        id: 'audit-log',
        name: 'Audit Log',
        href: '/admin/governance/audit-log',
        iconName: 'FileCheck',
        permission: 'audit.read',
        description: 'Search immutable administrative change records',
      },
      {
        id: 'security-events',
        name: 'Security Events',
        href: '/admin/governance/security-events',
        iconName: 'ShieldAlert',
        permission: 'security.read',
        badgeKey: 'criticalSecurityEvents',
        description: 'Review privileged access and sign-in anomalies',
      },
      {
        id: 'policies',
        name: 'Retention & Policies',
        href: '/admin/governance/policies',
        iconName: 'SlidersHorizontal',
        permission: 'policies.read',
        description: 'Compliance thresholds and data retention policies',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    items: [
      {
        id: 'platform-settings',
        name: 'Platform Settings',
        href: '/admin/settings',
        iconName: 'Settings',
        permission: 'settings.manage',
        description: 'Global timeouts, compliance targets, and maintenance',
      },
      {
        id: 'branding-settings',
        name: 'Branding & Notifications',
        href: '/admin/settings/branding',
        iconName: 'Palette',
        permission: 'settings.manage',
        description: 'Watermarks, official logos, and notification templates',
      },
      {
        id: 'integration-settings',
        name: 'Integration Settings',
        href: '/admin/settings/integrations',
        iconName: 'Sliders',
        permission: 'settings.manage',
        description: 'Webhook endpoints, retry limits, and rate caps',
      },
    ],
  },
];
