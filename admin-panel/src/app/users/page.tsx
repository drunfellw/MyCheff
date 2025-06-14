'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Snackbar,
  Container,
  Fab,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { apiService } from '../../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  preferredLanguageCode: string;
  isPremium: boolean;
  isVerified: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    preferredLanguage: 'tr',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching users from API...');
      
      const response = await apiService.getUsers();
      console.log('📥 Users fetched successfully:', response?.length || 0);
      
      // Handle both wrapped and direct responses
      const data = response.data || response;
      
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.warn('⚠️ Users data is not an array:', data);
        setUsers([]);
      }
      
      setError(null);
    } catch (err) {
      console.warn('⚠️ Error fetching users:', err);
      setError('Kullanıcılar yüklenirken hata oluştu. Lütfen backend\'in çalıştığından emin olun.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    try {
      console.log('Creating user with data:', formData);
      
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        preferredLanguage: formData.preferredLanguage, // API service will transform this to preferredLanguageCode
      };

      const newUser = await apiService.createUser(userData);
      console.log('User created successfully:', newUser);
      
      // If API call succeeds, refresh the user list
      await fetchUsers();
      setSuccess('Kullanıcı başarıyla oluşturuldu!');

      setOpenDialog(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        fullName: '',
        preferredLanguage: 'tr',
      });
    } catch (err) {
      console.warn('⚠️ Error creating user:', err);
      setError('Kullanıcı oluşturulurken hata oluştu: ' + (err?.message || 'Bilinmeyen hata'));
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      // API'ye silme isteği gönder
      await apiService.deleteUser(userId);
      
      // Local state'den de sil
      setUsers(users.filter(user => user.id !== userId));
      setSuccess('Kullanıcı başarıyla silindi');
    } catch (error) {
      console.warn('⚠️ Delete error:', error);
      setError('Kullanıcı silinirken hata oluştu: ' + (error?.message || 'Bilinmeyen hata'));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Navigation Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ minWidth: '120px' }}
        >
          Geri
        </Button>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => router.push('/')}
          sx={{ minWidth: '120px' }}
        >
          Ana Menü
        </Button>
      </Box>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <PeopleIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Kullanıcı Yönetimi
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Kullanıcıları görüntüle, düzenle ve yönet
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Toplam Kullanıcı
              </Typography>
              <Typography variant="h4">
                {users.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Aktif Kullanıcı
              </Typography>
              <Typography variant="h4">
                {users.filter(u => u.isVerified).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Premium Kullanıcı
              </Typography>
              <Typography variant="h4">
                {users.filter(u => u.isPremium).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Türkçe Kullanıcı
              </Typography>
              <Typography variant="h4">
                {users.filter(u => u.preferredLanguageCode === 'tr').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Bugün Eklenen
              </Typography>
              <Typography variant="h4">
                {users.filter(u => 
                  new Date(u.createdAt).toDateString() === new Date().toDateString()
                ).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Kullanıcı Listesi</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Yeni Kullanıcı
            </Button>
          </Box>
          
          {loading ? (
            <Typography>Yükleniyor...</Typography>
          ) : users.length === 0 ? (
            <Alert severity="info">
              Henüz kullanıcı bulunmuyor. Yeni kullanıcı eklemek için "Yeni Kullanıcı" butonunu kullanın.
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Kullanıcı Adı</TableCell>
                    <TableCell>Ad Soyad</TableCell>
                    <TableCell>E-posta</TableCell>
                    <TableCell>Dil</TableCell>
                    <TableCell>Durum</TableCell>
                    <TableCell>Premium</TableCell>
                    <TableCell>Oluşturulma</TableCell>
                    <TableCell>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.fullName || '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EmailIcon sx={{ mr: 1, fontSize: 16 }} />
                          {user.email}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.preferredLanguageCode?.toUpperCase() || 'TR'} 
                          size="small" 
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.isVerified ? 'Aktif' : 'Pasif'} 
                          color={user.isVerified ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.isPremium ? 'Premium' : 'Standart'} 
                          color={user.isPremium ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          color="error" 
                          onClick={() => handleDelete(user.id)}
                          startIcon={<DeleteIcon />}
                        >
                          Sil
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Kullanıcı Adı"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Ad Soyad"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              fullWidth
            />
            <TextField
              label="E-posta"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Şifre"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Tercih Edilen Dil"
              select
              value={formData.preferredLanguage}
              onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
              fullWidth
              SelectProps={{ native: true }}
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ar">العربية</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.username || !formData.email || !formData.password}
          >
            Kullanıcı Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
} 