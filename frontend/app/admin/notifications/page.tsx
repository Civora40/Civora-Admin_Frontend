'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCheck, Clock, ArrowRight } from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { PlatformNotification } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/Button';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<PlatformNotification[]>([]);
  const [filterSeverity, setFilterSeverity] = useState('all');

  const loadNotifications = async () => {
    const data = await AdminService.getNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    await AdminService.markAllNotificationsAsRead();
    await loadNotifications();
  };

  const handleMarkAsRead = async (id: string) => {
    await AdminService.markNotificationAsRead(id);
    await loadNotifications();
  };

  const filtered = notifications.filter((n) =>
    filterSeverity === 'all' ? true : n.severity === filterSeverity
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Administrative Notifications & Alerts"
        description="High-priority system anomalies, compliance violations, and security audit reminders."
        breadcrumbs={[
          { label: 'Platform Operations', href: '/admin' },
          { label: 'Notifications' },
        ]}
        actions={
          unreadCount > 0 ? (
            <Button
              onClick={handleMarkAllRead}
              variant="outline"
              size="sm"
              leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
            >
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs">
        {[
          { label: `All Alerts (${notifications.length})`, value: 'all' },
          { label: 'Critical Severity', value: 'critical' },
          { label: 'Warnings', value: 'warning' },
          { label: 'Information & Audit', value: 'info' },
          { label: 'System Successes', value: 'success' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterSeverity(tab.value)}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterSeverity === tab.value
                ? 'bg-[#001237] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 text-xs">
            No notifications matching this filter category.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.read
                  ? 'border-slate-200 bg-white'
                  : 'border-[#3B68DE]/40 bg-blue-50/20 shadow-xs'
              }`}
            >
              <div className="space-y-1.5 flex-1 pr-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {!item.read && (
                    <span className="h-2 w-2 rounded-full bg-[#3B68DE] shrink-0" />
                  )}
                  <StatusBadge status={item.severity} size="sm" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto sm:ml-0">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.message}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                {!item.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(item.id)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                )}

                {item.linkHref && (
                  <Link
                    href={item.linkHref}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#001237] text-white hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
