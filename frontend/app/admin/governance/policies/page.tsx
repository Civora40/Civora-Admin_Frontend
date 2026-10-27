'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Scale,
  FileLock2,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/Button';

export default function RetentionPoliciesPage() {
  const [threshold, setThreshold] = useState<number>(80);
  const [retentionYears, setRetentionYears] = useState<number>(7);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <AdminPageHeader
        title="Retention & Governance Policies"
        description="Configure mandatory compliance thresholds, statutory evidence retention, and statutory engineering notices."
        breadcrumbs={[
          { label: 'Governance & Audit', href: '/admin/governance/report-templates' },
          { label: 'Retention & Policies' },
        ]}
      />

      {/* Statutory Decoupling Callout */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
          <Scale className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed text-left">
          <p className="font-bold text-slate-900 text-sm">
            Statutory Notice: Decoupling of Technical Compliance from Payroll
          </p>
          <p>
            In accordance with the Civora Engineering Governance Charter and Nigerian Labour Act guidelines, submittal compliance percentages (75% or 80%) represent technical quality indicators for project monitoring only. They are strictly decoupled from and shall not be used for automated site staff salary withholding or disciplinary deductions.
          </p>
        </div>
      </div>

      {/* Policy Settings Form */}
      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-left">
        {isSaved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Governance policies updated and committed to immutable audit trail.</span>
          </div>
        )}

        {/* Section 1: Compliance Baseline */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3B68DE]" />
            <h3 className="text-sm font-bold text-slate-900">
              Technical Reporting Compliance Baseline
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Define the minimum percentage of qualifying site inspections required per reporting period.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div
              onClick={() => setThreshold(75)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                threshold === 75
                  ? 'border-[#3B68DE] bg-blue-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-900">75% Standard</span>
                {threshold === 75 && <CheckCircle2 className="w-4 h-4 text-[#3B68DE]" />}
              </div>
              <p className="text-xs text-slate-500">
                Baseline standard for standard civil works and general earthwork sites.
              </p>
            </div>

            <div
              onClick={() => setThreshold(80)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                threshold === 80
                  ? 'border-[#3B68DE] bg-blue-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-900">80% Enhanced (COREN Recommended)</span>
                {threshold === 80 && <CheckCircle2 className="w-4 h-4 text-[#3B68DE]" />}
              </div>
              <p className="text-xs text-slate-500">
                Strict assurance baseline for structural concrete, bridges, and rail overpasses.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Statutory Evidence Retention */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileLock2 className="w-4 h-4 text-[#3B68DE]" />
            <h3 className="text-sm font-bold text-slate-900">
              Statutory Evidence Retention Period
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Civil engineering submittals, test cube results, and site drawings must be preserved in encrypted object storage for statutory liability audits.
          </p>

          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Minimum Retention Duration
            </label>
            <select
              value={retentionYears}
              onChange={(e) => setRetentionYears(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
            >
              <option value={7}>7 Years (Nigerian Statutory Civil Limitation)</option>
              <option value={10}>10 Years (FIDIC Decennial Liability)</option>
              <option value={15}>15 Years (Permanent Infrastructure Archival)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Policy Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
