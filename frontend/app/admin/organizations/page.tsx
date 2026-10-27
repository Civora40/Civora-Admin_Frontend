'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail } from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { Organization } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, ColumnDef } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { FilterBar } from '@/components/admin/FilterBar';

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await AdminService.getOrganizations();
      setOrganizations(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredOrgs = organizations.filter(
    (o) => tierFilter === 'all' || o.tier === tierFilter
  );

  const columns: ColumnDef<Organization>[] = [
    {
      id: 'name',
      header: 'Entity Organization',
      sortable: true,
      cell: (row) => (
        <div className="space-y-0.5">
          <p className="font-bold text-slate-900">{row.name}</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded font-semibold text-slate-600">
              {row.code}
            </span>
            {row.cacNumber && <span>CAC: {row.cacNumber}</span>}
          </div>
        </div>
      ),
    },
    {
      id: 'tier',
      header: 'Enterprise Tier',
      sortable: true,
      cell: (row) => (
        <span className="capitalize font-semibold text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
          {row.tier.replace('_', ' ')}
        </span>
      ),
    },
    {
      id: 'contact',
      header: 'Administrative Contact',
      cell: (row) => (
        <div className="text-xs space-y-0.5 text-slate-600">
          <p className="flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400" />
            <span>{row.contactEmail}</span>
          </p>
          <p className="flex items-center gap-1 text-[11px] text-slate-500">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{row.contactPhone}</span>
          </p>
        </div>
      ),
    },
    {
      id: 'activeProjectsCount',
      header: 'Active Projects',
      sortable: true,
      cell: (row) => (
        <span className="font-bold text-[#001237] text-xs">
          {row.activeProjectsCount} Sites
        </span>
      ),
    },
    {
      id: 'totalMembersCount',
      header: 'Registered Personnel',
      sortable: true,
      cell: (row) => (
        <span className="text-xs text-slate-600 font-medium">
          {row.totalMembersCount} Members
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
        title="Organizations & Tenant Registry"
        description="Manage corporate entities, certified general contractors, engineering consultancies, and regulatory bodies."
        breadcrumbs={[
          { label: 'Organizations & Projects', href: '/admin/organizations' },
          { label: 'Organizations' },
        ]}
      />

      {/* Filter Bar */}
      <FilterBar
        filters={[
          {
            id: 'tier',
            label: 'Entity Tier',
            value: tierFilter,
            options: [
              { label: 'All Entity Tiers', value: 'all' },
              { label: 'Enterprise Contractors', value: 'enterprise' },
              { label: 'Government Regulatory Agencies', value: 'government_agency' },
              { label: 'Civil Engineering Contractors', value: 'contractor' },
              { label: 'Independent Consultancies', value: 'consultancy' },
            ],
            onChange: setTierFilter,
          },
        ]}
        onReset={() => setTierFilter('all')}
      />

      {/* Main Organizations Table */}
      <DataTable
        data={filteredOrgs as unknown as Record<string, unknown>[]}
        columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
        keyExtractor={(row) => (row as unknown as Organization).id}
        searchPlaceholder="Search organizations by name, code, or CAC number..."
        isLoading={isLoading}
      />
    </div>
  );
}
