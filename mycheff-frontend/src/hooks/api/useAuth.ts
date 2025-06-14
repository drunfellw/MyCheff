import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiServices } from '../../services/api';
import { authUtils } from '../../services/apiClient';
import type { User } from '../../types';
import Toast from 'react-native-toast-message';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// Get user profile
export const useProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => apiServices.user.getProfile(),
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiServices.auth.login(email, password),
    onSuccess: (data) => {
      // Cache user data
      queryClient.setQueryData(authKeys.profile(), data.user);
      
      Toast.show({
        type: 'success',
        text1: 'Giriş Başarılı',
        text2: `Hoş geldiniz, ${data.user.username}!`,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Giriş Hatası',
        text2: error.message || 'Giriş yapılırken bir hata oluştu',
      });
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: {
      username: string;
      email: string;
      password: string;
      preferredLanguage?: string;
    }) => apiServices.auth.register(userData),
    onSuccess: (data) => {
      // Cache user data
      queryClient.setQueryData(authKeys.profile(), data.user);
      
      Toast.show({
        type: 'success',
        text1: 'Kayıt Başarılı',
        text2: `Hoş geldiniz, ${data.user.username}!`,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Kayıt Hatası',
        text2: error.message || 'Kayıt olurken bir hata oluştu',
      });
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiServices.auth.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      Toast.show({
        type: 'success',
        text1: 'Çıkış Başarılı',
        text2: 'Güvenli bir şekilde çıkış yaptınız',
      });
    },
    onError: (error: any) => {
      // Even if logout fails on server, clear local data
      queryClient.clear();
      
      Toast.show({
        type: 'info',
        text1: 'Çıkış Yapıldı',
        text2: 'Yerel veriler temizlendi',
      });
    },
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<User>) => 
      apiServices.user.updateProfile(userData),
    onSuccess: (data) => {
      // Update cached profile data
      queryClient.setQueryData(authKeys.profile(), data);
      
      Toast.show({
        type: 'success',
        text1: 'Profil Güncellendi',
        text2: 'Profil bilgileriniz başarıyla güncellendi',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Güncelleme Hatası',
        text2: error.message || 'Profil güncellenirken bir hata oluştu',
      });
    },
  });
};

// Check if user is authenticated
export const useIsAuthenticated = () => {
  return useQuery({
    queryKey: ['auth', 'isAuthenticated'],
    queryFn: async () => {
      const token = await authUtils.getAccessToken();
      return !!token;
    },
    staleTime: 0, // Always check
    gcTime: 0, // Don't cache
  });
}; 