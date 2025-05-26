import type { ThemeColors, Spacing, NavigationTab, StorageKeys } from '../types';

// Application Constants
export const APP_CONFIG = {
  NAME: 'MyCheff',
  VERSION: '1.0.0',
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.mycheff.com',
  DEFAULT_LANGUAGE: 'en',
  PAGINATION_LIMIT: 20,
  IMAGE_QUALITY: 0.8,
  CACHE_DURATION: 1000 * 60 * 60 * 24, // 24 hours
  DEBOUNCE_DELAY: 300,
} as const;

// Theme Colors
export const COLORS: ThemeColors = {
  // Primary colors
  primary: '#F93A3B',
  primaryLight: 'rgba(249, 58, 59, 0.2)',
  
  // Background colors
  background: '#FBFBFE',
  white: '#FFFFFF',
  
  // Text colors
  textPrimary: '#230606',
  textSecondary: '#9C9C9C',
  textMuted: 'rgba(39, 39, 39, 0.63)',
  textWhite: 'rgba(255, 255, 255, 0.95)',
  
  // Border and surface colors
  border: '#E0E0E0',
  surfaceOverlay: 'rgba(38, 38, 38, 0.05)',
  surfaceOverlay2: 'rgba(37, 38, 40, 0.9)',
  
  // Shadow colors
  shadowLight: 'rgba(37, 37, 37, 0.1)',
  shadowMedium: 'rgba(37, 37, 37, 0.12)',
  shadowDark: 'rgba(37, 37, 37, 0.08)',
  
  // Utility colors
  transparent: 'transparent',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
} as const;

// Spacing System
export const SPACING: Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// Typography
export const FONT_FAMILY = {
  REGULAR: 'Inter_400Regular',
  MEDIUM: 'Inter_500Medium',
  SEMI_BOLD: 'Inter_600SemiBold',
  BOLD: 'Inter_700Bold',
} as const;

export const FONT_SIZE = {
  XS: 10,
  SM: 12,
  MD: 14,
  LG: 16,
  XL: 18,
  XXL: 20,
  XXXL: 24,
  TITLE: 28,
  LARGE_TITLE: 32,
} as const;

export const LINE_HEIGHT = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 22,
  XXXL: 26,
  TITLE: 32,
  LARGE_TITLE: 36,
} as const;

// Navigation Tabs
export const NAVIGATION_TABS: NavigationTab[] = [
  { 
    id: 'home', 
    label: 'Search', 
    icon: 'home',
  },
  { 
    id: 'search', 
    label: 'Search', 
    icon: 'search',
  },
  { 
    id: 'favorites', 
    label: 'Favorite', 
    icon: 'heart',
  },
  { 
    id: 'profile', 
    label: 'Settings', 
    icon: 'person',
  },
] as const;

// Category Icons Mapping
export const CATEGORY_ICONS = {
  'breakfast-icon': 'sunny',
  'sandwich-icon': 'fast-food',
  'salad-icon': 'leaf',
  'steak-icon': 'restaurant',
  'chicken-icon': 'nutrition',
  'vegetable-icon': 'flower',
  'pastas-icon': 'cafe',
  'main-meals-icon': 'pizza',
  'desserts-icon': 'ice-cream',
  'drinks-icon': 'wine',
} as const;

// Storage Keys
export const STORAGE_KEYS: StorageKeys = {
  FAVORITES: '@mycheff_favorites',
  RECENT_SEARCHES: '@mycheff_recent_searches',
  USER_PREFERENCES: '@mycheff_user_preferences',
  CACHE_RECIPES: '@mycheff_cache_recipes',
  CACHE_CATEGORIES: '@mycheff_cache_categories',
} as const;

// Screen Dimensions
export const SCREEN_BREAKPOINTS = {
  PHONE: 768,
  TABLET: 1024,
  LARGE_TABLET: 1200,
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  VERY_SLOW: 500,
} as const;

// Component Z-Index
export const Z_INDEX = {
  BACKGROUND: 0,
  CONTENT: 10,
  OVERLAY: 100,
  MODAL: 1000,
  TOAST: 2000,
  LOADER: 3000,
} as const;

// Border Radius
export const BORDER_RADIUS = {
  XS: 2,
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  XXL: 24,
  ROUND: 50,
  CIRCLE: 999,
} as const;

// Shadow Presets
export const SHADOW_PRESETS = {
  SMALL: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  MEDIUM: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  LARGE: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  NAVIGATION: {
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 8,
  },
} as const;

// Recipe Difficulty Colors
export const DIFFICULTY_COLORS = {
  Easy: '#4CAF50',
  Medium: '#FF9800',
  Hard: '#F44336',
} as const;

// Default Values
export const DEFAULTS = {
  GRID_COLUMNS: {
    PHONE: 2,
    TABLET: 3,
    LARGE_TABLET: 4,
  },
  SEARCH_PLACEHOLDER: {
    PRIMARY: "Cook with what's available",
    SECONDARY: "Search recipes by what you have",
  },
  INSPIRATION_TEXT: {
    COUNT: 1253,
    SUFFIX: 'inspiration',
  },
} as const; 