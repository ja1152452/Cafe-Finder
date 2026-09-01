import { create } from 'zustand';
import { CafeFilterParams, PriceLevel, Amenity, SortOption, CafeCategory } from '@cafefinder/shared';

interface FilterState {
  filters: CafeFilterParams;
  viewMode: 'list' | 'map' | 'split';
  setQuery: (query: string) => void;
  setCoordinates: (lat: number, lng: number) => void;
  setRadius: (radius: number) => void;
  setMinRating: (rating: number) => void;
  setOpenNow: (openNow: boolean) => void;
  setOpen24Hours: (open24Hours: boolean) => void;
  togglePriceLevel: (level: PriceLevel) => void;
  setCategory: (category: CafeCategory | 'all') => void;
  toggleAmenity: (amenity: Amenity) => void;
  setSortBy: (sortBy: SortOption) => void;
  setViewMode: (mode: 'list' | 'map' | 'split') => void;
  setAllFilters: (filters: Partial<CafeFilterParams>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: CafeFilterParams = {
  query: '',
  radius: 5000,
  minRating: 0,
  openNow: false,
  open24Hours: false,
  priceLevels: [],
  category: 'all',
  amenities: [],
  sortBy: 'recommended',
  page: 1,
  pageSize: 20,
};

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: { ...DEFAULT_FILTERS },
  viewMode: 'split',

  setQuery: (query) => set((s) => ({ filters: { ...s.filters, query, page: 1 } })),
  setCoordinates: (lat, lng) => set((s) => ({ filters: { ...s.filters, lat, lng, page: 1 } })),
  setRadius: (radius) => set((s) => ({ filters: { ...s.filters, radius, page: 1 } })),
  setMinRating: (minRating) => set((s) => ({ filters: { ...s.filters, minRating, page: 1 } })),
  setOpenNow: (openNow) => set((s) => ({ filters: { ...s.filters, openNow, page: 1 } })),
  setOpen24Hours: (open24Hours) => set((s) => ({ filters: { ...s.filters, open24Hours, page: 1 } })),
  
  togglePriceLevel: (level) =>
    set((s) => {
      const current = s.filters.priceLevels || [];
      const updated = current.includes(level)
        ? current.filter((l) => l !== level)
        : [...current, level];
      return { filters: { ...s.filters, priceLevels: updated, page: 1 } };
    }),

  setCategory: (category) => set((s) => ({ filters: { ...s.filters, category, page: 1 } })),

  toggleAmenity: (amenity) =>
    set((s) => {
      const current = s.filters.amenities || [];
      const updated = current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity];
      return { filters: { ...s.filters, amenities: updated, page: 1 } };
    }),

  setSortBy: (sortBy) => set((s) => ({ filters: { ...s.filters, sortBy } })),
  setViewMode: (viewMode) => set({ viewMode }),

  setAllFilters: (newFilters) =>
    set((s) => ({ filters: { ...s.filters, ...newFilters } })),

  resetFilters: () =>
    set((s) => ({
      filters: {
        ...DEFAULT_FILTERS,
        lat: s.filters.lat,
        lng: s.filters.lng,
      },
    })),
}));
