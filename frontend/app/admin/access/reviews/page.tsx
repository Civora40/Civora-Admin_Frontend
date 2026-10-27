'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { AccessReviewRecord } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, ColumnDef } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog';

export default function AccessReviewsPage() {
  const [reviews, setReviews] = useState<AccessReviewRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Certify confirmation state
  const [targetId, setTargetId] = useState<string | null>(null);
  const [isCertifyOpen, setIsCertifyOpen] = useState(false);
  const [isCertifying, setIsCertifying] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const data = await AdminService.getAccessReviews();
    setReviews(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCertify = async () => {
    if (!targetId) return;
    setIsCertifying(true);
    try {
      await AdminService.markReviewCompliant(targetId);
      await loadData();
      setIsCertifyOpen(false);
      setTargetId(null);
    } finally {
      setIsCertifying(false);
    }
  };

  const columns: ColumnDef<AccessReviewRecord>[] = [
    {
      id: 'user',
      header: 'Account & Identity',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.userName}</p>
          <p className="text-xs text-slate-500">{row.userEmail}</p>
          <p className="text-[11px] text-slate-400">{row.organization}</p>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Assigned Role',
      sortable: true,
      cell: (row) => (
        <span className="capitalize font-semibold text-xs text-slate-700">
          {row.role.replace('_', ' ')}
        </span>
      ),
    },
    {
      id: 'privilegedPermissions',
      header: 'Privileged Scopes',
      cell: (row) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {row.privilegedPermissions.map((perm, i) => (
            <span
              key={i}
              className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700"
            >
              {perm}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'lastLoginAt',
      header: 'Last Login Activity',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="text-xs text-slate-700">
            {new Date(row.lastLoginAt).toLocaleDateString()}
          </p>
          <p
            className={`text-[11px] font-medium ${
              row.daysSinceLastActivity > 60 ? 'text-rose-600' : 'text-slate-400'
            }`}
          >
            {row.daysSinceLastActivity === 0
              ? 'Active today'
              : `${row.daysSinceLastActivity} days ago`}
          </p>
        </div>
      ),
    },
    {
      id: 'complianceStatus',
      header: 'Audit Compliance',
      sortable: true,
      cell: (row) => <StatusBadge status={row.complianceStatus} size="sm" />,
    },
    {
      id: 'actions',
      header: 'Certification',
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end">
          {row.complianceStatus !== 'compliant' ? (
            <button
              type="button"
              onClick={() => {
                setTargetId(row.id);
                setIsCertifyOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#3B68DE] hover:text-[#2e54b8] px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Certify</span>
            </button>
          ) : (
            <span className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Certified
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Privileged Access Reviews & Security Hygiene"
        description="Statutory security audits verifying high-privilege reviewer and administrative capabilities."
        breadcrumbs={[
          { label: 'Access & Identity', href: '/admin/users' },
          { label: 'Access Reviews' },
        ]}
      />

      {/* Review Guidelines Notice */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3B68DE] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-900 text-sm">
            Quarterly Access Certification Policy
          </p>
          <p>
            Accounts with dormant activity exceeding 60 days are automatically flagged. Platform administrators must manually inspect project assignments and certify ongoing business necessity to preserve reviewer credentials.
          </p>
        </div>
      </div>

      {/* Main Review Table */}
      <DataTable
        data={reviews as unknown as Record<string, unknown>[]}
        columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
        keyExtractor={(row) => (row as unknown as AccessReviewRecord).id}
        searchPlaceholder="Search access reviews by user or organization..."
        isLoading={isLoading}
      />

      {/* Certification Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isCertifyOpen}
        onClose={() => {
          setIsCertifyOpen(false);
          setTargetId(null);
        }}
        onConfirm={handleCertify}
        title="Certify Privileged Access Authorization?"
        description="You are officially certifying that this account satisfies statutory compliance requirements and has legitimate business justification to retain high-privilege engineering reviewer authority."
        confirmLabel="Certify Compliance"
        variant="primary"
        isLoading={isCertifying}
      />
    </div>
  );
}
