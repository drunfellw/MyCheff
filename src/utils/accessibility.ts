import { AccessibilityInfo } from 'react-native';

// Accessibility constants
export const ACCESSIBILITY_ROLES = {
  BUTTON: 'button',
  LINK: 'link',
  TEXT: 'text',
  HEADING: 'header',
  IMAGE: 'image',
  LIST: 'list',
  LIST_ITEM: 'listitem',
  TAB: 'tab',
  TAB_LIST: 'tablist',
  SEARCH: 'search',
  MENU: 'menu',
  MENU_ITEM: 'menuitem',
} as const;

export const ACCESSIBILITY_TRAITS = {
  ADJUSTABLE: 'adjustable',
  ALLOWS_DIRECT_INTERACTION: 'allowsDirectInteraction',
  DISABLED: 'disabled',
  FREQUENCY_LOW: 'frequentUpdates',
  HEADER: 'header',
  IMAGE: 'image',
  KEY_KEYBOARD_KEY: 'keyboardKey',
  LINK: 'link',
  NONE: 'none',
  PLAYS_SOUND: 'playsSound',
  SEARCH_FIELD: 'searchField',
  SELECTED: 'selected',
  STARTS_MEDIA: 'startsMediaSession',
  SUMMARY_ELEMENT: 'summaryElement',
  TAB_BAR: 'tabBar',
  UPDATES_FREQUENTLY: 'updatesFrequently',
} as const;

// Accessibility helper functions
export const createAccessibilityProps = (
  label: string,
  hint?: string,
  role?: string,
  state?: { disabled?: boolean; selected?: boolean; expanded?: boolean }
) => {
  const props: any = {
    accessible: true,
    accessibilityLabel: label,
  };

  if (hint) {
    props.accessibilityHint = hint;
  }

  if (role) {
    props.accessibilityRole = role;
  }

  if (state) {
    props.accessibilityState = state;
  }

  return props;
};

// Screen reader utilities
export const announceForAccessibility = (message: string) => {
  AccessibilityInfo.announceForAccessibility(message);
};

export const setAccessibilityFocus = (reactTag: number) => {
  AccessibilityInfo.setAccessibilityFocus(reactTag);
};

// Check if screen reader is enabled
export const isScreenReaderEnabled = (): Promise<boolean> => {
  return AccessibilityInfo.isScreenReaderEnabled();
};

// Check if reduce motion is enabled
export const isReduceMotionEnabled = (): Promise<boolean> => {
  return AccessibilityInfo.isReduceMotionEnabled();
};

// Accessibility validation
export const validateAccessibility = (component: any): string[] => {
  const issues: string[] = [];

  if (!component.props.accessible && !component.props.accessibilityLabel) {
    issues.push('Component should have accessibility label');
  }

  if (component.props.onPress && !component.props.accessibilityRole) {
    issues.push('Pressable component should have accessibility role');
  }

  if (component.props.accessibilityLabel && component.props.accessibilityLabel.length > 40) {
    issues.push('Accessibility label should be concise (under 40 characters)');
  }

  return issues;
};

// Common accessibility patterns
export const createButtonAccessibility = (
  label: string,
  hint?: string,
  disabled: boolean = false
) => createAccessibilityProps(
  label,
  hint || `Double tap to ${label.toLowerCase()}`,
  ACCESSIBILITY_ROLES.BUTTON,
  { disabled }
);

export const createLinkAccessibility = (
  label: string,
  hint?: string
) => createAccessibilityProps(
  label,
  hint || `Double tap to open ${label.toLowerCase()}`,
  ACCESSIBILITY_ROLES.LINK
);

export const createHeadingAccessibility = (
  text: string,
  level: number = 1
) => {
  const props = createAccessibilityProps(
    text,
    undefined,
    ACCESSIBILITY_ROLES.HEADING
  );
  
  // Add level as a separate property for headings
  return {
    ...props,
    accessibilityLevel: level,
  };
};

export const createImageAccessibility = (
  description: string,
  decorative: boolean = false
) => {
  if (decorative) {
    return {
      accessible: false,
      accessibilityElementsHidden: true,
    };
  }

  return createAccessibilityProps(
    description,
    undefined,
    ACCESSIBILITY_ROLES.IMAGE
  );
};

export const createListAccessibility = (
  itemCount: number,
  currentIndex?: number
) => {
  const label = `List with ${itemCount} items`;
  const hint = currentIndex !== undefined 
    ? `Currently on item ${currentIndex + 1} of ${itemCount}`
    : undefined;

  return createAccessibilityProps(label, hint, ACCESSIBILITY_ROLES.LIST);
};

export const createTabAccessibility = (
  label: string,
  selected: boolean,
  index: number,
  totalTabs: number
) => createAccessibilityProps(
  label,
  `Tab ${index + 1} of ${totalTabs}`,
  ACCESSIBILITY_ROLES.TAB,
  { selected }
);

// Accessibility testing helpers
export const logAccessibilityTree = (component: any) => {
  if (__DEV__) {
    console.log('🔍 Accessibility Tree:', {
      accessible: component.props.accessible,
      accessibilityLabel: component.props.accessibilityLabel,
      accessibilityHint: component.props.accessibilityHint,
      accessibilityRole: component.props.accessibilityRole,
      accessibilityState: component.props.accessibilityState,
    });
  }
};

// Color contrast utilities
export const calculateContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation
  // In a real app, you'd use a proper color contrast library
  const getLuminance = (color: string): number => {
    // Convert hex to RGB and calculate luminance
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

export const meetsWCAGStandards = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean => {
  const ratio = calculateContrastRatio(foreground, background);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
}; 