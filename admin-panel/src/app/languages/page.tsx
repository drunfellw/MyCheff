'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Language as LanguageIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { apiService } from '../../services/api';

interface Language {
  code: string;
  name: string;
  nativeName?: string;
  isActive: boolean;
  isDefault?: boolean;
  createdAt: string;
}

export default function LanguagesPage() {
  const router = useRouter();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    isActive: true,
  });

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching languages from API...');
      
      const response = await apiService.getLanguages();
      console.log('📥 Raw API response:', response);
      
      // API response structure: { success: true, data: [...], message: "..." }
      // But apiService.getLanguages() should already extract the data array
      let languageData = response;
      
      // If response has a data property, extract it
      if (response && typeof response === 'object' && 'data' in response) {
        languageData = response.data;
      }
      
      console.log('📋 Processed language data:', languageData);
      
      if (Array.isArray(languageData)) {
        setLanguages(languageData);
        console.log('✅ Languages set successfully:', languageData.length, 'languages');
      } else {
        console.warn('⚠️ Language data is not an array:', languageData);
        setLanguages([]);
      }
      
      setError(null);
    } catch (err) {
      console.warn('⚠️ Error fetching languages:', err);
      setError('Diller yüklenirken hata oluştu. Lütfen backend\'in çalıştığından emin olun.');
      setLanguages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleSubmit = async () => {
    try {
      await apiService.createLanguage(formData);
      setSuccess('Dil başarıyla oluşturuldu!');
      setOpenDialog(false);
      setFormData({ code: '', name: '', isActive: true });
      fetchLanguages(); // Refresh the list
    } catch (err) {
      setError('Dil oluşturulurken hata oluştu');
    }
  };

  const handleDelete = async (languageCode: string) => {
    try {
      await apiService.deleteLanguage(languageCode);
      setSuccess('Dil silindi');
      fetchLanguages(); // Refresh the list
    } catch (err) {
      setError('Dil silinirken hata oluştu');
    }
  };

  const getFlagEmoji = (code: string) => {
    const flags: { [key: string]: string } = {
      'tr': '🇹🇷',
      'en': '🇺🇸',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'ar': '🇸🇦',
    };
    return flags[code] || '🌍';
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
          <LanguageIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Dil Yönetimi
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Dilleri görüntüle, düzenle ve yönet
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Toplam Dil
              </Typography>
              <Typography variant="h4">
                {languages.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Aktif Dil
              </Typography>
              <Typography variant="h4">
                {languages.filter(l => l.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Desteklenen Dil
              </Typography>
              <Typography variant="h4">
                {languages.filter(l => ['tr', 'en', 'es', 'fr', 'de', 'ar'].includes(l.code)).length}
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
                {languages.filter(l => 
                  new Date(l.createdAt).toDateString() === new Date().toDateString()
                ).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Languages Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Dil Listesi</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Yeni Dil
            </Button>
          </Box>
          
          {loading ? (
            <Typography>Yükleniyor...</Typography>
          ) : languages.length === 0 ? (
            <Alert severity="info">
              Henüz dil bulunmuyor. Yeni dil eklemek için "Yeni Dil" butonunu kullanın.
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bayrak</TableCell>
                    <TableCell>Kod</TableCell>
                    <TableCell>Dil Adı</TableCell>
                    <TableCell>Durum</TableCell>
                    <TableCell>Oluşturulma</TableCell>
                    <TableCell>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {languages.map((language) => (
                    <TableRow key={language.code}>
                      <TableCell>
                        <Typography variant="h5">
                          {getFlagEmoji(language.code)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={language.code.toUpperCase()} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LanguageIcon sx={{ mr: 1, fontSize: 16 }} />
                          {language.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={language.isActive ? 'Aktif' : 'Pasif'} 
                          color={language.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(language.createdAt).toLocaleDateString('tr-TR')}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary">
                          <ViewIcon />
                        </IconButton>
                        <IconButton size="small" color="info">
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDelete(language.code)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add Language Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Dil Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Dil Kodu (örn: tr, en, es)"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
              fullWidth
              required
              inputProps={{ maxLength: 5 }}
            />
            <TextField
              label="Dil Adı"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  color="primary"
                />
              }
              label="Aktif"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.code || !formData.name}
          >
            Dil Ekle
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