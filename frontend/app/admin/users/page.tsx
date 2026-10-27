'use client';

import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  CheckCircle2,
  Ban,
  RotateCcw,
} from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { CivoraUser } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, ColumnDef } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog';
import { FilterBar } from '@/components/admin/FilterBar';
import { Button } from '@/components/ui/Button';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<CivoraUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Confirmation dialog state
  const [selectedUser, setSelectedUser] = useState<CivoraUser | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    const data = await AdminService.getUsers();
    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    setIsActionLoading(true);
    try {
      await AdminService.toggleUserStatus(selectedUser.id);
      await loadUsers();
      setIsConfirmOpen(false);
      setSelectedUser(null);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Filtered dataset
  const filteredUsers = users.filter((u) => {
    const matchStatus = statusFilter === 'all' || u.accountStatus === statusFilter;
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchStatus && matchRole;
  });

  const columns: ColumnDef<CivoraUser>[] = [
    {
      id: 'name',
      header: 'User Identity',
      sortable: true,
      cell: (row) => (
        <div className="space-y-0.5">
          <p className="font-bold text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
          {row.title && <p className="text-[11px] text-slate-400">{row.title}</p>}
        </div>
      ),
    },
    {
      id: 'organization',
      header: 'Organization',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.organization || 'Unassigned'}</p>
          {row.department && (
            <p className="text-[11px] text-slate-400">{row.department}</p>
          )}
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Platform Role',
      sortable: true,
      cell: (row) => {
        const labels: Record<string, { label: string; variant: 'blue' | 'teal' | 'slate' }> = {
          platform_admin: { label: 'Platform Admin', variant: 'blue' },
          project_engineer: { label: 'Project Engineer', variant: 'teal' },
          read_only_stakeholder: { label: 'Stakeholder', variant: 'slate' },
        };
        const r = labels[row.role] || { label: row.role, variant: 'slate' };
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
              r.variant === 'blue'
                ? 'bg-[#3B68DE]/15 text-[#3B68DE]'
                : r.variant === 'teal'
                ? 'bg-[#4FAAA7]/15 text-teal-900'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {r.label}
          </span>
        );
      },
    },
    {
      id: 'coren',
      header: 'COREN Accreditation',
      cell: (row) => {
        if (!row.corenNumber) {
          return <span className="text-xs text-slate-400">N/A</span>;
        }
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {row.corenNumber}
          </span>
        );
      },
    },
    {
      id: 'accountStatus',
      header: 'Status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.accountStatus} size="sm" />,
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.accountStatus === 'active' ? (
            <button
              type="button"
              onClick={() => {
                setSelectedUser(row);
                setIsConfirmOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Ban className="w-3 h-3" />
              <span>Suspend</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSelectedUser(row);
                setIsConfirmOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reactivate</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Platform Users & Accounts Registry"
        description="Oversee authorized engineers, regulatory stakeholders, and platform administrator accounts."
        breadcrumbs={[
          { label: 'Access & Identity', href: '/admin/users' },
          { label: 'Users' },
        ]}
        actions={
          <Button
            href="/admin/access/invitations"
            variant="primary"
            size="sm"
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          >
            Invite New User
          </Button>
        }
      />

      {/* Filter Bar */}
      <FilterBar
        filters={[
          {
            id: 'status',
            label: 'Status',
            value: statusFilter,
            options: [
              { label: 'All Statuses', value: 'all' },
              { label: 'Active Accounts', value: 'active' },
              { label: 'Suspended Accounts', value: 'suspended' },
              { label: 'Pending Invitations', value: 'pending' },
            ],
            onChange: setStatusFilter,
          },
          {
            id: 'role',
            label: 'Role',
            value: roleFilter,
            options: [
              { label: 'All Roles', value: 'all' },
              { label: 'Platform Administrators', value: 'platform_admin' },
              { label: 'Project Engineers', value: 'project_engineer' },
              { label: 'Read-only Stakeholders', value: 'read_only_stakeholder' },
            ],
            onChange: setRoleFilter,
          },
        ]}
        onReset={() => {
          setStatusFilter('all');
          setRoleFilter('all');
        }}
      />

      {/* Main Data Table */}
      <DataTable
        data={filteredUsers as unknown as Record<string, unknown>[]}
        columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
        keyExtractor={(row) => (row as unknown as CivoraUser).id}
        searchPlaceholder="Search users by name, email, or organization..."
        isLoading={isLoading}
      />

      {/* High-Impact Status Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleToggleStatus}
        title={
          selectedUser?.accountStatus === 'active'
            ? `Suspend Account for ${selectedUser?.name}?`
            : `Reactivate Account for ${selectedUser?.name}?`
        }
        description={
          selectedUser?.accountStatus === 'active'
            ? `Suspending this account will immediately revoke all active sessions, block WhatsApp and Telegram submittals from their registered contact phone, and generate a tamper-evident audit record.`
            : `Reactivating this account will restore access according to their assigned projects and role permissions.`
        }
        confirmLabel={
          selectedUser?.accountStatus === 'active'
            ? 'Suspend Account'
            : 'Reactivate Account'
        }
        variant={selectedUser?.accountStatus === 'active' ? 'destructive' : 'primary'}
        isLoading={isActionLoading}
      />
    </div>
  );
}
