'use client';

import React, { useState, useEffect } from 'react';

import { AdminService } from '@/lib/services/admin-service';
import { AuditLogEntry } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, ColumnDef } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { FilterBar } from '@/components/admin/FilterBar';

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await AdminService.getAuditLogs();
      setLogs(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filtered = logs.filter(
    (l) => categoryFilter === 'all' || l.category === categoryFilter
  );

  const columns: ColumnDef<AuditLogEntry>[] = [
    {
      id: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      cell: (row) => (
        <div className="space-y-0.5 text-xs text-slate-500">
          <p className="font-semibold text-slate-900">
            {new Date(row.timestamp).toLocaleDateString()}
          </p>
          <p className="font-mono text-[11px] text-slate-400">
            {new Date(row.timestamp).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      id: 'action',
      header: 'Action & Description',
      sortable: true,
      cell: (row) => (
        <div className="space-y-1 max-w-md">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {row.action}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {row.category}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {row.description}
          </p>
          <p className="text-[11px] text-slate-400">
            Target: <strong className="text-slate-600">{row.targetResource}</strong> ({row.targetId})
          </p>
        </div>
      ),
    },
    {
      id: 'actor',
      header: 'Actor Identity',
      sortable: true,
      cell: (row) => (
        <div className="text-xs space-y-0.5">
          <p className="font-bold text-slate-900">{row.actorName}</p>
          <p className="text-slate-500">{row.actorEmail}</p>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {row.actorRole}
          </span>
        </div>
      ),
    },
    {
      id: 'ipAddress',
      header: 'Source Origin',
      cell: (row) => (
        <span className="font-mono text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100">
          {row.ipAddress}
        </span>
      ),
    },
    {
      id: 'outcome',
      header: 'Outcome',
      sortable: true,
      cell: (row) => <StatusBadge status={row.outcome} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Immutable Platform Audit Trail"
        description="Tamper-evident system ledger capturing every administrative mutation, access change, and security event."
        breadcrumbs={[
          { label: 'Governance & Audit', href: '/admin/governance/audit-log' },
          { label: 'Audit Log' },
        ]}
      />

      <FilterBar
        filters={[
          {
            id: 'category',
            label: 'Event Category',
            value: categoryFilter,
            options: [
              { label: 'All Event Categories', value: 'all' },
              { label: 'Access Control', value: 'access_control' },
              { label: 'Authentication', value: 'authentication' },
              { label: 'Policy Configurations', value: 'policy' },
              { label: 'Integrations & Webhooks', value: 'integration' },
              { label: 'Security Sentinels', value: 'security' },
              { label: 'System Infrastructure', value: 'system' },
            ],
            onChange: setCategoryFilter,
          },
        ]}
        onReset={() => setCategoryFilter('all')}
      />

      <DataTable
        data={filtered as unknown as Record<string, unknown>[]}
        columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
        keyExtractor={(row) => (row as unknown as AuditLogEntry).id}
        searchPlaceholder="Search audit events by action, actor, or target..."
        isLoading={isLoading}
      />
    </div>
  );
}
