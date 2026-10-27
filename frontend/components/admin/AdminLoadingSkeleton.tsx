import React from 'react';

interface AdminLoadingSkeletonProps {
  rows?: number;
  showCards?: boolean;
}

export function AdminLoadingSkeleton({
  rows = 4,
  showCards = true,
}: AdminLoadingSkeletonProps) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Metric Cards Skeleton */}
      {showCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-slate-200 bg-white p-5 space-y-3"
            >
              <div className="h-4 w-1/3 bg-slate-200 rounded" />
              <div className="h-8 w-1/2 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="h-5 w-48 bg-slate-200 rounded" />
          <div className="h-8 w-24 bg-slate-200 rounded" />
        </div>

        <div className="space-y-3 pt-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-12 bg-slate-200 rounded" />
              <div className="h-4 flex-1 bg-slate-200 rounded" />
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-4 w-16 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
