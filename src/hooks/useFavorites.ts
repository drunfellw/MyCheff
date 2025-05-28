import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { useErrorHandler } from '../utils/errorHandler';
import type { Recipe, PaginatedResponse } from '../types';

export interface UseFavoritesOptions {
  pageSize?: number;
  autoLoad?: boolean;
  languageCode?: string;
}

export interface UseFavoritesResult {
  // Data
  favorites: Recipe[];
  favoriteIds: Set<string>;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  
  // State
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  
  // Actions
  loadFavorites: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  addToFavorites: (recipeId: string) => Promise<void>;
  removeFromFavorites: (recipeId: string) => Promise<void>;
  toggleFavorite: (recipeId: string) => Promise<void>;
  isFavorite: (recipeId: string) => boolean;
  checkIsFavorite: (recipeId: string) => Promise<boolean>;
  reset: () => void;
}

export const useFavorites = (options: UseFavoritesOptions = {}): UseFavoritesResult => {
  const {
    pageSize = 20,
    autoLoad = true,
    languageCode = 'tr'
  } = options;

  const { handleError } = useErrorHandler();

  // State
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Computed values
  const favoriteIds = useMemo(
    () => new Set(favorites.map(recipe => recipe.id)),
    [favorites]
  );

  const hasMore = useMemo(
    () => currentPage < totalPages,
    [currentPage, totalPages]
  );

  // Helper function to update state from API response
  const updateFromResponse = useCallback((
    response: PaginatedResponse<Recipe>,
    append: boolean = false
  ) => {
    setFavorites(prev => append ? [...prev, ...response.data] : response.data);
    setTotalCount(response.pagination.total);
    setCurrentPage(response.pagination.page);
    setTotalPages(response.pagination.totalPages);
  }, []);

  // Load user's favorite recipes
  const loadFavorites = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.user.getFavorites(page, pageSize, languageCode);
      updateFromResponse(response, append);
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, [pageSize, languageCode, handleError, updateFromResponse]);

  // Load more favorites (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    const nextPage = currentPage + 1;
    await loadFavorites(nextPage, true);
  }, [hasMore, loading, currentPage, loadFavorites]);

  // Refresh favorites
  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      const response = await api.user.getFavorites(1, pageSize, languageCode);
      updateFromResponse(response, false);
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
    } finally {
      setRefreshing(false);
    }
  }, [pageSize, languageCode, handleError, updateFromResponse]);

  // Add recipe to favorites
  const addToFavorites = useCallback(async (recipeId: string) => {
    try {
      setError(null);

      await api.user.addToFavorites(recipeId);

      // Optimistically update the local state
      // Note: We don't add the full recipe here since we'd need to fetch it
      // The UI should handle this by showing the recipe as favorited
      // and the next refresh will include it in the favorites list
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
      throw appError; // Re-throw for component handling
    }
  }, [handleError]);

  // Remove recipe from favorites
  const removeFromFavorites = useCallback(async (recipeId: string) => {
    try {
      setError(null);

      await api.user.removeFromFavorites(recipeId);

      // Optimistically update the local state
      setFavorites(prev => prev.filter(recipe => recipe.id !== recipeId));
      setTotalCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
      
      // Revert optimistic update on error
      await refresh();
      throw appError; // Re-throw for component handling
    }
  }, [handleError, refresh]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (recipeId: string) => {
    if (favoriteIds.has(recipeId)) {
      await removeFromFavorites(recipeId);
    } else {
      await addToFavorites(recipeId);
    }
  }, [favoriteIds, removeFromFavorites, addToFavorites]);

  // Check if recipe is favorite (local check)
  const isFavorite = useCallback((recipeId: string): boolean => {
    return favoriteIds.has(recipeId);
  }, [favoriteIds]);

  // Check if recipe is favorite (server check)
  const checkIsFavorite = useCallback(async (recipeId: string): Promise<boolean> => {
    try {
      return await api.user.isFavorite(recipeId);
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
      return false;
    }
  }, [handleError]);

  // Reset state
  const reset = useCallback(() => {
    setFavorites([]);
    setTotalCount(0);
    setCurrentPage(1);
    setTotalPages(0);
    setLoading(false);
    setRefreshing(false);
    setError(null);
  }, []);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadFavorites();
    }
  }, [autoLoad, loadFavorites]);

  return {
    // Data
    favorites,
    favoriteIds,
    totalCount,
    currentPage,
    totalPages,
    hasMore,
    
    // State
    loading,
    refreshing,
    error,
    
    // Actions
    loadFavorites: () => loadFavorites(1, false),
    loadMore,
    refresh,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    checkIsFavorite,
    reset,
  };
};

// Hook for managing favorite status of a single recipe
export interface UseFavoriteStatusOptions {
  recipeId: string;
  initialStatus?: boolean;
}

export interface UseFavoriteStatusResult {
  isFavorite: boolean;
  loading: boolean;
  error: string | null;
  
  toggleFavorite: () => Promise<void>;
  setFavorite: (status: boolean) => Promise<void>;
  checkStatus: () => Promise<void>;
}

export const useFavoriteStatus = (options: UseFavoriteStatusOptions): UseFavoriteStatusResult => {
  const { recipeId, initialStatus = false } = options;
  const { handleError } = useErrorHandler();

  const [isFavorite, setIsFavorite] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check favorite status from server
  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const status = await api.user.isFavorite(recipeId);
      setIsFavorite(status);
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, [recipeId, handleError]);

  // Set favorite status
  const setFavorite = useCallback(async (status: boolean) => {
    try {
      setLoading(true);
      setError(null);

      if (status) {
        await api.user.addToFavorites(recipeId);
      } else {
        await api.user.removeFromFavorites(recipeId);
      }

      setIsFavorite(status);
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
      throw appError; // Re-throw for component handling
    } finally {
      setLoading(false);
    }
  }, [recipeId, handleError]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async () => {
    await setFavorite(!isFavorite);
  }, [isFavorite, setFavorite]);

  // Check status on mount if no initial status provided
  useEffect(() => {
    if (initialStatus === undefined) {
      checkStatus();
    }
  }, [initialStatus, checkStatus]);

  return {
    isFavorite,
    loading,
    error,
    
    toggleFavorite,
    setFavorite,
    checkStatus,
  };
}; 