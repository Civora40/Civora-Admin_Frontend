'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  RefreshCw,
  Cpu,
  Database,
  Radio,
  HardDrive,
  Bot,
  Zap,
} from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { SystemServiceHealth } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/Button';

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  core: Zap,
  database: Database,
  queue: Cpu,
  ai_inference: Bot,
  storage: HardDrive,
  telecom: Radio,
};

export default function SystemHealthPage() {
  const [services, setServices] = useState<SystemServiceHealth[]>([]);
  const [isPinging, setIsPinging] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>('');

  const loadData = async () => {
    const data = await AdminService.getSystemServiceHealth();
    setServices(data);
    setLastCheckTime(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePingServices = async () => {
    setIsPinging(true);
    // Simulate real probe
    await new Promise((resolve) => setTimeout(resolve, 800));
    await loadData();
    setIsPinging(false);
  };

  const healthyCount = services.filter((s) => s.status === 'healthy').length;
  const degradedCount = services.filter((s) => s.status === 'degraded').length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="System Health & Infrastructure Telemetry"
        description="Real-time operational indicators, database replication latency, and queue workers."
        breadcrumbs={[
          { label: 'Platform Operations', href: '/admin' },
          { label: 'System Health' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline-block">
              Last probe: {lastCheckTime || 'Just now'}
            </span>
            <Button
              onClick={handlePingServices}
              variant="outline"
              size="sm"
              isLoading={isPinging}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Probe Services
            </Button>
          </div>
        }
      />

      {/* Global Status Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Core Systems Operational
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {healthyCount} of {services.length} Healthy
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              99.94% average 90-day platform uptime. 1 secondary service experiencing non-blocking latency.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 self-end md:self-auto text-xs">
          <div className="text-right">
            <p className="text-slate-500">Telemetry SLA</p>
            <p className="font-bold text-slate-900">Tier-1 Guaranteed</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-right">
            <p className="text-slate-500">Degraded Services</p>
            <p className={`font-bold ${degradedCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {degradedCount} Service
            </p>
          </div>
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const Icon = CATEGORY_ICON_MAP[service.category] || Activity;
          const isHealthy = service.status === 'healthy';

          return (
            <div
              key={service.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isHealthy
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                        {service.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {service.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <StatusBadge status={service.status} size="sm" />
                </div>

                {service.message && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {service.message}
                  </p>
                )}
              </div>

              {/* Metric Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Latency:</span>
                  <span className="font-semibold text-slate-900">{service.latencyMs}ms</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">90d Uptime:</span>
                  <span className="font-semibold text-emerald-700">{service.uptime90d}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
