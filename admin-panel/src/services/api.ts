// API Service for MyCheff Admin Panel
import axios, { AxiosResponse } from 'axios';
import { 
  Category, 
  Recipe, 
  Language, 
  CreateCategoryRequest, 
  UpdateCategoryRequest,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  CreateLanguageRequest,
  UpdateLanguageRequest,
  PaginatedResponse,
  ApiResponse
} from '../types/api';

// API Base Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Categories API
export const categoriesAPI = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const response: AxiosResponse<ApiResponse<Category[]>> = await api.get('/categories');
    return response.data.data;
  },

  // Get category by ID
  getById: async (id: number): Promise<Category> => {
    const response: AxiosResponse<ApiResponse<Category>> = await api.get(`/categories/${id}`);
    return response.data.data;
  },

  // Create new category
  create: async (categoryData: CreateCategoryRequest): Promise<Category> => {
    const response: AxiosResponse<ApiResponse<Category>> = await api.post('/categories', categoryData);
    return response.data.data;
  },

  // Update category
  update: async (id: number, categoryData: UpdateCategoryRequest): Promise<Category> => {
    const response: AxiosResponse<ApiResponse<Category>> = await api.patch(`/categories/${id}`, categoryData);
    return response.data.data;
  },

  // Delete category
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  // Activate category
  activate: async (id: number): Promise<Category> => {
    const response: AxiosResponse<ApiResponse<Category>> = await api.patch(`/categories/${id}/activate`);
    return response.data.data;
  },

  // Deactivate category
  deactivate: async (id: number): Promise<Category> => {
    const response: AxiosResponse<ApiResponse<Category>> = await api.patch(`/categories/${id}/deactivate`);
    return response.data.data;
  }
};

// Languages API
export const languagesAPI = {
  // Get all languages
  getAll: async (): Promise<Language[]> => {
    const response: AxiosResponse<ApiResponse<Language[]>> = await api.get('/languages');
    return response.data.data;
  },

  // Get language by code
  getByCode: async (code: string): Promise<Language> => {
    const response: AxiosResponse<ApiResponse<Language>> = await api.get(`/languages/${code}`);
    return response.data.data;
  },

  // Create new language
  create: async (languageData: CreateLanguageRequest): Promise<Language> => {
    const response: AxiosResponse<ApiResponse<Language>> = await api.post('/languages', languageData);
    return response.data.data;
  },

  // Update language
  update: async (code: string, languageData: UpdateLanguageRequest): Promise<Language> => {
    const response: AxiosResponse<ApiResponse<Language>> = await api.put(`/languages/${code}`, languageData);
    return response.data.data;
  },

  // Delete language
  delete: async (code: string): Promise<void> => {
    await api.delete(`/languages/${code}`);
  }
};

// Recipes API
export const recipesAPI = {
  // Get all recipes with pagination
  getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Recipe>> => {
    const response: AxiosResponse<PaginatedResponse<Recipe>> = await api.get(`/recipes?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get recipe by ID
  getById: async (id: string): Promise<Recipe> => {
    const response: AxiosResponse<ApiResponse<Recipe>> = await api.get(`/recipes/${id}`);
    return response.data.data;
  },

  // Create new recipe
  create: async (recipeData: CreateRecipeRequest): Promise<Recipe> => {
    const response: AxiosResponse<ApiResponse<Recipe>> = await api.post('/recipes', recipeData);
    return response.data.data;
  },

  // Update recipe
  update: async (id: string, recipeData: UpdateRecipeRequest): Promise<Recipe> => {
    const response: AxiosResponse<ApiResponse<Recipe>> = await api.put(`/recipes/${id}`, recipeData);
    return response.data.data;
  },

  // Delete recipe
  delete: async (id: string): Promise<void> => {
    await api.delete(`/recipes/${id}`);
  },

  // Search recipes
  search: async (query: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Recipe>> => {
    const response: AxiosResponse<PaginatedResponse<Recipe>> = await api.get(`/recipes/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data;
  }
};

// Export default api instance
export default api;

// Export as apiService for compatibility
export { api as apiService };