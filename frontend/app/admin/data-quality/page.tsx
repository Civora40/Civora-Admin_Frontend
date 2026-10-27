'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { DataQualityIssue } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, ColumnDef } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog';
import { FilterBar } from '@/components/admin/FilterBar';

export default function DataQualityPage() {
  const [issues, setIssues] = useState<DataQualityIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all');

  // Resolution state
  const [selectedIssue, setSelectedIssue] = useState<DataQualityIssue | null>(null);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const data = await AdminService.getDataQualityIssues();
    setIssues(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolve = async () => {
    if (!selectedIssue) return;
    setIsResolving(true);
    try {
      await AdminService.resolveQualityIssue(selectedIssue.id);
      await loadData();
      setIsResolveOpen(false);
      setSelectedIssue(null);
    } finally {
      setIsResolving(false);
    }
  };

  const filtered = issues.filter(
    (i) => severityFilter === 'all' || i.severity === severityFilter
  );

  const columns: ColumnDef<DataQualityIssue>[] = [
    {
      id: 'title',
      header: 'Anomaly & Description',
      sortable: true,
      cell: (row) => (
        <div className="space-y-0.5 max-w-md">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
              {row.code}
            </span>
            <p className="font-bold text-slate-900 leading-snug">{row.title}</p>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{row.description}</p>
          <p className="text-[11px] text-slate-400">
            Source: {row.affectedSource} • Project: {row.affectedProject}
          </p>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Quality Category',
      sortable: true,
      cell: (row) => (
        <span className="capitalize font-semibold text-xs text-slate-700">
          {row.category.replace('_', ' ')}
        </span>
      ),
    },
    {
      id: 'severity',
      header: 'Severity',
      sortable: true,
      cell: (row) => <StatusBadge status={row.severity} size="sm" />,
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      id: 'actions',
      header: 'Resolution',
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end">
          {row.status !== 'resolved' ? (
            <button
              type="button"
              onClick={() => {
                setSelectedIssue(row);
                setIsResolveOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#3B68DE] hover:text-[#2e54b8] px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolve Trap</span>
            </button>
          ) : (
            <span className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Resolved
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Data Quality & Field Ingestion Traps"
        description="Surface unverified phone identities, missing statutory stage tags, and duplicate submission hashes."
        breadcrumbs={[
          { label: 'Integrations & Data', href: '/admin/integrations/messaging' },
          { label: 'Data Quality' },
        ]}
      />

      <FilterBar
        filters={[
          {
            id: 'severity',
            label: 'Severity Level',
            value: severityFilter,
            options: [
              { label: 'All Severities', value: 'all' },
              { label: 'Critical Traps', value: 'critical' },
              { label: 'High Priority', value: 'high' },
              { label: 'Medium Warnings', value: 'medium' },
              { label: 'Low / Informational', value: 'low' },
            ],
            onChange: setSeverityFilter,
          },
        ]}
        onReset={() => setSeverityFilter('all')}
      />

      <DataTable
        data={filtered as unknown as Record<string, unknown>[]}
        columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
        keyExtractor={(row) => (row as unknown as DataQualityIssue).id}
        searchPlaceholder="Search quality issues by code or description..."
        isLoading={isLoading}
      />

      <ConfirmationDialog
        isOpen={isResolveOpen}
        onClose={() => {
          setIsResolveOpen(false);
          setSelectedIssue(null);
        }}
        onConfirm={handleResolve}
        title={`Mark Issue ${selectedIssue?.code} as Resolved?`}
        description={`Resolution action: "${selectedIssue?.suggestedAction}". This will clear the quarantine flag and emit an administrative audit record.`}
        confirmLabel="Confirm Resolution"
        variant="primary"
        isLoading={isResolving}
      />
    </div>
  );
}
