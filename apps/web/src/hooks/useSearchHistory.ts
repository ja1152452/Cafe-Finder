import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SearchHistoryItem } from '@cafefinder/shared';
import { api } from '../services/api.js';

export function useSearchHistory() {
  const queryClient = useQueryClient();

  const { data: history = [], isLoading } = useQuery<SearchHistoryItem[]>({
    queryKey: ['search-history'],
    queryFn: async () => {
      const res = await api.get('/search-history');
      return res.data.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const addHistoryMutation = useMutation({
    mutationFn: async (item: { query: string; latitude?: number; longitude?: number; address?: string }) => {
      const res = await api.post('/search-history', item);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search-history'] });
    },
  });

  const deleteHistoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/search-history/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search-history'] });
    },
  });

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      await api.delete('/search-history');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search-history'] });
    },
  });

  return {
    history,
    isLoading,
    addHistory: addHistoryMutation.mutate,
    deleteHistory: deleteHistoryMutation.mutate,
    clearHistory: clearHistoryMutation.mutate,
  };
}
