// Core Types
export interface Recipe {
  id: string;
  title: string;
  description?: string;
  time: string;
  image: string;
  isFavorite: boolean;
  category: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  servings?: number;
  ingredients?: string[];
  instructions?: string[];
  nutrition?: NutritionInfo;
  tags?: string[];
  author?: string;
  rating?: number;
  reviewCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  color?: string;
  description?: string;
  recipeCount?: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

// Navigation Types
export interface NavigationTab {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

// Component Props Types
export interface SearchBarProps {
  onSearch?: (text: string) => void;
  onFilter?: () => void;
  placeholder1?: string;
  placeholder2?: string;
  value?: string;
  disabled?: boolean;
}

export interface ScrollMenuProps {
  categories: Category[];
  activeIndex: number;
  onCategorySelect?: (category: Category, index: number) => void;
}

export interface RecipeCardProps {
  recipe: Recipe;
  onPress?: (recipe: Recipe) => void;
  onFavoritePress?: (recipeId: string, isFavorite: boolean) => void;
  variant?: 'default' | 'compact' | 'featured';
}

export interface NavigationBarProps {
  activeTab: string;
  onTabPress?: (tabId: string) => void;
  tabs?: NavigationTab[];
}

// Screen Props Types
export interface HomeScreenProps {
  // Add navigation props when using react-navigation
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Hook Types
export interface UseRecipesResult {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export interface UseCategoriesResult {
  categories: Category[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  loading: boolean;
  error: string | null;
  activeCategory: Category | null;
  getCategoryById: (id: string) => Category | undefined;
  getCategoryIndexById: (id: string) => number;
  setActiveCategoryById: (id: string) => void;
  resetCategories: () => void;
  refreshCategories: () => Promise<void>;
}

// Theme & Style Types
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  background: string;
  white: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textWhite: string;
  border: string;
  surfaceOverlay: string;
  surfaceOverlay2: string;
  shadowLight: string;
  shadowMedium: string;
  shadowDark: string;
  transparent: string;
  success?: string;
  warning?: string;
  error?: string;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface ResponsiveDimensions {
  isPhone: boolean;
  isTablet: boolean;
  isLargeTablet: boolean;
  screenWidth: number;
  screenHeight: number;
  gridColumns: number;
  containerPadding: number;
  cardPadding: number;
  gridGap: number;
  searchBarMaxWidth: number;
  categoryItemWidth: number;
}

export interface ComponentDimensions {
  searchBar: {
    width: number;
    height: number;
    borderRadius: number;
    padding: number;
    gap: number;
  };
  category: {
    width: number;
    height: number;
    gap: number;
    iconSize: number;
    fontSize: number;
  };
  recipeCard: {
    width: number;
    imageHeight: number;
    borderRadius: number;
    padding: number;
    gap: number;
  };
  navigation: {
    height: number;
    padding: number;
    gap: number;
    iconSize: number;
    fontSize: number;
  };
}

// Utility Types
export type IconName = string;
export type ColorValue = string;
export type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';

// Search & Filter Types
export interface SearchFilters {
  category?: string;
  difficulty?: Recipe['difficulty'];
  maxTime?: number;
  minRating?: number;
  tags?: string[];
  ingredients?: string[];
}

export interface FilterOptions {
  categories: string[];
  difficulty: string[];
  cookingTime: string[];
  dietary: string[];
}

export interface SearchResult {
  recipes: Recipe[];
  totalCount: number;
  filters: SearchFilters;
  query: string;
}

// Animation Types
export interface AnimationConfig {
  duration: number;
  useNativeDriver: boolean;
  tension?: number;
  friction?: number;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Storage Types
export interface StorageKeys {
  FAVORITES: string;
  RECENT_SEARCHES: string;
  USER_PREFERENCES: string;
  CACHE_RECIPES: string;
  CACHE_CATEGORIES: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  defaultCategory: string;
  gridView: boolean;
} 