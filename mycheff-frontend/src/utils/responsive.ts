import { Dimensions, PixelRatio, Platform } from 'react-native';
import type { ResponsiveDimensions, ComponentDimensions } from '../types';
import { SCREEN_BREAKPOINTS, DEFAULTS } from '../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo } from 'react';

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

// Breakpoints (following modern responsive design standards)
export const BREAKPOINTS = {
  SMALL: 320,   // Small phones
  MEDIUM: 375,  // Standard phones (iPhone 6/7/8)
  LARGE: 414,   // Large phones (iPhone 6+/7+/8+)
  TABLET: 768,  // Tablets
  DESKTOP: 1024, // Desktop/Large tablets
} as const;

// Responsive scaling functions
export const scale = (size: number): number => {
  const baseWidth = 375; // iPhone 6/7/8 width as base
  return (screenWidth / baseWidth) * size;
};

export const verticalScale = (size: number): number => {
  const baseHeight = 667; // iPhone 6/7/8 height as base
  return (screenHeight / baseHeight) * size;
};

export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

// Font scaling with accessibility support
export const scaledFont = (size: number): number => {
  const scaled = moderateScale(size, 0.3);
  const pixelRatio = PixelRatio.get();
  
  // Ensure minimum readable size
  const minSize = 12;
  const maxSize = 30;
  
  return Math.max(minSize, Math.min(maxSize, scaled / pixelRatio));
};

// Grid system
export const getGridColumns = (): number => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'small-phone':
      return 1;
    case 'phone':
    case 'large-phone':
      return 2;
    case 'tablet':
      return 3;
    case 'desktop':
      return 4;
    default:
      return 2;
  }
};

export const getGridSpacing = (): number => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'small-phone':
      return scale(12);
    case 'phone':
    case 'large-phone':
      return scale(16);
    case 'tablet':
      return scale(20);
    case 'desktop':
      return scale(24);
    default:
      return scale(16);
  }
};

// Container padding based on device
export const getContainerPadding = (): number => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'small-phone':
      return scale(12);
    case 'phone':
    case 'large-phone':
      return scale(16);
    case 'tablet':
      return scale(24);
    case 'desktop':
      return scale(32);
    default:
      return scale(16);
  }
};

// Safe area utilities
export const useSafeAreaDimensions = () => {
  const insets = useSafeAreaInsets();
  
  return useMemo(() => ({
    safeWidth: screenWidth,
    safeHeight: screenHeight - insets.top - insets.bottom,
    contentHeight: screenHeight - insets.top - insets.bottom,
    headerHeight: 44 + insets.top,
    footerHeight: 49 + insets.bottom,
    insets,
  }), [insets]);
};

// Responsive component dimensions
export const useResponsiveDimensions = () => {
  const deviceType = getDeviceType();
  const gridColumns = getGridColumns();
  const gridSpacing = getGridSpacing();
  const containerPadding = getContainerPadding();
  
  return useMemo(() => {
    const availableWidth = screenWidth - (containerPadding * 2);
    const cardWidth = (availableWidth - (gridSpacing * (gridColumns - 1))) / gridColumns;
    
    return {
      deviceType,
      screenWidth: screenWidth,
      screenHeight: screenHeight,
      gridColumns,
      gridSpacing,
      containerPadding,
      cardWidth,
      isSmallDevice: deviceType === 'small-phone',
      isTablet: deviceType === 'tablet' || deviceType === 'desktop',
      
      // Component specific dimensions
      searchBar: {
        height: deviceType === 'small-phone' ? scale(44) : scale(48),
        borderRadius: scale(12),
        fontSize: scaledFont(16),
      },
      
      navigationBar: {
        height: Platform.OS === 'ios' ? scale(49) : scale(56),
        iconSize: scale(24),
        fontSize: scaledFont(11),
      },
      
      button: {
        height: deviceType === 'small-phone' ? scale(44) : scale(48),
        borderRadius: scale(8),
        fontSize: scaledFont(16),
      },
      
      card: {
        borderRadius: scale(12),
        padding: scale(16),
        imageHeight: cardWidth * 0.6, // 3:5 aspect ratio
      },
    };
  }, [deviceType, gridColumns, gridSpacing, containerPadding]);
};

// Orientation utilities
export const useOrientation = () => {
  const [dimensions, setDimensions] = React.useState(Dimensions.get('window'));
  
  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => subscription?.remove();
  }, []);
  
  return useMemo(() => ({
    isPortrait: dimensions.height > dimensions.width,
    isLandscape: dimensions.width > dimensions.height,
    width: dimensions.width,
    height: dimensions.height,
  }), [dimensions]);
};

// Platform-specific utilities
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const getStatusBarHeight = (): number => {
  if (isIOS) {
    // iOS status bar height varies by device
    if (screenHeight >= 812) return 44; // iPhone X and newer
    return 20; // Older iPhones
  }
  
  // Android status bar height
  return 24;
};

// Responsive text utilities
export const getResponsiveText = (text: string, maxLength?: number): string => {
  const deviceType = getDeviceType();
  
  if (!maxLength) {
    // Default max lengths based on device
    switch (deviceType) {
      case 'small-phone':
        maxLength = 20;
        break;
      case 'phone':
      case 'large-phone':
        maxLength = 30;
        break;
      case 'tablet':
      case 'desktop':
        maxLength = 50;
        break;
      default:
        maxLength = 30;
    }
  }
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - 3) + '...';
};

// Animation duration based on device performance
export const getAnimationDuration = (baseDuration: number): number => {
  const pixelRatio = PixelRatio.get();
  
  // Reduce animation duration on lower-end devices
  if (pixelRatio < 2) {
    return baseDuration * 0.8;
  }
  
  return baseDuration;
};

// Hit slop for better touch targets
export const getHitSlop = (size: number = 8) => ({
  top: size,
  bottom: size,
  left: size,
  right: size,
});

// Minimum touch target size (44pt on iOS, 48dp on Android)
export const getMinTouchTarget = (): number => {
  return isIOS ? 44 : 48;
}; 