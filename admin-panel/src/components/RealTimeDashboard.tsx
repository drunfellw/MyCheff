'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
  Alert,
  Fade,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Restaurant,
  Category,
  AttachMoney,
  Refresh,
  CheckCircle,
  Error,
  Warning,
} from '@mui/icons-material';
import { apiService, Language, Category as CategoryType } from '../services/api';

interface DashboardStats {
  totalUsers: number;
  totalRecipes: number;
  totalCategories: number;
  totalLanguages: number;
  totalIngredients: number;
  activeUsers: number;
  activeRecipes: number;
  languages?: any[];
  categories?: any[];
}

interface RealTimeData {
  stats: DashboardStats;
  languages: Language[];
  categories: CategoryType[];
  lastUpdated: Date;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
  loading?: boolean;
}> = ({ title, value, icon, color, change, loading }) => (
  <Card sx={{ height: '100%', position: 'relative' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {loading ? <CircularProgress size={24} /> : value}
          </Typography>
          {change && (
            <Typography variant="body2" sx={{ color: 'success.main', mt: 1 }}>
              <TrendingUp fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
              {change}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: '50%',
            p: 1.5,
            color: color,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const ConnectionStatus: React.FC<{ status: RealTimeData['connectionStatus'] }> = ({ status }) => {
  const getStatusProps = () => {
    switch (status) {
      case 'connected':
        return { color: 'success', icon: <CheckCircle />, text: 'Bağlı' };
      case 'disconnected':
        return { color: 'error', icon: <Error />, text: 'Bağlantı Kesildi' };
      case 'connecting':
        return { color: 'warning', icon: <CircularProgress size={16} />, text: 'Bağlanıyor...' };
    }
  };

  const { color, icon, text } = getStatusProps();

  return (
    <Chip
      icon={icon}
      label={text}
      color={color as any}
      variant="filled"
      size="small"
    />
  );
};

export const RealTimeDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRecipes: 0,
    totalCategories: 0,
    totalLanguages: 0,
    totalIngredients: 0,
    activeUsers: 0,
    activeRecipes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  const fetchData = async () => {
    try {
      setConnectionStatus('connecting');
      setError(null);
      
      // Try to fetch dashboard stats
      const dashboardData = await apiService.getDashboardStats();
      
      setStats(dashboardData);
      setConnectionStatus('connected');
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('Dashboard API hatası:', err);
      setError('Backend bağlantısı kurulamadı. Demo veriler gösteriliyor.');
      setConnectionStatus('disconnected');
      
      // Set mock data as fallback
      setStats({
        totalUsers: 156,
        totalRecipes: 89,
        totalCategories: 12,
        totalLanguages: 6,
        totalIngredients: 0,
        activeUsers: 142,
        activeRecipes: 76,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'disconnected':
        return <Error sx={{ color: 'error.main' }} />;
      default:
        return <CircularProgress size={16} />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Bağlı';
      case 'disconnected':
        return 'Bağlantı Yok';
      default:
        return 'Bağlanıyor...';
    }
  };

  if (loading && stats.totalUsers === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Dashboard yükleniyor...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box display="flex" alignItems="center" gap={1}>
            {getConnectionIcon()}
            <Typography variant="body2">
              {getConnectionText()}
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            {lastUpdated.toLocaleTimeString('tr-TR')}
          </Typography>
          <IconButton onClick={handleRefresh} color="primary">
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Fade in={!!error}>
          <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        </Fade>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Kullanıcılar"
            value={stats.totalUsers.toLocaleString('tr-TR')}
            icon={<People />}
            color="#2196F3"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Tarifler"
            value={stats.totalRecipes.toLocaleString('tr-TR')}
            icon={<Restaurant />}
            color="#4CAF50"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Kategoriler"
            value={stats.totalCategories}
            icon={<Category />}
            color="#FF9800"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Aktif Diller"
            value={stats.totalLanguages}
            icon={<AttachMoney />}
            color="#9C27B0"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🔧 Sistem Durumu
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" gutterBottom>
                    Backend API
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={connectionStatus === 'connected' ? 100 : 0}
                    color={connectionStatus === 'connected' ? 'success' : 'error'}
                  />
                  <Typography variant="caption" color="textSecondary">
                    {connectionStatus === 'connected' ? 'Çevrimiçi' : 'Çevrimdışı'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" gutterBottom>
                    Veri Durumu
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stats.totalUsers > 0 ? 100 : 0}
                    color={stats.totalUsers > 0 ? 'success' : 'warning'}
                  />
                  <Typography variant="caption" color="textSecondary">
                    {stats.totalUsers > 0 ? 'Veri Mevcut' : 'Veri Bulunamadı'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" gutterBottom>
                    Son Güncelleme
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={85}
                    color="info"
                  />
                  <Typography variant="caption" color="textSecondary">
                    {lastUpdated.toLocaleString('tr-TR')}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 