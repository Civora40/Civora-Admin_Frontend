'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
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

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await AdminService.getProjects();
      setProjects(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filtered = projects.filter(
    (p) => statusFilter === 'all' || p.status === statusFilter
  );

  const columns: ColumnDef<Project>[] = [
    {
      id: 'name',
      header: 'Project Title & Registry',
      sortable: true,
      cell: (row) => (
        <div className="space-y-0.5">
          <p className="font-bold text-slate-900 leading-snug">{row.name}</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
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
      header: 'Contractor & Client',
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
          {row.corenLeadEngineer && (
            <p className="text-[11px] text-slate-600 truncate max-w-[180px]">
              {row.corenLeadEngineer}
            </p>
          )}
        </div>
      ),
    },
    {
      id: 'submissions',
      header: 'Field Volume',
      cell: (row) => (
        <div className="text-xs space-y-0.5">
          <p className="font-bold text-[#001237]">
            {row.activeSubmissionsCount} Submittals
          </p>
          <p className="text-[11px] text-slate-400">
            {row.activePersonnelCount} Field Staff
          </p>
        </div>
      ),
    },
    {
      id: 'flags',
      header: 'Discrepancy Flags',
      cell: (row) =>
        row.unresolvedFlagsCount > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            {row.unresolvedFlagsCount} Open
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Clear
          </span>
        ),
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Infrastructure Projects Registry"
        description="Comprehensive project ledger with statutory LASBCA permit mapping and engineering lead assignments."
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

      {/* Filter Bar */}
      <FilterBar
        filters={[
          {
            id: 'status',
            label: 'Project Status',
            value: statusFilter,
            options: [
              { label: 'All Project States', value: 'all' },
              { label: 'Active Construction Sites', value: 'active' },
              { label: 'In Milestone Review', value: 'in_review' },
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
        searchPlaceholder="Search projects by name, code, contractor, or permit..."
        isLoading={isLoading}
      />
    </div>
  );
}
