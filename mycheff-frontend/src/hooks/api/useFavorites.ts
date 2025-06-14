import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiServices } from '../../services/api';
import type { Recipe } from '../../types';
import Toast from 'react-native-toast-message';

// Query Keys
export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  list: () => [...favoriteKeys.lists()] as const,
  check: (recipeId: string) => [...favoriteKeys.all, 'check', recipeId] as const,
};

// Get user favorites with infinite scroll
export const useFavorites = () => {
  return useInfiniteQuery({
    queryKey: favoriteKeys.list(),
    queryFn: ({ pageParam = 1 }) => 
      apiServices.user.getFavorites(pageParam, 20),
    getNextPageParam: (lastPage) => 
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });
};

// Check if recipe is favorite
export const useIsFavorite = (recipeId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: favoriteKeys.check(recipeId),
    queryFn: () => apiServices.user.isFavorite(recipeId),
    enabled: enabled && !!recipeId,
  });
};

// Add to favorites
export const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: string) => apiServices.user.addToFavorites(recipeId),
    onSuccess: (_, recipeId) => {
      // Update the favorite status
      queryClient.setQueryData(favoriteKeys.check(recipeId), true);
      
      // Invalidate favorites list to refresh
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() });
      
      Toast.show({
        type: 'success',
        text1: 'Favorilere Eklendi',
        text2: 'Tarif favorilerinize eklendi',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Favorilere Eklenemedi',
        text2: error.message || 'Tarif favorilere eklenirken bir hata oluştu',
      });
    },
  });
};

// Remove from favorites
export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: string) => apiServices.user.removeFromFavorites(recipeId),
    onSuccess: (_, recipeId) => {
      // Update the favorite status
      queryClient.setQueryData(favoriteKeys.check(recipeId), false);
      
      // Invalidate favorites list to refresh
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() });
      
      Toast.show({
        type: 'success',
        text1: 'Favorilerden Çıkarıldı',
        text2: 'Tarif favorilerinizden çıkarıldı',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Favorilerden Çıkarılamadı',
        text2: error.message || 'Tarif favorilerden çıkarılırken bir hata oluştu',
      });
    },
  });
};

// Toggle favorite status
export const useToggleFavorite = () => {
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();
  const queryClient = useQueryClient();

  return {
    toggleFavorite: (recipeId: string, currentStatus: boolean) => {
      if (currentStatus) {
        removeFromFavorites.mutate(recipeId);
      } else {
        addToFavorites.mutate(recipeId);
      }
    },
    isLoading: addToFavorites.isPending || removeFromFavorites.isPending,
  };
}; 