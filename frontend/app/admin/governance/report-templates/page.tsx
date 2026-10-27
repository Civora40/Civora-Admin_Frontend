'use client';

import React, { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { ReportTemplate } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, ColumnDef } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { FilterBar } from '@/components/admin/FilterBar';

export default function ReportTemplatesPage() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [frameworkFilter, setFrameworkFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await AdminService.getReportTemplates();
      setTemplates(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filtered = templates.filter(
    (t) => frameworkFilter === 'all' || t.framework === frameworkFilter
  );

  const columns: ColumnDef<ReportTemplate>[] = [
    {
      id: 'name',
      header: 'Template Identity',
      sortable: true,
      cell: (row) => (
        <div className="space-y-0.5">
          <p className="font-bold text-slate-900 leading-snug">{row.name}</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded font-semibold text-slate-600">
              {row.code}
            </span>
            <span>Version: {row.version}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'framework',
      header: 'Statutory Framework',
      sortable: true,
      cell: (row) => (
        <span className="font-semibold text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
          {row.framework.replace('_', ' ')}
        </span>
      ),
    },
    {
      id: 'format',
      header: 'Print Standard',
      cell: (row) => (
        <span className="font-mono text-xs text-slate-600 bg-blue-50/60 text-[#3B68DE] px-2 py-0.5 rounded border border-blue-200/60 font-semibold">
          {row.paperFormat === 'A4_PORTRAIT' ? 'A4 Portrait (210×297mm)' : 'A3 Landscape'}
        </span>
      ),
    },
    {
      id: 'mandatorySectionsCount',
      header: 'Mandatory Sections',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-bold text-[#001237]">
          {row.mandatorySectionsCount} Form Sections
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Approval Status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Statutory Report Templates & Standards"
        description="Review approved regulatory reporting frameworks (COREN Decree 55, LASBCA Stage Certification, FIDIC)."
        breadcrumbs={[
          { label: 'Governance & Audit', href: '/admin/governance/report-templates' },
          { label: 'Report Templates' },
        ]}
      />

      {/* Statutory High-Assurance Specification Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#001237] flex items-center justify-center shrink-0">
          <Printer className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-900 text-sm">
            High-Assurance A4 Statutory Print Specification
          </p>
          <p>
            Templates enforce strict A4 physical margins (210mm × 297mm), zero screen scale distortions, vector QR watermarks, and tamper-evident cryptographic hash footers required by the Council for the Regulation of Engineering in Nigeria.
          </p>
        </div>
      </div>

      <FilterBar
        filters={[
          {
            id: 'framework',
            label: 'Regulatory Framework',
            value: frameworkFilter,
            options: [
              { label: 'All Frameworks', value: 'all' },
              { label: 'COREN Engineering Decree', value: 'COREN' },
              { label: 'LASBCA Building Control', value: 'LASBCA' },
              { label: 'FIDIC Red Book Standard', value: 'FIDIC_RED' },
              { label: 'Civora Assurance Custom', value: 'CIVORA_ASSURANCE' },
            ],
            onChange: setFrameworkFilter,
          },
        ]}
        onReset={() => setFrameworkFilter('all')}
      />

      <DataTable
        data={filtered as unknown as Record<string, unknown>[]}
        columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
        keyExtractor={(row) => (row as unknown as ReportTemplate).id}
        searchPlaceholder="Search templates by title or framework..."
        isLoading={isLoading}
      />
    </div>
  );
}
