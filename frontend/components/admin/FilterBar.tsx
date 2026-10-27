import React from 'react';
import { RotateCcw, Filter } from 'lucide-react';

export interface FilterItem {
  id: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

interface FilterBarProps {
  filters: FilterItem[];
  onReset?: () => void;
  className?: string;
}

export function FilterBar({ filters, onReset, className = '' }: FilterBarProps) {
  const hasActiveFilters = filters.some((f) => f.value && f.value !== 'all');

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 pr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
        </div>

        {filters.map((filter) => (
          <div key={filter.id} className="relative">
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white px-3 py-1.5 pr-8 text-xs font-medium text-slate-800 outline-none transition-all focus:border-[#001237] focus:ring-1 focus:ring-[#001237] cursor-pointer"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
              ▼
            </div>
          </div>
        ))}
      </div>

      {hasActiveFilters && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
}
