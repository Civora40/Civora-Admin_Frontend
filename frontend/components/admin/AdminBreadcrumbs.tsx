import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function AdminBreadcrumbs({ items, className = '' }: AdminBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-1.5 text-xs text-slate-500 overflow-x-auto ${className}`}
    >
      <Link
        href="/admin"
        className="inline-flex items-center text-slate-400 hover:text-slate-700 transition-colors"
        title="Admin Home"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-slate-900 transition-colors truncate max-w-[150px] sm:max-w-none"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-900 truncate max-w-[180px] sm:max-w-none">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
