'use client';

import React, { useState, useEffect } from 'react';
import { Globe, CheckCircle2 } from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { SecurityEvent } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, ColumnDef } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog';

export default function SecurityEventsPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mitigation state
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const data = await AdminService.getSecurityEvents();
    setEvents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolve = async () => {
    if (!selectedEvent) return;
    setIsResolving(true);
    try {
      await AdminService.resolveSecurityEvent(selectedEvent.id);
      await loadData();
      setIsResolveOpen(false);
      setSelectedEvent(null);
    } finally {
      setIsResolving(false);
    }
  };

  const columns: ColumnDef<SecurityEvent>[] = [
    {
      id: 'type',
      header: 'Anomaly Type & Threat',
      sortable: true,
      cell: (row) => (
        <div className="space-y-0.5 max-w-sm">
          <p className="font-bold text-slate-900 leading-snug">
            {row.type.replace('_', ' ').toUpperCase()}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">{row.description}</p>
          {row.actionTaken && (
            <p className="text-[11px] text-emerald-800 font-medium">
              Action: {row.actionTaken}
            </p>
          )}
        </div>
      ),
    },
    {
      id: 'actorIdentifier',
      header: 'Target Identifier',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.actorIdentifier}
        </span>
      ),
    },
    {
      id: 'geoSummary',
      header: 'Origin & IP Address',
      cell: (row) => (
        <div className="text-xs space-y-0.5">
          <p className="font-medium text-slate-800 flex items-center gap-1">
            <Globe className="w-3 h-3 text-slate-400" />
            <span>{row.geoSummary}</span>
          </p>
          <p className="font-mono text-[11px] text-slate-400">{row.ipAddress}</p>
        </div>
      ),
    },
    {
      id: 'severity',
      header: 'Threat Severity',
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
      header: 'Mitigation',
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end">
          {row.status !== 'resolved' ? (
            <button
              type="button"
              onClick={() => {
                setSelectedEvent(row);
                setIsResolveOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#3B68DE] hover:text-[#2e54b8] px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolve</span>
            </button>
          ) : (
            <span className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mitigated
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Security Events & Threat Sentinel"
        description="Inspect edge rate limit anomalies, suspicious Tor logins, and brute-force mitigations."
        breadcrumbs={[
          { label: 'Governance & Audit', href: '/admin/governance/report-templates' },
          { label: 'Security Events' },
        ]}
      />

      <DataTable
        data={events as unknown as Record<string, unknown>[]}
        columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
        keyExtractor={(row) => (row as unknown as SecurityEvent).id}
        searchPlaceholder="Search security events by type or IP..."
        isLoading={isLoading}
      />

      <ConfirmationDialog
        isOpen={isResolveOpen}
        onClose={() => {
          setIsResolveOpen(false);
          setSelectedEvent(null);
        }}
        onConfirm={handleResolve}
        title="Mark Security Event as Mitigated?"
        description="This certifies that the identified threat vector has been reviewed and necessary firewall rules or password resets have been enforced."
        confirmLabel="Confirm Mitigation"
        variant="primary"
        isLoading={isResolving}
      />
    </div>
  );
}
