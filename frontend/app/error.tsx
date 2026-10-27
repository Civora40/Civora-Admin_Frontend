'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors securely without leaking internal traces
    console.error('Civora Admin Console error caught:', error.message);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">
          System Execution Error
        </h1>

        <p className="text-xs text-slate-600 leading-relaxed">
          An operational exception occurred while rendering this administrative interface. The event has been captured by the platform telemetry worker.
        </p>

        <div className="pt-2">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Retry Component Render
          </Button>
        </div>
      </div>
    </div>
  );
}
