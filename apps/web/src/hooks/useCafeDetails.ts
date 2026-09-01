import { useQuery } from '@tanstack/react-query';
import { CafeDetail, LocationCoordinates } from '@cafefinder/shared';
import { api } from '../services/api.js';

export function useCafeDetails(placeId?: string, userLocation?: LocationCoordinates | null) {
  return useQuery<CafeDetail>({
    queryKey: ['cafe-detail', placeId, userLocation?.lat, userLocation?.lng],
    queryFn: async () => {
      if (!placeId) throw new Error('Missing placeId');

      const params: Record<string, any> = {};
      if (userLocation) {
        params.lat = userLocation.lat;
        params.lng = userLocation.lng;
      }

      const res = await api.get(`/cafes/${placeId}`, { params });
      return res.data.data;
    },
    enabled: Boolean(placeId),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
