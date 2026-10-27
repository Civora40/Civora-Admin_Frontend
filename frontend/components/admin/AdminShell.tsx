'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminMobileNav } from './AdminMobileNav';
import { CivoraUser } from '@/types';

interface AdminShellProps {
  children: React.ReactNode;
  currentUser?: CivoraUser | null;
  badgeCounts?: Record<string, number>;
}

export function AdminShell({
  children,
  currentUser,
  badgeCounts = {
    unreadNotifications: 2,
    pendingInvitations: 2,
    failedIngestionRuns: 1,
    qualityIssues: 2,
    criticalSecurityEvents: 0,
  },
}: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <AdminSidebar badgeCounts={badgeCounts} />
      </div>

      {/* Mobile Drawer */}
      <AdminMobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        badgeCounts={badgeCounts}
      />

      {/* Main Administrative Application Frame */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <AdminHeader
          currentUser={currentUser}
          unreadCount={badgeCounts.unreadNotifications}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
