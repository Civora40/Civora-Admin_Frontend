import React from 'react';
import { ShieldX, ArrowLeft, LogOut } from 'lucide-react';
import { CivoraLogo } from '@/components/brand/CivoraLogo';
import { Button } from '@/components/ui/Button';

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#001237] px-4 text-center">
      <div className="mb-6">
        <CivoraLogo size="lg" theme="dark" variant="full" />
      </div>

      <div className="max-w-md w-full bg-[#18243D] p-8 rounded-2xl border border-slate-700/80 shadow-2xl space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto mb-2">
          <ShieldX className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-bold text-white font-['Encode_Sans_Condensed',sans-serif]">
          Administrative Clearance Required
        </h1>

        <p className="text-xs text-slate-300 leading-relaxed">
          Your authenticated profile does not possess the <span className="text-[#4FAAA7] font-semibold">platform_admin</span> capability required to manage tenant organizations, user roles, security events, or statutory compliance policies.
        </p>

        <div className="p-3 bg-[#001237] rounded-xl border border-slate-800 text-[11px] text-slate-400 text-left space-y-1">
          <p><strong className="text-slate-200">Required Role:</strong> Platform Administrator</p>
          <p><strong className="text-slate-200">Scope:</strong> Platform Control Plane</p>
          <p><strong className="text-slate-200">Audit Status:</strong> Unauthorized access attempt logged</p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Button
            href="/login"
            variant="outline"
            size="sm"
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Switch Account
          </Button>

          <Button
            href="/admin"
            variant="primary"
            size="sm"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Return to Admin Home
          </Button>
        </div>
      </div>
    </div>
  );
}
