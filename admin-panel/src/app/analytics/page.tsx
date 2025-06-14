'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Restaurant,
  Visibility,
  Star,
  Category,
} from '@mui/icons-material';
import AdminLayout from '@/components/Layout/AdminLayout';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ title, value, change, changeType, icon, color }: MetricCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: changeType === 'positive' ? 'success.main' : 'error.main',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 1,
              }}
            >
              <TrendingUp fontSize="small" />
              {change}
            </Typography>
          </Box>
          <Avatar
            sx={{
              backgroundColor: color,
              height: 56,
              width: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const metrics = [
    {
      title: 'Total Users',
      value: '12,567',
      change: '+15% vs last month',
      changeType: 'positive' as const,
      icon: <People />,
      color: '#4ECDC4',
    },
    {
      title: 'Active Recipes',
      value: '1,234',
      change: '+8% vs last month',
      changeType: 'positive' as const,
      icon: <Restaurant />,
      color: '#FF6B6B',
    },
    {
      title: 'Total Views',
      value: '89.5K',
      change: '+22% vs last month',
      changeType: 'positive' as const,
      icon: <Visibility />,
      color: '#45B7D1',
    },
    {
      title: 'Average Rating',
      value: '4.6',
      change: '+0.2 vs last month',
      changeType: 'positive' as const,
      icon: <Star />,
      color: '#F39C12',
    },
  ];

  const topCategories = [
    { name: 'Main Dishes', count: 456, percentage: 85 },
    { name: 'Desserts', count: 234, percentage: 65 },
    { name: 'Beverages', count: 189, percentage: 45 },
    { name: 'Appetizers', count: 123, percentage: 35 },
    { name: 'Salads', count: 98, percentage: 25 },
  ];

  const recentActivity = [
    { id: 1, action: 'New recipe published', user: 'Chef Ahmed', time: '2 hours ago', type: 'recipe' },
    { id: 2, action: 'User registered', user: 'Maria Rodriguez', time: '3 hours ago', type: 'user' },
    { id: 3, action: 'Recipe rated 5 stars', user: 'Yuki Tanaka', time: '4 hours ago', type: 'rating' },
    { id: 4, action: 'Category created', user: 'Admin', time: '5 hours ago', type: 'category' },
    { id: 5, action: 'Recipe favorited', user: 'John Doe', time: '6 hours ago', type: 'favorite' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'recipe':
        return <Restaurant sx={{ color: 'primary.main' }} />;
      case 'user':
        return <People sx={{ color: 'success.main' }} />;
      case 'rating':
        return <Star sx={{ color: 'warning.main' }} />;
      case 'category':
        return <Category sx={{ color: 'info.main' }} />;
      default:
        return <TrendingUp sx={{ color: 'text.secondary' }} />;
    }
  };

  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
          Analytics Dashboard
        </Typography>

        {/* Metrics Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MetricCard {...metric} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Top Categories */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
                  Top Categories by Recipe Count
                </Typography>
                <List>
                  {topCategories.map((category, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {category.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {category.count} recipes
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={category.percentage}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
                  Recent Activity
                </Typography>
                <List>
                  {recentActivity.map((activity) => (
                    <ListItem key={activity.id} sx={{ px: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'transparent' }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {activity.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            by {activity.user} • {activity.time}
                          </Typography>
                        </Box>
                        <Chip
                          label={activity.type}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Performance Summary */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
                  Performance Summary
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" color="primary.main" fontWeight="bold">
                        98.5%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        System Uptime
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" color="success.main" fontWeight="bold">
                        1.2s
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Response Time
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" color="warning.main" fontWeight="bold">
                        256MB
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Memory Usage
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
} 