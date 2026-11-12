'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Clock,
  Lock,
  X,
  XCircle,
  MessageSquareWarning,
  FileCheck2,
  Building2,
} from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { Project } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, ColumnDef } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { FilterBar } from '@/components/admin/FilterBar';
import { Button } from '@/components/ui/Button';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Review Modal state
  const [reviewingProject, setReviewingProject] = useState<Project | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const data = await AdminService.getProjects();
    setProjects(data);
    setIsLoading(false);
  };

  useEffect(() => {
    const queryStatus =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('status')
        : null;
    if (queryStatus) {
      setStatusFilter(queryStatus);
    }
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const pendingApprovalCount = projects.filter(
    (p) => p.approvalStatus === 'pending_review' || p.status === 'pending_approval'
  ).length;

  const filtered = projects.filter((p) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending_approval') {
      return p.status === 'pending_approval' || p.approvalStatus === 'pending_review';
    }
    if (statusFilter === 'changes_requested') {
      return p.approvalStatus === 'changes_requested';
    }
    return p.status === statusFilter;
  });

  const handleOpenReview = (project: Project) => {
    setReviewingProject(project);
    setReviewNotes(project.reviewNotes || '');
    setReviewError(null);
  };

  const handleReviewDecision = async (decision: 'approve' | 'request_changes' | 'reject') => {
    if (!reviewingProject) return;
    if ((decision === 'request_changes' || decision === 'reject') && !reviewNotes.trim()) {
      setReviewError('Please enter review notes explaining the requested changes or rejection reason.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewError(null);
    try {
      const updated = await AdminService.reviewProject(reviewingProject.id, {
        decision,
        notes: reviewNotes.trim(),
        targetStatus: decision === 'approve' ? 'active' : undefined,
      });

      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setReviewingProject(null);
      setReviewNotes('');
      const label =
        decision === 'approve'
          ? `Approved ${updated.code} — field submissions are now unlocked.`
          : decision === 'request_changes'
          ? `Requested changes on ${updated.code} and notified the engineer.`
          : `Rejected ${updated.code}; field submissions remain blocked.`;
      showToast(label);
    } catch (err: unknown) {
      setReviewError((err as Error)?.message || 'Failed to submit administrative review decision.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const columns: ColumnDef<Project>[] = [
    {
      id: 'name',
      header: 'Project Title & Registry',
      sortable: true,
      cell: (row) => (
        <div className="space-y-0.5">
          <p className="font-bold text-slate-900 leading-snug">{row.name}</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
            <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded font-semibold text-slate-600">
              {row.code}
            </span>
            <span className="flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              {row.location}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'organizationName',
      header: 'Organization & Client',
      sortable: true,
      cell: (row) => (
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-slate-800">{row.organizationName}</p>
          <p className="text-[11px] text-slate-500">Client: {row.clientName}</p>
        </div>
      ),
    },
    {
      id: 'lasbcaPermitNumber',
      header: 'Regulatory & Lead Engr',
      cell: (row) => (
        <div className="text-xs space-y-0.5">
          {row.lasbcaPermitNumber ? (
            <p className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block">
              {row.lasbcaPermitNumber}
            </p>
          ) : (
            <span className="text-slate-400 text-[11px]">Permit Pending</span>
          )}
          {(row.corenLeadEngineer || row.createdByName) && (
            <p className="text-[11px] text-slate-600 truncate max-w-[180px]">
              {row.corenLeadEngineer || row.createdByName}
            </p>
          )}
        </div>
      ),
    },
    {
      id: 'approvalStatus',
      header: 'Admin Review & Field Gate',
      sortable: true,
      cell: (row) => (
        <div className="space-y-1">
          <StatusBadge
            status={row.approvalStatus || (row.isAdminApproved ? 'approved' : 'pending_review')}
            size="sm"
          />
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            {row.canAcceptFieldSubmissions ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Submissions Active ({row.activeSubmissionsCount})</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Submissions Locked</span>
              </>
            )}
          </p>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Lifecycle Status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      id: 'actions',
      header: 'Governance Action',
      cell: (row) => {
        const needsReview =
          row.approvalStatus === 'pending_review' ||
          row.status === 'pending_approval' ||
          !row.isAdminApproved;
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenReview(row);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              needsReview
                ? 'bg-[#001237] hover:bg-[#18243D] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#4FAAA7]" />
            <span>{needsReview ? 'Review & Approve' : 'Inspect / Update'}</span>
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#001237] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#4FAAA7]/50 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-[#4FAAA7]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <AdminPageHeader
        title="Infrastructure Projects Registry"
        description="Review engineer-submitted projects, verify LASBCA permits & specifications, and authorize field submissions."
        breadcrumbs={[
          { label: 'Organizations & Projects', href: '/admin/organizations' },
          { label: 'Projects' },
        ]}
        actions={
          <Button
            href="/admin/provisioning"
            variant="primary"
            size="sm"
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Provision New Project
          </Button>
        }
      />

      {/* Pending Administrator Review Banner */}
      {pendingApprovalCount > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-950">
                {pendingApprovalCount} Project{pendingApprovalCount === 1 ? '' : 's'} Pending Administrator Review
              </h2>
              <p className="text-xs text-amber-900/90 mt-0.5">
                Engineer-created projects cannot transition to active field operations or receive WhatsApp, Telegram, or portal submissions until approved here.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStatusFilter('pending_approval')}
            className="shrink-0 px-3.5 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Show Pending Queue ({pendingApprovalCount})
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        filters={[
          {
            id: 'status',
            label: 'Project Status',
            value: statusFilter,
            options: [
              { label: 'All Project States', value: 'all' },
              { label: `Pending Admin Approval (${pendingApprovalCount})`, value: 'pending_approval' },
              { label: 'Changes Requested', value: 'changes_requested' },
              { label: 'Active Field Operations', value: 'active' },
              { label: 'Setup / Planning', value: 'setup' },
              { label: 'Draft', value: 'draft' },
              { label: 'Rejected', value: 'rejected' },
              { label: 'Completed Infrastructure', value: 'completed' },
            ],
            onChange: setStatusFilter,
          },
        ]}
        onReset={() => setStatusFilter('all')}
      />

      {/* Main Projects Table */}
      <DataTable
        data={filtered as unknown as Record<string, unknown>[]}
        columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
        keyExtractor={(row) => (row as unknown as Project).id}
        searchPlaceholder="Search projects by name, code, organization, or permit..."
        isLoading={isLoading}
      />

      {/* Platform Administrator Project Review & Approval Modal */}
      {reviewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001237]/65 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold bg-[#001237] text-[#4FAAA7] px-2 py-0.5 rounded">
                    {reviewingProject.code}
                  </span>
                  <StatusBadge
                    status={reviewingProject.approvalStatus || 'pending_review'}
                    size="sm"
                  />
                </div>
                <h3 className="text-lg font-bold text-[#001237]">
                  {reviewingProject.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{reviewingProject.organizationName} &bull; Client: {reviewingProject.clientName}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewingProject(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reviewError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{reviewError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  LASBCA / Statutory Permit
                </span>
                <span className="font-mono font-semibold text-slate-900">
                  {reviewingProject.lasbcaPermitNumber || 'Not provided'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Submitted By / Lead Engineer
                </span>
                <span className="font-semibold text-slate-900">
                  {reviewingProject.createdByName || reviewingProject.corenLeadEngineer || 'Project Engineer'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Governing Standards & Location
                </span>
                <p className="text-slate-800 font-medium mt-0.5">
                  {reviewingProject.specsReference || 'Standard Engineering Specifications'} &mdash;{' '}
                  {reviewingProject.location}
                </p>
              </div>
              {reviewingProject.description && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Project Scope Description
                  </span>
                  <p className="text-slate-700 mt-0.5 leading-relaxed">
                    {reviewingProject.description}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">
                Administrator Review Notes / Conditions
              </label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter approval remarks, compliance checks, or specific items to fix before approval (required when rejecting or requesting changes)..."
                className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-[#001237] focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSubmittingReview}
                  onClick={() => handleReviewDecision('reject')}
                  className="px-3 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  type="button"
                  disabled={isSubmittingReview}
                  onClick={() => handleReviewDecision('request_changes')}
                  className="px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <MessageSquareWarning className="w-3.5 h-3.5" />
                  <span>Request Changes</span>
                </button>
              </div>

              <button
                type="button"
                disabled={isSubmittingReview}
                onClick={() => handleReviewDecision('approve')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>
                  {isSubmittingReview ? 'Processing...' : 'Approve for Field Submissions'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
