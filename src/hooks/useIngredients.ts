import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { useErrorHandler } from '../utils/errorHandler';
import { useDebouncedCallback } from '../utils/performance';
import type { Ingredient, UserIngredient } from '../types';

export interface UseIngredientsOptions {
  languageCode?: string;
  autoLoad?: boolean;
  debounceMs?: number;
}

export interface UseIngredientsResult {
  // Available ingredients
  allIngredients: Ingredient[];
  searchResults: Ingredient[];
  searchQuery: string;
  
  // User's ingredients
  userIngredients: UserIngredient[];
  selectedIngredientIds: string[];
  
  // State
  loading: boolean;
  searching: boolean;
  error: string | null;
  
  // Actions
  searchIngredients: (query: string) => void;
  loadAllIngredients: () => Promise<void>;
  loadUserIngredients: () => Promise<void>;
  addUserIngredient: (ingredientId: string, quantity: number, unit: string) => Promise<void>;
  updateUserIngredient: (ingredientId: string, quantity: number, unit: string) => Promise<void>;
  removeUserIngredient: (ingredientId: string) => Promise<void>;
  clearSearch: () => void;
  reset: () => void;
}

export const useIngredients = (options: UseIngredientsOptions = {}): UseIngredientsResult => {
  const {
    languageCode = 'tr',
    autoLoad = true,
    debounceMs = 300
  } = options;

  const { handleError } = useErrorHandler();

  // State
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userIngredients, setUserIngredients] = useState<UserIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Computed values
  const selectedIngredientIds = useMemo(
    () => userIngredients.map(ui => ui.ingredientId),
    [userIngredients]
  );

  // Load all available ingredients
  const loadAllIngredients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const ingredients = await api.ingredients.getAllIngredients(languageCode);
      setAllIngredients(ingredients);
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, [languageCode, handleError]);

  // Search ingredients with debouncing
  const performSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setError(null);

      const results = await api.ingredients.searchIngredients(query, languageCode, 10);
      setSearchResults(results);
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [languageCode, handleError]);

  // Debounced search function
  const debouncedSearch = useDebouncedCallback(
    performSearch,
    debounceMs,
    [performSearch]
  );

  // Search ingredients (public API)
  const searchIngredients = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Load user's ingredients
  const loadUserIngredients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const ingredients = await api.user.getUserIngredients();
      setUserIngredients(ingredients);
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Add ingredient to user's list
  const addUserIngredient = useCallback(async (
    ingredientId: string,
    quantity: number,
    unit: string
  ) => {
    try {
      setError(null);

      const newUserIngredient = await api.user.addUserIngredient({
        ingredientId,
        quantity,
        unit,
      });

      setUserIngredients(prev => [...prev, newUserIngredient]);
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
      throw appError; // Re-throw for component handling
    }
  }, [handleError]);

  // Update user ingredient
  const updateUserIngredient = useCallback(async (
    ingredientId: string,
    quantity: number,
    unit: string
  ) => {
    try {
      setError(null);

      const updatedIngredient = await api.user.updateUserIngredient(ingredientId, {
        quantity,
        unit,
      });

      setUserIngredients(prev =>
        prev.map(ui =>
          ui.ingredientId === ingredientId ? updatedIngredient : ui
        )
      );
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
      throw appError; // Re-throw for component handling
    }
  }, [handleError]);

  // Remove ingredient from user's list
  const removeUserIngredient = useCallback(async (ingredientId: string) => {
    try {
      setError(null);

      await api.user.removeUserIngredient(ingredientId);

      setUserIngredients(prev =>
        prev.filter(ui => ui.ingredientId !== ingredientId)
      );
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
      throw appError; // Re-throw for component handling
    }
  }, [handleError]);

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // Reset all state
  const reset = useCallback(() => {
    setAllIngredients([]);
    setSearchResults([]);
    setSearchQuery('');
    setUserIngredients([]);
    setLoading(false);
    setSearching(false);
    setError(null);
  }, []);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadUserIngredients();
    }
  }, [autoLoad, loadUserIngredients]);

  return {
    // Available ingredients
    allIngredients,
    searchResults,
    searchQuery,
    
    // User's ingredients
    userIngredients,
    selectedIngredientIds,
    
    // State
    loading,
    searching,
    error,
    
    // Actions
    searchIngredients,
    loadAllIngredients,
    loadUserIngredients,
    addUserIngredient,
    updateUserIngredient,
    removeUserIngredient,
    clearSearch,
    reset,
  };
};

// Hook for ingredient selection (simplified for forms)
export interface UseIngredientSelectionOptions {
  languageCode?: string;
  maxSelections?: number;
}

export interface UseIngredientSelectionResult {
  searchResults: Ingredient[];
  searchQuery: string;
  selectedIngredients: Ingredient[];
  searching: boolean;
  error: string | null;
  
  searchIngredients: (query: string) => void;
  selectIngredient: (ingredient: Ingredient) => void;
  removeIngredient: (ingredientId: string) => void;
  clearSelection: () => void;
  clearSearch: () => void;
}

export const useIngredientSelection = (
  options: UseIngredientSelectionOptions = {}
): UseIngredientSelectionResult => {
  const {
    languageCode = 'tr',
    maxSelections = 20
  } = options;

  const { handleError } = useErrorHandler();

  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search ingredients
  const performSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setError(null);

      const results = await api.ingredients.searchIngredients(query, languageCode, 10);
      setSearchResults(results);
    } catch (err) {
      const appError = handleError(err);
      setError(appError.message);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [languageCode, handleError]);

  // Debounced search
  const debouncedSearch = useDebouncedCallback(
    performSearch,
    300,
    [performSearch]
  );

  const searchIngredients = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Select ingredient
  const selectIngredient = useCallback((ingredient: Ingredient) => {
    setSelectedIngredients(prev => {
      // Check if already selected
      if (prev.some(i => i.id === ingredient.id)) {
        return prev;
      }

      // Check max selections
      if (prev.length >= maxSelections) {
        return prev;
      }

      return [...prev, ingredient];
    });

    // Clear search after selection
    setSearchQuery('');
    setSearchResults([]);
  }, [maxSelections]);

  // Remove ingredient
  const removeIngredient = useCallback((ingredientId: string) => {
    setSelectedIngredients(prev =>
      prev.filter(ingredient => ingredient.id !== ingredientId)
    );
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedIngredients([]);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  return {
    searchResults,
    searchQuery,
    selectedIngredients,
    searching,
    error,
    
    searchIngredients,
    selectIngredient,
    removeIngredient,
    clearSelection,
    clearSearch,
  };
}; 