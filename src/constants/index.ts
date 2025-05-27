import type { ThemeColors, Spacing, NavigationTab, StorageKeys } from '../types';
import { Dimensions, PixelRatio } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Dynamic Font Scaling
const scale = screenWidth / 375; // iPhone X base width
const normalize = (size: number): number => {
  const newSize = size * scale;
  if (PixelRatio.get() >= 3 && screenWidth >= 414) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  } else if (PixelRatio.get() >= 3) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) + 1;
  }
};

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

// Spacing System - Professional Design System
export const SPACING: Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// Component Specific Spacing
export const COMPONENT_SPACING = {
  // SearchBar
  SEARCH_BAR: {
    HORIZONTAL: SPACING.lg,
    VERTICAL: SPACING.sm,
    ICON_SIZE: 24,
    FILTER_BUTTON_SIZE: 40,
    GAP: SPACING.md,
  },
  
  // Navigation
  NAVIGATION: {
    HEIGHT: 70,
    ICON_SIZE: 24,
    PADDING: SPACING.lg,
  },
  
  // Cards
  CARD: {
    PADDING: SPACING.md,
    MARGIN: SPACING.sm,
    IMAGE_HEIGHT: 120,
    BORDER_RADIUS: SPACING.md,
  },
  
  // Grid Layout
  GRID: {
    COLUMNS_PHONE: 2,
    COLUMNS_TABLET: 3,
    SPACING: SPACING.lg,
    HORIZONTAL_PADDING: SPACING.lg,
  },
  
  // Modal
  MODAL: {
    PADDING: SPACING.xl,
    BORDER_RADIUS: SPACING.xl,
    BACKDROP_OPACITY: 0.5,
  },
} as const;

// Typography System - Airbnb Style Professional Design
export const FONT_FAMILY = {
  REGULAR: 'Inter_400Regular',
  MEDIUM: 'Inter_500Medium',
  SEMI_BOLD: 'Inter_600SemiBold',
  BOLD: 'Inter_700Bold',
} as const;

// Font Sizes - Semantic Naming with Airbnb Standards
export const FONT_SIZE = {
  // Display Sizes - For hero sections and large titles
  DISPLAY_LARGE: normalize(40),    // Hero titles, landing pages
  DISPLAY_MEDIUM: normalize(36),   // Section headers
  DISPLAY_SMALL: normalize(32),    // Page titles
  
  // Heading Sizes - For content hierarchy
  HEADING_1: normalize(28),        // Main page headings
  HEADING_2: normalize(24),        // Section headings
  HEADING_3: normalize(20),        // Subsection headings
  HEADING_4: normalize(18),        // Card titles, important labels
  
  // Body Text Sizes - For content and UI
  BODY_LARGE: normalize(16),       // Primary body text, important content
  BODY_MEDIUM: normalize(14),      // Standard body text, descriptions
  BODY_SMALL: normalize(12),       // Secondary text, captions
  
  // UI Component Sizes - For interface elements
  BUTTON_LARGE: normalize(16),     // Primary buttons
  BUTTON_MEDIUM: normalize(14),    // Secondary buttons
  BUTTON_SMALL: normalize(12),     // Small buttons, chips
  
  LABEL_LARGE: normalize(14),      // Form labels, important labels
  LABEL_MEDIUM: normalize(12),     // Standard labels
  LABEL_SMALL: normalize(10),      // Small labels, badges
  
  // Navigation & Tab Sizes
  TAB_LABEL: normalize(11),        // Bottom navigation labels
  NAVIGATION_TITLE: normalize(17), // Navigation bar titles
  
  // Special Use Cases
  CAPTION: normalize(10),          // Image captions, fine print
  OVERLINE: normalize(10),         // Category labels, overlines
  
  // Backward Compatibility - Legacy sizes (will be deprecated)
  XS: normalize(10),    // Use CAPTION instead
  SM: normalize(12),    // Use BODY_SMALL instead
  MD: normalize(14),    // Use BODY_MEDIUM instead
  LG: normalize(16),    // Use BODY_LARGE instead
  XL: normalize(18),    // Use HEADING_4 instead
  XXL: normalize(20),   // Use HEADING_3 instead
  XXXL: normalize(24),  // Use HEADING_2 instead
  TITLE: normalize(28), // Use HEADING_1 instead
  LARGE_TITLE: normalize(32), // Use DISPLAY_SMALL instead
} as const;

// Line Heights - Optimized for readability
export const LINE_HEIGHT = {
  // Display Line Heights
  DISPLAY_LARGE: 48,
  DISPLAY_MEDIUM: 44,
  DISPLAY_SMALL: 40,
  
  // Heading Line Heights
  HEADING_1: 36,
  HEADING_2: 32,
  HEADING_3: 28,
  HEADING_4: 24,
  
  // Body Line Heights
  BODY_LARGE: 24,
  BODY_MEDIUM: 20,
  BODY_SMALL: 16,
  
  // UI Component Line Heights
  BUTTON_LARGE: 24,
  BUTTON_MEDIUM: 20,
  BUTTON_SMALL: 16,
  
  LABEL_LARGE: 20,
  LABEL_MEDIUM: 16,
  LABEL_SMALL: 14,
  
  // Navigation Line Heights
  TAB_LABEL: 14,
  NAVIGATION_TITLE: 24,
  
  // Special Line Heights
  CAPTION: 14,
  OVERLINE: 14,
} as const;

// Typography Presets - Ready-to-use text styles
export const TEXT_STYLES = {
  // Display Styles
  displayLarge: {
    fontSize: FONT_SIZE.DISPLAY_LARGE,
    lineHeight: LINE_HEIGHT.DISPLAY_LARGE,
    fontFamily: FONT_FAMILY.BOLD,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: FONT_SIZE.DISPLAY_MEDIUM,
    lineHeight: LINE_HEIGHT.DISPLAY_MEDIUM,
    fontFamily: FONT_FAMILY.BOLD,
    letterSpacing: -0.25,
  },
  displaySmall: {
    fontSize: FONT_SIZE.DISPLAY_SMALL,
    lineHeight: LINE_HEIGHT.DISPLAY_SMALL,
    fontFamily: FONT_FAMILY.BOLD,
    letterSpacing: 0,
  },
  
  // Heading Styles
  heading1: {
    fontSize: FONT_SIZE.HEADING_1,
    lineHeight: LINE_HEIGHT.HEADING_1,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    letterSpacing: -0.25,
  },
  heading2: {
    fontSize: FONT_SIZE.HEADING_2,
    lineHeight: LINE_HEIGHT.HEADING_2,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    letterSpacing: 0,
  },
  heading3: {
    fontSize: FONT_SIZE.HEADING_3,
    lineHeight: LINE_HEIGHT.HEADING_3,
    fontFamily: FONT_FAMILY.MEDIUM,
    letterSpacing: 0,
  },
  heading4: {
    fontSize: FONT_SIZE.HEADING_4,
    lineHeight: LINE_HEIGHT.HEADING_4,
    fontFamily: FONT_FAMILY.MEDIUM,
    letterSpacing: 0,
  },
  
  // Body Styles
  bodyLarge: {
    fontSize: FONT_SIZE.BODY_LARGE,
    lineHeight: LINE_HEIGHT.BODY_LARGE,
    fontFamily: FONT_FAMILY.REGULAR,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontSize: FONT_SIZE.BODY_MEDIUM,
    lineHeight: LINE_HEIGHT.BODY_MEDIUM,
    fontFamily: FONT_FAMILY.REGULAR,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: FONT_SIZE.BODY_SMALL,
    lineHeight: LINE_HEIGHT.BODY_SMALL,
    fontFamily: FONT_FAMILY.REGULAR,
    letterSpacing: 0,
  },
  
  // Button Styles
  buttonLarge: {
    fontSize: FONT_SIZE.BUTTON_LARGE,
    lineHeight: LINE_HEIGHT.BUTTON_LARGE,
    fontFamily: FONT_FAMILY.MEDIUM,
    letterSpacing: 0.25,
  },
  buttonMedium: {
    fontSize: FONT_SIZE.BUTTON_MEDIUM,
    lineHeight: LINE_HEIGHT.BUTTON_MEDIUM,
    fontFamily: FONT_FAMILY.MEDIUM,
    letterSpacing: 0.25,
  },
  buttonSmall: {
    fontSize: FONT_SIZE.BUTTON_SMALL,
    lineHeight: LINE_HEIGHT.BUTTON_SMALL,
    fontFamily: FONT_FAMILY.MEDIUM,
    letterSpacing: 0.25,
  },
  
  // Label Styles
  labelLarge: {
    fontSize: FONT_SIZE.LABEL_LARGE,
    lineHeight: LINE_HEIGHT.LABEL_LARGE,
    fontFamily: FONT_FAMILY.MEDIUM,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: FONT_SIZE.LABEL_MEDIUM,
    lineHeight: LINE_HEIGHT.LABEL_MEDIUM,
    fontFamily: FONT_FAMILY.MEDIUM,
    letterSpacing: 0.1,
  },
  labelSmall: {
    fontSize: FONT_SIZE.LABEL_SMALL,
    lineHeight: LINE_HEIGHT.LABEL_SMALL,
    fontFamily: FONT_FAMILY.MEDIUM,
    letterSpacing: 0.1,
  },
  
  // Navigation Styles
  tabLabel: {
    fontSize: FONT_SIZE.TAB_LABEL,
    lineHeight: LINE_HEIGHT.TAB_LABEL,
    fontFamily: FONT_FAMILY.MEDIUM,
    letterSpacing: 0.1,
  },
  navigationTitle: {
    fontSize: FONT_SIZE.NAVIGATION_TITLE,
    lineHeight: LINE_HEIGHT.NAVIGATION_TITLE,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    letterSpacing: -0.1,
  },
  
  // Special Styles
  caption: {
    fontSize: FONT_SIZE.CAPTION,
    lineHeight: LINE_HEIGHT.CAPTION,
    fontFamily: FONT_FAMILY.REGULAR,
    letterSpacing: 0.1,
  },
  overline: {
    fontSize: FONT_SIZE.OVERLINE,
    lineHeight: LINE_HEIGHT.OVERLINE,
    fontFamily: FONT_FAMILY.MEDIUM,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
} as const;

// Navigation Tabs
export const NAVIGATION_TABS: NavigationTab[] = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: 'home',
  },
  { 
    id: 'cheff', 
    label: 'Cheff', 
    icon: 'restaurant',
  },
  { 
    id: 'search', 
    label: 'Search', 
    icon: 'search',
  },
  { 
    id: 'profile', 
    label: 'Profile', 
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
  TYPEWRITER: {
    TYPE_SPEED: 40,
    DELETE_SPEED: 20,
    PAUSE_DURATION: 1200,
  },
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
  TYPEWRITER_TEXTS: [
    'Search recipes by what you have',
    'Discover dishes you can cook now',
    'What would you like to cook today?',
    'Find recipes with your ingredients',
  ],
} as const;

// Typography Usage Examples & Migration Guide
export const TYPOGRAPHY_EXAMPLES = {
  // How to use the new system:
  // 
  // OLD WAY (deprecated):
  // fontSize: FONT_SIZE.MD,
  // fontWeight: '500',
  // lineHeight: 20,
  //
  // NEW WAY (recommended):
  // ...TEXT_STYLES.bodyMedium
  //
  // Or for custom colors:
  // ...TEXT_STYLES.bodyMedium,
  // color: COLORS.primary
  
  // Common Use Cases:
  pageTitle: { ...TEXT_STYLES.heading1 },
  sectionHeader: { ...TEXT_STYLES.heading2 },
  cardTitle: { ...TEXT_STYLES.heading4 },
  bodyText: { ...TEXT_STYLES.bodyMedium },
  caption: { ...TEXT_STYLES.caption },
  buttonText: { ...TEXT_STYLES.buttonMedium },
  tabLabel: { ...TEXT_STYLES.tabLabel },
  
  // With custom colors:
  primaryButton: { ...TEXT_STYLES.buttonLarge, color: '#FFFFFF' },
  errorText: { ...TEXT_STYLES.bodySmall, color: '#F44336' },
  successText: { ...TEXT_STYLES.bodySmall, color: '#4CAF50' },
} as const; 