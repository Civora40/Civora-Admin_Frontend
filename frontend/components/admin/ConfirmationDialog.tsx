'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'primary' | 'teal';
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'destructive',
  isLoading = false,
}: ConfirmationDialogProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const isDestructive = variant === 'destructive';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={() => !isLoading && onClose()}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 z-50 animate-in zoom-in-95 duration-150 text-left"
      >
        <button
          type="button"
          disabled={isLoading}
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-rose-100 text-rose-600'
                : 'bg-blue-50 text-[#3B68DE]'
            }`}
          >
            {isDestructive ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <Info className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1.5 flex-1 pr-4">
            <h3
              id="confirmation-dialog-title"
              className="text-base font-bold text-slate-900 leading-snug"
            >
              {title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={onClose}
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            variant={variant}
            size="sm"
            isLoading={isLoading}
            onClick={async () => {
              await onConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
