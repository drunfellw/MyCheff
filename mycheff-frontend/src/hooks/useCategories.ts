import { useState, useCallback, useMemo, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import type { Category, UseCategoriesResult } from '../types';

/**
 * Custom hook for managing categories state and operations
 */
export const useCategories = (): UseCategoriesResult => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load categories from API
   */
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoryAPI.getCategories();
      setCategories(response || []);
      
      if (response && response.length > 0) {
        setActiveIndex(0);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  /**
   * Set active category index and update categories state
   */
  const handleSetActiveIndex = useCallback((index: number) => {
    if (index < 0 || index >= categories.length) {
      setError('Invalid category index');
      return;
    }

    setActiveIndex(index);
    
    // Update categories to reflect active state
    setCategories(prevCategories =>
      prevCategories.map((category, idx) => ({
        ...category,
        isActive: idx === index,
      }))
    );
    
    setError(null);
  }, [categories.length]);

  /**
   * Get active category
   */
  const activeCategory = useMemo(() => {
    return categories[activeIndex] || null;
  }, [categories, activeIndex]);

  /**
   * Get category by id
   */
  const getCategoryById = useCallback((id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  }, [categories]);

  /**
   * Get category index by id
   */
  const getCategoryIndexById = useCallback((id: string): number => {
    return categories.findIndex(category => category.id === id);
  }, [categories]);

  /**
   * Set active category by id
   */
  const setActiveCategoryById = useCallback((id: string) => {
    const index = getCategoryIndexById(id);
    if (index !== -1) {
      handleSetActiveIndex(index);
    } else {
      setError(`Category with id ${id} not found`);
    }
  }, [getCategoryIndexById, handleSetActiveIndex]);

  /**
   * Reset categories to initial state
   */
  const resetCategories = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  /**
   * Refresh categories (useful for future API integration)
   */
  const refreshCategories = useCallback(async () => {
    await loadCategories();
  }, [loadCategories]);

  return {
    categories,
    activeIndex,
    setActiveIndex: handleSetActiveIndex,
    loading,
    error,
    activeCategory,
    getCategoryById,
    getCategoryIndexById,
    setActiveCategoryById,
    resetCategories,
    refreshCategories,
  };
}; 