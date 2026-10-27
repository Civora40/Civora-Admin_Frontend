'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Save,
  CheckCircle2,
  Clock,
  Mail,
  Zap,
} from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { PlatformSettings } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/Button';

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await AdminService.getPlatformSettings();
      setSettings(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    await AdminService.updatePlatformSettings(settings);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (isLoading || !settings) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Loading platform configurations...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <AdminPageHeader
        title="Platform Settings & Operational Security"
        description="Global session timeouts, administrator MFA policy, and emergency maintenance controls."
        breadcrumbs={[
          { label: 'Settings', href: '/admin/settings' },
          { label: 'Platform Settings' },
        ]}
      />

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-left">
        {isSaved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings successfully committed to configuration ledger.</span>
          </div>
        )}

        {/* Maintenance Mode */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Emergency Maintenance Mode</span>
            </h3>
            <p className="text-xs text-slate-500 max-w-lg">
              When activated, site engineer and stakeholder workspaces will display a scheduled maintenance screen. Admin Console access remains operational for platform recovery.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                setSettings({ ...settings, maintenanceMode: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
          </label>
        </div>

        {/* MFA Enforcement */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#3B68DE]" />
              <span>Enforce MFA for Administrator Accounts</span>
            </h3>
            <p className="text-xs text-slate-500 max-w-lg">
              Mandate hardware FIDO2 or TOTP authenticator verification on every privileged session login.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={settings.enforceMfaForAdmins}
              onChange={(e) =>
                setSettings({ ...settings, enforceMfaForAdmins: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B68DE]" />
          </label>
        </div>

        {/* Session Timeout */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <span>Privileged Inactivity Session Timeout</span>
          </h3>
          <p className="text-xs text-slate-500">
            Automatically invalidate browser cookie session after consecutive minutes of inactivity.
          </p>
          <div className="max-w-xs">
            <select
              value={settings.sessionTimeoutMinutes}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  sessionTimeoutMinutes: Number(e.target.value),
                })
              }
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
            >
              <option value={15}>15 Minutes (High Security)</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>60 Minutes (Standard)</option>
              <option value={120}>120 Minutes</option>
            </select>
          </div>
        </div>

        {/* Email Digest */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-600" />
              <span>Daily Administrative Security Digest</span>
            </h3>
            <p className="text-xs text-slate-500 max-w-lg">
              Transmit daily encrypted briefing covering blocked duplicates, flagged access reviews, and failed ingestion runs to root administrators.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={settings.notificationEmailDigest}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notificationEmailDigest: e.target.checked,
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B68DE]" />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
