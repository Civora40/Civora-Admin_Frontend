'use client';

import React from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CivoraLogo } from '@/components/brand/CivoraLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#001237] px-4 text-center">
      <div className="mb-6">
        <CivoraLogo size="lg" theme="dark" variant="full" />
      </div>

      <div className="max-w-md w-full bg-[#18243D] p-8 rounded-2xl border border-slate-700/80 shadow-2xl space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-[#3B68DE] flex items-center justify-center mx-auto mb-2">
          <Compass className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-bold text-white font-['Encode_Sans_Condensed',sans-serif]">
          Administrative Route Not Found
        </h1>

        <p className="text-xs text-slate-300 leading-relaxed">
          The requested administrative endpoint or resource does not exist in the Civora Admin Control Plane registry.
        </p>

        <div className="pt-2">
          <Button
            href="/admin"
            variant="primary"
            size="sm"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Return to Admin Overview
          </Button>
        </div>
      </div>
    </div>
  );
}
