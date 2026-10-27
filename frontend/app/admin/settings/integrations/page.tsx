'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Save,
  Radio,
  Clock,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/Button';

export default function IntegrationSettingsPage() {
  const [rateLimit, setRateLimit] = useState(600);
  const [maxRetries, setMaxRetries] = useState(3);
  const [backoffType, setBackoffType] = useState('exponential');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
        title="Integration Settings & Gateway Throttling"
        description="Configure edge webhook rate caps, retry backoff algorithms, and duplicate detection thresholds."
        breadcrumbs={[
          { label: 'Settings', href: '/admin/settings' },
          { label: 'Integration Settings' },
        ]}
      />

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-left"
      >
        {isSaved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Gateway rate limit parameters updated.</span>
          </div>
        )}

        {/* Rate Limiting */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#3B68DE]" />
            <span>Edge Webhook Ingestion Rate Limit</span>
          </h3>
          <p className="text-xs text-slate-500">
            Maximum inbound submittal payloads processed per minute across WhatsApp Business and Telegram bot channels before rate limiting kicks in.
          </p>
          <div className="max-w-xs">
            <select
              value={rateLimit}
              onChange={(e) => setRateLimit(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
            >
              <option value={300}>300 Requests / min (Standard Site Load)</option>
              <option value={600}>600 Requests / min (Multi-Site Peak)</option>
              <option value={1200}>1,200 Requests / min (Enterprise Bulk Ingest)</option>
            </select>
          </div>
        </div>

        {/* Retry Algorithm */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <span>Media Download Retry Backoff Algorithm</span>
          </h3>
          <p className="text-xs text-slate-500">
            Algorithm utilized when retrieving large uncompressed geotagged construction site drawings from telecommunications CDNs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Backoff Strategy
              </label>
              <select
                value={backoffType}
                onChange={(e) => setBackoffType(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
              >
                <option value="exponential">Exponential Backoff (1s, 2s, 4s, 8s)</option>
                <option value="linear">Linear Interval (3s spacing)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maximum Retry Attempts
              </label>
              <select
                value={maxRetries}
                onChange={(e) => setMaxRetries(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
              >
                <option value={3}>3 Attempts</option>
                <option value={5}>5 Attempts</option>
              </select>
            </div>
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
            Save Gateway Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
