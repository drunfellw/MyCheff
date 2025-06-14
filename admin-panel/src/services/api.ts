const BASE_URL = 'http://localhost:3001/api/v1';

// Simple token storage
let authToken: string | null = null;

export interface Language {
  code: string;
  name: string;
  nativeName?: string;
  isActive: boolean;
  isDefault?: boolean;
  createdAt: string;
}

export interface Category {
  id: string; // UUID
  name: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  translations?: Array<{
    languageCode: string;
    name: string;
  }>;
}

export interface User {
  id: string; // UUID
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  preferredLanguageCode: string;
  profileImage?: string;
  bio?: string;
  cookingSkillLevel?: number;
  dietaryRestrictions?: any;
  allergies?: string[];
  isActive: boolean;
  isVerified: boolean;
  isPremium: boolean;
  lastLoginAt?: string;
  fcmToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Recipe {
  id: string; // UUID
  title: string;
  description: string;
  preparationSteps?: any[];
  tips?: string[];
  cookingTimeMinutes: number;
  prepTimeMinutes: number;
  difficultyLevel: number;
  servingSize: number;
  isPremium: boolean;
  isPublished: boolean;
  averageRating?: number;
  ratingCount?: number;
  viewCount?: number;
  authorId: string; // UUID
  imageUrl?: string;
  nutritionalData?: {
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  attributes?: {
    isVegan?: boolean;
    isVegetarian?: boolean;
    isGluten_free?: boolean;
    isDairy_free?: boolean;
    isNut_free?: boolean;
    isKeto?: boolean;
    spiceLevel?: number;
  };
  createdAt: string;
  updatedAt: string;
  ingredients?: Array<{
    ingredientId: string; // UUID
    quantity: number;
    unit: string;
    isRequired: boolean;
  }>;
  media?: Array<{
    id: string; // UUID
    url: string;
    mediaType: 'photo' | 'video';
    isPrimary: boolean;
    displayOrder: number;
  }>;
}

export interface SubscriptionPlan {
  id: string; // UUID
  name: string;
  durationMonths: number;
  price: number;
  description?: string;
  features: any;
  isActive: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
  translations?: Array<{
    languageCode: string;
    name: string;
    description: string;
  }>;
}

export interface Ingredient {
  id: string; // UUID
  name: string;
  defaultUnit: string;
  slug?: string;
  image?: string;
  nutritionalInfo?: any;
  isActive: boolean;
  categoryId?: string; // UUID
  unitId?: string; // UUID
  createdAt: string;
  updatedAt: string;
  translations?: Array<{
    languageCode: string;
    name: string;
    aliases?: string[];
  }>;
}

// Mock data for development
const mockCategories = [
  {
    id: 1,
    slug: 'ana-yemekler',
    color: '#FF5722',
    icon: 'utensils',
    isActive: true,
    translations: [
      { languageCode: 'tr', name: 'Ana Yemekler', description: 'Temel yemek tarifleri' },
      { languageCode: 'en', name: 'Main Dishes', description: 'Essential meal recipes' }
    ]
  },
  {
    id: 2,
    slug: 'tatlilar',
    color: '#E91E63',
    icon: 'cookie',
    isActive: true,
    translations: [
      { languageCode: 'tr', name: 'Tatlılar', description: 'Şeker ve tatlı tarifleri' },
      { languageCode: 'en', name: 'Desserts', description: 'Sweet recipes and treats' }
    ]
  },
  {
    id: 3,
    slug: 'corbalar',
    color: '#2196F3',
    icon: 'hot-tub',
    isActive: true,
    translations: [
      { languageCode: 'tr', name: 'Çorbalar', description: 'Sıcak çorba tarifleri' },
      { languageCode: 'en', name: 'Soups', description: 'Hot soup recipes' }
    ]
  }
];

const mockLanguages = [
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', isActive: true },
  { code: 'en', name: 'English', nativeName: 'English', isActive: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', isActive: true },
  { code: 'fr', name: 'French', nativeName: 'Français', isActive: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', isActive: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', isActive: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', isActive: true }
];

const mockRecipes = [
  {
    id: '1',
    title: 'Köfte Tarifi',
    description: 'Geleneksel Türk köftesi tarifi',
    instructions: 'Malzemeleri karıştırın, şekil verin ve pişirin',
    categoryId: 1,
    difficulty: 'Easy',
    preparationTime: 15,
    cookingTime: 30,
    servings: 4,
    calories: 250,
    protein: 20,
    carbs: 15,
    fat: 12,
    fiber: 2,
    isActive: true,
    imageUrl: '/uploads/recipes/kofte.jpg',
    averageRating: 4.8,
    ratingCount: 124,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Baklava',
    description: 'Geleneksel Türk tatlısı',
    instructions: 'Yufkaları açın, fıstık serpip, şerbet dökün',
    categoryId: 2,
    difficulty: 'Hard',
    preparationTime: 60,
    cookingTime: 45,
    servings: 8,
    calories: 320,
    protein: 8,
    carbs: 45,
    fat: 18,
    fiber: 3,
    isActive: true,
    imageUrl: '/uploads/recipes/baklava.jpg',
    averageRating: 4.9,
    ratingCount: 89,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    title: 'Mercimek Çorbası',
    description: 'Besleyici ve lezzetli çorba',
    instructions: 'Mercimeği haşlayın, sebzeleri ekleyin, blender\'dan geçirin',
    categoryId: 3,
    difficulty: 'Easy',
    preparationTime: 10,
    cookingTime: 25,
    servings: 6,
    calories: 150,
    protein: 12,
    carbs: 25,
    fat: 5,
    fiber: 8,
    isActive: true,
    imageUrl: '/uploads/recipes/mercimek-corbasi.jpg',
    averageRating: 4.7,
    ratingCount: 156,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export class ApiService {
  // Authentication methods
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed with status ${response.status}`);
      }

      const result = await response.json();
      
      // Store token
      if (result.data && result.data.token) {
        authToken = result.data.token;
        localStorage.setItem('adminToken', authToken);
      }
      
      return result.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  logout(): void {
    authToken = null;
    localStorage.removeItem('adminToken');
  }

  isAuthenticated(): boolean {
    if (!authToken) {
      authToken = localStorage.getItem('adminToken');
    }
    return !!authToken;
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (!authToken) {
      authToken = localStorage.getItem('adminToken');
    }

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return headers;
  }

  private async fetchApi(endpoint: string, options?: RequestInit): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        // Try to get error details from response
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // Response might not be JSON, use status-based message
          if (response.status === 401) {
            errorMessage = 'Authentication required - please login';
          } else if (response.status === 403) {
            errorMessage = 'Access denied';
          } else if (response.status === 404) {
            errorMessage = 'Resource not found';
          }
        }
        
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
      }

      // Check if response has content
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null; // No content to parse
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return null; // Not JSON content
      }

      const result = await response.json();
      
      // Handle API response structure (data wrapper)
      if (result && result.data !== undefined) {
        return result.data;
      }
      
      return result;
    } catch (error: any) {
      // If it's a network error (backend not available), throw a specific error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const networkError = new Error('Backend server is not available. Please ensure the backend is running on port 3001.');
        (networkError as any).isNetworkError = true;
        throw networkError;
      }
      
      console.error('API Error:', error);
      throw error;
    }
  }

  // Languages
  async getLanguages(): Promise<any[]> {
    const response = await this.fetchApi('/languages');
    // fetchApi already extracts .data from backend response, so response is the languages array
    return Array.isArray(response) ? response : [];
  }

  async createLanguage(data: any): Promise<any> {
    return await this.fetchApi('/languages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLanguage(code: string, data: Partial<Language>): Promise<Language> {
    return this.fetchApi(`/languages/${code}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteLanguage(code: string): Promise<void> {
    await this.fetchApi(`/languages/${code}`, { method: 'DELETE' });
  }

  // Categories
  async getCategories(): Promise<any[]> {
    const response = await this.fetchApi('/categories');
    return Array.isArray(response) ? response : [];
  }

  async createCategory(data: any): Promise<any> {
    return await this.fetchApi('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return this.fetchApi(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.fetchApi(`/categories/${id}`, { method: 'DELETE' });
  }

  // Users
  async getUsers(): Promise<User[]> {
    return this.fetchApi('/auth/users');
  }

  async createUser(data: Partial<User>): Promise<User> {
    // Transform admin panel data to backend format
    const backendData = {
      username: data.username || data.email?.split('@')[0] || 'user',
      email: data.email,
      password: (data as any).password || 'defaultPassword123',
      fullName: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.email?.split('@')[0],
      preferredLanguageCode: (data as any).preferredLanguage || 'tr',
    };

    return this.fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.fetchApi(`/user/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.fetchApi(`/auth/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Recipes
  async getRecipes(params?: any): Promise<any> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await this.fetchApi(`/recipes${queryString}`);
    
    // fetchApi already extracts .data from backend response, so response is the recipes array
    // We need to return it in the format that frontend expects: { data: recipes }
    return { data: response };
  }

  async createRecipe(data: any): Promise<any> {
    const response = await this.fetchApi('/recipes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async updateRecipe(id: string, data: Partial<Recipe>): Promise<Recipe> {
    return await this.fetchApi(`/recipes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteRecipe(id: string): Promise<void> {
    await this.fetchApi(`/recipes/${id}`, { method: 'DELETE' });
  }

  // File Upload Methods
  async uploadRecipeFiles(recipeId: string, files: File[]): Promise<any> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append('files', file);
    });

    // Add media metadata
    const mediaData = files.map((_, index) => ({
      purpose: index === 0 ? 'main' : 'step',
      altText: `Recipe ${recipeId} - Image ${index + 1}`,
      sortOrder: index
    }));
    
    formData.append('mediaData', JSON.stringify(mediaData));

    const response = await fetch(`http://localhost:3001/api/v1/recipes/${recipeId}/media`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return await response.json();
  }

  async uploadRecipeImage(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return await this.fetchApi('/upload/recipe-image', {
      method: 'POST',
      body: formData,
    });
  }

  // Ingredients
  async getIngredients(): Promise<Ingredient[]> {
    const response = await this.fetchApi('/ingredients');
    return Array.isArray(response) ? response : [];
  }

  async createIngredient(data: Partial<Ingredient>): Promise<Ingredient> {
    return this.fetchApi('/ingredients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateIngredient(id: string, data: Partial<Ingredient>): Promise<Ingredient> {
    return this.fetchApi(`/ingredients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteIngredient(id: string): Promise<void> {
    return this.fetchApi(`/ingredients/${id}`, {
      method: 'DELETE',
    });
  }

  // Subscription Plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return this.fetchApi('/subscriptions/plans');
  }

  async createSubscriptionPlan(data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    return this.fetchApi('/subscriptions/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSubscriptionPlan(id: string, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    return this.fetchApi(`/subscriptions/plans/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteSubscriptionPlan(id: string): Promise<void> {
    return this.fetchApi(`/subscriptions/plans/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<any> {
    try {
      // Fetch data from working endpoints
      let categories = [];
      let languages = [];
      let ingredients = [];
      let recipes = [];

      try {
        languages = await this.getLanguages() || [];
      } catch (error) {
        console.warn('Failed to fetch languages:', error);
        languages = [];
      }

      try {
        categories = await this.getCategories() || [];
      } catch (error) {
        console.warn('Failed to fetch categories:', error);
        categories = [];
      }

      try {
        ingredients = await this.getIngredients() || [];
      } catch (error) {
        console.warn('Failed to fetch ingredients:', error);
        ingredients = [];
      }

      try {
        const recipesResponse = await this.getRecipes() || { data: [] };
        recipes = recipesResponse.data || [];
      } catch (error) {
        console.warn('Failed to fetch recipes:', error);
        recipes = [];
      }

      // Count active items
      const activeRecipes = recipes.filter(recipe => recipe.isActive !== false).length;

      return {
        totalUsers: 0, // Users require authentication
        totalRecipes: recipes.length,
        totalCategories: Array.isArray(categories) ? categories.length : 0,
        totalLanguages: Array.isArray(languages) ? languages.length : 0,
        totalIngredients: Array.isArray(ingredients) ? ingredients.length : 0,
        activeUsers: 0,
        activeRecipes: activeRecipes,
        recentUsers: [],
        recentRecipes: recipes.slice(0, 5), // Show recent recipes
        languages: languages.slice(0, 5), // Show some languages
        categories: categories.slice(0, 5), // Show some categories
      };
    } catch (error) {
      console.error('Dashboard stats error:', error);
      // Return fallback data
      return {
        totalUsers: 0,
        totalRecipes: 0,
        totalCategories: 0,
        totalLanguages: 0,
        totalIngredients: 0,
        activeUsers: 0,
        activeRecipes: 0,
        recentUsers: [],
        recentRecipes: [],
        languages: [],
        categories: [],
      };
    }
  }
}

// Export a default instance
export const apiService = new ApiService();