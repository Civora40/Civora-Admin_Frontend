import React from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  Briefcase,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  FileCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/Button';

export default async function AdminOverviewPage() {
  const metrics = await AdminService.getOverviewMetrics();
  const recentActivities = (await AdminService.getAuditLogs()).slice(0, 5);
  const telemetry = await AdminService.getChannelTelemetry();
  const qualityIssues = (await AdminService.getDataQualityIssues()).filter(
    (q) => q.status === 'open'
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Platform Overview & Control Plane"
        description="Real-time operational summary, identity telemetry, and cross-project governance indicators."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              href="/admin/provisioning"
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Provision Project
            </Button>
            <Button
              href="/admin/governance/audit-log"
              variant="outline"
              size="sm"
              leftIcon={<FileCheck className="w-3.5 h-3.5" />}
            >
              Audit Stream
            </Button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Organizations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Tenants
            </span>
            <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#18243D]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#001237]">
              {metrics.totalOrganizations}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Registered Organizations
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
            <Link
              href="/admin/organizations"
              className="text-[#3B68DE] hover:text-[#2e54b8] font-semibold inline-flex items-center gap-1"
            >
              <span>View registry</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
            <span className="text-slate-400">100% active</span>
          </div>
        </div>

        {/* Active Projects */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Monitored Projects
            </span>
            <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#18243D]">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#001237]">
              {metrics.activeProjects}
            </span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
              Live Field Sites
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
            <Link
              href="/admin/projects"
              className="text-[#3B68DE] hover:text-[#2e54b8] font-semibold inline-flex items-center gap-1"
            >
              <span>Inspect sites</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
            <span className="text-slate-400">LASBCA tracked</span>
          </div>
        </div>

        {/* Platform Users */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Platform Accounts
            </span>
            <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#18243D]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#001237]">
              {metrics.totalUsers}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({metrics.activeUsers} Active)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
            <Link
              href="/admin/users"
              className="text-[#3B68DE] hover:text-[#2e54b8] font-semibold inline-flex items-center gap-1"
            >
              <span>Manage users</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
            <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded text-[10px] font-semibold">
              {metrics.pendingInvitations} pending
            </span>
          </div>
        </div>

        {/* Ingestion 24h & Integrity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              24h Ingested Messages
            </span>
            <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#18243D]">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#001237]">
              {metrics.messagesIngested24h.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              WhatsApp & Telegram
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
            <span className="text-slate-500 font-medium">
              Trapped: <strong className="text-slate-900">{metrics.duplicatesBlocked24h} dups</strong>
            </span>
            <StatusBadge status="operational" size="sm" />
          </div>
        </div>
      </div>

      {/* Operational Telemetry Banner */}
      <div className="rounded-2xl bg-[#001237] text-white p-6 shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#4FAAA7]">
                Live Platform Telemetry
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white font-['Encode_Sans_Condensed',sans-serif]">
              All core services operational across Lagos & Abuja cloud gateways
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              WhatsApp Business API webhook receiver and Telegram Field Bot workers are processing field drawings, concrete crushing test sheets, and daily progress logs with zero dropped packets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/system-health"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#18243D] hover:bg-[#223354] border border-slate-700 text-xs font-semibold text-white transition-colors"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Inspect Health Telemetry</span>
            </Link>
            <Link
              href="/admin/integrations/messaging"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3B68DE] hover:bg-[#2e54b8] text-xs font-semibold text-white transition-colors shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messaging Gateways</span>
            </Link>
          </div>
        </div>

        {/* Channel Status Strips */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          {telemetry.map((t) => (
            <div
              key={t.channel}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#18243D]/90 border border-slate-800"
            >
              <div className="space-y-0.5 truncate pr-3">
                <p className="text-xs font-bold text-white truncate">{t.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{t.identifier}</p>
              </div>
              <div className="text-right shrink-0">
                <StatusBadge status={t.status} size="sm" />
                <p className="text-[10px] text-slate-400 mt-1">
                  {t.totalProcessed24h.toLocaleString()} processed / 24h
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Data Quality Alerts & Recent Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Data Quality Flags */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Data Quality & Compliance Traps
              </h3>
            </div>
            <Link
              href="/admin/data-quality"
              className="text-xs font-semibold text-[#3B68DE] hover:underline"
            >
              View all ({metrics.openQualityFlags})
            </Link>
          </div>

          {qualityIssues.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No outstanding data quality flags across active projects.
            </p>
          ) : (
            <div className="space-y-3">
              {qualityIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-2 text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {issue.title}
                    </span>
                    <StatusBadge status={issue.severity} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {issue.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span className="truncate max-w-[200px]">{issue.affectedProject}</span>
                    <Link
                      href="/admin/data-quality"
                      className="text-[#3B68DE] font-semibold hover:underline"
                    >
                      Resolve trap →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Platform Audit Events */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#3B68DE] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Recent Audit Trail Stream
              </h3>
            </div>
            <Link
              href="/admin/governance/audit-log"
              className="text-xs font-semibold text-[#3B68DE] hover:underline"
            >
              Full log →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 space-y-0">
            {recentActivities.map((log) => (
              <div key={log.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">
                    {log.action}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {log.description}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Actor: {log.actorName}</span>
                  <span className="font-mono">{log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
