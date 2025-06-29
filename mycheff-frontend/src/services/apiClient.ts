import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorHandler, ErrorType } from '../utils/errorHandler';
import { APP_CONFIG } from '../constants';

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.225.125:3001/api';
const API_VERSION = 'v1';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_LANGUAGE: 'user_language',
} as const;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for auth and language
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Add authentication token
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add language preference
      const language = await AsyncStorage.getItem(STORAGE_KEYS.USER_LANGUAGE) || 'tr';
      config.headers['Accept-Language'] = language;

      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/${API_VERSION}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data.data;
          
          await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
          await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.ACCESS_TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN,
        ]);
        
        // You can emit an event here to redirect to login
        console.error('Token refresh failed:', refreshError);
      }
    }

    // Handle different error types
    const appError = errorHandler.handleNetworkError(error);
    return Promise.reject(appError);
  }
);

// API response wrapper - matches backend response format
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  timestamp?: string;
}

// Backend pagination response format
export interface BackendPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

// Frontend expected pagination format  
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

// Generic API methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<ApiResponse<T>>(url, config).then(response => response.data.data),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post<ApiResponse<T>>(url, data, config).then(response => response.data.data),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put<ApiResponse<T>>(url, data, config).then(response => response.data.data),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch<ApiResponse<T>>(url, data, config).then(response => response.data.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete<ApiResponse<T>>(url, config).then(response => response.data.data),

  // For paginated responses - transform backend format to frontend format
  getPaginated: <T>(url: string, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> =>
    apiClient.get<BackendPaginatedResponse<T>>(url, config).then(response => {
      const backendData = response.data;
      return {
        data: backendData.data,
        pagination: {
          ...backendData.pagination,
          hasNext: backendData.pagination.page < backendData.pagination.totalPages,
          hasPrev: backendData.pagination.page > 1,
        }
      };
    }),

  postPaginated: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> =>
    apiClient.post<BackendPaginatedResponse<T>>(url, data, config).then(response => {
      const backendData = response.data;
      return {
        data: backendData.data,
        pagination: {
          ...backendData.pagination,
          hasNext: backendData.pagination.page < backendData.pagination.totalPages,
          hasPrev: backendData.pagination.page > 1,
        }
      };
    }),
};

// Auth utilities
export const authUtils = {
  setTokens: async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
    ]);
  },

  clearTokens: async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
    ]);
  },

  getAccessToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  setLanguage: async (language: string) => {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_LANGUAGE, language);
  },

  getLanguage: async (): Promise<string> => {
    return (await AsyncStorage.getItem(STORAGE_KEYS.USER_LANGUAGE)) || 'tr';
  },
};

export default apiClient; 