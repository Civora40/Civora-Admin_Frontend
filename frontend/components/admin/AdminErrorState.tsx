import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AdminErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function AdminErrorState({
  title = 'Failed to load administrative telemetry',
  message = 'An unexpected error occurred while communicating with the Civora backend control service. All event attempts have been recorded.',
  onRetry,
  className = '',
}: AdminErrorStateProps) {
  return (
    <div
      className={`rounded-2xl border border-rose-200 bg-rose-50/50 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4 ring-8 ring-rose-50">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-600 max-w-sm mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button
          onClick={onRetry}
          size="sm"
          variant="outline"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Retry Request
        </Button>
      )}
    </div>
  );
}
