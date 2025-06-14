'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Save,
  Refresh,
  Security,
  Notifications,
  Language,
  Storage,
} from '@mui/icons-material';
import AdminLayout from '@/components/Layout/AdminLayout';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'MyCheff Admin',
    siteDescription: 'Professional Recipe Management System',
    adminEmail: 'admin@mycheff.com',
    timezone: 'UTC',
    language: 'en',
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAttempts: 5,
    
    // Notification Settings
    emailNotifications: true,
    recipeApprovals: true,
    userRegistrations: true,
    systemAlerts: true,
    
    // Storage Settings
    maxFileSize: 10,
    imageQuality: 80,
    autoBackup: true,
    backupFrequency: 'daily',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically send the settings to your API
    console.log('Saving settings:', settings);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      siteName: 'MyCheff Admin',
      siteDescription: 'Professional Recipe Management System',
      adminEmail: 'admin@mycheff.com',
      timezone: 'UTC',
      language: 'en',
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginAttempts: 5,
      emailNotifications: true,
      recipeApprovals: true,
      userRegistrations: true,
      systemAlerts: true,
      maxFileSize: 10,
      imageQuality: 80,
      autoBackup: true,
      backupFrequency: 'daily',
    });
  };

  return (
    <AdminLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            System Settings
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleReset}
            >
              Reset to Default
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Box>
        </Box>

        {showSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* General Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Language color="primary" />
                  <Typography variant="h6" component="h2" fontWeight="bold">
                    General Settings
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Site Name"
                    value={settings.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Site Description"
                    value={settings.siteDescription}
                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                    multiline
                    rows={2}
                    fullWidth
                  />
                  <TextField
                    label="Admin Email"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleChange('adminEmail', e.target.value)}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={settings.timezone}
                      label="Timezone"
                      onChange={(e) => handleChange('timezone', e.target.value)}
                    >
                      <MenuItem value="UTC">UTC</MenuItem>
                      <MenuItem value="US/Eastern">US/Eastern</MenuItem>
                      <MenuItem value="Europe/London">Europe/London</MenuItem>
                      <MenuItem value="Europe/Istanbul">Europe/Istanbul</MenuItem>
                      <MenuItem value="Asia/Tokyo">Asia/Tokyo</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Default Language</InputLabel>
                    <Select
                      value={settings.language}
                      label="Default Language"
                      onChange={(e) => handleChange('language', e.target.value)}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="tr">Turkish</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Security Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Security color="primary" />
                  <Typography variant="h6" component="h2" fontWeight="bold">
                    Security Settings
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                      />
                    }
                    label="Enable Two-Factor Authentication"
                  />
                  <TextField
                    label="Session Timeout (minutes)"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                    fullWidth
                  />
                  <TextField
                    label="Max Login Attempts"
                    type="number"
                    value={settings.loginAttempts}
                    onChange={(e) => handleChange('loginAttempts', parseInt(e.target.value))}
                    fullWidth
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Notifications color="primary" />
                  <Typography variant="h6" component="h2" fontWeight="bold">
                    Notification Settings
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.recipeApprovals}
                        onChange={(e) => handleChange('recipeApprovals', e.target.checked)}
                      />
                    }
                    label="Recipe Approval Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.userRegistrations}
                        onChange={(e) => handleChange('userRegistrations', e.target.checked)}
                      />
                    }
                    label="User Registration Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.systemAlerts}
                        onChange={(e) => handleChange('systemAlerts', e.target.checked)}
                      />
                    }
                    label="System Alert Notifications"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Storage Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Storage color="primary" />
                  <Typography variant="h6" component="h2" fontWeight="bold">
                    Storage Settings
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Max File Size (MB)"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => handleChange('maxFileSize', parseInt(e.target.value))}
                    fullWidth
                  />
                  <TextField
                    label="Image Quality (%)"
                    type="number"
                    value={settings.imageQuality}
                    onChange={(e) => handleChange('imageQuality', parseInt(e.target.value))}
                    inputProps={{ min: 1, max: 100 }}
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoBackup}
                        onChange={(e) => handleChange('autoBackup', e.target.checked)}
                      />
                    }
                    label="Automatic Backup"
                  />
                  <FormControl fullWidth>
                    <InputLabel>Backup Frequency</InputLabel>
                    <Select
                      value={settings.backupFrequency}
                      label="Backup Frequency"
                      onChange={(e) => handleChange('backupFrequency', e.target.value)}
                      disabled={!settings.autoBackup}
                    >
                      <MenuItem value="hourly">Hourly</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* System Information */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
              System Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Application Version
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  v1.0.0
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Database Version
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  PostgreSQL 14.9
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Last Backup
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  2024-01-20 03:00 UTC
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  System Status
                </Typography>
                <Typography variant="body1" fontWeight="medium" color="success.main">
                  Online
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </AdminLayout>
  );
} 