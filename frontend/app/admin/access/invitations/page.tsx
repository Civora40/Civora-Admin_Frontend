'use client';

import React, { useState, useEffect } from 'react';
import {
  MailPlus,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { UserInvitation, Organization, UserRole } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, ColumnDef } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog';
import { Button } from '@/components/ui/Button';

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Invite Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('project_engineer');
  const [newOrgId, setNewOrgId] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Revoke state
  const [selectedInvite, setSelectedInvite] = useState<UserInvitation | null>(null);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const [invs, orgs] = await Promise.all([
      AdminService.getInvitations(),
      AdminService.getOrganizations(),
    ]);
    setInvitations(invs);
    setOrganizations(orgs);
    if (orgs.length > 0 && !newOrgId) {
      setNewOrgId(orgs[0].id);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      setErrorMsg('Please enter a valid recipient email address.');
      return;
    }

    setIsDispatching(true);
    setErrorMsg('');

    try {
      const selectedOrg = organizations.find((o) => o.id === newOrgId);
      await AdminService.createInvitation({
        email: newEmail.trim(),
        role: newRole,
        organizationId: newOrgId,
        organizationName: selectedOrg ? selectedOrg.name : 'Civora Enterprise',
        invitedBy: 'babatunde.fashola@civora.internal',
        assignedProjects: [],
      });

      await loadData();
      setIsModalOpen(false);
      setNewEmail('');
    } catch {
      setErrorMsg('Failed to dispatch platform invitation.');
    } finally {
      setIsDispatching(false);
    }
  };

  const handleRevoke = async () => {
    if (!selectedInvite) return;
    setIsRevoking(true);
    try {
      await AdminService.revokeInvitation(selectedInvite.id);
      await loadData();
      setIsRevokeOpen(false);
      setSelectedInvite(null);
    } finally {
      setIsRevoking(false);
    }
  };

  const columns: ColumnDef<UserInvitation>[] = [
    {
      id: 'email',
      header: 'Invited Recipient',
      sortable: true,
      cell: (row) => (
        <div className="space-y-0.5">
          <p className="font-bold text-slate-900">{row.email}</p>
          <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
            {row.invitationCode}
          </span>
        </div>
      ),
    },
    {
      id: 'organizationName',
      header: 'Target Organization',
      sortable: true,
      cell: (row) => (
        <span className="font-semibold text-slate-800">{row.organizationName}</span>
      ),
    },
    {
      id: 'role',
      header: 'Assigned Role',
      sortable: true,
      cell: (row) => (
        <span className="capitalize font-medium text-xs text-slate-700">
          {row.role.replace('_', ' ')}
        </span>
      ),
    },
    {
      id: 'invitedAt',
      header: 'Dispatched Date',
      sortable: true,
      cell: (row) => (
        <span className="text-xs text-slate-500">
          {new Date(row.invitedAt).toLocaleDateString()}
        </span>
      ),
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
          {row.status === 'pending' && (
            <button
              type="button"
              onClick={() => {
                setSelectedInvite(row);
                setIsRevokeOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Revoke</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="User Invitations & Onboarding Dispatches"
        description="Dispatch single-use cryptographic invitation tokens for contractor engineers and agency auditors."
        breadcrumbs={[
          { label: 'Access & Identity', href: '/admin/users' },
          { label: 'Invitations' },
        ]}
        actions={
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            size="sm"
            leftIcon={<MailPlus className="w-3.5 h-3.5" />}
          >
            Dispatch Invitation
          </Button>
        }
      />

      {/* Main Invitations Table */}
      <DataTable
        data={invitations as unknown as Record<string, unknown>[]}
        columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
        keyExtractor={(row) => (row as unknown as UserInvitation).id}
        searchPlaceholder="Search invitations by email or organization..."
        isLoading={isLoading}
      />

      {/* Dispatch Invitation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => !isDispatching && setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 z-50 text-left space-y-4 animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Dispatch User Invitation
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Recipient will receive an email containing a 7-day single-use onboarding registration link.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateInvitation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="engineer@contractor.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Platform Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
                >
                  <option value="project_engineer">Project Engineer (Technical Reviewer)</option>
                  <option value="read_only_stakeholder">Read-only Stakeholder (Auditor / Agency)</option>
                  <option value="platform_admin">Platform Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Organization Entity
                </label>
                <select
                  value={newOrgId}
                  onChange={(e) => setNewOrgId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.tier})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isDispatching}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Dispatch Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revoke Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isRevokeOpen}
        onClose={() => {
          setIsRevokeOpen(false);
          setSelectedInvite(null);
        }}
        onConfirm={handleRevoke}
        title={`Revoke invitation for ${selectedInvite?.email}?`}
        description="Once revoked, the invitation token will be immediately invalidated and cannot be used to complete onboarding."
        confirmLabel="Revoke Invitation"
        variant="destructive"
        isLoading={isRevoking}
      />
    </div>
  );
}
