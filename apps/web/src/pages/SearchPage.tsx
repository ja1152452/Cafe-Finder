import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  Map as MapIcon,
  List,
  LayoutGrid,
  X,
  Navigation,
  Clock,
  Star,
  Wifi,
  Zap,
} from 'lucide-react';
import { SearchBar } from '../components/SearchBar.js';
import { FilterPanel } from '../components/FilterPanel.js';
import { SortDropdown } from '../components/SortDropdown.js';
import { CafeGrid } from '../components/CafeGrid.js';
import { CafeList } from '../components/CafeList.js';
import { CafeMap } from '../components/CafeMap.js';
import { SkeletonCard } from '../components/SkeletonCard.js';
import { EmptyState } from '../components/EmptyState.js';
import { ErrorState } from '../components/ErrorState.js';
import { useCafeSearch } from '../hooks/useCafeSearch.js';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { useFilterStore } from '../stores/filterStore.js';
import { useMapStore } from '../stores/mapStore.js';
import { LocationCoordinates } from '@cafefinder/shared';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    filters,
    setAllFilters,
    setSortBy,
    setRadius,
    setOpenNow,
    setMinRating,
    toggleAmenity,
    setOpen24Hours,
    resetFilters,
  } = useFilterStore();
  const { setCenter, setUserLocation } = useMapStore();
  const { getLocation, loading: geoLoading } = useGeolocation();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [cardLayout, setCardLayout] = useState<'grid' | 'list'>('grid');

  // 1. Sync URL search params into filter store on initial load or URL change
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const radiusParam = searchParams.get('radius');
    const minRatingParam = searchParams.get('minRating');
    const openNowParam = searchParams.get('openNow');
    const open24Param = searchParams.get('open24');
    const priceParam = searchParams.get('price');
    const categoryParam = searchParams.get('category');
    const sortByParam = searchParams.get('sortBy');

    const lat = latParam ? parseFloat(latParam) : undefined;
    const lng = lngParam ? parseFloat(lngParam) : undefined;

    if (lat && lng) {
      setCenter({ lat, lng });
    }

    setAllFilters({
      query: q,
      lat: lat ?? filters.lat,
      lng: lng ?? filters.lng,
      radius: radiusParam ? parseInt(radiusParam, 10) : filters.radius,
      minRating: minRatingParam ? parseFloat(minRatingParam) : filters.minRating,
      openNow: openNowParam === 'true',
      open24Hours: open24Param === 'true',
      priceLevels: priceParam ? priceParam.split(',').map((p) => parseInt(p, 10) as any) : filters.priceLevels,
      category: (categoryParam as any) || filters.category,
      sortBy: (sortByParam as any) || filters.sortBy,
    });
  }, [searchParams]);

  // 2. Fetch Cafes from backend
  const { data, isLoading, isError, refetch } = useCafeSearch(filters);

  // 3. Handle "Search this area" from interactive map
  const handleSearchThisArea = (newCenter: LocationCoordinates) => {
    setAllFilters({
      lat: newCenter.lat,
      lng: newCenter.lng,
    });
    const params = new URLSearchParams(searchParams);
    params.set('lat', newCenter.lat.toString());
    params.set('lng', newCenter.lng.toString());
    setSearchParams(params);
  };

  // Quick 1-Click "Nearest to Me" Handler
  const handleFilterNearest = () => {
    getLocation((loc) => {
      setUserLocation(loc);
      setCenter(loc);
      setAllFilters({
        lat: loc.lat,
        lng: loc.lng,
        sortBy: 'distance',
      });
      const params = new URLSearchParams(searchParams);
      params.set('lat', loc.lat.toString());
      params.set('lng', loc.lng.toString());
      params.set('sortBy', 'distance');
      setSearchParams(params);
    });
  };

  const cafes = data?.cafes || [];
  const total = data?.total || 0;
  const isNearestActive = filters.sortBy === 'distance';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Search Header Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 max-w-2xl">
          <SearchBar initialQuery={filters.query} size="md" />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-2.5">
          {/* Mobile View Toggle (List | Map) */}
          <div className="md:hidden flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
            <button
              type="button"
              onClick={() => setMobileView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mobileView === 'list'
                  ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileView('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mobileView === 'map'
                  ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>

          {/* Desktop Layout Toggle (Grid / List) */}
          <div className="hidden lg:flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
            <button
              type="button"
              onClick={() => setCardLayout('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                cardLayout === 'grid'
                  ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-stone-500'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCardLayout('list')}
              title="List View"
              className={`p-1.5 rounded-lg transition-colors ${
                cardLayout === 'list'
                  ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-stone-500'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <SortDropdown />

          {/* Mobile Filter Sheet Trigger */}
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-200"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* QUICK FILTER CHIPS BAR: 1-Click Nearest, Radius, & Attributes */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* Nearest to Me Highlight Pill */}
        <button
          type="button"
          onClick={handleFilterNearest}
          disabled={geoLoading}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm active:scale-95 cursor-pointer ${
            isNearestActive
              ? 'bg-amber-600 text-white ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-stone-900 shadow-amber-600/20'
              : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:border-amber-500'
          }`}
        >
          <Navigation className={`w-3.5 h-3.5 ${geoLoading ? 'animate-spin' : isNearestActive ? 'text-white' : 'text-amber-600'}`} />
          <span>{geoLoading ? 'Detecting GPS...' : isNearestActive ? '✓ Nearest to Me' : '📍 Nearest to Me'}</span>
        </button>

        {/* Radius Pills */}
        {[
          { label: '1 km', value: 1000 },
          { label: '3 km', value: 3000 },
          { label: '5 km', value: 5000 },
          { label: '10 km', value: 10000 },
          { label: '25 km', value: 25000 },
          { label: 'All', value: 0 },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              setRadius(item.value);
              const params = new URLSearchParams(searchParams);
              if (item.value === 0) {
                params.delete('radius');
              } else {
                params.set('radius', item.value.toString());
              }
              setSearchParams(params);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
              (item.value === 0 && !filters.radius) || filters.radius === item.value
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {item.label}
          </button>
        ))}

        <div className="h-4 w-px bg-stone-300 dark:bg-stone-700 mx-1 flex-shrink-0" />

        {/* Open Now Chip */}
        <button
          type="button"
          onClick={() => setOpenNow(!filters.openNow)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
            filters.openNow
              ? 'bg-emerald-600 text-white'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Open Now</span>
        </button>

        {/* Top Rated Chip */}
        <button
          type="button"
          onClick={() => setMinRating(filters.minRating === 4.5 ? 0 : 4.5)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
            filters.minRating === 4.5
              ? 'bg-amber-500 text-white'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>4.5+ Rated</span>
        </button>

        {/* 24/7 Chip */}
        <button
          type="button"
          onClick={() => setOpen24Hours(!filters.open24Hours)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
            filters.open24Hours
              ? 'bg-indigo-600 text-white'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>24/7 Hours</span>
        </button>

        {/* Fast Wi-Fi Chip */}
        <button
          type="button"
          onClick={() => toggleAmenity('wifi')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
            filters.amenities?.includes('wifi')
              ? 'bg-blue-600 text-white'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Wifi className="w-3.5 h-3.5" />
          <span>Fast Wi-Fi</span>
        </button>
      </div>

      {/* Main Discovery Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Side: Results List */}
        <div className={`md:col-span-6 lg:col-span-7 space-y-6 ${mobileView === 'map' ? 'hidden md:block' : ''}`}>
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h2 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                {isLoading ? 'Searching cafes...' : `${total} Cafes Found`}
              </h2>
              {filters.query && (
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Results for &ldquo;{filters.query}&rdquo;
                </p>
              )}
            </div>

            {/* Reset All Filters button if active */}
            {(filters.query || filters.openNow || filters.open24Hours || (filters.minRating ?? 0) > 0 || (filters.priceLevels && filters.priceLevels.length > 0) || (filters.amenities && filters.amenities.length > 0)) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Results State Rendering */}
          {isLoading ? (
            <div className={cardLayout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : cafes.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <div>
              {cardLayout === 'grid' ? (
                <CafeGrid cafes={cafes} />
              ) : (
                <CafeList cafes={cafes} />
              )}
            </div>
          )}
        </div>

        {/* Right Side: Sticky Interactive Map */}
        <div className={`md:col-span-6 lg:col-span-5 sticky top-20 h-[calc(100vh-6.5rem)] ${mobileView === 'list' ? 'hidden md:block' : ''}`}>
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-800">
            <CafeMap
              cafes={cafes}
              className="w-full h-full"
              onSearchArea={handleSearchThisArea}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Filter & Refine
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterPanel />

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setIsFilterDrawerOpen(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
