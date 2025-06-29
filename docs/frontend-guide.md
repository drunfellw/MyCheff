# MyCheff Frontend Development Guide

Complete guide for developing and maintaining the MyCheff React Native mobile application.

## 📱 Tech Stack

- **React Native**: 0.79.x - Cross-platform mobile framework
- **Expo**: 53.x - Development platform and toolkit
- **TypeScript**: 5.x - Type safety and developer experience
- **React Navigation**: 6.x - Navigation library
- **React Query**: 4.x - Data fetching and caching
- **AsyncStorage**: Persistent local storage
- **Expo Linear Gradient**: Background gradients
- **React Native Safe Area Context**: Safe area handling

## 🏗️ Project Structure

```
mycheff-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── RecipeCard.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── LoadingSpinner.tsx
│   ├── screens/             # Screen components
│   │   ├── WelcomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── RecipeDetailScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── FavoritesScreen.tsx
│   │   └── CookingStepsScreen.tsx
│   ├── providers/           # Context providers
│   │   └── AuthProvider.tsx
│   ├── services/            # API clients and external services
│   │   ├── apiClient.ts
│   │   ├── authAPI.ts
│   │   ├── recipesAPI.ts
│   │   └── categoriesAPI.ts
│   ├── constants/           # Design system and constants
│   │   ├── Colors.ts
│   │   ├── Spacing.ts
│   │   ├── Typography.ts
│   │   └── index.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── api.ts
│   │   ├── navigation.ts
│   │   └── index.ts
│   └── utils/               # Utility functions
│       ├── validation.ts
│       ├── storage.ts
│       └── helpers.ts
├── assets/                  # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── app.json                 # Expo configuration
├── babel.config.js
├── metro.config.js
├── package.json
└── tsconfig.json
```

## 🎨 Design System

### Colors (`src/constants/Colors.ts`)
```typescript
export const COLORS = {
  // Primary Colors
  primary: '#FF6B6B',
  primaryLight: '#FF8E8E',
  primaryDark: '#E63946',
  
  // Secondary Colors
  secondary: '#4ECDC4',
  secondaryLight: '#6FD8D2',
  secondaryDark: '#2A9D8F',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Semantic Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Background Colors
  background: '#FFFFFF',
  surface: '#F9FAFB',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Text Colors
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
} as const;
```

### Spacing (`src/constants/Spacing.ts`)
```typescript
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const LAYOUT = {
  containerPadding: SPACING.md,
  screenPadding: SPACING.lg,
  cardPadding: SPACING.md,
  listItemPadding: SPACING.sm,
} as const;
```

### Typography (`src/constants/Typography.ts`)
```typescript
export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export const FONT_FAMILY = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
} as const;

export const LINE_HEIGHT = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;
```

### Border Radius (`src/constants/Border.ts`)
```typescript
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
} as const;

export const SHADOW_PRESETS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;
```

## 🧭 Navigation System

### Navigation Types (`src/types/navigation.ts`)
```typescript
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Search: undefined;
  SearchResults: { query: string };
  RecipeDetail: { 
    recipeId: string; 
    recipeTitle: string; 
  };
  CookingSteps: { 
    recipeId: string; 
    recipeTitle: string; 
  };
  Profile: undefined;
  Favorites: undefined;
  ProfileEdit: undefined;
};

export type NavigationProp = {
  navigate: <T extends keyof RootStackParamList>(
    screen: T,
    params?: RootStackParamList[T]
  ) => void;
  goBack: () => void;
  replace: <T extends keyof RootStackParamList>(
    screen: T,
    params?: RootStackParamList[T]
  ) => void;
};
```

### Navigation Implementation (`App.tsx`)
```typescript
const AppContent = React.memo(() => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('Welcome');
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>(['Welcome']);

  const navigate = useCallback(<T extends Screen>(
    screen: T,
    params?: any
  ): void => {
    setNavigationHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
  }, []);

  const goBack = useCallback((): void => {
    if (navigationHistory.length > 1) {
      const newHistory = navigationHistory.slice(0, -1);
      setNavigationHistory(newHistory);
      setCurrentScreen(newHistory[newHistory.length - 1]);
    }
  }, [navigationHistory]);

  // Screen rendering logic...
});
```

## 🔐 Authentication System

### AuthProvider (`src/providers/AuthProvider.tsx`)
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const userData = await AsyncStorage.getItem('userData');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(email, password);
      
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Other auth methods...
};
```

## 🌐 API Integration

### API Client (`src/services/apiClient.ts`)
```typescript
class APIClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    this.timeout = 10000;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    const {
      method = 'GET',
      body,
      requiresAuth = false,
      ...otherOptions
    } = options;

    try {
      const headers = requiresAuth 
        ? await this.getAuthHeaders()
        : { 'Content-Type': 'application/json' };

      const config: RequestInit = {
        method,
        headers,
        ...otherOptions,
      };

      if (body) {
        config.body = JSON.stringify(body);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new APIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Network request failed', 0);
    }
  }
}

export const apiClient = new APIClient();
```

### Recipes API (`src/services/recipesAPI.ts`)
```typescript
export const recipesAPI = {
  getAll: async (page: number = 1, limit: number = 10): Promise<APIResponse<Recipe[]>> => {
    return apiClient.request(`/recipes?page=${page}&limit=${limit}`);
  },

  getFeatured: async (page: number = 1, limit: number = 10): Promise<APIResponse<Recipe[]>> => {
    return apiClient.request(`/recipes/featured?page=${page}&limit=${limit}`);
  },

  search: async (query: string, page: number = 1, limit: number = 10): Promise<APIResponse<Recipe[]>> => {
    const encodedQuery = encodeURIComponent(query);
    return apiClient.request(`/recipes/search?q=${encodedQuery}&page=${page}&limit=${limit}`);
  },

  getById: async (id: string): Promise<APIResponse<Recipe>> => {
    return apiClient.request(`/recipes/${id}`, { requiresAuth: true });
  },
};
```

## 🎯 Screen Components

### Screen Template
```typescript
interface ScreenNameProps {
  navigation: NavigationProp;
  route?: {
    params: {
      // Route parameters
    };
  };
}

const ScreenName: React.FC<ScreenNameProps> = ({ navigation, route }) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  
  // Hooks
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  // Effects
  useEffect(() => {
    // Component initialization
  }, []);

  // Handlers
  const handleSomeAction = useCallback(() => {
    // Action handler
  }, []);

  // Render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      {/* Screen content */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Other styles
});

export default ScreenName;
```

### HomeScreen Implementation
```typescript
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await recipesAPI.getFeatured(1, 20);
      setRecipes(response.data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <RecipeCard
      recipe={item}
      onPress={() => navigation.navigate('RecipeDetail', {
        recipeId: item.id,
        recipeTitle: item.title,
      })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hoş Geldin!</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Feather name="user" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={recipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.recipesList}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={fetchRecipes}
      />
    </SafeAreaView>
  );
};
```

## 🧱 Component Architecture

### Reusable Component Template
```typescript
interface ComponentProps {
  // Required props
  title: string;
  onPress: () => void;
  
  // Optional props
  subtitle?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  
  // Style props
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Component: React.FC<ComponentProps> = ({
  title,
  onPress,
  subtitle,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
}) => {
  const containerStyle = [
    styles.container,
    styles[variant],
    disabled && styles.disabled,
    style,
  ];

  const titleStyle = [
    styles.title,
    styles[`${variant}Title`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={titleStyle}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  disabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: FONT_SIZE.base,
    fontFamily: FONT_FAMILY.medium,
  },
  primaryTitle: {
    color: COLORS.white,
  },
  secondaryTitle: {
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});

export default Component;
```

## 🏪 State Management

### Local State with Hooks
```typescript
// Custom hook for recipes
const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await recipesAPI.getAll();
      setRecipes(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    recipes,
    isLoading,
    error,
    fetchRecipes,
  };
};
```

### Context for Global State
```typescript
// Theme context
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof COLORS;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const colors = isDarkMode ? DARK_COLORS : COLORS;

  const value = {
    isDarkMode,
    toggleTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## 🎨 Styling Best Practices

### Style Organization
```typescript
// Separate styles by component sections
const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.containerPadding,
  },
  headerTitle: {
    fontSize: FONT_SIZE['2xl'],
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.text,
  },
  
  // Content styles
  content: {
    flex: 1,
    paddingHorizontal: LAYOUT.containerPadding,
  },
  
  // List styles
  list: {
    paddingBottom: SPACING.xl,
  },
  listItem: {
    marginBottom: SPACING.md,
  },
  
  // Button styles
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.base,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.base,
    fontFamily: FONT_FAMILY.medium,
  },
});
```

### Responsive Design
```typescript
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 375;

const responsiveStyles = StyleSheet.create({
  container: {
    paddingHorizontal: isTablet ? SPACING.xxl : SPACING.md,
  },
  title: {
    fontSize: isSmallScreen ? FONT_SIZE.lg : FONT_SIZE.xl,
  },
  grid: {
    numColumns: isTablet ? 3 : 2,
  },
});
```

## 🧪 Testing

### Component Testing
```typescript
// __tests__/components/RecipeCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RecipeCard from '../src/components/RecipeCard';

const mockRecipe = {
  id: '1',
  title: 'Test Recipe',
  description: 'Test description',
  imageUrl: 'https://example.com/image.jpg',
  cookingTime: 30,
  difficulty: 'Easy',
};

describe('RecipeCard', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <RecipeCard recipe={mockRecipe} onPress={jest.fn()} />
    );
    
    expect(getByText('Test Recipe')).toBeTruthy();
    expect(getByText('30 min')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <RecipeCard recipe={mockRecipe} onPress={onPressMock} />
    );
    
    fireEvent.press(getByTestId('recipe-card'));
    expect(onPressMock).toHaveBeenCalledWith(mockRecipe);
  });
});
```

### API Testing
```typescript
// __tests__/services/recipesAPI.test.ts
import { recipesAPI } from '../src/services/recipesAPI';

// Mock the API client
jest.mock('../src/services/apiClient');

describe('recipesAPI', () => {
  it('fetches recipes successfully', async () => {
    const mockResponse = {
      success: true,
      data: [{ id: '1', title: 'Test Recipe' }],
    };

    (apiClient.request as jest.Mock).mockResolvedValue(mockResponse);

    const result = await recipesAPI.getAll();
    expect(result).toEqual(mockResponse);
  });
});
```

## 🚀 Performance Optimization

### Image Optimization
```typescript
// Optimized Image component
const OptimizedImage: React.FC<{
  source: { uri: string };
  style?: ImageStyle;
  placeholder?: string;
}> = ({ source, style, placeholder }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={style}>
      {loading && (
        <View style={[style, styles.placeholder]}>
          <ActivityIndicator size="small" color={COLORS.gray400} />
        </View>
      )}
      <Image
        source={source}
        style={[style, { opacity: loading ? 0 : 1 }]}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        resizeMode="cover"
      />
      {error && (
        <View style={[style, styles.errorState]}>
          <Feather name="image" size={24} color={COLORS.gray400} />
        </View>
      )}
    </View>
  );
};
```

### List Optimization
```typescript
// Optimized FlatList configuration
const RecipesList: React.FC<{
  recipes: Recipe[];
  onEndReached: () => void;
}> = ({ recipes, onEndReached }) => {
  const renderItem = useCallback(({ item }: { item: Recipe }) => (
    <RecipeCard recipe={item} />
  ), []);

  const keyExtractor = useCallback((item: Recipe) => item.id, []);

  return (
    <FlatList
      data={recipes}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={10}
      getItemLayout={(data, index) => ({
        length: 200,
        offset: 200 * index,
        index,
      })}
    />
  );
};
```

## 🔧 Development Workflow

### Development Commands
```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm test

# Build for production
npm run build:android
npm run build:ios
```

### Environment Configuration
```typescript
// src/config/environment.ts
const ENV = process.env.EXPO_PUBLIC_ENVIRONMENT || 'development';

export const config = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  API_TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '10000'),
  ENABLE_LOGS: ENV === 'development',
  APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
};
```

### Code Quality Tools

#### ESLint Configuration (`.eslintrc.js`)
```javascript
module.exports = {
  extends: [
    '@react-native-community',
    '@typescript-eslint/recommended',
  ],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-native/no-inline-styles': 'warn',
  },
};
```

#### Prettier Configuration (`.prettierrc`)
```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semicolons": true,
  "printWidth": 100
}
```

## 📚 Common Patterns

### Error Handling
```typescript
// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong. Please try again.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
```

### Loading States
```typescript
// Loading state hook
const useLoadingState = () => {
  const [loading, setLoading] = useState(false);

  const withLoading = useCallback(async (asyncFn: () => Promise<any>) => {
    try {
      setLoading(true);
      return await asyncFn();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, withLoading };
};
```

---

**Last Updated**: December 2024  
**React Native Version**: 0.79.x  
**Expo Version**: 53.x 