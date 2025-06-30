import { api, authUtils, PaginatedResponse } from './apiClient';
import { validateRecipeData, validateSearchQuery } from '../utils/security';
import type { 
  Recipe, 
  Category, 
  SearchFilters, 
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

// Authentication API Services
export const authAPI = {
  // User login
  login: async (email: string, password: string): Promise<{
    user: User;
    token: string;
    refreshToken?: string;
  }> => {
    const response = await api.post<{
      user: User;
      token: string;
      refreshToken?: string;
    }>('/auth/login', { email, password });
    
    // Store tokens (refreshToken might be undefined)
    await authUtils.setTokens(response.token, response.refreshToken);
    
    return response;
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
    refreshToken?: string;
  }> => {
    const response = await api.post<{
      user: User;
      token: string;
      refreshToken?: string;
    }>('/auth/register', userData);
    
    // Store tokens and language (refreshToken might be undefined)
    await authUtils.setTokens(response.token, response.refreshToken);
    if (userData.preferredLanguage) {
      await authUtils.setLanguage(userData.preferredLanguage);
    }
    
    return response;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post<void>('/auth/logout');
    await authUtils.clearTokens();
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{
    token: string;
    refreshToken: string;
  }> => {
    return api.post<{
      token: string;
      refreshToken: string;
    }>('/auth/refresh', { refreshToken });
  },
};

// Language API Services
export const languageAPI = {
  // Get all available languages
  getLanguages: async (): Promise<Language[]> => {
    return api.get<Language[]>('/languages');
  },
};

// Recipe API Services
export const recipeAPI = {
  // Search recipes with query parameter (matches backend GET /api/v1/recipes/search?q=query)
  searchRecipes: async (params: RecipeSearchParams & {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Recipe>> => {
    const { page = 1, limit = 20, query, ...searchParams } = params;
    
    if (query) {
      const { isValid, sanitized } = validateSearchQuery(query);
      if (!isValid) {
        throw new Error('Invalid search query');
      }
      
      const queryParams = new URLSearchParams({
        q: sanitized,
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add other search parameters
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // Handle array parameters like categories
            value.forEach(v => queryParams.append(key === 'categories' ? 'categoryIds' : key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      return api.getPaginated<Recipe>(`/recipes/search?${queryParams.toString()}`);
    }
    
    return { data: [], pagination: { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false } };
  },

  // Get recipes by ingredient matching (NEW BACKEND ENDPOINT)
  getRecipesByIngredients: async (
    params: IngredientMatchParams & {
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<Recipe & { 
    matchPercentage: number; 
    missingIngredients: string[];
    matchingIngredients: string[];
    totalIngredients: number;
    matchingIngredientsCount: number;
  }>> => {
    const { page = 1, limit = 20, ...matchParams } = params;

    return api.post<PaginatedResponse<Recipe & { 
      matchPercentage: number; 
      missingIngredients: string[];
      matchingIngredients: string[];
      totalIngredients: number;
      matchingIngredientsCount: number;
    }>>('/recipes/by-ingredients', {
      ...matchParams,
      page,
      limit,
    });
  },

  // Get popular recipes (backend will need this endpoint - for now use regular recipes)
  getPopularRecipes: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Recipe>> => {
    // For now, use regular recipes endpoint since popular endpoint doesn't exist yet
    return api.getPaginated<Recipe>(`/recipes?page=${page}&limit=${limit}`);
  },

  // Get featured recipes (matches backend GET /api/v1/recipes/featured)
  getFeaturedRecipes: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Recipe>> => {
    return api.getPaginated<Recipe>(`/recipes/featured?page=${page}&limit=${limit}`);
  },

  // Get all recipes with filters (matches backend GET /api/v1/recipes)
  getRecipes: async (
    page: number = 1,
    limit: number = 20,
    filters?: SearchFilters
  ): Promise<PaginatedResponse<Recipe>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    return api.getPaginated<Recipe>(`/recipes?${params.toString()}`);
  },

  // Get single recipe by ID (matches backend GET /api/v1/recipes/:id)
  getRecipeById: async (recipeId: string): Promise<Recipe> => {
    const recipe = await api.get<Recipe>(`/recipes/${recipeId}`);
    
    // Validate recipe data
    const { isValid, errors } = validateRecipeData(recipe);
    if (!isValid) {
      throw new Error(`Invalid recipe data: ${errors.join(', ')}`);
    }

    return recipe;
  },

  // Rate a recipe (backend will need this endpoint)
  rateRecipe: async (
    recipeId: string,
    rating: number,
    comment?: string
  ): Promise<RecipeRating> => {
    return api.post<RecipeRating>(`/recipes/${recipeId}/ratings`, {
      rating,
      comment,
    });
  },
};

// Category API Services
export const categoryAPI = {
  // Get all categories with translations (matches backend GET /api/v1/recipes/categories)
  getCategories: async (): Promise<Category[]> => {
    // Backend returns { success: true, data: Category[] } format
    const response = await api.get<Category[]>('/recipes/categories');
    return response;
  },

  // Get recipes by category (backend will need this endpoint)
  getCategoryRecipes: async (
    categoryId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Recipe>> => {
    return api.getPaginated<Recipe>(
      `/categories/${categoryId}/recipes?page=${page}&limit=${limit}`
    );
  },
};

// Ingredient API Services
export const ingredientAPI = {
  // Search ingredients with autocomplete
  searchIngredients: async (
    query: string,
    limit: number = 10
  ): Promise<Ingredient[]> => {
    const { isValid, sanitized } = validateSearchQuery(query);
    
    if (!isValid || sanitized.length < 2) {
      return [];
    }

    return api.get<Ingredient[]>(
      `/ingredients/search?q=${encodeURIComponent(sanitized)}&limit=${limit}`
    );
  },

  // Get all available ingredients
  getAllIngredients: async (): Promise<Ingredient[]> => {
    return api.get<Ingredient[]>('/ingredients');
  },
};

// User API Services
export const userAPI = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    return api.get<User>('/user/profile');
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    return api.patch<User>('/user/profile', userData);
  },

  // Get user ingredients
  getUserIngredients: async (): Promise<UserIngredient[]> => {
    return api.get<UserIngredient[]>('/user/ingredients');
  },

  // Add ingredient to user's list
  addUserIngredient: async (ingredientData: {
    ingredientId: string;
    quantity: number;
    unit: string;
  }): Promise<UserIngredient> => {
    return api.post<UserIngredient>('/user/ingredients', ingredientData);
  },

  // Update user ingredient
  updateUserIngredient: async (
    ingredientId: string,
    updateData: {
      quantity?: number;
      unit?: string;
    }
  ): Promise<UserIngredient> => {
    return api.put<UserIngredient>(`/user/ingredients/${ingredientId}`, updateData);
  },

  // Remove ingredient from user's list
  removeUserIngredient: async (ingredientId: string): Promise<void> => {
    return api.delete<void>(`/user/ingredients/${ingredientId}`);
  },

  // Get user favorites
  getFavorites: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Recipe>> => {
    return api.getPaginated<Recipe>(`/users/me/favorites?page=${page}&limit=${limit}`);
  },

  // Add recipe to favorites
  addToFavorites: async (recipeId: string): Promise<{ success: boolean; message: string; }> => {
    return api.post<{ success: boolean; message: string; }>(`/users/me/favorites/${recipeId}`);
  },

  // Remove recipe from favorites
  removeFromFavorites: async (recipeId: string): Promise<{ success: boolean; message: string; }> => {
    return api.delete<{ success: boolean; message: string; }>(`/users/me/favorites/${recipeId}`);
  },

  // Remove multiple recipes from favorites
  removeMultipleFavorites: async (recipeIds: string[]): Promise<{ success: boolean; message: string; removed: number; }> => {
    return api.post<{ success: boolean; message: string; removed: number; }>('/users/me/favorites/bulk-delete', {
      recipeIds
    });
  },

  // Check if recipe is favorite
  isFavorite: async (recipeId: string): Promise<boolean> => {
    try {
      const response = await api.get<{ isFavorite: boolean }>(`/user/favorites/${recipeId}/check`);
      return response.isFavorite;
    } catch (error) {
      return false;
    }
  },

  // Get user ratings
  getUserRatings: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<RecipeRating>> => {
    return api.getPaginated<RecipeRating>(`/user/ratings?page=${page}&limit=${limit}`);
  },
};

// Subscription API Services
export const subscriptionAPI = {
  // Get available subscription plans
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    return api.get<SubscriptionPlan[]>('/subscription-plans');
  },

  // Get user's subscriptions
  getUserSubscriptions: async (): Promise<UserSubscription[]> => {
    return api.get<UserSubscription[]>('/user/subscriptions');
  },

  // Purchase subscription
  purchaseSubscription: async (planId: string, paymentData: {
    paymentMethod: string;
    paymentReference?: string;
  }): Promise<UserSubscription> => {
    return api.post<UserSubscription>('/subscriptions/purchase', {
      planId,
      ...paymentData,
    });
  },

  // Check premium status
  checkPremiumStatus: async (): Promise<{
    isPremium: boolean;
    expiresAt?: Date;
    subscription?: UserSubscription;
  }> => {
    return api.get<{
      isPremium: boolean;
      expiresAt?: Date;
      subscription?: UserSubscription;
    }>('/user/subscriptions/status');
  },
};

// Export all API services
export const apiServices = {
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