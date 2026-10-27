'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog';
import { Button } from '@/components/ui/Button';

export default function ProvisioningWizardPage() {
  const [step, setStep] = useState(1);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Form State
  const [orgName, setOrgName] = useState('Dantata & Sawoe Civil Engineering Ltd');
  const [cacNumber, setCacNumber] = useState('RC-58921');
  const [tier, setTier] = useState('contractor');
  const [contactEmail, setContactEmail] = useState('admin@dantata-sawoe.com');

  const [projectName, setProjectName] = useState('Kano-Maiduguri Dual Carriage Section IV Bridge Works');
  const [projectCode, setProjectCode] = useState('CIV-PRJ-KANO-04');
  const [location, setLocation] = useState('Wudil to Gaya Corridor, Kano State');
  const [permitNumber, setPermitNumber] = useState('FED/WORKS/2026/0892-BR');
  const [leadEngineer, setLeadEngineer] = useState('Engr. Ibrahim Garba, FNSE (R.21049)');

  const handleExecuteProvisioning = async () => {
    setIsProvisioning(true);
    // Simulate real backend provisioning operation
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsProvisioning(false);
    setIsConfirmOpen(false);
    setIsSuccess(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <AdminPageHeader
        title="Project & Tenant Provisioning Control"
        description="Admin-authorized provisioning wizard establishing new corporate tenants, statutory permit mapping, and messaging channels."
        breadcrumbs={[
          { label: 'Organizations & Projects', href: '/admin/projects' },
          { label: 'Provisioning' },
        ]}
      />

      {/* Stepper Progress */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
          <div
            className={`flex items-center justify-center gap-2 p-2 rounded-xl transition-all ${
              step === 1
                ? 'bg-[#001237] text-white shadow-xs'
                : step > 1
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-400'
            }`}
          >
            <span>1. Organization</span>
          </div>
          <div
            className={`flex items-center justify-center gap-2 p-2 rounded-xl transition-all ${
              step === 2
                ? 'bg-[#001237] text-white shadow-xs'
                : step > 2
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-400'
            }`}
          >
            <span>2. Project & LASBCA</span>
          </div>
          <div
            className={`flex items-center justify-center gap-2 p-2 rounded-xl transition-all ${
              step === 3
                ? 'bg-[#001237] text-white shadow-xs'
                : 'text-slate-400'
            }`}
          >
            <span>3. Review & Commit</span>
          </div>
        </div>
      </div>

      {isSuccess ? (
        // Provisioning Success State
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 sm:p-12 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">
            Project Workspace Successfully Provisioned
          </h2>

          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Organization <strong className="text-slate-900">{orgName}</strong> and Project{' '}
            <strong className="text-slate-900">{projectName}</strong> have been registered in the platform control plane. Ingestion webhooks are initialized.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1.5 font-mono">
            <p><span className="text-slate-400">Workspace Code:</span> {projectCode}</p>
            <p><span className="text-slate-400">Statutory Permit:</span> {permitNumber}</p>
            <p><span className="text-slate-400">COREN Lead:</span> {leadEngineer}</p>
            <p><span className="text-slate-400">Audit Reference:</span> AUD-PROV-2026-9901</p>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Button href="/admin/projects" variant="outline" size="sm">
              View in Projects Registry
            </Button>
            <Button
              onClick={() => {
                setIsSuccess(false);
                setStep(1);
              }}
              variant="primary"
              size="sm"
            >
              Provision Another Project
            </Button>
          </div>
        </div>
      ) : (
        // Wizard Form Card
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          {step === 1 && (
            <div className="space-y-5 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Step 1: Organization & Corporate Entity
                </h3>
                <p className="text-xs text-slate-500">
                  Define corporate details and Corporate Affairs Commission (CAC) registration reference.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate Entity / Company Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CAC Registration Number
                  </label>
                  <input
                    type="text"
                    value={cacNumber}
                    onChange={(e) => setCacNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enterprise Tier
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
                  >
                    <option value="enterprise">Tier 1 Enterprise Contractor</option>
                    <option value="contractor">Civil Engineering Contractor</option>
                    <option value="government_agency">Government Regulatory Agency</option>
                    <option value="consultancy">Supervising Engineering Consultancy</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Administrative Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Continue to Project Details
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Step 2: Project Workspace & Statutory Permits
                </h3>
                <p className="text-xs text-slate-500">
                  Assign site identifiers, LASBCA building control permits, and COREN accredited lead engineer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Project Title
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    System Identifier Code
                  </label>
                  <input
                    type="text"
                    value={projectCode}
                    onChange={(e) => setProjectCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 font-mono outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Site Location & LGA
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    LASBCA / Statutory Permit Index
                  </label>
                  <input
                    type="text"
                    value={permitNumber}
                    onChange={(e) => setPermitNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 font-mono outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned COREN Lead Resident Engineer
                  </label>
                  <input
                    type="text"
                    value={leadEngineer}
                    onChange={(e) => setLeadEngineer(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  size="sm"
                  leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Review Configuration
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Step 3: Review & Authorize Provisioning
                </h3>
                <p className="text-xs text-slate-500">
                  Confirm parameters before committing the workspace into the immutable platform ledger.
                </p>
              </div>

              {/* Review Manifest */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400">Organization:</span>
                    <p className="font-bold text-slate-900">{orgName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">CAC Number:</span>
                    <p className="font-bold text-slate-900">{cacNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Project Code:</span>
                    <p className="font-mono font-bold text-slate-900">{projectCode}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Permit Number:</span>
                    <p className="font-mono font-bold text-emerald-800">{permitNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">Lead Engineer:</span>
                    <p className="font-bold text-slate-900">{leadEngineer}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center gap-4 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    WhatsApp Gateway Enabled
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Telegram Bot Enabled
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  size="sm"
                  leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setIsConfirmOpen(true)}
                  variant="primary"
                  size="sm"
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Commit Provisioning
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleExecuteProvisioning}
        title="Authorize Project Provisioning?"
        description={`You are about to officially register workspace ${projectCode} under ${orgName}. This action will generate a platform audit certificate and bind the LASBCA permit index.`}
        confirmLabel="Authorize & Commit"
        variant="primary"
        isLoading={isProvisioning}
      />
    </div>
  );
}
