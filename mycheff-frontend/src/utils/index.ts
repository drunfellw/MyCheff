// API Services
export { api, recipeAPI, categoryAPI, ingredientAPI, userAPI, filterAPI } from '../services/api';

// Custom Hooks
export { useRecipes, useIngredientRecipes, useRecipeSearch } from '../hooks/useRecipes';
export { useIngredients, useIngredientInput } from '../hooks/useIngredients';
export { useFavorites, useFavoriteToggle } from '../hooks/useFavorites';

// Performance Utilities
export * from './performance';

// Accessibility Utilities
export * from './accessibility';

// Responsive Design
export * from './responsiveDesign';

// Security & Validation
export * from './security';

// Testing Utilities (development only)
if (__DEV__) {
  // Only export testing utilities in development
  // export * from './testing';
}

// Re-export commonly used utilities
export { 
  ErrorHandler, 
  errorHandler, 
  handleAsyncError,
  ErrorType 
} from './errorHandler';

export {
  debounce,
  throttle,
  memoize,
  useDebouncedCallback,
  useThrottledCallback,
  PerformanceMonitor
} from './performance';

export {
  createAccessibilityProps,
  createButtonAccessibility,
  createTabAccessibility,
  announceForAccessibility,
  isScreenReaderEnabled
} from './accessibility';

export {
  useResponsiveDimensions,
  useSafeAreaDimensions,
  useOrientation,
  getDeviceType,
  scale,
  moderateScale,
  getHitSlop,
  getMinTouchTarget
} from './responsiveDesign';

export {
  sanitizeInput,
  validateRecipeData,
  validateSearchQuery,
  isValidEmail,
  isValidUrl,
  RateLimiter,
  securityConfig
} from './security'; 