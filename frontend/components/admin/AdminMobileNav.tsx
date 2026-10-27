'use client';

import React from 'react';
import { X } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

interface AdminMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  badgeCounts?: Record<string, number>;
}

export function AdminMobileNav({ isOpen, onClose, badgeCounts }: AdminMobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#001237] shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-250">
        <div className="absolute top-4 right-3 z-10">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <AdminSidebar badgeCounts={badgeCounts} onCloseMobile={onClose} />
      </div>
    </div>
  );
}
