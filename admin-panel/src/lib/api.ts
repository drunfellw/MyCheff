import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// API istemci oluştur
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - token ekle
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token && token !== 'mock_admin_token_12345') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  profileImage?: string;
  preferredLanguage: string;
  isActive: boolean;
  isVerified: boolean;
  isPremium: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Recipe {
  id: string;
  slug: string;
  categoryId: string;
  authorId: string;
  imageUrl?: string;
  prepTime: number;
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  caloriesPerServing?: number;
  isPremium: boolean;
  isFeatured: boolean;
  isActive: boolean;
  averageRating: number;
  ratingCount: number;
  viewCount: number;
  favoriteCount: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  author?: User;
  category?: any;
  translations?: any[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  isActive: boolean;
  recipeCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  logout: async () => {
    await apiClient.post('/auth/logout');
  },
};

export const usersAPI = {
  getAll: async (page = 1, limit = 10, search = '') => {
    const response = await apiClient.get('/users', {
      params: { page, limit, search }
    });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  
  create: async (userData: Partial<User>) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },
  
  update: async (id: string, userData: Partial<User>) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },
  
  delete: async (id: string) => {
    await apiClient.delete(`/users/${id}`);
  },
};

export const recipesAPI = {
  getAll: async (page = 1, limit = 10, search = '', difficulty = '', category = '') => {
    const response = await apiClient.get('/recipes', {
      params: { page, limit, search, difficulty, category }
    });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/recipes/${id}`);
    return response.data;
  },
  
  create: async (recipeData: Partial<Recipe>) => {
    const response = await apiClient.post('/recipes', recipeData);
    return response.data;
  },
  
  update: async (id: string, recipeData: Partial<Recipe>) => {
    const response = await apiClient.put(`/recipes/${id}`, recipeData);
    return response.data;
  },
  
  delete: async (id: string) => {
    await apiClient.delete(`/recipes/${id}`);
  },
};

export const categoriesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },
  
  create: async (categoryData: Partial<Category>) => {
    const response = await apiClient.post('/categories', categoryData);
    return response.data;
  },
  
  update: async (id: string, categoryData: Partial<Category>) => {
    const response = await apiClient.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  
  delete: async (id: string) => {
    await apiClient.delete(`/categories/${id}`);
  },
};

export const analyticsAPI = {
  getStats: async () => {
    const response = await apiClient.get('/analytics/stats');
    return response.data;
  },
  
  getUserStats: async () => {
    const response = await apiClient.get('/analytics/users');
    return response.data;
  },
  
  getRecipeStats: async () => {
    const response = await apiClient.get('/analytics/recipes');
    return response.data;
  },
};

export default apiClient; 