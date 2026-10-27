'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FolderOpen,
} from 'lucide-react';

export interface ColumnDef<T> {
  id: string;
  header: string | React.ReactNode;
  accessorKey?: keyof T;
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (row: T) => string;
  searchPlaceholder?: string;
  searchableKeys?: (keyof T)[];
  pageSize?: number;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  toolbarActions?: React.ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = 'Search records...',
  searchableKeys = [],
  pageSize = 10,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search query or filter parameters.',
  emptyAction,
  toolbarActions,
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumnId, setSortColumnId] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase().trim();
    return data.filter((item) => {
      if (searchableKeys.length > 0) {
        return searchableKeys.some((key) => {
          const val = item[key];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(query);
        });
      }

      // Default: inspect all scalar values
      return Object.values(item).some((val) => {
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(query);
        }
        return false;
      });
    });
  }, [data, searchQuery, searchableKeys]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortColumnId) return filteredData;

    const column = columns.find((c) => c.id === sortColumnId);
    if (!column || !column.accessorKey) return filteredData;

    const key = column.accessorKey;
    return [...filteredData].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        const cmp = valA.localeCompare(valB);
        return sortDirection === 'asc' ? cmp : -cmp;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumnId, sortDirection, columns]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (columnId: string, sortable?: boolean) => {
    if (!sortable) return;

    if (sortColumnId === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumnId(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumnId(columnId);
      setSortDirection('asc');
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Top Controls: Search Bar and Toolbar Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#001237] focus:ring-1 focus:ring-[#001237]"
          />
        </div>

        {toolbarActions && (
          <div className="flex items-center gap-2 shrink-0">{toolbarActions}</div>
        )}
      </div>

      {/* Table Surface */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                {columns.map((col) => {
                  const isSorted = sortColumnId === col.id;
                  return (
                    <th
                      key={col.id}
                      onClick={() => handleSort(col.id, col.sortable)}
                      style={{ width: col.width }}
                      className={`px-4 py-3.5 select-none ${
                        col.sortable ? 'cursor-pointer hover:bg-slate-100/80 transition-colors' : ''
                      } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${
                        col.className || ''
                      }`}
                    >
                      <div
                        className={`inline-flex items-center gap-1.5 ${
                          col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                        }`}
                      >
                        <span>{col.header}</span>
                        {col.sortable && (
                          <span className="text-slate-400">
                            {isSorted ? (
                              sortDirection === 'asc' ? (
                                <ArrowUp className="w-3.5 h-3.5 text-[#3B68DE]" />
                              ) : (
                                <ArrowDown className="w-3.5 h-3.5 text-[#3B68DE]" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3 h-3 opacity-60" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-normal text-slate-800">
              {isLoading ? (
                // Loading Skeletons
                Array.from({ length: 5 }).map((_, rIdx) => (
                  <tr key={rIdx} className="animate-pulse">
                    {columns.map((col) => (
                      <td key={col.id} className="px-4 py-3.5">
                        <div className="h-4 bg-slate-200/80 rounded-md w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                // Empty state inside table
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <FolderOpen className="w-5 h-5 text-slate-500" />
                      </div>
                      <p className="font-semibold text-slate-800 text-sm">{emptyTitle}</p>
                      <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">{emptyDescription}</p>
                      {emptyAction}
                    </div>
                  </td>
                </tr>
              ) : (
                // Data Rows
                paginatedData.map((row, rowIdx) => {
                  const key = keyExtractor(row);
                  return (
                    <tr
                      key={key}
                      onClick={() => onRowClick && onRowClick(row)}
                      className={`transition-colors ${
                        onRowClick ? 'cursor-pointer hover:bg-slate-50/80' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      {columns.map((col) => {
                        const content = col.cell
                          ? col.cell(row, rowIdx)
                          : col.accessorKey
                          ? String(row[col.accessorKey] ?? '')
                          : null;

                        return (
                          <td
                            key={col.id}
                            className={`px-4 py-3 align-middle ${
                              col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                            } ${col.className || ''}`}
                          >
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && sortedData.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 bg-white">
            <div>
              Showing{' '}
              <span className="font-semibold text-slate-900">
                {(currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-900">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </span>{' '}
              of <span className="font-semibold text-slate-900">{sortedData.length}</span>{' '}
              results
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <span className="px-2 text-slate-600 font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
