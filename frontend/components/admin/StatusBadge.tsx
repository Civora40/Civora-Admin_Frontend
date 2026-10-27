import React from 'react';

export type StatusType =
  | 'active'
  | 'healthy'
  | 'operational'
  | 'success'
  | 'approved'
  | 'compliant'
  | 'pending'
  | 'in_review'
  | 'in_progress'
  | 'partial_failure'
  | 'degraded'
  | 'investigating'
  | 'open'
  | 'flagged'
  | 'suspended'
  | 'failed'
  | 'critical'
  | 'unhealthy'
  | 'expired'
  | 'revoked'
  | 'archived'
  | 'on_hold';

interface StatusBadgeProps {
  status: string | StatusType;
  label?: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  label,
  size = 'md',
  pulse,
  className = '',
}: StatusBadgeProps) {
  const normalized = (status || '').toLowerCase().replace(/\s+/g, '_') as StatusType;

  // Visual mapping adhering to Civora tokens
  const config: Record<
    string,
    { bg: string; text: string; border: string; dot: string; defaultLabel: string }
  > = {
    // Greens (Healthy / Active / Approved / Compliant / Success)
    active: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      defaultLabel: 'Active',
    },
    healthy: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      defaultLabel: 'Healthy',
    },
    operational: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      defaultLabel: 'Operational',
    },
    success: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      defaultLabel: 'Success',
    },
    approved: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      defaultLabel: 'Approved',
    },
    compliant: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      defaultLabel: 'Compliant',
    },

    // Teals (In Progress / Resolved)
    in_progress: {
      bg: 'bg-[#4FAAA7]/15',
      text: 'text-teal-900',
      border: 'border-[#4FAAA7]/40',
      dot: 'bg-[#4FAAA7]',
      defaultLabel: 'In Progress',
    },
    resolved: {
      bg: 'bg-[#4FAAA7]/15',
      text: 'text-teal-900',
      border: 'border-[#4FAAA7]/40',
      dot: 'bg-[#4FAAA7]',
      defaultLabel: 'Resolved',
    },

    // Blues (Information / Standard)
    provisioning: {
      bg: 'bg-[#3B68DE]/15',
      text: 'text-blue-800',
      border: 'border-[#3B68DE]/30',
      dot: 'bg-[#3B68DE]',
      defaultLabel: 'Provisioning',
    },

    // Ambers (Pending / In Review / Degraded / Partial)
    pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      dot: 'bg-amber-500',
      defaultLabel: 'Pending',
    },
    in_review: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      dot: 'bg-amber-500',
      defaultLabel: 'In Review',
    },
    investigating: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      dot: 'bg-amber-500',
      defaultLabel: 'Investigating',
    },
    degraded: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      dot: 'bg-amber-500',
      defaultLabel: 'Degraded',
    },
    partial_failure: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      dot: 'bg-amber-500',
      defaultLabel: 'Partial Failure',
    },

    // Roses (Critical / Failed / Suspended / Flagged / Revoked)
    critical: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      defaultLabel: 'Critical',
    },
    unhealthy: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      defaultLabel: 'Unhealthy',
    },
    failed: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      defaultLabel: 'Failed',
    },
    suspended: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      defaultLabel: 'Suspended',
    },
    flagged: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      defaultLabel: 'Flagged',
    },
    open: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      defaultLabel: 'Open Flag',
    },
    revoked: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-300',
      dot: 'bg-slate-400',
      defaultLabel: 'Revoked',
    },
    expired: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-300',
      dot: 'bg-slate-400',
      defaultLabel: 'Expired',
    },
    archived: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-300',
      dot: 'bg-slate-400',
      defaultLabel: 'Archived',
    },
    on_hold: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-300',
      dot: 'bg-slate-400',
      defaultLabel: 'On Hold',
    },
  };

  const style = config[normalized] || {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    defaultLabel: status,
  };

  const displayLabel = label || style.defaultLabel;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  const shouldPulse = pulse !== undefined ? pulse : normalized === 'healthy' || normalized === 'operational';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses} select-none ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot} ${shouldPulse ? 'animate-pulse' : ''}`}
        aria-hidden="true"
      />
      <span>{displayLabel}</span>
    </span>
  );
}
