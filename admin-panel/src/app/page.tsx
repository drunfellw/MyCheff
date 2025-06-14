'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  Stack,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  Category as CategoryIcon,
  Language as LanguageIcon,
  TrendingUp,
  AccessTime,
  Star,
  ChevronRight,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { apiService } from '../services/api';
import AdminLayout from '@/components/Layout/AdminLayout';

interface DashboardStats {
  totalUsers: number;
  totalRecipes: number;
  totalCategories: number;
  totalLanguages: number;
}

const quickActions = [
  {
    title: 'Yeni Tarif Ekle',
    description: 'Hızlı tarif ekleme',
    icon: <RestaurantIcon />,
    path: '/recipes',
    color: '#2e7d32',
  },
  {
    title: 'Kategori Yönet',
    description: 'Kategorileri düzenle',
    icon: <CategoryIcon />,
    path: '/categories',
    color: '#ed6c02',
  },
  {
    title: 'Dil Ayarları',
    description: 'Dilleri yönet',
    icon: <LanguageIcon />,
    path: '/languages',
    color: '#9c27b0',
  },
  {
    title: 'Kullanıcılar',
    description: 'Kullanıcı yönetimi',
    icon: <PeopleIcon />,
    path: '/users',
    color: '#1976d2',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRecipes: 0,
    totalCategories: 0,
    totalLanguages: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const dashboardStats = await apiService.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Stats fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const statCards = [
    {
      title: 'Toplam Tarifler',
      value: stats.totalRecipes,
      icon: <RestaurantIcon sx={{ fontSize: 32 }} />,
      color: '#2e7d32',
      trend: '+12%',
    },
    {
      title: 'Kategoriler',
      value: stats.totalCategories,
      icon: <CategoryIcon sx={{ fontSize: 32 }} />,
      color: '#ed6c02',
      trend: '+5%',
    },
    {
      title: 'Kullanıcılar',
      value: stats.totalUsers,
      icon: <PeopleIcon sx={{ fontSize: 32 }} />,
      color: '#1976d2',
      trend: '+18%',
    },
    {
      title: 'Diller',
      value: stats.totalLanguages,
      icon: <LanguageIcon sx={{ fontSize: 32 }} />,
      color: '#9c27b0',
      trend: '0%',
    },
  ];

  return (
    <AdminLayout>
      <Box>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Hoş Geldiniz! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            MyCheff Admin Panel - Tüm işlemlerinizi buradan yönetebilirsiniz.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                  border: '1px solid',
                  borderColor: `${stat.color}30`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color }}>
                        {loading ? '-' : stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                      {stat.icon}
                    </Avatar>
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                    <Chip
                      label={stat.trend}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Bu ay
                    </Typography>
                  </Box>
                  {loading && (
                    <LinearProgress sx={{ mt: 1, borderRadius: 1 }} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Hızlı İşlemler
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Sık kullanılan işlemlere hızlı erişim
                </Typography>
                
                <Grid container spacing={2}>
                  {quickActions.map((action, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        onClick={() => handleNavigate(action.path)}
                        sx={{
                          p: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'action.hover',
                            borderColor: action.color,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: action.color }}>
                            {action.icon}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {action.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {action.description}
                            </Typography>
                          </Box>
                          <ChevronRight />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Recent Activity */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Son Aktivite
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <RestaurantIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          3 yeni tarif eklendi
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          2 saat önce
                        </Typography>
                      </Box>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                        <CategoryIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          Ana Yemekler kategorisi güncellendi
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          5 saat önce
                        </Typography>
                      </Box>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                        <PeopleIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          15 yeni kullanıcı kaydı
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          1 gün önce
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Sistem Durumu
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Backend API</Typography>
                        <Chip label="Aktif" size="small" color="success" />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Database</Typography>
                        <Chip label="Aktif" size="small" color="success" />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">File Upload</Typography>
                        <Chip label="Aktif" size="small" color="success" />
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}
