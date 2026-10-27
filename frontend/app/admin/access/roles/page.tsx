import React from 'react';
import { Shield, Check, X } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

interface PermissionRow {
  category: string;
  capability: string;
  description: string;
  admin: boolean;
  engineer: boolean;
  stakeholder: boolean;
}

const PERMISSION_MATRIX: PermissionRow[] = [
  // Platform & System Operations
  {
    category: 'Platform Operations',
    capability: 'system:read',
    description: 'View live telemetry, latency indicators, and microservice status',
    admin: true,
    engineer: true,
    stakeholder: true,
  },
  {
    category: 'Platform Operations',
    capability: 'system:manage',
    description: 'Toggle maintenance mode, flush caches, restart worker pools',
    admin: true,
    engineer: false,
    stakeholder: false,
  },

  // Access Control & Identity
  {
    category: 'Access & Identity',
    capability: 'users:manage',
    description: 'Suspend or reactivate accounts, assign project scopes',
    admin: true,
    engineer: false,
    stakeholder: false,
  },
  {
    category: 'Access & Identity',
    capability: 'invitations:manage',
    description: 'Dispatch, inspect, and revoke user invitations',
    admin: true,
    engineer: false,
    stakeholder: false,
  },
  {
    category: 'Access & Identity',
    capability: 'access_reviews:certify',
    description: 'Certify quarterly privileged user and inactive account audits',
    admin: true,
    engineer: false,
    stakeholder: false,
  },

  // Organization & Project Governance
  {
    category: 'Projects & Workspaces',
    capability: 'projects:create',
    description: 'Provision new project workspaces with LASBCA permit mapping',
    admin: true,
    engineer: false,
    stakeholder: false,
  },
  {
    category: 'Projects & Workspaces',
    capability: 'projects:manage',
    description: 'Configure site personnel, milestone stages, and drawing categories',
    admin: true,
    engineer: true,
    stakeholder: false,
  },

  // Technical Submittals & QA/QC
  {
    category: 'Field Submittals',
    capability: 'submissions:review',
    description: 'Accept, reject, flag, or resolve technical discrepancies',
    admin: true,
    engineer: true,
    stakeholder: false,
  },
  {
    category: 'Field Submittals',
    capability: 'submissions:read_all',
    description: 'Inspect drawings, test reports, and site photo archives',
    admin: true,
    engineer: true,
    stakeholder: true,
  },

  // Statutory Reporting Studio
  {
    category: 'Statutory Reports',
    capability: 'reports:release',
    description: 'Authorize statutory release of locked COREN/LASBCA report packages',
    admin: true,
    engineer: true,
    stakeholder: false,
  },
  {
    category: 'Statutory Reports',
    capability: 'templates:manage',
    description: 'Update and lock approved regulatory reporting templates',
    admin: true,
    engineer: false,
    stakeholder: false,
  },

  // Integrations & Telemetry
  {
    category: 'Integrations & Ingestion',
    capability: 'integrations:manage',
    description: 'Configure WhatsApp & Telegram webhooks and credentials',
    admin: true,
    engineer: false,
    stakeholder: false,
  },
  {
    category: 'Integrations & Ingestion',
    capability: 'ingestion:retry',
    description: 'Trigger automated retry workers on failed attachment batches',
    admin: true,
    engineer: false,
    stakeholder: false,
  },

  // Audit & Security
  {
    category: 'Audit & Compliance',
    capability: 'audit:read',
    description: 'Inspect immutable platform audit trails and actor IP addresses',
    admin: true,
    engineer: false,
    stakeholder: true,
  },
  {
    category: 'Audit & Compliance',
    capability: 'policies:manage',
    description: 'Enforce compliance threshold percent (75%/80%) and retention',
    admin: true,
    engineer: false,
    stakeholder: false,
  },
];

export default function RolesPermissionsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Roles & Permissions Matrix (RBAC)"
        description="Review explicit role definitions and system capability mappings enforced on backend API boundaries."
        breadcrumbs={[
          { label: 'Access & Identity', href: '/admin/users' },
          { label: 'Roles & Permissions' },
        ]}
      />

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Platform Admin */}
        <div className="rounded-2xl border-2 border-[#3B68DE]/40 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#3B68DE]/15 text-[#3B68DE]">
              Platform Admin
            </span>
            <Shield className="w-5 h-5 text-[#3B68DE]" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Platform Administrator
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Full operational oversight, tenant provisioning, security event response, and statutory policy enforcement.
          </p>
        </div>

        {/* Project Engineer */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#4FAAA7]/15 text-teal-900">
              Project Engineer
            </span>
            <Shield className="w-5 h-5 text-[#4FAAA7]" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Certified Resident Engineer
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Technical submittal inspection, COREN discrepancy resolution, task verification, and report release within assigned scopes.
          </p>
        </div>

        {/* Read-Only Stakeholder */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
              Stakeholder
            </span>
            <Shield className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Read-only Regulatory Stakeholder
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Independent auditing, LASBCA compliance monitoring, and executive progress tracking without mutation authority.
          </p>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3.5">Category & Capability</th>
                <th className="px-4 py-3.5">Capability Description</th>
                <th className="px-4 py-3.5 text-center">Platform Admin</th>
                <th className="px-4 py-3.5 text-center">Project Engineer</th>
                <th className="px-4 py-3.5 text-center">Stakeholder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PERMISSION_MATRIX.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-slate-900">{row.capability}</p>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 max-w-sm">
                    {row.description}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {row.admin ? (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {row.engineer ? (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {row.stakeholder ? (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
