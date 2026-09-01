import { useQuery } from '@tanstack/react-query';
import { CafeFilterParams, SearchCafesResponse } from '@cafefinder/shared';
import { api } from '../services/api.js';

export function useCafeSearch(filters: CafeFilterParams) {
  return useQuery<SearchCafesResponse>({
    queryKey: [
      'cafes',
      filters.query,
      filters.lat,
      filters.lng,
      filters.radius,
      filters.minRating,
      filters.openNow,
      filters.open24Hours,
      filters.priceLevels?.join(','),
      filters.category,
      filters.amenities?.join(','),
      filters.sortBy,
      filters.page,
      filters.pageSize,
    ],
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (filters.query) params.query = filters.query;
      if (filters.lat !== undefined) params.lat = filters.lat;
      if (filters.lng !== undefined) params.lng = filters.lng;
      if (filters.radius) params.radius = filters.radius;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.openNow) params.openNow = filters.openNow;
      if (filters.open24Hours) params.open24Hours = filters.open24Hours;
      if (filters.priceLevels && filters.priceLevels.length > 0) {
        params.priceLevels = filters.priceLevels.join(',');
      }
      if (filters.category && filters.category !== 'all') {
        params.category = filters.category;
      }
      if (filters.amenities && filters.amenities.length > 0) {
        params.amenities = filters.amenities.join(',');
      }
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.page) params.page = filters.page;
      if (filters.pageSize) params.pageSize = filters.pageSize;

      const res = await api.get('/cafes/search', { params });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
