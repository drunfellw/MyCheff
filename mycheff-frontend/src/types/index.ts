// Core Types - Updated according to database model

export interface Language {
  code: string; // VARCHAR(5) - tr, en, es
  name: string; // VARCHAR(50) - Türkçe, English, Español
  isActive: boolean;
}

export interface User {
  id: string; // UUID
  username: string; // VARCHAR(50) - unique
  email: string; // VARCHAR(100) - unique
  passwordHash?: string; // VARCHAR(255) - only for backend
  preferredLanguage: string; // VARCHAR(5) - default 'tr'
  createdAt: Date;
  updatedAt: Date;
  // Computed fields
  isPremium?: boolean; // Calculated from active subscription
  premiumExpiresAt?: Date; // From active subscription
}

export interface SubscriptionPlan {
  id: string; // UUID
  name: string; // VARCHAR(50)
  durationMonths: number; // INTEGER - 1, 6, 12
  price: number; // DECIMAL(10, 2)
  description: string; // TEXT
  features: Record<string, any>; // JSONB
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Translations
  translations?: SubscriptionPlanTranslation[];
}

export interface SubscriptionPlanTranslation {
  id: string; // UUID
  planId: string; // UUID
  languageCode: string; // VARCHAR(5)
  name: string; // VARCHAR(50)
  description: string; // TEXT
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubscription {
  id: string; // UUID
  userId: string; // UUID
  planId: string; // UUID
  startDate: Date; // TIMESTAMP
  endDate: Date; // TIMESTAMP
  paymentReference: string; // VARCHAR(100)
  paymentStatus: 'completed' | 'failed' | 'refunded' | 'pending'; // VARCHAR(20)
  isAutoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  plan?: SubscriptionPlan;
}

export interface Category {
  id: string; // UUID
  createdAt: Date;
  updatedAt: Date;
  // Translations
  translations?: CategoryTranslation[];
  // Computed
  name?: string; // From translation based on current language
  recipeCount?: number; // Computed
  icon?: string; // Icon name for UI
}

export interface CategoryTranslation {
  id: string; // UUID
  categoryId: string; // UUID
  languageCode: string; // VARCHAR(5)
  name: string; // VARCHAR(50)
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  id: string; // UUID
  defaultUnit: string; // VARCHAR(20)
  createdAt: Date;
  updatedAt: Date;
  // Translations
  translations?: IngredientTranslation[];
  // Computed
  name?: string; // From translation based on current language
  aliases?: string[]; // From translation
}

export interface IngredientTranslation {
  id: string; // UUID
  ingredientId: string; // UUID
  languageCode: string; // VARCHAR(5)
  name: string; // VARCHAR(100)
  aliases: string[]; // TEXT[]
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipe {
  id: string; // UUID
  isPremium: boolean; // BOOLEAN - default FALSE
  isFeatured: boolean; // BOOLEAN - default FALSE
  cookingTimeMinutes: number; // INTEGER
  authorId: string; // UUID
  difficultyLevel: number; // SMALLINT (1-5)
  createdAt: Date;
  updatedAt: Date;
  // Translations
  translations?: RecipeTranslation[];
  // Related data
  details?: RecipeDetails;
  categories?: Category[];
  ingredients?: RecipeIngredient[];
  media?: RecipeMedia[];
  ratings?: RecipeRating[];
  // Computed fields
  title?: string; // From translation
  description?: string; // From translation
  preparationSteps?: any[]; // From translation JSONB
  averageRating?: number;
  favoriteCount?: number;
  image?: string; // Primary image URL
  isFavorite?: boolean; // Client-side favorite status
  // Legacy compatibility
  name?: string; // Alias for title
  difficulty?: 'Easy' | 'Medium' | 'Hard'; // Computed from difficultyLevel
  cookingTime?: number; // Alias for cookingTimeMinutes
  instructions?: string[]; // Computed from preparationSteps
}

export interface RecipeTranslation {
  id: string; // UUID
  recipeId: string; // UUID
  languageCode: string; // VARCHAR(5)
  title: string; // VARCHAR(100)
  description: string; // TEXT
  preparationSteps: any[]; // JSONB
  searchVector?: string; // TSVECTOR
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeDetails {
  id: string; // UUID
  recipeId: string; // UUID
  nutritionalData: NutritionInfo; // JSONB
  attributes: DietaryFlags; // JSONB
  servingSize: string; // VARCHAR(30)
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbohydrates: number; // grams
  fat: number; // grams
  fiber?: number; // grams
  sugar?: number; // grams
  sodium?: number; // mg
  cholesterol?: number; // mg
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
}

export interface DietaryFlags {
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  isNutFree?: boolean;
  isLowCarb?: boolean;
  isKeto?: boolean;
  isPaleo?: boolean;
  isHalal?: boolean;
  isKosher?: boolean;
  [key: string]: boolean | undefined;
}

export interface RecipeIngredient {
  id: string; // UUID
  recipeId: string; // UUID
  ingredientId: string; // UUID
  quantity: number; // DECIMAL(10, 2)
  unit: string; // VARCHAR(30)
  isRequired: boolean; // BOOLEAN - default TRUE
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  ingredient?: Ingredient;
  // Computed
  name?: string; // From ingredient translation
}

export interface RecipeMedia {
  id: string; // UUID
  recipeId: string; // UUID
  mediaType: 'photo' | 'video'; // VARCHAR(10)
  url: string; // VARCHAR(255)
  isPrimary: boolean; // BOOLEAN - default FALSE
  displayOrder: number; // INTEGER
  createdAt: Date;
  updatedAt: Date;
}

export interface UserIngredient {
  id: string; // UUID
  userId: string; // UUID
  ingredientId: string; // UUID
  quantity: number; // DECIMAL(10, 2)
  unit: string; // VARCHAR(30)
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  ingredient?: Ingredient;
  // Computed
  name?: string; // From ingredient translation
}

export interface FavoriteRecipe {
  userId: string; // UUID
  recipeId: string; // UUID
  createdAt: Date;
  // Joined data
  recipe?: Recipe;
}

export interface RecipeRating {
  id: string; // UUID
  userId: string; // UUID
  recipeId: string; // UUID
  rating: number; // SMALLINT (1-5)
  comment?: string; // TEXT
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  user?: User;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search & Filter Types
export interface SearchFilters {
  query?: string; // Text search
  categories?: string[]; // Category IDs
  attributes?: Partial<DietaryFlags>; // Dietary filters
  maxCookingTime?: number; // Maximum cooking time in minutes
  difficultyLevelMax?: number; // Maximum difficulty level (1-5)
  includePremium?: boolean; // Include premium recipes
  minMatchPercent?: number; // For ingredient-based search
  maxMissingIngredients?: number; // For ingredient-based search
}

export interface RecipeSearchParams {
  query?: string;
  userId?: string;
  languageCode?: string;
  attributes?: Record<string, any>;
  maxCookingTime?: number;
  categories?: string[];
  difficultyLevelMax?: number;
  includePremium?: boolean;
}

export interface IngredientMatchParams {
  userId: string;
  languageCode?: string;
  minMatchPercent?: number;
  maxMissingIngredients?: number;
  includePremium?: boolean;
}

// Component Props Types
export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  loading?: boolean;
  style?: any;
  testID?: string;
}

export interface RecipeCardProps {
  recipe: Recipe;
  onPress: (recipe: Recipe) => void;
  onFavoritePress?: (recipeId: string) => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
  style?: any;
  testID?: string;
}

export interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  style?: any;
  testID?: string;
}

// Navigation Types
export interface NavigationTab {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

export interface NavigationState {
  currentScreen: string;
  previousScreen?: string;
  params?: Record<string, any>;
}

// Screen Props Types
export interface HomeScreenProps {
  navigation: any;
  route: any;
}

export interface SearchScreenProps {
  navigation: any;
  route: any;
}

export interface CheffScreenProps {
  navigation: any;
  route: any;
}

export interface ProfileScreenProps {
  navigation: any;
  route: any;
}

export interface RecipeDetailScreenProps {
  navigation: any;
  route: {
    params: {
      recipeId: string;
      recipe?: Recipe;
    };
  };
}

// Error Types
export interface AppError {
  type: 'NETWORK' | 'VALIDATION' | 'AUTHENTICATION' | 'AUTHORIZATION' | 'NOT_FOUND' | 'SERVER' | 'UNKNOWN';
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
}

// Premium Features
export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  isAvailable: boolean;
  requiresPremium: boolean;
}

// Analytics Types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

// Cache Types
export interface CacheItem<T> {
  data: T;
  timestamp: Date;
  expiresAt: Date;
  key: string;
}

export interface CacheConfig {
  ttl: number; // time to live in milliseconds
  maxSize: number; // maximum number of items
  strategy: 'LRU' | 'FIFO' | 'TTL';
}

// Legacy compatibility types (for backward compatibility)
export interface LegacyRecipe {
  id: string;
  name: string;
  description: string;
  image: string;
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  category: string;
  categoryId: string;
  servings: number;
  calories?: number;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
}

// Utility Types
export type RecipeWithTranslation = Recipe & {
  title: string;
  description: string;
  preparationSteps: any[];
};

export type CategoryWithTranslation = Category & {
  name: string;
};

export type IngredientWithTranslation = Ingredient & {
  name: string;
  aliases: string[];
}; 