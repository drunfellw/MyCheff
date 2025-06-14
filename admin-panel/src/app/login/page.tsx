'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Alert,
  Paper,
} from '@mui/material';
import {
  Login as LoginIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { apiService } from '../../services/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Email ve şifre gereklidir');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiService.login(formData.email, formData.password);
      router.push('/');
    } catch (err) {
      setError('Giriş başarısız. Email ve şifrenizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={6} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <AdminIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Admin Giriş
          </Typography>
          <Typography variant="h6">
            MyCheff Admin Panel
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  fullWidth
                  required
                  autoFocus
                />
                
                <TextField
                  label="Şifre"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  fullWidth
                  required
                />

                {error && (
                  <Alert severity="error">
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<LoginIcon />}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1BA0D3 90%)',
                    },
                  }}
                >
                  {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Demo hesap: admin@mycheff.com / password123
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 