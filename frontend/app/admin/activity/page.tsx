'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Clock,
  User,
  Shield,
} from 'lucide-react';
import { AdminService } from '@/lib/services/admin-service';
import { AuditLogEntry } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { FilterBar } from '@/components/admin/FilterBar';

export default function ActivityFeedPage() {
  const [activities, setActivities] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function loadActivities() {
      const data = await AdminService.getAuditLogs();
      setActivities(data);
    }
    loadActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchesCategory =
        selectedCategory === 'all' || act.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.targetResource.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activities, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Platform Activity & Audit Stream"
        description="Comprehensive real-time chronological timeline of administrative events, access reviews, and mutations."
        breadcrumbs={[
          { label: 'Platform Operations', href: '/admin' },
          { label: 'Activity Feed' },
        ]}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities by actor, action, or description..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
          />
        </div>

        <FilterBar
          filters={[
            {
              id: 'category',
              label: 'Category',
              value: selectedCategory,
              options: [
                { label: 'All Event Categories', value: 'all' },
                { label: 'Access Control', value: 'access_control' },
                { label: 'Authentication', value: 'authentication' },
                { label: 'Integrations & Jobs', value: 'integration' },
                { label: 'Policy & Governance', value: 'policy' },
                { label: 'Security Sentinels', value: 'security' },
              ],
              onChange: setSelectedCategory,
            },
          ]}
          onReset={() => {
            setSelectedCategory('all');
            setSearchQuery('');
          }}
        />
      </div>

      {/* Activity Timeline List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No activity events matched your criteria.
          </div>
        ) : (
          filteredActivities.map((entry) => (
            <div
              key={entry.id}
              className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors space-y-2 text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#001237] text-white">
                    {entry.action}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {entry.category.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(entry.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {entry.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{entry.actorName}</span>
                  <span className="text-[11px] text-slate-400">({entry.actorRole})</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target: {entry.targetResource}</span>
                </div>

                <div className="ml-auto font-mono text-[11px] text-slate-400">
                  {entry.ipAddress}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
