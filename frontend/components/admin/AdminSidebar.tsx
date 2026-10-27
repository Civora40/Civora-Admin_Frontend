'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  ScrollText,
  Bell,
  Users,
  ShieldCheck,
  MailPlus,
  UserCheck,
  Building2,
  Briefcase,
  Network,
  Sparkles,
  MessageSquareShare,
  ListOrdered,
  AlertTriangle,
  FileText,
  FileCheck,
  ShieldAlert,
  SlidersHorizontal,
  Settings,
  Palette,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { ADMIN_NAVIGATION, AdminNavItem } from '@/config/admin-navigation';
import { CivoraLogo } from '@/components/brand/CivoraLogo';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Activity,
  ScrollText,
  Bell,
  Users,
  ShieldCheck,
  MailPlus,
  UserCheck,
  Building2,
  Briefcase,
  Network,
  Sparkles,
  MessageSquareShare,
  ListOrdered,
  AlertTriangle,
  FileText,
  FileCheck,
  ShieldAlert,
  SlidersHorizontal,
  Settings,
  Palette,
  Sliders,
};

interface AdminSidebarProps {
  badgeCounts?: Record<string, number>;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ badgeCounts = {}, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex flex-col h-full w-72 bg-[#001237] text-white border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="flex flex-col px-6 py-5 border-b border-slate-800/80">
        <CivoraLogo size="md" theme="dark" variant="full" href="/admin" />
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#4FAAA7] bg-[#4FAAA7]/10 px-2 py-0.5 rounded border border-[#4FAAA7]/20">
            Admin Console
          </span>
          <span className="text-[10px] text-slate-400 font-medium">v1.4.0</span>
        </div>
      </div>

      {/* Navigation Groups List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 sidebar-scroll">
        {ADMIN_NAVIGATION.map((group) => (
          <div key={group.id} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {group.title}
            </h3>

            <div className="space-y-0.5 pt-1">
              {group.items.map((item: AdminNavItem) => {
                const IconComponent = ICON_MAP[item.iconName] || LayoutDashboard;
                const active = isItemActive(item.href);
                const badgeValue = item.badgeKey ? badgeCounts[item.badgeKey] : undefined;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                      active
                        ? 'bg-[#3B68DE] text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <IconComponent
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          active
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-[#4FAAA7]'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {typeof badgeValue === 'number' && badgeValue > 0 && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            active
                              ? 'bg-white text-[#3B68DE]'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {badgeValue}
                        </span>
                      )}
                      {active && (
                        <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Governance Signature */}
      <div className="p-4 border-t border-slate-800/80 bg-[#000d28]/70 text-[11px] text-slate-400">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-300">High-Assurance Plane</span>
        </div>
        <p className="text-[10px] leading-relaxed text-slate-400">
          All administrative actions logged with tamper-evident audit hashes.
        </p>
      </div>
    </aside>
  );
}
