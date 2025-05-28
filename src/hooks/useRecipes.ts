import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { useErrorHandler } from '../utils/errorHandler';
import type { 
  Recipe, 
  PaginatedResponse, 
  SearchFilters,
  RecipeSearchParams,
  IngredientMatchParams
} from '../types';

export interface UseRecipesOptions {
  initialPage?: number;
  pageSize?: number;
  autoLoad?: boolean;
  languageCode?: string;
}

export interface UseRecipesResult {
  // Data
  recipes: Recipe[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  
  // State
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  
  // Actions
  loadRecipes: (params?: RecipeSearchParams) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  searchRecipes: (query: string, filters?: SearchFilters) => Promise<void>;
  getRecipesByIngredients: (params: IngredientMatchParams) => Promise<void>;
  getPopularRecipes: () => Promise<void>;
  getFeaturedRecipes: () => Promise<void>;
  reset: () => void;
}

export const useRecipes = (options: UseRecipesOptions = {}): UseRecipesResult => {
  const {
    initialPage = 1,
    pageSize = 20,
    autoLoad = true,
    languageCode = 'tr'
  } = options;

  const { handleError } = useErrorHandler();

  // State
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParams, setLastParams] = useState<RecipeSearchParams | null>(null);

  // Computed values
  const hasMore = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);

  // Helper function to update state from API response
  const updateFromResponse = useCallback((
    response: PaginatedResponse<Recipe>,
    append: boolean = false
  ) => {
    setRecipes(prev => append ? [...prev, ...response.data] : response.data);
    setTotalCount(response.pagination.total);
    setCurrentPage(response.pagination.page);
    setTotalPages(response.pagination.totalPages);
  }, []);

  // Load recipes with search parameters
  const loadRecipes = useCallback(async (params: RecipeSearchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchParams = {
        ...params,
        languageCode: params.languageCode || languageCode,
        page: 1,
        limit: pageSize,
      };

      const response = await api.recipes.searchRecipes(searchParams);
      updateFromResponse(response, false);
      setLastParams(searchParams);
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, [pageSize, languageCode, handleError, updateFromResponse]);

  // Load more recipes (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !lastParams) return;

    try {
      setLoading(true);
      setError(null);

      const nextPage = currentPage + 1;
      const response = await api.recipes.searchRecipes({
        ...lastParams,
        page: nextPage,
        limit: pageSize,
      });

      updateFromResponse(response, true);
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, lastParams, currentPage, pageSize, handleError, updateFromResponse]);

  // Refresh current data
  const refresh = useCallback(async () => {
    if (!lastParams) {
      await loadRecipes();
      return;
    }

    try {
      setRefreshing(true);
      setError(null);

      const response = await api.recipes.searchRecipes({
        ...lastParams,
        page: 1,
        limit: pageSize,
      });

      updateFromResponse(response, false);
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
    } finally {
      setRefreshing(false);
    }
  }, [lastParams, pageSize, handleError, updateFromResponse, loadRecipes]);

  // Search recipes by text query
  const searchRecipes = useCallback(async (
    query: string,
    filters: SearchFilters = {}
  ) => {
    const searchParams: RecipeSearchParams = {
      query: query.trim(),
      languageCode,
      attributes: filters.attributes,
      maxCookingTime: filters.maxCookingTime,
      categories: filters.categories,
      difficultyLevelMax: filters.difficultyLevelMax,
      includePremium: filters.includePremium,
    };

    await loadRecipes(searchParams);
  }, [languageCode, loadRecipes]);

  // Get recipes by ingredients
  const getRecipesByIngredients = useCallback(async (params: IngredientMatchParams) => {
    try {
      setLoading(true);
      setError(null);

      const matchParams = {
        ...params,
        languageCode: params.languageCode || languageCode,
        page: 1,
        limit: pageSize,
      };

      const response = await api.recipes.getRecipesByIngredients(matchParams);
      
      // Transform the response to match Recipe interface
      const transformedRecipes: Recipe[] = response.data.map(item => ({
        ...item,
        // Add match data as computed fields
        matchPercentage: item.matchPercentage,
        missingIngredients: item.missingIngredients,
      }));

      setRecipes(transformedRecipes);
      setTotalCount(response.pagination.total);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
      
      // Store params for pagination
      setLastParams({
        userId: params.userId,
        languageCode: params.languageCode || languageCode,
      });
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, [languageCode, pageSize, handleError]);

  // Get popular recipes
  const getPopularRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.recipes.getPopularRecipes(languageCode, 1, pageSize);
      updateFromResponse(response, false);
      
      // Store params for pagination
      setLastParams({ languageCode });
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, [languageCode, pageSize, handleError, updateFromResponse]);

  // Get featured recipes
  const getFeaturedRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.recipes.getFeaturedRecipes(languageCode, 1, pageSize);
      updateFromResponse(response, false);
      
      // Store params for pagination
      setLastParams({ languageCode });
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, [languageCode, pageSize, handleError, updateFromResponse]);

  // Reset state
  const reset = useCallback(() => {
    setRecipes([]);
    setTotalCount(0);
    setCurrentPage(initialPage);
    setTotalPages(0);
    setLoading(false);
    setRefreshing(false);
    setError(null);
    setLastParams(null);
  }, [initialPage]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      getPopularRecipes();
    }
  }, [autoLoad, getPopularRecipes]);

  return {
    // Data
    recipes,
    totalCount,
    currentPage,
    totalPages,
    hasMore,
    
    // State
    loading,
    refreshing,
    error,
    
    // Actions
    loadRecipes,
    loadMore,
    refresh,
    searchRecipes,
    getRecipesByIngredients,
    getPopularRecipes,
    getFeaturedRecipes,
    reset,
  };
};

// Hook for getting recipes by category
export interface UseCategoryRecipesOptions {
  categoryId: string;
  languageCode?: string;
  pageSize?: number;
  autoLoad?: boolean;
}

export const useCategoryRecipes = (options: UseCategoryRecipesOptions) => {
  const {
    categoryId,
    languageCode = 'tr',
    pageSize = 20,
    autoLoad = true
  } = options;

  const { handleError } = useErrorHandler();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);

  const loadCategoryRecipes = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.categories.getCategoryRecipes(
        categoryId,
        languageCode,
        page,
        pageSize
      );

      setRecipes(prev => append ? [...prev, ...response.data] : response.data);
      setTotalCount(response.pagination.total);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, [categoryId, languageCode, pageSize, handleError]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await loadCategoryRecipes(currentPage + 1, true);
  }, [hasMore, loading, currentPage, loadCategoryRecipes]);

  const refresh = useCallback(async () => {
    await loadCategoryRecipes(1, false);
  }, [loadCategoryRecipes]);

  useEffect(() => {
    if (autoLoad && categoryId) {
      loadCategoryRecipes();
    }
  }, [autoLoad, categoryId, loadCategoryRecipes]);

  return {
    recipes,
    totalCount,
    currentPage,
    totalPages,
    hasMore,
    loading,
    error,
    loadMore,
    refresh,
    reload: () => loadCategoryRecipes(1, false),
  };
}; 