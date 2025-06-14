import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiServices } from '../../services/api';
import type { Recipe, SearchFilters, RecipeSearchParams, IngredientMatchParams } from '../../types';
import Toast from 'react-native-toast-message';

// Query Keys
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (filters: SearchFilters) => [...recipeKeys.lists(), { filters }] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
  popular: () => [...recipeKeys.all, 'popular'] as const,
  featured: () => [...recipeKeys.all, 'featured'] as const,
  search: (params: RecipeSearchParams) => [...recipeKeys.all, 'search', params] as const,
  byIngredients: (params: IngredientMatchParams) => [...recipeKeys.all, 'byIngredients', params] as const,
};

// Get recipes with filters
export const useRecipes = (filters?: SearchFilters) => {
  return useInfiniteQuery({
    queryKey: recipeKeys.list(filters || {}),
    queryFn: ({ pageParam = 1 }) => 
      apiServices.recipes.getRecipes(pageParam, 20, filters),
    getNextPageParam: (lastPage) => 
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });
};

// Get single recipe
export const useRecipe = (recipeId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: recipeKeys.detail(recipeId),
    queryFn: () => apiServices.recipes.getRecipeById(recipeId),
    enabled: enabled && !!recipeId,
  });
};

// Get popular recipes
export const usePopularRecipes = () => {
  return useInfiniteQuery({
    queryKey: recipeKeys.popular(),
    queryFn: ({ pageParam = 1 }) => 
      apiServices.recipes.getPopularRecipes(pageParam, 20),
    getNextPageParam: (lastPage) => 
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });
};

// Get featured recipes
export const useFeaturedRecipes = () => {
  return useInfiniteQuery({
    queryKey: recipeKeys.featured(),
    queryFn: ({ pageParam = 1 }) => 
      apiServices.recipes.getFeaturedRecipes(pageParam, 20),
    getNextPageParam: (lastPage) => 
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });
};

// Search recipes
export const useRecipeSearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RecipeSearchParams & { page?: number; limit?: number }) =>
      apiServices.recipes.searchRecipes(params),
    onSuccess: (data, variables) => {
      // Cache the search results
      queryClient.setQueryData(recipeKeys.search(variables), data);
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Arama Hatası',
        text2: error.message || 'Tarifler aranırken bir hata oluştu',
      });
    },
  });
};

// Get recipes by ingredients
export const useRecipesByIngredients = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: IngredientMatchParams & { page?: number; limit?: number }) =>
      apiServices.recipes.getRecipesByIngredients(params),
    onSuccess: (data, variables) => {
      // Cache the results
      queryClient.setQueryData(recipeKeys.byIngredients(variables), data);
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Malzeme Eşleştirme Hatası',
        text2: error.message || 'Malzemelerle tarif eşleştirilirken bir hata oluştu',
      });
    },
  });
};

// Rate recipe
export const useRateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipeId, rating, comment }: { 
      recipeId: string; 
      rating: number; 
      comment?: string; 
    }) => apiServices.recipes.rateRecipe(recipeId, rating, comment),
    onSuccess: (data, variables) => {
      // Invalidate recipe details to refresh rating
      queryClient.invalidateQueries({ 
        queryKey: recipeKeys.detail(variables.recipeId) 
      });
      
      Toast.show({
        type: 'success',
        text1: 'Değerlendirme Başarılı',
        text2: 'Tarifinizi değerlendirdiğiniz için teşekkürler!',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Değerlendirme Hatası',
        text2: error.message || 'Tarif değerlendirilirken bir hata oluştu',
      });
    },
  });
}; 