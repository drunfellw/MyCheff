import { Dimensions, PixelRatio, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo, useState, useEffect } from 'react';

// Device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Breakpoints (following modern responsive design standards)
export const BREAKPOINTS = {
  SMALL: 320,   // Small phones
  MEDIUM: 375,  // Standard phones (iPhone 6/7/8)
  LARGE: 414,   // Large phones (iPhone 6+/7+/8+)
  TABLET: 768,  // Tablets
  DESKTOP: 1024, // Desktop/Large tablets
} as const;

export type DeviceType = 'small-phone' | 'phone' | 'large-phone' | 'tablet' | 'desktop';

// Device type detection
export const getDeviceType = (): DeviceType => {
  if (SCREEN_WIDTH < BREAKPOINTS.MEDIUM) return 'small-phone';
  if (SCREEN_WIDTH < BREAKPOINTS.LARGE) return 'phone';
  if (SCREEN_WIDTH < BREAKPOINTS.TABLET) return 'large-phone';
  if (SCREEN_WIDTH < BREAKPOINTS.DESKTOP) return 'tablet';
  return 'desktop';
};

// Responsive scaling functions
export const scale = (size: number): number => {
  const baseWidth = 375; // iPhone 6/7/8 width as base
  return (SCREEN_WIDTH / baseWidth) * size;
};

export const verticalScale = (size: number): number => {
  const baseHeight = 667; // iPhone 6/7/8 height as base
  return (SCREEN_HEIGHT / baseHeight) * size;
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
    safeWidth: SCREEN_WIDTH,
    safeHeight: SCREEN_HEIGHT - insets.top - insets.bottom,
    contentHeight: SCREEN_HEIGHT - insets.top - insets.bottom,
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
    const availableWidth = SCREEN_WIDTH - (containerPadding * 2);
    const cardWidth = (availableWidth - (gridSpacing * (gridColumns - 1))) / gridColumns;
    
    return {
      deviceType,
      screenWidth: SCREEN_WIDTH,
      screenHeight: SCREEN_HEIGHT,
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
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  useEffect(() => {
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
    if (SCREEN_HEIGHT >= 812) return 44; // iPhone X and newer
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