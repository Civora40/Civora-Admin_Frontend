import { Project, ProjectApprovalStatus, ProjectStatus } from '@/types';

/**
 * Normalizes project payloads coming from Django `/api/v1/projects/`
 * or Admin fallback fixtures into the Admin Console `Project` shape.
 */
export function normalizeAdminProject(raw: Record<string, unknown>): Project {
  const status = String(raw.status || 'pending_approval') as ProjectStatus;
  const rawApproval = (raw.approvalStatus || raw.approval_status) as ProjectApprovalStatus | undefined;
  const derivedApproval: ProjectApprovalStatus =
    rawApproval ||
    (status === 'rejected'
      ? 'rejected'
      : status === 'active' || status === 'on_hold' || status === 'completed' || status === 'archived'
      ? 'approved'
      : 'pending_review');

  const isAdminApproved =
    typeof raw.isAdminApproved === 'boolean'
      ? raw.isAdminApproved
      : typeof raw.is_admin_approved === 'boolean'
      ? raw.is_admin_approved
      : derivedApproval === 'approved';

  const canAcceptFieldSubmissions =
    typeof raw.canAcceptFieldSubmissions === 'boolean'
      ? raw.canAcceptFieldSubmissions
      : typeof raw.can_accept_field_submissions === 'boolean'
      ? raw.can_accept_field_submissions
      : isAdminApproved && status === 'active';

  return {
    id: String(raw.id || ''),
    name: String(raw.name || ''),
    code: String(raw.code || ''),
    organizationId: String(raw.organizationId || raw.organization_id || raw.organization || ''),
    organizationName: String(raw.organizationName || raw.organization_name || 'Registered Tenant'),
    clientName: String(raw.clientName || raw.client_name || raw.client || ''),
    location: String(raw.location || ''),
    status,
    approvalStatus: derivedApproval,
    isAdminApproved,
    canAcceptFieldSubmissions,
    fieldSubmissionBlockReason:
      (raw.fieldSubmissionBlockReason as string | null | undefined) ??
      (raw.field_submission_block_reason as string | null | undefined) ??
      null,
    reviewedById: (raw.reviewedById as string | null | undefined) ?? null,
    reviewedByName: (raw.reviewedByName as string | null | undefined) ?? null,
    reviewedByEmail: (raw.reviewedByEmail as string | null | undefined) ?? null,
    reviewedAt: (raw.reviewedAt as string | null | undefined) ?? null,
    reviewNotes: String(raw.reviewNotes || raw.review_notes || ''),
    createdById: (raw.createdById as string | null | undefined) ?? null,
    createdByName: (raw.createdByName as string | null | undefined) ?? null,
    createdByEmail: (raw.createdByEmail as string | null | undefined) ?? null,
    specsReference: raw.specsReference ? String(raw.specsReference) : undefined,
    description: raw.description ? String(raw.description) : undefined,
    budgetFormatted: raw.budgetFormatted ? String(raw.budgetFormatted) : undefined,
    lasbcaPermitNumber: (raw.lasbcaPermitNumber || raw.lasbca_permit_number)
      ? String(raw.lasbcaPermitNumber || raw.lasbca_permit_number)
      : undefined,
    corenLeadEngineer: (raw.corenLeadEngineer || raw.leadEngineer || raw.lead_engineer_name)
      ? String(raw.corenLeadEngineer || raw.leadEngineer || raw.lead_engineer_name)
      : undefined,
    startDate: String(raw.startDate || ''),
    targetCompletionDate: String(raw.targetCompletionDate || raw.completionDate || ''),
    activeSubmissionsCount: Number(
      raw.activeSubmissionsCount ?? raw.submissionsCount ?? raw.submissions_count ?? 0
    ),
    activePersonnelCount: Number(
      raw.activePersonnelCount ?? (Array.isArray(raw.members) ? raw.members.length : 0)
    ),
    unresolvedFlagsCount: Number(raw.unresolvedFlagsCount ?? raw.pendingReviewsCount ?? 0),
    integrationsActive: Array.isArray(raw.integrationsActive)
      ? (raw.integrationsActive as string[])
      : Array.isArray(raw.submissionChannels)
      ? (raw.submissionChannels as string[])
      : [],
    contractSum: raw.contractSum
      ? String(raw.contractSum)
      : raw.budgetFormatted
      ? String(raw.budgetFormatted)
      : undefined,
    createdAt: String(raw.createdAt || raw.created_at || ''),
    updatedAt: String(raw.updatedAt || raw.updated_at || ''),
  };
}
