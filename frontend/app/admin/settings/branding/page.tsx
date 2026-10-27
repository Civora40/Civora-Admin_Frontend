'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Save,
  Image as ImageIcon,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { CivoraLogo } from '@/components/brand/CivoraLogo';
import { Button } from '@/components/ui/Button';

export default function BrandingSettingsPage() {
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [disclaimer, setDisclaimer] = useState(
    'Civora platform records constitute statutory civil engineering documentation subject to COREN Decree No. 55 of 1970 and amended Act 2018. Unauthorized alterations or unverified identity claims are subject to regulatory investigation.'
  );
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
        title="Branding & Statutory Document Rules"
        description="Verify official brand assets, configure document watermarking, and manage regulatory legal disclaimers."
        breadcrumbs={[
          { label: 'Settings', href: '/admin/settings' },
          { label: 'Branding & Notifications' },
        ]}
      />

      {/* Official Assets Verification Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-left">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#3B68DE]" />
          <span>Official Civora Brand Vector Identity</span>
        </h3>
        <p className="text-xs text-slate-500">
          The Admin Console uses the approved isometric faceted prism wordmark synchronized from the Civora design system.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Light Theme Logo Preview */}
          <div className="p-6 rounded-xl border border-slate-200 bg-white flex flex-col items-center justify-center space-y-2">
            <CivoraLogo size="lg" theme="light" showTagline variant="full" />
            <span className="text-[10px] text-slate-400 font-medium pt-2">
              Primary Brand Display (Light Surface)
            </span>
          </div>

          {/* Dark Theme Logo Preview */}
          <div className="p-6 rounded-xl border border-slate-800 bg-[#001237] flex flex-col items-center justify-center space-y-2">
            <CivoraLogo size="lg" theme="dark" showTagline variant="full" />
            <span className="text-[10px] text-slate-400 font-medium pt-2">
              Navigation & Terminal Display (Dark Navy)
            </span>
          </div>
        </div>
      </div>

      {/* Document Watermarking & Disclaimers Form */}
      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-left"
      >
        {isSaved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Document branding preferences updated.</span>
          </div>
        )}

        <div className="flex items-start justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              High-Assurance PDF Document Watermark
            </h3>
            <p className="text-xs text-slate-500 max-w-lg">
              Embed a translucent diagonal Civora vector watermark and QR validation code across all exported statutory engineering submittals.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={watermarkEnabled}
              onChange={(e) => setWatermarkEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B68DE]" />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Statutory Regulatory Disclaimer Notice
          </label>
          <p className="text-xs text-slate-500">
            This notice is legally bound to the footer of every approved report, submittal summary, and audit export.
          </p>
          <textarea
            rows={4}
            value={disclaimer}
            onChange={(e) => setDisclaimer(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Document Rules
          </Button>
        </div>
      </form>
    </div>
  );
}
