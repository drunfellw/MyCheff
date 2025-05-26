import { Dimensions } from 'react-native';
import type { ResponsiveDimensions, ComponentDimensions } from '../types';
import { SCREEN_BREAKPOINTS, DEFAULTS } from '../constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Base dimensions for responsive design
const BASE_WIDTH = 375; // iPhone design width
const BASE_HEIGHT = 812; // iPhone design height

/**
 * Convert percentage to width pixels
 */
export const widthPercentageToDP = (percentage: number): number => {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
};

/**
 * Convert percentage to height pixels
 */
export const heightPercentageToDP = (percentage: number): number => {
  const value = (percentage * screenHeight) / 100;
  return Math.round(value);
};

/**
 * Normalize font size based on screen width
 */
export const normalizeFont = (size: number): number => {
  const scale = screenWidth / BASE_WIDTH;
  const newSize = size * scale;
  
  // Prevent fonts from being too small or too large
  const minScale = 0.8;
  const maxScale = 1.3;
  
  if (newSize < size * minScale) return Math.round(size * minScale);
  if (newSize > size * maxScale) return Math.round(size * maxScale);
  
  return Math.round(newSize);
};

/**
 * Get device type based on screen width
 */
export const getDeviceType = () => {
  const isPhone = screenWidth < SCREEN_BREAKPOINTS.PHONE;
  const isTablet = screenWidth >= SCREEN_BREAKPOINTS.PHONE && screenWidth < SCREEN_BREAKPOINTS.TABLET;
  const isLargeTablet = screenWidth >= SCREEN_BREAKPOINTS.TABLET;
  
  return {
    isPhone,
    isTablet,
    isLargeTablet,
    deviceType: isPhone ? 'phone' : isTablet ? 'tablet' : 'largeTablet',
  } as const;
};

/**
 * Get responsive dimensions based on screen size
 */
export const getResponsiveDimensions = (): ResponsiveDimensions => {
  const { isPhone, isTablet, isLargeTablet } = getDeviceType();
  
  return {
    isPhone,
    isTablet,
    isLargeTablet,
    screenWidth,
    screenHeight,
    gridColumns: isLargeTablet 
      ? DEFAULTS.GRID_COLUMNS.LARGE_TABLET 
      : isTablet 
        ? DEFAULTS.GRID_COLUMNS.TABLET 
        : DEFAULTS.GRID_COLUMNS.PHONE,
    containerPadding: isTablet ? 24 : 16,
    cardPadding: isTablet ? 16 : 12,
    gridGap: isTablet ? 20 : 16,
    searchBarMaxWidth: Math.min(400, screenWidth * 0.9),
    categoryItemWidth: isTablet ? 90 : 70,
  };
};

/**
 * Get responsive component dimensions
 */
export const getComponentDimensions = (): ComponentDimensions => {
  const dimensions = getResponsiveDimensions();
  
  return {
    searchBar: {
      width: Math.min(widthPercentageToDP(90), 400),
      height: normalizeFont(56),
      borderRadius: normalizeFont(50),
      padding: normalizeFont(8),
      gap: normalizeFont(12),
    },
    category: {
      width: dimensions.categoryItemWidth,
      height: normalizeFont(53),
      gap: normalizeFont(4),
      iconSize: normalizeFont(32),
      fontSize: normalizeFont(12),
    },
    recipeCard: {
      width: (screenWidth - (dimensions.containerPadding * 2) - dimensions.gridGap) / dimensions.gridColumns,
      imageHeight: normalizeFont(126),
      borderRadius: normalizeFont(4),
      padding: normalizeFont(8),
      gap: normalizeFont(8),
    },
    navigation: {
      height: normalizeFont(76),
      padding: normalizeFont(8),
      gap: normalizeFont(8),
      iconSize: normalizeFont(24),
      fontSize: normalizeFont(12),
    },
  };
};

/**
 * Calculate grid item width for flexible layouts
 */
export const calculateGridItemWidth = (
  containerWidth: number,
  itemsPerRow: number,
  gap: number,
  padding: number = 0
): number => {
  const totalGaps = (itemsPerRow - 1) * gap;
  const totalPadding = padding * 2;
  const availableWidth = containerWidth - totalGaps - totalPadding;
  
  return Math.floor(availableWidth / itemsPerRow);
};

/**
 * Get responsive value based on device type
 */
export const getResponsiveValue = <T>(values: {
  phone: T;
  tablet: T;
  largeTablet: T;
}): T => {
  const { isPhone, isTablet } = getDeviceType();
  
  if (isPhone) return values.phone;
  if (isTablet) return values.tablet;
  return values.largeTablet;
};

/**
 * Scale value based on screen density
 */
export const scaleSize = (size: number): number => {
  const scale = screenWidth / BASE_WIDTH;
  return Math.round(size * scale);
};

/**
 * Get safe area paddings for different devices
 */
export const getSafeAreaPadding = () => {
  const { isPhone } = getDeviceType();
  
  return {
    top: isPhone ? 44 : 20, // Status bar height
    bottom: isPhone ? 34 : 0, // Home indicator height
    horizontal: 16,
  };
};

/**
 * Check if device is in landscape mode
 */
export const isLandscape = (): boolean => {
  return screenWidth > screenHeight;
};

/**
 * Get responsive font size with custom scaling
 */
export const getResponsiveFontSize = (
  baseSize: number,
  scaleFactor: number = 1
): number => {
  return normalizeFont(baseSize * scaleFactor);
};

/**
 * Get responsive spacing based on device type
 */
export const getResponsiveSpacing = (baseSpacing: number): number => {
  const { isTablet } = getDeviceType();
  return isTablet ? baseSpacing * 1.5 : baseSpacing;
};

// Export singleton instances
export const dimensions = getResponsiveDimensions();
export const componentDimensions = getComponentDimensions(); 