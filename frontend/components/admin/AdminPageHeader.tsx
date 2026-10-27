import React from 'react';
import { AdminBreadcrumbs, BreadcrumbItem } from './AdminBreadcrumbs';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  badge,
  className = '',
}: AdminPageHeaderProps) {
  return (
    <div className={`mb-6 sm:mb-8 space-y-3 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <AdminBreadcrumbs items={breadcrumbs} className="mb-2" />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
