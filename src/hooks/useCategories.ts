import { useState, useCallback, useMemo } from 'react';
import type { Category, UseCategoriesResult } from '../types';
import { CATEGORIES_DATA } from '../services/mockData';

/**
 * Custom hook for managing categories state and operations
 */
export const useCategories = (): UseCategoriesResult => {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES_DATA);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    setCategories(CATEGORIES_DATA);
    setActiveIndex(0);
    setError(null);
  }, []);

  /**
   * Refresh categories (useful for future API integration)
   */
  const refreshCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real app, this would be an API call
      setCategories(CATEGORIES_DATA);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh categories');
    } finally {
      setLoading(false);
    }
  }, []);

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