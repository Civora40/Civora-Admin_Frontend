import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { AdminService } from '@/lib/services/admin-service';
import { AdminShell } from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const metrics = await AdminService.getOverviewMetrics();

  const badgeCounts = {
    unreadNotifications: metrics.unreadNotifications,
    pendingInvitations: metrics.pendingInvitations,
    failedIngestionRuns: metrics.duplicatesBlocked24h > 20 ? 1 : 0,
    qualityIssues: metrics.openQualityFlags,
    criticalSecurityEvents: metrics.criticalSecurityEvents,
  };

  return (
    <AdminShell currentUser={user} badgeCounts={badgeCounts}>
      {children}
    </AdminShell>
  );
}
