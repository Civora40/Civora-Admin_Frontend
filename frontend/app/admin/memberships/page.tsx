'use client';

import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { MembershipRecord } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, ColumnDef } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog';

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<MembershipRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Revoke modal state
  const [selectedRecord, setSelectedRecord] = useState<MembershipRecord | null>(null);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const data = await AdminService.getMemberships();
    setMemberships(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRevoke = async () => {
    if (!selectedRecord) return;
    setIsRevoking(true);
    try {
      await AdminService.revokeMembership(selectedRecord.id);
      await loadData();
      setIsRevokeOpen(false);
      setSelectedRecord(null);
    } finally {
      setIsRevoking(false);
    }
  };

  const columns: ColumnDef<MembershipRecord>[] = [
    {
      id: 'userName',
      header: 'Assigned User Identity',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.userName}</p>
          <p className="text-xs text-slate-500">{row.userEmail}</p>
        </div>
      ),
    },
    {
      id: 'organizationName',
      header: 'Affiliated Organization',
      sortable: true,
      cell: (row) => (
        <span className="font-semibold text-slate-800">{row.organizationName}</span>
      ),
    },
    {
      id: 'assignedProjectNames',
      header: 'Scoped Project Access',
      cell: (row) => (
        <div className="flex flex-wrap gap-1 max-w-sm">
          {row.assignedProjectNames.map((proj, i) => (
            <span
              key={i}
              className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200"
            >
              {proj}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'accessLevel',
      header: 'Authorized Access Level',
      sortable: true,
      cell: (row) => {
        const labels: Record<string, { label: string; variant: 'blue' | 'teal' | 'slate' }> = {
          full_admin: { label: 'Platform SuperAdmin', variant: 'blue' },
          project_lead: { label: 'Lead Resident Engineer', variant: 'teal' },
          technical_reviewer: { label: 'Technical Reviewer', variant: 'teal' },
          auditor: { label: 'Statutory Auditor', variant: 'slate' },
        };
        const l = labels[row.accessLevel] || { label: row.accessLevel, variant: 'slate' };
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
              l.variant === 'blue'
                ? 'bg-[#3B68DE]/15 text-[#3B68DE]'
                : l.variant === 'teal'
                ? 'bg-[#4FAAA7]/15 text-teal-900'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {l.label}
          </span>
        );
      },
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end">
          {row.accessLevel !== 'full_admin' && (
            <button
              type="button"
              onClick={() => {
                setSelectedRecord(row);
                setIsRevokeOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Revoke Access</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Memberships & Project Scope Assignments"
        description="Inspect and manage specific user-to-project authorization boundaries and role privileges."
        breadcrumbs={[
          { label: 'Organizations & Projects', href: '/admin/organizations' },
          { label: 'Memberships' },
        ]}
      />

      <DataTable
        data={memberships as unknown as Record<string, unknown>[]}
        columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
        keyExtractor={(row) => (row as unknown as MembershipRecord).id}
        searchPlaceholder="Search memberships by user or organization..."
        isLoading={isLoading}
      />

      <ConfirmationDialog
        isOpen={isRevokeOpen}
        onClose={() => {
          setIsRevokeOpen(false);
          setSelectedRecord(null);
        }}
        onConfirm={handleRevoke}
        title={`Revoke project scope for ${selectedRecord?.userName}?`}
        description="This will instantly evict the user from the assigned construction project workspaces and generate an immutable audit log record."
        confirmLabel="Revoke Scope"
        variant="destructive"
        isLoading={isRevoking}
      />
    </div>
  );
}
