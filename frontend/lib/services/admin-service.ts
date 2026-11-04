import {
  CivoraUser,
  Organization,
  Project,
  MembershipRecord,
  UserInvitation,
  AccessReviewRecord,
  IngestionRun,
  ChannelTelemetry,
  DataQualityIssue,
  AuditLogEntry,
  SecurityEvent,
  ReportTemplate,
  SystemServiceHealth,
  PlatformNotification,
  PlatformSettings,
} from '../../types';
import { fetchBackend } from '../api/backend-client';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_ORGANIZATIONS,
  INITIAL_PROJECTS,
  INITIAL_MEMBERSHIPS,
  INITIAL_INVITATIONS,
  INITIAL_ACCESS_REVIEWS,
  INITIAL_CHANNEL_TELEMETRY,
  INITIAL_INGESTION_RUNS,
  INITIAL_DATA_QUALITY_ISSUES,
  INITIAL_AUDIT_LOG,
  INITIAL_SECURITY_EVENTS,
  INITIAL_REPORT_TEMPLATES,
  INITIAL_SYSTEM_HEALTH,
  INITIAL_NOTIFICATIONS,
  INITIAL_PLATFORM_SETTINGS,
} from '../mock-data/admin-data';

async function getAdminAccessToken(): Promise<string | undefined> {
  try {
    if (typeof window !== 'undefined') {
      const cached = window.sessionStorage.getItem('civora_admin_token');
      if (cached) return cached;
      return undefined;
    }
    return (globalThis as Record<string, unknown>).__civoraAdminAccessToken as string | undefined;
  } catch {
    return undefined;
  }
}

// In-memory runtime state for mutations during dev/demo sessions
const users: CivoraUser[] = [...INITIAL_ADMIN_USERS];
const organizations: Organization[] = [...INITIAL_ORGANIZATIONS];
const projects: Project[] = [...INITIAL_PROJECTS];
let memberships: MembershipRecord[] = [...INITIAL_MEMBERSHIPS];
const invitations: UserInvitation[] = [...INITIAL_INVITATIONS];
const accessReviews: AccessReviewRecord[] = [...INITIAL_ACCESS_REVIEWS];
const ingestionRuns: IngestionRun[] = [...INITIAL_INGESTION_RUNS];
const channelTelemetry: ChannelTelemetry[] = [...INITIAL_CHANNEL_TELEMETRY];
const qualityIssues: DataQualityIssue[] = [...INITIAL_DATA_QUALITY_ISSUES];
const auditLog: AuditLogEntry[] = [...INITIAL_AUDIT_LOG];
const securityEvents: SecurityEvent[] = [...INITIAL_SECURITY_EVENTS];
const reportTemplates: ReportTemplate[] = [...INITIAL_REPORT_TEMPLATES];
const systemHealth: SystemServiceHealth[] = [...INITIAL_SYSTEM_HEALTH];
const notifications: PlatformNotification[] = [...INITIAL_NOTIFICATIONS];
let settings: PlatformSettings = { ...INITIAL_PLATFORM_SETTINGS };

export interface OverviewMetrics {
  totalUsers: number;
  activeUsers: number;
  totalOrganizations: number;
  activeProjects: number;
  systemHealthStatus: 'healthy' | 'degraded' | 'critical';
  healthyServicesCount: number;
  totalServicesCount: number;
  messagesIngested24h: number;
  duplicatesBlocked24h: number;
  openQualityFlags: number;
  criticalSecurityEvents: number;
  unreadNotifications: number;
  pendingInvitations: number;
}

export const AdminService = {
  // Overview
  async getOverviewMetrics(): Promise<OverviewMetrics> {
    const [allUsers, allOrgs, allProjects, allInvitations, allNotifs] = await Promise.all([
      this.getUsers(),
      this.getOrganizations(),
      this.getProjects(),
      this.getInvitations(),
      this.getNotifications(),
    ]);

    const healthyServices = systemHealth.filter((s) => s.status === 'healthy').length;
    const anyDegraded = systemHealth.some((s) => s.status === 'degraded');
    const anyUnhealthy = systemHealth.some((s) => s.status === 'unhealthy');

    const totalIngested = channelTelemetry.reduce((acc, curr) => acc + curr.totalProcessed24h, 0);
    const totalDuplicates = channelTelemetry.reduce((acc, curr) => acc + curr.duplicatesBlocked24h, 0);

    return {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter((u) => u.accountStatus === 'active').length,
      totalOrganizations: allOrgs.length,
      activeProjects: allProjects.filter((p) => p.status === 'active').length,
      systemHealthStatus: anyUnhealthy ? 'critical' : anyDegraded ? 'degraded' : 'healthy',
      healthyServicesCount: healthyServices,
      totalServicesCount: systemHealth.length,
      messagesIngested24h: totalIngested,
      duplicatesBlocked24h: totalDuplicates,
      openQualityFlags: qualityIssues.filter((q) => q.status === 'open' || q.status === 'investigating').length,
      criticalSecurityEvents: securityEvents.filter((s) => s.severity === 'critical' && s.status === 'open').length,
      unreadNotifications: allNotifs.filter((n) => !n.read).length,
      pendingInvitations: allInvitations.filter((i) => i.status === 'pending').length,
    };
  },

  // Users
  async getUsers(): Promise<CivoraUser[]> {
    const token = await getAdminAccessToken();
    if (token) {
      const res = await fetchBackend<CivoraUser[]>('/users/', { accessToken: token });
      if (res.ok && Array.isArray(res.data)) {
        return res.data;
      }
    }
    return [...users];
  },

  async getUserById(id: string): Promise<CivoraUser | undefined> {
    const allUsers = await this.getUsers();
    return allUsers.find((u) => u.id === id);
  },

  async toggleUserStatus(id: string, actorEmail: string = 'admin@civora.internal'): Promise<CivoraUser> {
    const token = await getAdminAccessToken();
    if (token) {
      const res = await fetchBackend<CivoraUser>(`/users/${id}/toggle-status/`, {
        method: 'POST',
        accessToken: token,
      });
      if (res.ok && res.data) {
        return res.data;
      }
    }

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) throw new Error(`User ${id} not found`);

    const user = users[userIndex];
    const newStatus: 'active' | 'suspended' = user.accountStatus === 'active' ? 'suspended' : 'active';
    const updatedUser: CivoraUser = { ...user, accountStatus: newStatus };
    users[userIndex] = updatedUser;

    // Record audit event
    auditLog.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: 'usr_adm_01',
      actorName: 'Platform Administrator',
      actorEmail,
      actorRole: 'platform_admin',
      ipAddress: '102.89.44.18',
      action: newStatus === 'suspended' ? 'USER_ACCOUNT_SUSPENDED' : 'USER_ACCOUNT_REACTIVATED',
      category: 'access_control',
      targetResource: 'CivoraUser',
      targetId: id,
      description: `Administrative status toggle on ${user.email} -> ${newStatus.toUpperCase()}`,
      outcome: 'success',
    });

    return updatedUser;
  },

  // Organizations
  async getOrganizations(): Promise<Organization[]> {
    const token = await getAdminAccessToken();
    if (token) {
      const res = await fetchBackend<Organization[]>('/organizations/', { accessToken: token });
      if (res.ok && Array.isArray(res.data)) {
        return res.data;
      }
    }
    return [...organizations];
  },

  async getOrganizationById(id: string): Promise<Organization | undefined> {
    const allOrgs = await this.getOrganizations();
    return allOrgs.find((o) => o.id === id);
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const token = await getAdminAccessToken();
    if (token) {
      const res = await fetchBackend<Project[]>('/projects/', { accessToken: token });
      if (res.ok && Array.isArray(res.data)) {
        return res.data;
      }
    }
    return [...projects];
  },

  async getProjectById(id: string): Promise<Project | undefined> {
    const allProjects = await this.getProjects();
    return allProjects.find((p) => p.id === id);
  },

  // Memberships
  async getMemberships(): Promise<MembershipRecord[]> {
    const token = await getAdminAccessToken();
    if (token) {
      const res = await fetchBackend<MembershipRecord[]>('/organizations/memberships/', {
        accessToken: token,
      });
      if (res.ok && Array.isArray(res.data)) {
        return res.data;
      }
    }
    return [...memberships];
  },

  async revokeMembership(id: string, actorEmail: string = 'admin@civora.internal'): Promise<void> {
    const token = await getAdminAccessToken();
    if (token) {
      const res = await fetchBackend(`/organizations/memberships/${id}/`, {
        method: 'DELETE',
        accessToken: token,
      });
      if (res.ok) {
        return;
      }
    }

    const item = memberships.find((m) => m.id === id);
    memberships = memberships.filter((m) => m.id !== id);

    auditLog.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: 'usr_adm_01',
      actorName: 'Platform Administrator',
      actorEmail,
      actorRole: 'platform_admin',
      ipAddress: '102.89.44.18',
      action: 'MEMBERSHIP_REVOKED',
      category: 'access_control',
      targetResource: 'MembershipRecord',
      targetId: id,
      description: `Revoked access level for ${item?.userName || id}`,
      outcome: 'success',
    });
  },

  // Invitations
  async getInvitations(): Promise<UserInvitation[]> {
    const token = await getAdminAccessToken();
    if (token) {
      const res = await fetchBackend<UserInvitation[]>('/organizations/invitations/', {
        accessToken: token,
      });
      if (res.ok && Array.isArray(res.data)) {
        return res.data;
      }
    }
    return [...invitations];
  },

  async createInvitation(
    data: Omit<UserInvitation, 'id' | 'invitedAt' | 'expiresAt' | 'status' | 'invitationCode'>,
    actorEmail: string = 'admin@civora.internal'
  ): Promise<UserInvitation> {
    const token = await getAdminAccessToken();
    if (token) {
      const res = await fetchBackend<UserInvitation>('/organizations/invitations/', {
        method: 'POST',
        accessToken: token,
        body: data,
      });
      if (res.ok && res.data) {
        return res.data;
      }
    }

    const newInv: UserInvitation = {
      ...data,
      id: `inv_${Date.now()}`,
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      invitationCode: `CIV-INV-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    invitations.unshift(newInv);

    auditLog.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: 'usr_adm_01',
      actorName: 'Platform Administrator',
      actorEmail,
      actorRole: 'platform_admin',
      ipAddress: '102.89.44.18',
      action: 'INVITATION_ISSUED',
      category: 'access_control',
      targetResource: 'UserInvitation',
      targetId: newInv.id,
      description: `Issued invitation to ${data.email} as ${data.role}`,
      outcome: 'success',
    });

    return newInv;
  },

  async revokeInvitation(id: string, actorEmail: string = 'admin@civora.internal'): Promise<void> {
    const token = await getAdminAccessToken();
    if (token) {
      const res = await fetchBackend(`/organizations/invitations/${id}/revoke/`, {
        method: 'POST',
        accessToken: token,
      });
      if (res.ok) {
        return;
      }
    }

    const inv = invitations.find((i) => i.id === id);
    if (inv) {
      inv.status = 'revoked';
      auditLog.unshift({
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: 'usr_adm_01',
        actorName: 'Platform Administrator',
        actorEmail,
        actorRole: 'platform_admin',
        ipAddress: '102.89.44.18',
        action: 'INVITATION_REVOKED',
        category: 'access_control',
        targetResource: 'UserInvitation',
        targetId: id,
        description: `Revoked pending invitation for ${inv.email}`,
        outcome: 'success',
      });
    }
  },

  // Access Reviews
  async getAccessReviews(): Promise<AccessReviewRecord[]> {
    return [...accessReviews];
  },

  async markReviewCompliant(id: string, reviewerName: string = 'Amina Bello, FNSE'): Promise<void> {
    const review = accessReviews.find((r) => r.id === id);
    if (review) {
      review.complianceStatus = 'compliant';
      review.reviewedAt = new Date().toISOString();
      review.reviewedBy = reviewerName;

      auditLog.unshift({
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: 'usr_adm_02',
        actorName: reviewerName,
        actorEmail: 'amina.bello@civora.internal',
        actorRole: 'platform_admin',
        ipAddress: '197.210.8.92',
        action: 'ACCESS_REVIEW_COMPLETED',
        category: 'access_control',
        targetResource: 'AccessReviewRecord',
        targetId: id,
        description: `Validated privileged permissions for ${review.userName}`,
        outcome: 'success',
      });
    }
  },

  // Messaging & Ingestion
  async getChannelTelemetry(): Promise<ChannelTelemetry[]> {
    return [...channelTelemetry];
  },

  async getIngestionRuns(): Promise<IngestionRun[]> {
    return [...ingestionRuns];
  },

  async retryIngestionRun(runId: string): Promise<IngestionRun> {
    const run = ingestionRuns.find((r) => r.id === runId);
    if (!run) throw new Error('Run not found');

    run.status = 'success';
    run.retryAttempts += 1;
    run.mediaProcessingFailures = 0;

    auditLog.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: 'usr_adm_01',
      actorName: 'Platform Administrator',
      actorEmail: 'admin@civora.internal',
      actorRole: 'platform_admin',
      ipAddress: '102.89.44.18',
      action: 'INGESTION_MANUAL_RETRY_SUCCESS',
      category: 'integration',
      targetResource: 'IngestionRun',
      targetId: runId,
      description: `Dispatched media processing retry on batch ${run.batchReference}`,
      outcome: 'success',
    });

    return run;
  },

  // Data Quality
  async getDataQualityIssues(): Promise<DataQualityIssue[]> {
    return [...qualityIssues];
  },

  async resolveQualityIssue(id: string): Promise<void> {
    const issue = qualityIssues.find((q) => q.id === id);
    if (issue) {
      issue.status = 'resolved';
      auditLog.unshift({
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: 'usr_adm_01',
        actorName: 'Platform Administrator',
        actorEmail: 'admin@civora.internal',
        actorRole: 'platform_admin',
        ipAddress: '102.89.44.18',
        action: 'DATA_QUALITY_ISSUE_RESOLVED',
        category: 'project',
        targetResource: 'DataQualityIssue',
        targetId: id,
        description: `Marked issue ${issue.code} (${issue.title}) as resolved`,
        outcome: 'success',
      });
    }
  },

  // Governance & Audit
  async getAuditLogs(): Promise<AuditLogEntry[]> {
    const token = await getAdminAccessToken();
    if (token) {
      const res = await fetchBackend<AuditLogEntry[]>('/audit/', { accessToken: token });
      if (res.ok && Array.isArray(res.data)) {
        return res.data;
      }
    }
    return [...auditLog];
  },

  async getSecurityEvents(): Promise<SecurityEvent[]> {
    return [...securityEvents];
  },

  async resolveSecurityEvent(id: string): Promise<void> {
    const ev = securityEvents.find((s) => s.id === id);
    if (ev) {
      ev.status = 'resolved';
      ev.actionTaken = 'Administrative review completed and threat mitigated.';
    }
  },

  async getReportTemplates(): Promise<ReportTemplate[]> {
    const token = await getAdminAccessToken();
    if (token) {
      const res = await fetchBackend<ReportTemplate[]>('/reports/templates/', {
        accessToken: token,
      });
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    }
    return [...reportTemplates];
  },

  // System Health
  async getSystemServiceHealth(): Promise<SystemServiceHealth[]> {
    return [...systemHealth];
  },

  // Notifications
  async getNotifications(): Promise<PlatformNotification[]> {
    const token = await getAdminAccessToken();
    if (token) {
      const res = await fetchBackend<{ notifications?: PlatformNotification[] }>(
        '/notifications/?scope=all',
        { accessToken: token }
      );
      if (res.ok && res.data && Array.isArray(res.data.notifications) && res.data.notifications.length > 0) {
        return res.data.notifications;
      }
    }
    return [...notifications];
  },

  async markNotificationAsRead(id: string): Promise<void> {
    const token = await getAdminAccessToken();
    if (token) {
      await fetchBackend('/notifications/', {
        method: 'POST',
        accessToken: token,
        body: { action: 'mark_read', notificationId: id },
      });
    }
    const n = notifications.find((item) => item.id === id);
    if (n) n.read = true;
  },

  async markAllNotificationsAsRead(): Promise<void> {
    const token = await getAdminAccessToken();
    if (token) {
      await fetchBackend('/notifications/', {
        method: 'POST',
        accessToken: token,
        body: { action: 'mark_all_read' },
      });
    }
    notifications.forEach((n) => (n.read = true));
  },

  // Settings
  async getPlatformSettings(): Promise<PlatformSettings> {
    return { ...settings };
  },

  async updatePlatformSettings(updates: Partial<PlatformSettings>): Promise<PlatformSettings> {
    settings = { ...settings, ...updates };

    auditLog.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: 'usr_adm_01',
      actorName: 'Platform Administrator',
      actorEmail: 'admin@civora.internal',
      actorRole: 'platform_admin',
      ipAddress: '102.89.44.18',
      action: 'PLATFORM_SETTINGS_UPDATED',
      category: 'system',
      targetResource: 'PlatformSettings',
      targetId: 'global_config',
      description: `Updated platform settings: ${Object.keys(updates).join(', ')}`,
      outcome: 'success',
    });

    return { ...settings };
  },
};
