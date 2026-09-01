import React from 'react';
import { SlidersHorizontal, RotateCcw, Check, Sparkles } from 'lucide-react';
import {
  DISTANCE_OPTIONS,
  RATING_OPTIONS,
  PRICE_LEVELS,
  CAFE_CATEGORIES,
  AMENITIES_LIST,
  PriceLevel,
  Amenity,
  CafeCategory,
} from '@cafefinder/shared';
import { useFilterStore } from '../stores/filterStore.js';

interface FilterPanelProps {
  className?: string;
  isDrawer?: boolean;
  onClose?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  className = '',
  isDrawer = false,
  onClose,
}) => {
  const {
    filters,
    setRadius,
    setMinRating,
    setOpenNow,
    setOpen24Hours,
    togglePriceLevel,
    setCategory,
    toggleAmenity,
    resetFilters,
  } = useFilterStore();

  const activeFiltersCount =
    (filters.radius !== 5000 ? 1 : 0) +
    ((filters.minRating && filters.minRating > 0) ? 1 : 0) +
    (filters.openNow ? 1 : 0) +
    (filters.open24Hours ? 1 : 0) +
    (filters.priceLevels?.length || 0) +
    (filters.category && filters.category !== 'all' ? 1 : 0) +
    (filters.amenities?.length || 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
          <SlidersHorizontal className="w-4 h-4 text-amber-600 dark:text-amber-500" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-white">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Distance Radius */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Distance Radius
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {DISTANCE_OPTIONS.map((dist) => {
            const isSelected = (filters.radius || 5000) === dist.value;
            return (
              <button
                key={dist.value}
                type="button"
                onClick={() => setRadius(dist.value)}
                className={`px-2.5 py-2 rounded-xl text-xs font-semibold transition-all text-center ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {dist.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Rating */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Minimum Rating
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {RATING_OPTIONS.map((rate) => {
            const isSelected = (filters.minRating || 0) === rate.value;
            return (
              <button
                key={rate.value}
                type="button"
                onClick={() => setMinRating(rate.value)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <span>{rate.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Open Status */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Open Status
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOpenNow(!filters.openNow)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filters.openNow
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
            <span>Open Now</span>
          </button>
          <button
            type="button"
            onClick={() => setOpen24Hours(!filters.open24Hours)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filters.open24Hours
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <span>Open 24 Hours</span>
          </button>
        </div>
      </div>

      {/* 4. Price Tiers */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Price Tier
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {PRICE_LEVELS.map((price) => {
            const isSelected = filters.priceLevels?.includes(price.level);
            return (
              <button
                key={price.level}
                type="button"
                onClick={() => togglePriceLevel(price.level)}
                title={price.description}
                className={`py-2 rounded-xl text-xs font-bold transition-all text-center ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {price.symbol}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Cafe Category */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Category
        </label>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between ${
              !filters.category || filters.category === 'all'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span>All Categories</span>
            {(!filters.category || filters.category === 'all') && <Check className="w-3.5 h-3.5 text-amber-600" />}
          </button>
          {CAFE_CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Verified Amenities */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Features & Amenities
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {AMENITIES_LIST.map((amenity) => {
            const isSelected = filters.amenities?.includes(amenity.id);
            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={`px-2.5 py-2 rounded-xl text-xs font-medium text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <span className="truncate">{amenity.label}</span>
                {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {isDrawer && (
        <div className="pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};
