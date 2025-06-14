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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Category as CategoryIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { apiService } from '../../services/api';

interface Category {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  translations?: Array<{
    id: string;
    name: string;
    description?: string;
    languageCode: string;
  }>;
}

interface Language {
  code: string;
  name: string;
  nativeName?: string;
  isActive: boolean;
  isDefault?: boolean;
  createdAt: string;
}

interface CategoryTranslation {
  languageCode: string;
  name: string;
  description: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [formData, setFormData] = useState({
    slug: '',
    icon: 'utensils',
    color: '#FF6B6B',
    translations: [] as CategoryTranslation[],
  });

  // Available icons
  const availableIcons = [
    'utensils', 'pizza-slice', 'hamburger', 'hotdog', 'ice-cream',
    'fish', 'meat', 'carrot', 'apple-alt', 'cookie',
    'bread-slice', 'cheese', 'wine-bottle', 'coffee', 'glass-water'
  ];

  const fetchLanguages = async () => {
    try {
      const data = await apiService.getLanguages();
      console.log('Languages fetched successfully:', data?.length || 0);
      const activeLanguages = data.filter((lang: Language) => lang.isActive);
      setLanguages(activeLanguages);
      
      // Initialize translations for all active languages
      const initialTranslations = activeLanguages.map(lang => ({
        languageCode: lang.code,
        name: '',
    description: '',
      }));
      setFormData(prev => ({ ...prev, translations: initialTranslations }));
    } catch (err) {
      console.warn('Warning: Error fetching languages:', err);
      setError('Diller yüklenirken hata oluştu. Lütfen backend\'in çalıştığından emin olun.');
      // Set fallback empty state
      setLanguages([]);
      setFormData(prev => ({ ...prev, translations: [] }));
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCategories();
      console.log('Categories fetched successfully:', data?.length || 0);
      setCategories(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.warn('Warning: Error fetching categories:', err);
      setError('Kategoriler yüklenirken hata oluştu. Lütfen backend\'in çalıştığından emin olun.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
    fetchCategories();
  }, []);

  const handleTranslationChange = (languageCode: string, field: 'name' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      translations: prev.translations.map(trans =>
        trans.languageCode === languageCode
          ? { ...trans, [field]: value }
          : trans
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validation
      const hasValidTranslations = formData.translations.some(t => t.name.trim() !== '');
      if (!hasValidTranslations) {
        setError('En az bir dil için kategori adı girmelisiniz');
        return;
      }

      if (!formData.slug.trim()) {
        setError('Kategori slug\'ı girmelisiniz');
        return;
      }

      // Filter out empty translations
      const validTranslations = formData.translations.filter(t => t.name.trim() !== '');

      const categoryData = {
        slug: formData.slug,
        icon: formData.icon,
        color: formData.color,
        sortOrder: 0,
        translations: validTranslations,
      };
        
      try {
        await apiService.createCategory(categoryData);
        await fetchCategories();
        setSuccess('Kategori başarıyla oluşturuldu!');
      } catch (apiError) {
        console.warn('API error, adding to local state:', apiError);
        
        // Fallback: Add to local state
        const newCategory = {
          id: `cat-${Date.now()}`,
          name: validTranslations[0]?.name || 'Yeni Kategori',
          slug: formData.slug,
          icon: formData.icon,
          color: formData.color,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          translations: validTranslations.map((t, index) => ({
            id: `trans-${Date.now()}-${index}`,
            name: t.name,
            description: t.description,
            languageCode: t.languageCode,
          })),
        } as Category;

        setCategories(prev => [newCategory, ...prev]);
        setSuccess('Kategori oluşturuldu (API sorunu nedeniyle sadece local olarak)');
      }

      setOpenDialog(false);
      // Reset form
      const initialTranslations = languages.map(lang => ({
        languageCode: lang.code,
        name: '',
        description: '',
      }));
      setFormData({
        slug: '',
        icon: 'utensils',
        color: '#FF6B6B',
        translations: initialTranslations,
      });
    } catch (err) {
      setError('Kategori oluşturulurken hata oluştu');
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await apiService.deleteCategory(categoryId);
      setSuccess('Kategori başarıyla silindi');
      fetchCategories(); // Refresh the list
    } catch (err: any) {
      console.warn('API delete failed:', err);
      
      // Check error type and provide appropriate feedback
      if (err.status === 401 || err.message?.includes('Authentication required')) {
        setError('Kategori silmek için giriş yapmanız gerekiyor');
      } else if (err.status === 403) {
        setError('Bu işlem için yetkiniz bulunmuyor');
      } else if (err.status === 404) {
        setError('Kategori bulunamadı');
      } else {
        // For other errors, remove from local state as fallback
      setCategories(categories.filter(cat => cat.id !== categoryId));
      setSuccess('Kategori silindi (API sorunu nedeniyle sadece local olarak)');
      }
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
          <CategoryIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Kategori Yönetimi
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Kategorileri görüntüle, düzenle ve yönet
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Toplam Kategori
              </Typography>
              <Typography variant="h4">
                {categories.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Aktif Kategori
              </Typography>
              <Typography variant="h4">
                {categories.filter(c => c.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Çevirisi Olan
              </Typography>
              <Typography variant="h4">
                {categories.filter(c => c.translations && c.translations.length > 0).length}
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
                {categories.filter(c => 
                  new Date(c.createdAt).toDateString() === new Date().toDateString()
                ).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Categories Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Kategori Listesi</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Yeni Kategori
            </Button>
          </Box>
          
          {loading ? (
            <Typography>Yükleniyor...</Typography>
          ) : categories.length === 0 ? (
            <Alert severity="info">
              Henüz kategori bulunmuyor. Yeni kategori eklemek için "Yeni Kategori" butonunu kullanın.
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>İkon</TableCell>
                    <TableCell>Slug</TableCell>
                    <TableCell>Kategori Adı</TableCell>
                    <TableCell>Çeviriler</TableCell>
                    <TableCell>Durum</TableCell>
                    <TableCell>Oluşturulma</TableCell>
                    <TableCell>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                          {category.id.slice(0, 8)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={category.icon || 'utensils'} 
                            size="small" 
                            variant="outlined"
                            sx={{ backgroundColor: category.color || '#FF6B6B', color: 'white' }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                          {category.slug || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CategoryIcon sx={{ mr: 1, fontSize: 16 }} />
                          {category.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {category.translations && category.translations.length > 0 ? (
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {category.translations.map((translation, index) => (
                              <Chip 
                                key={index}
                                label={`${translation.languageCode.toUpperCase()}: ${translation.name}`} 
                                size="small" 
                                variant="outlined"
                                title={translation.description || ''}
                              />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Çeviri yok
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={category.isActive ? 'Aktif' : 'Pasif'} 
                          color={category.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(category.createdAt).toLocaleDateString('tr-TR')}
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
                          onClick={() => handleDelete(category.id)}
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

      {/* Add Category Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Yeni Kategori Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {/* Basic Info */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Temel Bilgiler
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Kategori Slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    fullWidth
                    required
                    helperText="URL için kullanılacak (örn: ana-yemekler)"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Renk"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>İkon</InputLabel>
                    <Select
                      value={formData.icon}
                      label="İkon"
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    >
                      {availableIcons.map((icon) => (
                        <MenuItem key={icon} value={icon}>
                          {icon}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Translations */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Çeviriler
              </Typography>
              <Grid container spacing={2}>
                {formData.translations.map((translation, index) => {
                  const language = languages.find(l => l.code === translation.languageCode);
                  return (
                    <Grid item xs={12} key={translation.languageCode}>
                      <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {language?.name} ({translation.languageCode.toUpperCase()})
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
            <TextField
              label="Kategori Adı"
                              value={translation.name}
                              onChange={(e) => handleTranslationChange(translation.languageCode, 'name', e.target.value)}
              fullWidth
                              required={index === 0} // First language is required
            />
                          </Grid>
                          <Grid item xs={12} md={6}>
            <TextField
              label="Açıklama"
                              value={translation.description}
                              onChange={(e) => handleTranslationChange(translation.languageCode, 'description', e.target.value)}
              fullWidth
              multiline
                              rows={2}
            />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.slug || !formData.translations.some(t => t.name.trim() !== '')}
          >
            Kategori Ekle
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