'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  Category as CategoryIcon,
  Language as LanguageIcon,
  TrendingUp,
  TrendingDown,
  MoreVert,
  Visibility,
  Star,
  AccessTime,
} from '@mui/icons-material';
import { apiService } from '../../services/api';
import AdminLayout from '@/components/Layout/AdminLayout';

interface DashboardData {
  totalUsers: number;
  totalRecipes: number;
  totalCategories: number;
  totalLanguages: number;
  recentRecipes: any[];
  recentUsers: any[];
  popularCategories: any[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    totalUsers: 0,
    totalRecipes: 0,
    totalCategories: 0,
    totalLanguages: 0,
    recentRecipes: [],
    recentUsers: [],
    popularCategories: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardStats = await apiService.getDashboardStats();
        setData(dashboardStats);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metrics = [
    {
      title: 'Toplam Kullanıcılar',
      value: data.totalUsers,
      change: '+12.5%',
      trend: 'up',
      icon: <PeopleIcon />,
      color: '#1976d2',
    },
    {
      title: 'Toplam Tarifler',
      value: data.totalRecipes,
      change: '+8.2%',
      trend: 'up',
      icon: <RestaurantIcon />,
      color: '#2e7d32',
    },
    {
      title: 'Kategoriler',
      value: data.totalCategories,
      change: '+2.1%',
      trend: 'up',
      icon: <CategoryIcon />,
      color: '#ed6c02',
    },
    {
      title: 'Aktif Diller',
      value: data.totalLanguages,
      change: '0%',
      trend: 'stable',
      icon: <LanguageIcon />,
      color: '#9c27b0',
    },
  ];

  const mockRecentRecipes = [
    { id: 1, title: 'Köfte Tarifi', author: 'Chef Ali', views: 1250, rating: 4.8, createdAt: '2 saat önce' },
    { id: 2, title: 'Baklava', author: 'Chef Ayşe', views: 980, rating: 4.9, createdAt: '5 saat önce' },
    { id: 3, title: 'Lahmacun', author: 'Chef Mehmet', views: 756, rating: 4.7, createdAt: '1 gün önce' },
    { id: 4, title: 'Menemen', author: 'Chef Fatma', views: 643, rating: 4.6, createdAt: '2 gün önce' },
  ];

  const mockPopularCategories = [
    { name: 'Ana Yemekler', recipeCount: 45, trend: '+15%' },
    { name: 'Tatlılar', recipeCount: 32, trend: '+8%' },
    { name: 'Çorbalar', recipeCount: 18, trend: '+22%' },
    { name: 'Salatalar', recipeCount: 24, trend: '+5%' },
  ];

  return (
    <AdminLayout>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Dashboard 📊
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sistem performansı ve istatistiklerin genel görünümü
          </Typography>
        </Box>

        {/* Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: metric.color }}>
                        {loading ? '-' : metric.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {metric.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {metric.trend === 'up' ? (
                          <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                        ) : metric.trend === 'down' ? (
                          <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                        ) : null}
                        <Chip
                          label={metric.change}
                          size="small"
                          color={metric.trend === 'up' ? 'success' : metric.trend === 'down' ? 'error' : 'default'}
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    <Avatar sx={{ bgcolor: metric.color, width: 56, height: 56 }}>
                      {metric.icon}
                    </Avatar>
                  </Box>
                  {loading && (
                    <LinearProgress sx={{ mt: 2, borderRadius: 1 }} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Content Grid */}
        <Grid container spacing={3}>
          {/* Recent Recipes */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Son Eklenen Tarifler
                  </Typography>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tarif</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Yazar</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Görüntülenme</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Puan</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tarih</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockRecentRecipes.map((recipe) => (
                        <TableRow key={recipe.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                <RestaurantIcon sx={{ fontSize: 16 }} />
                              </Avatar>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                                {recipe.title}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {recipe.author}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {recipe.views.toLocaleString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                              <Typography variant="body2">
                                {recipe.rating}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {recipe.createdAt}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Popular Categories */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Popüler Kategoriler
                  </Typography>
                  <Stack spacing={2}>
                    {mockPopularCategories.map((category, index) => (
                      <Box key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                            {category.name}
                          </Typography>
                          <Chip
                            label={category.trend}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {category.recipeCount} tarif
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            %{Math.round((category.recipeCount / 120) * 100)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(category.recipeCount / 120) * 100}
                          sx={{ borderRadius: 1, height: 6 }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* System Performance */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Sistem Performansı
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">API Response Time</Typography>
                        <Typography variant="body2" color="success.main">145ms</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={75}
                        color="success"
                        sx={{ borderRadius: 1, height: 6 }}
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Database Load</Typography>
                        <Typography variant="body2" color="warning.main">65%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={65}
                        color="warning"
                        sx={{ borderRadius: 1, height: 6 }}
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Memory Usage</Typography>
                        <Typography variant="body2" color="info.main">42%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={42}
                        color="info"
                        sx={{ borderRadius: 1, height: 6 }}
                      />
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