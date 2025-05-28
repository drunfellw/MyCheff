import { handleAsyncError, errorHandler, ErrorType } from '../utils/errorHandler';
import { validateRecipeData, validateSearchQuery } from '../utils/security';
import type { 
  Recipe, 
  Category, 
  SearchFilters, 
  PaginatedResponse, 
  ApiResponse,
  User,
  UserSubscription,
  SubscriptionPlan,
  Ingredient,
  UserIngredient,
  FavoriteRecipe,
  RecipeRating,
  RecipeSearchParams,
  IngredientMatchParams,
  Language
} from '../types';

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.mycheff.com';
const API_VERSION = 'v1';

// API Endpoints
const ENDPOINTS = {
  // Authentication
  AUTH_LOGIN: `${API_BASE_URL}/${API_VERSION}/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/${API_VERSION}/auth/register`,
  AUTH_LOGOUT: `${API_BASE_URL}/${API_VERSION}/auth/logout`,
  AUTH_REFRESH: `${API_BASE_URL}/${API_VERSION}/auth/refresh`,
  
  // Languages
  LANGUAGES: `${API_BASE_URL}/${API_VERSION}/languages`,
  
  // Recipes
  RECIPES: `${API_BASE_URL}/${API_VERSION}/recipes`,
  RECIPES_SEARCH: `${API_BASE_URL}/${API_VERSION}/recipes/search`,
  RECIPES_BY_INGREDIENTS: `${API_BASE_URL}/${API_VERSION}/recipes/by-ingredients`,
  RECIPES_POPULAR: `${API_BASE_URL}/${API_VERSION}/recipes/popular`,
  RECIPES_FEATURED: `${API_BASE_URL}/${API_VERSION}/recipes/featured`,
  RECIPE_BY_ID: (id: string) => `${API_BASE_URL}/${API_VERSION}/recipes/${id}`,
  
  // Categories
  CATEGORIES: `${API_BASE_URL}/${API_VERSION}/categories`,
  CATEGORY_RECIPES: (categoryId: string) => `${API_BASE_URL}/${API_VERSION}/categories/${categoryId}/recipes`,
  
  // Ingredients
  INGREDIENTS: `${API_BASE_URL}/${API_VERSION}/ingredients`,
  INGREDIENTS_SEARCH: `${API_BASE_URL}/${API_VERSION}/ingredients/search`,
  
  // User
  USER_PROFILE: `${API_BASE_URL}/${API_VERSION}/user/profile`,
  USER_INGREDIENTS: `${API_BASE_URL}/${API_VERSION}/user/ingredients`,
  USER_FAVORITES: `${API_BASE_URL}/${API_VERSION}/user/favorites`,
  USER_RATINGS: `${API_BASE_URL}/${API_VERSION}/user/ratings`,
  
  // Subscriptions
  SUBSCRIPTION_PLANS: `${API_BASE_URL}/${API_VERSION}/subscription-plans`,
  USER_SUBSCRIPTIONS: `${API_BASE_URL}/${API_VERSION}/user/subscriptions`,
  SUBSCRIPTION_PURCHASE: `${API_BASE_URL}/${API_VERSION}/subscriptions/purchase`,
} as const;

// Request headers
const getHeaders = (includeAuth: boolean = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (includeAuth) {
    // TODO: Backend - Implement authentication token management
    const token = ''; // Get from secure storage
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function
const apiRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  return handleAsyncError(async () => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  });
};

// Authentication API Services
export const authAPI = {
  // User login
  login: async (email: string, password: string): Promise<{
    user: User;
    token: string;
    refreshToken: string;
  }> => {
    const response = await apiRequest<ApiResponse<any>>(ENDPOINTS.AUTH_LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.data;
  },

  // User registration
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    preferredLanguage?: string;
  }): Promise<{
    user: User;
    token: string;
    refreshToken: string;
  }> => {
    const response = await apiRequest<ApiResponse<any>>(ENDPOINTS.AUTH_REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiRequest<ApiResponse<void>>(ENDPOINTS.AUTH_LOGOUT, {
      method: 'POST',
    });
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{
    token: string;
    refreshToken: string;
  }> => {
    const response = await apiRequest<ApiResponse<any>>(ENDPOINTS.AUTH_REFRESH, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    return response.data;
  },
};

// Language API Services
export const languageAPI = {
  // Get all available languages
  getLanguages: async (): Promise<Language[]> => {
    const response = await apiRequest<ApiResponse<Language[]>>(ENDPOINTS.LANGUAGES);
    return response.data;
  },
};

// Recipe API Services
export const recipeAPI = {
  // Search recipes with advanced parameters
  searchRecipes: async (params: RecipeSearchParams & {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Recipe>> => {
    const { page = 1, limit = 20, ...searchParams } = params;
    
    if (searchParams.query) {
      const { isValid, sanitized } = validateSearchQuery(searchParams.query);
      if (!isValid) {
        throw errorHandler.createError(
          ErrorType.VALIDATION,
          'Invalid search query'
        );
      }
      searchParams.query = sanitized;
    }

    const response = await apiRequest<PaginatedResponse<Recipe>>(ENDPOINTS.RECIPES_SEARCH, {
      method: 'POST',
      body: JSON.stringify({
        ...searchParams,
        page,
        limit,
      }),
    });

    return response;
  },

  // Get recipes by ingredient matching
  getRecipesByIngredients: async (
    params: IngredientMatchParams & {
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<Recipe & { matchPercentage: number; missingIngredients: string[] }>> => {
    const { page = 1, limit = 20, ...matchParams } = params;

    const response = await apiRequest<PaginatedResponse<Recipe & { matchPercentage: number; missingIngredients: string[] }>>(
      ENDPOINTS.RECIPES_BY_INGREDIENTS,
      {
        method: 'POST',
        body: JSON.stringify({
          ...matchParams,
          page,
          limit,
        }),
      }
    );

    return response;
  },

  // Get popular recipes
  getPopularRecipes: async (
    languageCode: string = 'tr',
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Recipe>> => {
    const params = new URLSearchParams({
      languageCode,
      page: page.toString(),
      limit: limit.toString(),
    });

    const url = `${ENDPOINTS.RECIPES_POPULAR}?${params.toString()}`;
    return apiRequest<PaginatedResponse<Recipe>>(url);
  },

  // Get featured recipes
  getFeaturedRecipes: async (
    languageCode: string = 'tr',
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Recipe>> => {
    const params = new URLSearchParams({
      languageCode,
      page: page.toString(),
      limit: limit.toString(),
    });

    const url = `${ENDPOINTS.RECIPES_FEATURED}?${params.toString()}`;
    return apiRequest<PaginatedResponse<Recipe>>(url);
  },

  // Get single recipe by ID
  getRecipeById: async (
    recipeId: string,
    languageCode: string = 'tr'
  ): Promise<Recipe> => {
    const params = new URLSearchParams({ languageCode });
    const url = `${ENDPOINTS.RECIPE_BY_ID(recipeId)}?${params.toString()}`;
    
    const response = await apiRequest<ApiResponse<Recipe>>(url);
    
    // Validate recipe data
    const { isValid, errors } = validateRecipeData(response.data);
    if (!isValid) {
      throw errorHandler.createError(
        ErrorType.VALIDATION,
        `Invalid recipe data: ${errors.join(', ')}`
      );
    }

    return response.data;
  },

  // Rate a recipe
  rateRecipe: async (
    recipeId: string,
    rating: number,
    comment?: string
  ): Promise<RecipeRating> => {
    const response = await apiRequest<ApiResponse<RecipeRating>>(
      `${ENDPOINTS.RECIPE_BY_ID(recipeId)}/ratings`,
      {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
      }
    );
    return response.data;
  },
};

// Category API Services
export const categoryAPI = {
  // Get all categories with translations
  getCategories: async (languageCode: string = 'tr'): Promise<Category[]> => {
    const params = new URLSearchParams({ languageCode });
    const url = `${ENDPOINTS.CATEGORIES}?${params.toString()}`;
    
    const response = await apiRequest<ApiResponse<Category[]>>(url);
    return response.data;
  },

  // Get recipes by category
  getCategoryRecipes: async (
    categoryId: string,
    languageCode: string = 'tr',
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Recipe>> => {
    const params = new URLSearchParams({
      languageCode,
      page: page.toString(),
      limit: limit.toString(),
    });

    const url = `${ENDPOINTS.CATEGORY_RECIPES(categoryId)}?${params.toString()}`;
    return apiRequest<PaginatedResponse<Recipe>>(url);
  },
};

// Ingredient API Services
export const ingredientAPI = {
  // Search ingredients with autocomplete
  searchIngredients: async (
    query: string,
    languageCode: string = 'tr',
    limit: number = 10
  ): Promise<Ingredient[]> => {
    const { isValid, sanitized } = validateSearchQuery(query);
    
    if (!isValid || sanitized.length < 2) {
      return [];
    }

    const params = new URLSearchParams({
      q: sanitized,
      languageCode,
      limit: limit.toString(),
    });

    const url = `${ENDPOINTS.INGREDIENTS_SEARCH}?${params.toString()}`;
    const response = await apiRequest<ApiResponse<Ingredient[]>>(url);
    return response.data;
  },

  // Get all available ingredients
  getAllIngredients: async (languageCode: string = 'tr'): Promise<Ingredient[]> => {
    const params = new URLSearchParams({ languageCode });
    const url = `${ENDPOINTS.INGREDIENTS}?${params.toString()}`;
    
    const response = await apiRequest<ApiResponse<Ingredient[]>>(url);
    return response.data;
  },
};

// User API Services
export const userAPI = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await apiRequest<ApiResponse<User>>(ENDPOINTS.USER_PROFILE);
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiRequest<ApiResponse<User>>(ENDPOINTS.USER_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data;
  },

  // Get user ingredients
  getUserIngredients: async (): Promise<UserIngredient[]> => {
    const response = await apiRequest<ApiResponse<UserIngredient[]>>(ENDPOINTS.USER_INGREDIENTS);
    return response.data;
  },

  // Add ingredient to user's list
  addUserIngredient: async (ingredientData: {
    ingredientId: string;
    quantity: number;
    unit: string;
  }): Promise<UserIngredient> => {
    const response = await apiRequest<ApiResponse<UserIngredient>>(ENDPOINTS.USER_INGREDIENTS, {
      method: 'POST',
      body: JSON.stringify(ingredientData),
    });
    return response.data;
  },

  // Update user ingredient
  updateUserIngredient: async (
    ingredientId: string,
    updateData: {
      quantity?: number;
      unit?: string;
    }
  ): Promise<UserIngredient> => {
    const response = await apiRequest<ApiResponse<UserIngredient>>(
      `${ENDPOINTS.USER_INGREDIENTS}/${ingredientId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updateData),
      }
    );
    return response.data;
  },

  // Remove ingredient from user's list
  removeUserIngredient: async (ingredientId: string): Promise<void> => {
    await apiRequest<ApiResponse<void>>(`${ENDPOINTS.USER_INGREDIENTS}/${ingredientId}`, {
      method: 'DELETE',
    });
  },

  // Get user favorites
  getFavorites: async (
    page: number = 1,
    limit: number = 20,
    languageCode: string = 'tr'
  ): Promise<PaginatedResponse<Recipe>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      languageCode,
    });

    const url = `${ENDPOINTS.USER_FAVORITES}?${params.toString()}`;
    return apiRequest<PaginatedResponse<Recipe>>(url);
  },

  // Add recipe to favorites
  addToFavorites: async (recipeId: string): Promise<void> => {
    await apiRequest<ApiResponse<void>>(ENDPOINTS.USER_FAVORITES, {
      method: 'POST',
      body: JSON.stringify({ recipeId }),
    });
  },

  // Remove recipe from favorites
  removeFromFavorites: async (recipeId: string): Promise<void> => {
    await apiRequest<ApiResponse<void>>(`${ENDPOINTS.USER_FAVORITES}/${recipeId}`, {
      method: 'DELETE',
    });
  },

  // Check if recipe is favorite
  isFavorite: async (recipeId: string): Promise<boolean> => {
    try {
      const response = await apiRequest<ApiResponse<{ isFavorite: boolean }>>(
        `${ENDPOINTS.USER_FAVORITES}/${recipeId}/check`
      );
      return response.data.isFavorite;
    } catch (error) {
      return false;
    }
  },

  // Get user ratings
  getUserRatings: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<RecipeRating>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const url = `${ENDPOINTS.USER_RATINGS}?${params.toString()}`;
    return apiRequest<PaginatedResponse<RecipeRating>>(url);
  },
};

// Subscription API Services
export const subscriptionAPI = {
  // Get available subscription plans
  getPlans: async (languageCode: string = 'tr'): Promise<SubscriptionPlan[]> => {
    const params = new URLSearchParams({ languageCode });
    const url = `${ENDPOINTS.SUBSCRIPTION_PLANS}?${params.toString()}`;
    
    const response = await apiRequest<ApiResponse<SubscriptionPlan[]>>(url);
    return response.data;
  },

  // Get user's subscriptions
  getUserSubscriptions: async (): Promise<UserSubscription[]> => {
    const response = await apiRequest<ApiResponse<UserSubscription[]>>(ENDPOINTS.USER_SUBSCRIPTIONS);
    return response.data;
  },

  // Purchase subscription
  purchaseSubscription: async (planId: string, paymentData: {
    paymentMethod: string;
    paymentReference?: string;
  }): Promise<UserSubscription> => {
    const response = await apiRequest<ApiResponse<UserSubscription>>(ENDPOINTS.SUBSCRIPTION_PURCHASE, {
      method: 'POST',
      body: JSON.stringify({
        planId,
        ...paymentData,
      }),
    });
    return response.data;
  },

  // Check premium status
  checkPremiumStatus: async (): Promise<{
    isPremium: boolean;
    expiresAt?: Date;
    subscription?: UserSubscription;
  }> => {
    const response = await apiRequest<ApiResponse<any>>(`${ENDPOINTS.USER_SUBSCRIPTIONS}/status`);
    return response.data;
  },
};

// Export all API services
export const api = {
  auth: authAPI,
  languages: languageAPI,
  recipes: recipeAPI,
  categories: categoryAPI,
  ingredients: ingredientAPI,
  user: userAPI,
  subscriptions: subscriptionAPI,
};

// TODO: Backend Implementation Checklist
/*
BACKEND GEREKSİNİMLERİ - UPDATED FOR NEW DATA MODEL:

1. AUTHENTICATION & USER MANAGEMENT
   - POST /auth/login - User login with email/password
   - POST /auth/register - User registration
   - POST /auth/logout - User logout
   - POST /auth/refresh - Token refresh
   - GET /user/profile - Get user profile with premium status
   - PUT /user/profile - Update user profile

2. LANGUAGE MANAGEMENT
   - GET /languages - Get all available languages

3. RECIPE MANAGEMENT
   - POST /recipes/search - Advanced recipe search with filters
   - POST /recipes/by-ingredients - Recipe matching by user ingredients
   - GET /recipes/popular - Popular recipes (materialized view)
   - GET /recipes/featured - Featured recipes
   - GET /recipes/:id - Single recipe with translations
   - POST /recipes/:id/ratings - Rate a recipe

4. CATEGORY MANAGEMENT
   - GET /categories - Categories with translations
   - GET /categories/:id/recipes - Recipes by category

5. INGREDIENT MANAGEMENT
   - GET /ingredients/search - Autocomplete ingredient search
   - GET /ingredients - All ingredients with translations

6. USER INGREDIENT MANAGEMENT
   - GET /user/ingredients - User's ingredient list
   - POST /user/ingredients - Add ingredient to user's list
   - PUT /user/ingredients/:id - Update user ingredient
   - DELETE /user/ingredients/:id - Remove user ingredient

7. USER FAVORITES
   - GET /user/favorites - User's favorite recipes
   - POST /user/favorites - Add to favorites
   - DELETE /user/favorites/:id - Remove from favorites
   - GET /user/favorites/:id/check - Check if recipe is favorite

8. USER RATINGS
   - GET /user/ratings - User's recipe ratings

9. SUBSCRIPTION MANAGEMENT
   - GET /subscription-plans - Available subscription plans
   - GET /user/subscriptions - User's subscriptions
   - POST /subscriptions/purchase - Purchase subscription
   - GET /user/subscriptions/status - Check premium status

10. DATABASE FUNCTIONS TO IMPLEMENT
    - match_recipes_by_ingredients() - Core ingredient matching function
    - search_recipes() - Advanced recipe search function
    - update_recipe_translation_search_vector() - Search vector updates
    - active_premium_users view - Premium user management

11. PERFORMANCE REQUIREMENTS
    - Ingredient search autocomplete (< 200ms)
    - Recipe search with full-text search (< 500ms)
    - Recipe matching by ingredients (< 1s)
    - Popular recipes materialized view refresh

12. MULTI-LANGUAGE SUPPORT
    - All content served based on languageCode parameter
    - Translation tables properly joined
    - Search vectors for each language

13. PREMIUM SYSTEM
    - Automatic premium status calculation
    - Premium content filtering
    - Subscription expiry management
*/ 