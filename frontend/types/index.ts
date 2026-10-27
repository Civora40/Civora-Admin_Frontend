export type UserRole = 'platform_admin' | 'project_engineer' | 'read_only_stakeholder';

export interface CivoraUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  assignedProjects: string[]; // Project IDs, or ['*'] for all
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  organization?: string;
  organizationId?: string;
  department?: string;
  phone?: string;
  timeZone?: string;
  corenNumber?: string;
  corenStatus?: 'verified' | 'pending' | 'unregistered';
  cacNumber?: string;
  accountStatus: 'active' | 'suspended' | 'pending';
  lastLoginAt?: string;
  createdAt?: string;
  permissions?: AdminPermission[];
  onboardingCompletedAt?: number | null;
}

export interface SessionData {
  user: CivoraUser;
  createdAt: number;
  expiresAt: number;
}

export type AdminPermission =
  | 'system.read'
  | 'users.read'
  | 'users.manage'
  | 'roles.read'
  | 'roles.manage'
  | 'invitations.read'
  | 'invitations.manage'
  | 'access_reviews.read'
  | 'organizations.read'
  | 'organizations.manage'
  | 'projects.read'
  | 'projects.manage'
  | 'memberships.read'
  | 'memberships.manage'
  | 'provisioning.manage'
  | 'integrations.read'
  | 'integrations.manage'
  | 'ingestion.read'
  | 'ingestion.manage'
  | 'data_quality.read'
  | 'data_quality.manage'
  | 'governance.read'
  | 'governance.manage'
  | 'audit.read'
  | 'security.read'
  | 'policies.read'
  | 'policies.manage'
  | 'settings.read'
  | 'settings.manage';

export type OrganizationTier = 'enterprise' | 'contractor' | 'consultancy' | 'government_agency';
export type OrganizationStatus = 'active' | 'inactive' | 'provisioning' | 'suspended';

export interface Organization {
  id: string;
  name: string;
  code: string;
  tier: OrganizationTier;
  status: OrganizationStatus;
  cacNumber?: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  activeProjectsCount: number;
  totalMembersCount: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export type ProjectStatus = 'active' | 'in_review' | 'completed' | 'on_hold' | 'archived';

export interface Project {
  id: string;
  name: string;
  code: string;
  organizationId: string;
  organizationName: string;
  clientName: string;
  location: string;
  status: ProjectStatus;
  lasbcaPermitNumber?: string;
  corenLeadEngineer?: string;
  startDate: string;
  targetCompletionDate: string;
  activeSubmissionsCount: number;
  activePersonnelCount: number;
  unresolvedFlagsCount: number;
  integrationsActive: string[];
  contractSum?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  organizationId: string;
  organizationName: string;
  assignedProjectIds: string[];
  assignedProjectNames: string[];
  accessLevel: 'full_admin' | 'project_lead' | 'technical_reviewer' | 'auditor';
  grantedAt: string;
  grantedBy: string;
  status: 'active' | 'revoked' | 'temporary';
}

export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  invitationCode: string;
  assignedProjects: string[];
}

export interface AccessReviewRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: UserRole;
  organization: string;
  privilegedPermissions: string[];
  lastLoginAt: string;
  daysSinceLastActivity: number;
  complianceStatus: 'compliant' | 'flagged' | 'requires_revalidation';
  flaggedReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export type SourceChannel = 'whatsapp' | 'telegram' | 'web_portal' | 'email';

export interface IngestionRun {
  id: string;
  channel: SourceChannel;
  batchReference: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  status: 'success' | 'partial_failure' | 'failed' | 'in_progress';
  totalMessagesIngested: number;
  duplicatesBlocked: number;
  unresolvedSenders: number;
  mediaProcessingFailures: number;
  retryAttempts: number;
  errorLogSnippet?: string;
}

export interface ChannelTelemetry {
  channel: SourceChannel;
  name: string;
  status: 'operational' | 'degraded' | 'disconnected';
  identifier: string; // Phone number or Bot handle
  webhookStatus: 'healthy' | 'latency_warning' | 'error';
  lastPingAt: string;
  totalProcessed24h: number;
  duplicatesBlocked24h: number;
  failureRate24h: number; // percentage
  allowedChatOrGroupCount: number;
}

export type QualitySeverity = 'critical' | 'high' | 'medium' | 'low';

export interface DataQualityIssue {
  id: string;
  code: string;
  severity: QualitySeverity;
  category: 'unverified_identity' | 'missing_metadata' | 'duplicate_hash' | 'ocr_failure' | 'spec_mismatch';
  title: string;
  description: string;
  affectedSource: string;
  affectedProject: string;
  detectedAt: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  suggestedAction: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  ipAddress: string;
  action: string;
  category: 'authentication' | 'access_control' | 'organization' | 'project' | 'integration' | 'policy' | 'system' | 'security';
  targetResource: string;
  targetId: string;
  description: string;
  outcome: 'success' | 'denied' | 'failure';
  metadata?: Record<string, unknown>;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'suspicious_login' | 'privilege_escalation_attempt' | 'brute_force' | 'token_reuse' | 'ip_anomaly';
  actorIdentifier: string;
  ipAddress: string;
  geoSummary: string;
  description: string;
  status: 'open' | 'mitigated' | 'resolved' | 'false_positive';
  actionTaken?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  code: string;
  version: string;
  framework: 'COREN' | 'LASBCA' | 'FIDIC_RED' | 'CIVORA_ASSURANCE';
  description: string;
  status: 'approved' | 'in_review' | 'deprecated';
  paperFormat: 'A4_PORTRAIT' | 'A3_LANDSCAPE';
  mandatorySectionsCount: number;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export interface SystemServiceHealth {
  id: string;
  name: string;
  category: 'core' | 'database' | 'queue' | 'ai_inference' | 'storage' | 'telecom';
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime90d: number;
  latencyMs: number;
  lastIncident?: string;
  message?: string;
}

export interface PlatformNotification {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  category: 'security' | 'ingestion' | 'governance' | 'compliance';
  timestamp: string;
  read: boolean;
  linkHref?: string;
}

export interface PlatformSettings {
  platformName: string;
  enforceMfaForAdmins: boolean;
  sessionTimeoutMinutes: number;
  defaultComplianceThreshold: number; // 75 or 80
  retentionPeriodDays: number;
  allowSelfRegistration: boolean;
  maintenanceMode: boolean;
  ingestionRateLimitPerMinute: number;
  notificationEmailDigest: boolean;
  disclaimerText: string;
}
