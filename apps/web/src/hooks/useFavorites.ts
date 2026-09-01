import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FavoriteItem, Cafe } from '@cafefinder/shared';
import { api } from '../services/api.js';
import { useAuthStore } from '../stores/authStore.js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useFavorites() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const { data: favorites = [], isLoading } = useQuery<FavoriteItem[]>({
    queryKey: ['favorites', isAuthenticated],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const res = await api.get('/favorites');
      return res.data.data;
    },
    enabled: isAuthenticated,
  });

  const isFavorite = (placeId: string) => {
    if (!isAuthenticated) return false;
    return favorites.some((f) => f.placeId === placeId);
  };

  const addFavoriteMutation = useMutation({
    mutationFn: async (cafe: Cafe) => {
      const payload: Partial<FavoriteItem> = {
        placeId: cafe.placeId,
        placeName: cafe.name,
        placeAddress: cafe.address,
        placePhotoUrl: cafe.primaryPhotoUrl || cafe.photos?.[0]?.url || null,
        rating: cafe.rating,
        priceLevel: cafe.priceLevel || null,
        lat: cafe.location?.lat,
        lng: cafe.location?.lng,
      };

      const res = await api.post('/favorites', payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(`Saved "${data.placeName}" to your favorites!`);
    },
    onError: () => {
      toast.error('Failed to save cafe to favorites.');
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (placeId: string) => {
      await api.delete(`/favorites/${placeId}`);
      return placeId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.info('Removed from favorites.');
    },
    onError: () => {
      toast.error('Failed to remove favorite.');
    },
  });

  const toggleFavorite = (cafe: Cafe) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save cafes to your favorites!', {
        action: {
          label: 'Sign In',
          onClick: () => navigate('/login'),
        },
      });
      return;
    }

    if (isFavorite(cafe.placeId)) {
      removeFavoriteMutation.mutate(cafe.placeId);
    } else {
      addFavoriteMutation.mutate(cafe);
    }
  };

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
  };
}
