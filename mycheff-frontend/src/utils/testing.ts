import { ReactTestInstance } from 'react-test-renderer';

// Test utilities for React Native Testing Library
export const testIds = {
  // Navigation
  NAVIGATION_BAR: 'navigation-bar',
  TAB_BUTTON: (tabId: string) => `tab-button-${tabId}`,
  
  // Header
  SCREEN_HEADER: 'screen-header',
  BACK_BUTTON: 'back-button',
  HEADER_TITLE: 'header-title',
  
  // Search
  SEARCH_BAR: 'search-bar',
  SEARCH_INPUT: 'search-input',
  FILTER_BUTTON: 'filter-button',
  
  // Recipe Cards
  RECIPE_CARD: (recipeId: string) => `recipe-card-${recipeId}`,
  RECIPE_IMAGE: (recipeId: string) => `recipe-image-${recipeId}`,
  FAVORITE_BUTTON: (recipeId: string) => `favorite-button-${recipeId}`,
  
  // Modals
  FILTER_MODAL: 'filter-modal',
  MODAL_BACKDROP: 'modal-backdrop',
  MODAL_CLOSE: 'modal-close',
  
  // Lists
  RECIPE_LIST: 'recipe-list',
  CATEGORY_LIST: 'category-list',
  
  // Loading states
  LOADING_SPINNER: 'loading-spinner',
  LOADING_SKELETON: 'loading-skeleton',
  
  // Error states
  ERROR_MESSAGE: 'error-message',
  RETRY_BUTTON: 'retry-button',
} as const;

// Accessibility testing helpers
export const accessibilityTestHelpers = {
  // Check if element has proper accessibility label
  hasAccessibilityLabel: (element: ReactTestInstance): boolean => {
    return !!(element.props.accessibilityLabel || element.props['aria-label']);
  },
  
  // Check if element has proper accessibility role
  hasAccessibilityRole: (element: ReactTestInstance): boolean => {
    return !!(element.props.accessibilityRole || element.props.role);
  },
  
  // Check if button has proper accessibility state
  hasProperButtonState: (element: ReactTestInstance): boolean => {
    const hasRole = element.props.accessibilityRole === 'button' || element.props.role === 'button';
    const hasLabel = accessibilityTestHelpers.hasAccessibilityLabel(element);
    return hasRole && hasLabel;
  },
  
  // Check if element is properly focusable
  isFocusable: (element: ReactTestInstance): boolean => {
    return element.props.accessible !== false && 
           !element.props.accessibilityElementsHidden;
  },
  
  // Validate color contrast (simplified)
  validateColorContrast: (foreground: string, background: string): boolean => {
    // This is a simplified check - in real tests you'd use a proper contrast library
    return foreground !== background;
  },
};

// Performance testing utilities
export const performanceTestHelpers = {
  // Measure component render time
  measureRenderTime: async (renderFn: () => Promise<any>): Promise<number> => {
    const startTime = Date.now();
    await renderFn();
    const endTime = Date.now();
    return endTime - startTime;
  },
  
  // Check if component renders within acceptable time
  isRenderTimeAcceptable: (renderTime: number, maxTime: number = 100): boolean => {
    return renderTime <= maxTime;
  },
  
  // Memory usage helpers (mock for React Native)
  checkMemoryUsage: (): { used: number; limit: number } => {
    // In real implementation, this would use native modules
    return { used: 0, limit: 100 };
  },
};

// Component validation helpers
export const componentValidationHelpers = {
  // Validate that required props are provided
  validateRequiredProps: <T extends Record<string, any>>(
    props: T,
    requiredProps: (keyof T)[]
  ): string[] => {
    const missingProps: string[] = [];
    
    requiredProps.forEach(prop => {
      if (props[prop] === undefined || props[prop] === null) {
        missingProps.push(String(prop));
      }
    });
    
    return missingProps;
  },
  
  // Validate prop types (simplified)
  validatePropTypes: <T extends Record<string, any>>(
    props: T,
    propTypes: Record<keyof T, string>
  ): string[] => {
    const errors: string[] = [];
    
    Object.entries(propTypes).forEach(([key, expectedType]) => {
      const value = props[key];
      const actualType = typeof value;
      
      if (value !== undefined && actualType !== expectedType) {
        errors.push(`${key}: expected ${expectedType}, got ${actualType}`);
      }
    });
    
    return errors;
  },
  
  // Check if component has proper display name
  hasDisplayName: (component: any): boolean => {
    return !!(component.displayName || component.name);
  },
};

// Mock data generators for testing
export const mockDataGenerators = {
  // Generate mock recipe
  generateMockRecipe: (overrides: Partial<any> = {}): any => ({
    id: `recipe-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Mock Recipe',
    description: 'A delicious mock recipe for testing',
    time: '30 min',
    image: 'https://via.placeholder.com/300x200',
    isFavorite: false,
    category: 'Main Course',
    difficulty: 'Easy' as const,
    servings: 4,
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    instructions: ['Step 1', 'Step 2'],
    rating: 4.5,
    reviewCount: 123,
    ...overrides,
  }),
  
  // Generate mock category
  generateMockCategory: (overrides: Partial<any> = {}): any => ({
    id: `category-${Math.random().toString(36).substr(2, 9)}`,
    name: 'Mock Category',
    icon: 'restaurant',
    isActive: false,
    color: '#FF6B6B',
    recipeCount: 25,
    ...overrides,
  }),
  
  // Generate mock user preferences
  generateMockUserPreferences: (overrides: Partial<any> = {}): any => ({
    theme: 'light' as const,
    language: 'en',
    notifications: true,
    defaultCategory: 'all',
    gridView: true,
    ...overrides,
  }),
};

// Test environment setup helpers
export const testEnvironmentHelpers = {
  // Setup mock navigation
  setupMockNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
    setParams: jest.fn(),
    dispatch: jest.fn(),
    isFocused: jest.fn(() => true),
    canGoBack: jest.fn(() => true),
    getId: jest.fn(() => 'test-screen'),
    getParent: jest.fn(),
    getState: jest.fn(() => ({})),
  }),
  
  // Setup mock safe area insets
  setupMockSafeAreaInsets: () => ({
    top: 44,
    bottom: 34,
    left: 0,
    right: 0,
  }),
  
  // Setup mock dimensions
  setupMockDimensions: (width: number = 375, height: number = 667) => ({
    window: { width, height, scale: 2, fontScale: 1 },
    screen: { width, height, scale: 2, fontScale: 1 },
  }),
};

// Integration test helpers
export const integrationTestHelpers = {
  // Wait for async operations
  waitForAsync: (ms: number = 100): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  // Simulate user interaction
  simulateUserInteraction: async (
    element: ReactTestInstance,
    interaction: 'press' | 'longPress' | 'focus' = 'press'
  ): Promise<void> => {
    switch (interaction) {
      case 'press':
        if (element.props.onPress) {
          element.props.onPress();
        }
        break;
      case 'longPress':
        if (element.props.onLongPress) {
          element.props.onLongPress();
        }
        break;
      case 'focus':
        if (element.props.onFocus) {
          element.props.onFocus();
        }
        break;
    }
    
    await integrationTestHelpers.waitForAsync();
  },
  
  // Check if element is visible
  isElementVisible: (element: ReactTestInstance): boolean => {
    const style = element.props.style;
    if (Array.isArray(style)) {
      return !style.some(s => s?.display === 'none' || s?.opacity === 0);
    }
    return !(style?.display === 'none' || style?.opacity === 0);
  },
};

// Snapshot testing helpers
export const snapshotTestHelpers = {
  // Clean props for snapshot testing
  cleanPropsForSnapshot: (props: any): any => {
    const cleaned = { ...props };
    
    // Remove function props that can cause snapshot inconsistencies
    Object.keys(cleaned).forEach(key => {
      if (typeof cleaned[key] === 'function') {
        cleaned[key] = '[Function]';
      }
    });
    
    return cleaned;
  },
  
  // Generate consistent test data
  generateConsistentTestData: (seed: string): any => {
    // Use seed to generate consistent data for snapshots
    const hash = seed.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return {
      id: `test-${Math.abs(hash)}`,
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      randomValue: Math.abs(hash) % 100,
    };
  },
};

// Export all helpers
export const testUtils = {
  testIds,
  accessibilityTestHelpers,
  performanceTestHelpers,
  componentValidationHelpers,
  mockDataGenerators,
  testEnvironmentHelpers,
  integrationTestHelpers,
  snapshotTestHelpers,
}; 