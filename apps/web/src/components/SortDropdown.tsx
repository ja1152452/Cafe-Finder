import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SORT_OPTIONS, SortOption } from '@cafefinder/shared';
import { useFilterStore } from '../stores/filterStore.js';

export const SortDropdown: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { filters, setSortBy } = useFilterStore();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs sm:text-sm font-medium shadow-sm hover:border-amber-500/50 transition-colors">
        <ArrowUpDown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <span className="text-stone-500 dark:text-stone-400 hidden sm:inline">Sort by:</span>
        <select
          value={filters.sortBy || 'recommended'}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          aria-label="Sort cafe results"
          className="bg-transparent text-stone-800 dark:text-stone-100 font-semibold focus:outline-none cursor-pointer pr-1"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
