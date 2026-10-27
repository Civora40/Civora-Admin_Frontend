'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { IngestionRun } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, ColumnDef } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog';

export default function IngestionRunsPage() {
  const [runs, setRuns] = useState<IngestionRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Retry state
  const [selectedRun, setSelectedRun] = useState<IngestionRun | null>(null);
  const [isRetryOpen, setIsRetryOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const data = await AdminService.getIngestionRuns();
    setRuns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRetry = async () => {
    if (!selectedRun) return;
    setIsRetrying(true);
    try {
      await AdminService.retryIngestionRun(selectedRun.id);
      await loadData();
      setIsRetryOpen(false);
      setSelectedRun(null);
    } finally {
      setIsRetrying(false);
    }
  };

  const columns: ColumnDef<IngestionRun>[] = [
    {
      id: 'batchReference',
      header: 'Batch Reference',
      sortable: true,
      cell: (row) => (
        <div className="space-y-0.5">
          <p className="font-mono font-bold text-slate-900">{row.batchReference}</p>
          <p className="text-[11px] text-slate-400">
            {new Date(row.startedAt).toLocaleTimeString()} • {(row.durationMs / 1000).toFixed(1)}s elapsed
          </p>
        </div>
      ),
    },
    {
      id: 'channel',
      header: 'Channel Gateway',
      sortable: true,
      cell: (row) => (
        <span className="capitalize font-semibold text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.channel}
        </span>
      ),
    },
    {
      id: 'totalMessagesIngested',
      header: 'Ingested Submissions',
      sortable: true,
      cell: (row) => (
        <span className="font-bold text-[#001237] text-xs">
          {row.totalMessagesIngested} Items
        </span>
      ),
    },
    {
      id: 'duplicatesBlocked',
      header: 'Trapped Duplicates',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-semibold text-slate-600">
          {row.duplicatesBlocked} Duplicates
        </span>
      ),
    },
    {
      id: 'mediaProcessingFailures',
      header: 'Media Exceptions',
      cell: (row) =>
        row.mediaProcessingFailures > 0 ? (
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
            {row.mediaProcessingFailures} Failed
          </span>
        ) : (
          <span className="text-xs text-emerald-700 font-medium">0 Errors</span>
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
      header: 'Retry',
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end">
          {row.status === 'partial_failure' && (
            <button
              type="button"
              onClick={() => {
                setSelectedRun(row);
                setIsRetryOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#3B68DE] hover:text-[#2e54b8] px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Media</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Message Ingestion Batches & Runs"
        description="Monitor inbound field drawings, photo attachments, and duplicate trapping workers."
        breadcrumbs={[
          { label: 'Integrations & Data', href: '/admin/integrations/messaging' },
          { label: 'Ingestion Runs' },
        ]}
      />

      {/* Main Runs Table */}
      <DataTable
        data={runs as unknown as Record<string, unknown>[]}
        columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
        keyExtractor={(row) => (row as unknown as IngestionRun).id}
        searchPlaceholder="Search runs by batch reference or channel..."
        isLoading={isLoading}
      />

      {/* Confirmation Dialog for Retry */}
      <ConfirmationDialog
        isOpen={isRetryOpen}
        onClose={() => {
          setIsRetryOpen(false);
          setSelectedRun(null);
        }}
        onConfirm={handleRetry}
        title={`Trigger Media Ingestion Retry for ${selectedRun?.batchReference}?`}
        description="This will re-dispatch worker jobs to retrieve uncompressed media attachments from the Meta Cloud Content Delivery Network."
        confirmLabel="Execute Retry"
        variant="primary"
        isLoading={isRetrying}
      />
    </div>
  );
}
