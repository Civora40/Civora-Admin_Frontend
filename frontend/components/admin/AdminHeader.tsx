'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Shield,
  Menu,
  ChevronDown,
  LogOut,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { CivoraLogo } from '@/components/brand/CivoraLogo';

interface AdminHeaderProps {
  currentUser?: CivoraUser | null;
  unreadCount?: number;
  onOpenMobileNav?: () => void;
}

export function AdminHeader({
  currentUser,
  unreadCount = 2,
  onOpenMobileNav,
}: AdminHeaderProps) {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    try {
      await fetch('/api/auth/login', { method: 'DELETE' });
    } catch {
      // ignore network error
    }
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('civora_admin_token');
    }
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile hamburger & Context breadcrumb info */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="inline-flex lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden">
          <CivoraLogo size="sm" variant="mark" href="/admin" />
        </div>

        {/* Environment & Security Boundary Pill */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-[#18243D] border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Admin Control Plane
          </span>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-medium text-slate-500">
            Civora Cloud (Nigeria West)
          </span>
        </div>
      </div>

      {/* Right Actions: Search shortcut, System Heartbeat, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Telemetry Heartbeat Status */}
        <Link
          href="/admin/system-health"
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>Services Operational</span>
        </Link>

        {/* Notifications Icon Button */}
        <Link
          href="/admin/notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Administrative notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#3B68DE] px-1 text-[10px] font-bold text-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </Link>

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        {/* User Identity Menu Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-2.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
          >
            <div className="h-8 w-8 rounded-lg bg-[#001237] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser?.name
                ? currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                : 'AD'}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-[#001237] leading-tight truncate max-w-[150px]">
                {currentUser?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight truncate max-w-[150px]">
                {currentUser?.title || 'Platform Admin'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-xl border border-slate-200 z-50 text-xs">
                <div className="px-3 py-2.5 border-b border-slate-100">
                  <p className="font-bold text-[#001237] text-sm truncate">
                    {currentUser?.name || 'Platform Administrator'}
                  </p>
                  <p className="text-slate-500 truncate">{currentUser?.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#001237] text-white uppercase tracking-wider">
                      <Shield className="w-2.5 h-2.5" />
                      Platform Admin
                    </span>
                    {currentUser?.corenNumber && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        COREN {currentUser.corenNumber}
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/admin/access/reviews"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>Access Review Audit</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <Activity className="w-4 h-4 text-slate-400" />
                    <span>Security & Platform Settings</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out of Admin Console</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
