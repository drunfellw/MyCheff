'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Snackbar,
  Alert,
  FormHelperText,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Restaurant,
  Close,
  CloudUpload,
  Image,
  DeleteOutline,
} from '@mui/icons-material';
import AdminLayout from '@/components/Layout/AdminLayout';
import { apiService } from '@/services/api';

interface Recipe {
  id: string;
  title: string;
  description: string;
  preparationSteps?: any[];
  tips?: string[];
  cookingTimeMinutes: number;
  prepTimeMinutes: number;
  servingSize: number;
  difficultyLevel: number;
  categoryId?: string;
  authorId?: string;
  isPremium: boolean;
  isPublished: boolean;
  imageUrl?: string;
  averageRating?: number;
  ratingCount?: number;
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
  nutritionalData?: {
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  attributes?: {
    isVegan?: boolean;
    isVegetarian?: boolean;
    isGluten_free?: boolean;
    isDairy_free?: boolean;
    isNut_free?: boolean;
    isKeto?: boolean;
    spiceLevel?: number;
  };
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  sortOrder?: number;
  translations?: Array<{
    languageCode: string;
    name: string;
    description?: string;
  }>;
}

const initialRecipeForm = {
  title: '',
  description: '',
  preparationSteps: [],
  tips: [],
  categoryId: '',
  difficultyLevel: 1,
  cookingTimeMinutes: 0,
  prepTimeMinutes: 0,
  servingSize: 1,
  isPremium: false,
  isPublished: true,
  nutritionalData: {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  },
  attributes: {
    isVegan: false,
    isVegetarian: false,
    isGluten_free: false,
    isDairy_free: false,
    isNut_free: false,
    isKeto: false,
    spiceLevel: 1,
  },
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [recipeForm, setRecipeForm] = useState(initialRecipeForm);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetchData();
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      setBackendConnected(response.ok);
    } catch (error) {
      setBackendConnected(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recipesResponse, categoriesResponse] = await Promise.all([
        apiService.getRecipes().catch(() => ({ data: [] })),
        apiService.getCategories().catch(() => [])
      ]);
      
      // Handle recipes response
      const recipesData = recipesResponse?.data || recipesResponse || [];
      setRecipes(recipesData);
      
      // Handle categories response - could be direct array or wrapped in response
      const categoriesData = Array.isArray(categoriesResponse) 
        ? categoriesResponse 
        : categoriesResponse?.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (recipe?: Recipe) => {
    if (recipe) {
      setEditingRecipe(recipe);
      setRecipeForm({
        title: recipe.title || '',
        description: recipe.description || '',
        preparationSteps: recipe.preparationSteps || [],
        tips: recipe.tips || [],
        categoryId: recipe.categoryId || '',
        difficultyLevel: recipe.difficultyLevel || 1,
        cookingTimeMinutes: recipe.cookingTimeMinutes || 0,
        prepTimeMinutes: recipe.prepTimeMinutes || 0,
        servingSize: recipe.servingSize || 1,
        isPremium: recipe.isPremium || false,
        isPublished: recipe.isPublished || true,
        nutritionalData: recipe.nutritionalData || {
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
        },
        attributes: recipe.attributes || {
          isVegan: false,
          isVegetarian: false,
          isGluten_free: false,
          isDairy_free: false,
          isNut_free: false,
          isKeto: false,
          spiceLevel: 1,
        },
      });
    } else {
      setEditingRecipe(null);
      setRecipeForm(initialRecipeForm);
    }
    setSelectedFiles([]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRecipe(null);
    setRecipeForm(initialRecipeForm);
    setSelectedFiles([]);
  };

  const handleFormChange = (field: string, value: any) => {
    if (field.startsWith('nutritional_')) {
      const nutritionField = field.replace('nutritional_', '');
      setRecipeForm(prev => ({
        ...prev,
        nutritionalData: {
          ...prev.nutritionalData,
          [nutritionField]: value
        }
      }));
    } else if (field.startsWith('attribute_')) {
      const attributeField = field.replace('attribute_', '');
      setRecipeForm(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [attributeField]: value
        }
      }));
    } else {
      setRecipeForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError('Bazı dosyalar geçersiz format veya boyutta. Sadece resim/video dosyaları (max 50MB) kabul edilir.');
    }

    setSelectedFiles(validFiles);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (recipeId: string): Promise<boolean> => {
    if (selectedFiles.length === 0) return true;

    try {
      setUploading(true);
      const uploadResult = await apiService.uploadRecipeFiles(recipeId, selectedFiles);
      
      if (uploadResult.success || uploadResult.data) {
        return true;
      } else {
        throw new Error('File upload failed');
      }
    } catch (error) {
      console.error('File upload error:', error);
      setError('Dosyalar yüklenirken hata oluştu');
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleSaveRecipe = async () => {
    try {
      setUploading(true);
      
      // Validate form
      if (!recipeForm.title.trim()) {
        setError('Tarif başlığı gereklidir');
        return;
      }
      
      if (!recipeForm.categoryId) {
        setError('Kategori seçimi gereklidir');
        return;
      }

      const recipeData = {
        title: recipeForm.title,
        description: recipeForm.description,
        preparationSteps: recipeForm.preparationSteps,
        tips: recipeForm.tips,
        categoryId: recipeForm.categoryId,
        difficultyLevel: recipeForm.difficultyLevel,
        cookingTimeMinutes: recipeForm.cookingTimeMinutes,
        prepTimeMinutes: recipeForm.prepTimeMinutes,
        servingSize: recipeForm.servingSize,
        isPremium: recipeForm.isPremium,
        isPublished: recipeForm.isPublished,
        nutritionalData: recipeForm.nutritionalData,
        attributes: recipeForm.attributes,
      };

      let savedRecipe;
      let isUsingMockData = false;
      
      try {
        if (editingRecipe) {
          savedRecipe = await apiService.updateRecipe(editingRecipe.id, recipeData);
        } else {
          savedRecipe = await apiService.createRecipe(recipeData);
        }
      } catch (error: any) {
        if (error.message && error.message.includes('Backend server is not available')) {
          setError('Backend server bağlantısı yok. Tarif sadece geçici olarak mock veriye kaydedildi. Gerçek kayıt için backend\'i başlatın.');
          isUsingMockData = true;
        } else {
          throw error;
        }
      }

      // Get recipe ID - handle different response structures
      const recipeId = savedRecipe?.id || savedRecipe?.data?.id || editingRecipe?.id;
      
      if (!recipeId && !isUsingMockData) {
        setError('Tarif kaydedildi ancak ID alınamadı');
        await fetchData();
        handleCloseDialog();
        return;
      }

      // Upload files if any
      if (selectedFiles.length > 0 && recipeId) {
        const uploadSuccess = await uploadFiles(recipeId);
        if (!uploadSuccess) {
          if (isUsingMockData) {
            setSuccess('Tarif mock veriye kaydedildi ancak dosyalar yüklenemedi (Backend bağlantısı yok)');
          } else {
            setSuccess('Tarif kaydedildi ancak dosyalar yüklenemedi');
          }
          await fetchData();
          handleCloseDialog();
          return;
        }
      }

      if (isUsingMockData) {
        setSuccess('⚠️ Tarif sadece geçici mock veriye kaydedildi. Gerçek kayıt için backend server\'ı başlatın.');
      } else {
        setSuccess(editingRecipe ? 'Tarif başarıyla güncellendi ve veritabanına kaydedildi' : 'Tarif başarıyla eklendi ve veritabanına kaydedildi');
      }
      
      await fetchData();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Save error:', error);
      if (error.message && error.message.includes('Backend server is not available')) {
        setError('Backend server bağlantısı kurulamadı. Lütfen backend\'i port 3001\'de başlatın.');
      } else {
        setError('Tarif kaydedilirken hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      await apiService.deleteRecipe(id);
      setSuccess('Tarif başarıyla silindi');
      await fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      setError('Tarif silinirken hata oluştu');
    }
  };

  const getDifficultyColor = (difficultyLevel: number) => {
    switch (difficultyLevel) {
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'error';
      default:
        return 'default';
    }
  };

  const getDifficultyText = (difficultyLevel: number) => {
    switch (difficultyLevel) {
      case 1:
        return 'Kolay';
      case 2:
        return 'Orta';
      case 3:
        return 'Zor';
      default:
        return 'Bilinmiyor';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Yükleniyor...</Typography>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Tarif Yönetimi
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2 }}
          >
            Yeni Tarif Ekle
          </Button>
        </Box>

        {/* Backend Connection Status */}
        {backendConnected !== null && (
          <Card sx={{ mb: 3, border: backendConnected ? '1px solid #4caf50' : '1px solid #ff9800' }}>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: backendConnected ? '#4caf50' : '#ff9800',
                  }}
                />
                <Typography variant="body2" color={backendConnected ? 'success.main' : 'warning.main'}>
                  {backendConnected 
                    ? '✅ Backend bağlantısı aktif - Veriler veritabanına kaydediliyor'
                    : '⚠️ Backend bağlantısı yok - Veriler geçici mock sisteme kaydediliyor'
                  }
                </Typography>
                {!backendConnected && (
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={checkBackendConnection}
                    sx={{ ml: 2 }}
                  >
                    Yeniden Dene
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Tariflerde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ borderRadius: 2 }}
            />
          </CardContent>
        </Card>

        <Card>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tarif</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Kategori</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Zorluk</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Süre</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Porsiyon</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecipes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((recipe) => (
                    <TableRow key={recipe.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={recipe.imageUrl}
                            sx={{
                              bgcolor: 'primary.main',
                              width: 50,
                              height: 50,
                            }}
                          >
                            <Restaurant />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {recipe.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {recipe.description}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const category = categories.find(cat => cat.id === recipe.categoryId);
                          return category?.translations?.[0]?.name || category?.name || 'Kategori Yok';
                        })()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getDifficultyText(recipe.difficultyLevel)}
                          color={getDifficultyColor(recipe.difficultyLevel) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          Hazırlık: {recipe.prepTimeMinutes || 0}dk
                        </Typography>
                        <Typography variant="body2">
                          Pişirme: {recipe.cookingTimeMinutes || 0}dk
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {recipe.servingSize || 1} kişilik
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenDialog(recipe)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteRecipe(recipe.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredRecipes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">
                        Henüz tarif bulunmuyor
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRecipes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        {/* Add/Edit Recipe Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {editingRecipe ? 'Tarif Düzenle' : 'Yeni Tarif Ekle'}
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={8}>
                <TextField
                  label="Tarif Başlığı *"
                  fullWidth
                  value={recipeForm.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  error={!recipeForm.title.trim()}
                  helperText={!recipeForm.title.trim() ? 'Bu alan zorunludur' : ''}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth error={!recipeForm.categoryId}>
                  <InputLabel>Kategori *</InputLabel>
                  <Select
                    value={recipeForm.categoryId}
                    label="Kategori *"
                    onChange={(e) => handleFormChange('categoryId', e.target.value)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.translations?.[0]?.name || category.name || 'İsimsiz Kategori'}
                      </MenuItem>
                    ))}
                  </Select>
                  {!recipeForm.categoryId && (
                    <FormHelperText>Bu alan zorunludur</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Açıklama"
                  fullWidth
                  multiline
                  rows={3}
                  value={recipeForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Hazırlık Süresi (dakika)"
                  type="number"
                  fullWidth
                  value={recipeForm.prepTimeMinutes}
                  onChange={(e) => handleFormChange('prepTimeMinutes', parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Pişirme Süresi (dakika)"
                  type="number"
                  fullWidth
                  value={recipeForm.cookingTimeMinutes}
                  onChange={(e) => handleFormChange('cookingTimeMinutes', parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Porsiyon"
                  type="number"
                  fullWidth
                  value={recipeForm.servingSize}
                  onChange={(e) => handleFormChange('servingSize', parseInt(e.target.value) || 1)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Zorluk</InputLabel>
                  <Select
                    value={recipeForm.difficultyLevel}
                    label="Zorluk"
                    onChange={(e) => handleFormChange('difficultyLevel', parseInt(e.target.value) || 1)}
                  >
                    <MenuItem value={1}>Kolay</MenuItem>
                    <MenuItem value={2}>Orta</MenuItem>
                    <MenuItem value={3}>Zor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Premium</InputLabel>
                  <Select
                    value={recipeForm.isPremium}
                    label="Premium"
                    onChange={(e) => handleFormChange('isPremium', e.target.value === 'true')}
                  >
                    <MenuItem value={true}>Evet</MenuItem>
                    <MenuItem value={false}>Hayır</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Yayınlanma</InputLabel>
                  <Select
                    value={recipeForm.isPublished}
                    label="Yayınlanma"
                    onChange={(e) => handleFormChange('isPublished', e.target.value === 'true')}
                  >
                    <MenuItem value={true}>Evet</MenuItem>
                    <MenuItem value={false}>Hayır</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Besin Değerleri (100g için)
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Kalori (kcal)"
                  type="number"
                  fullWidth
                  value={recipeForm.nutritionalData?.calories || ''}
                  onChange={(e) => handleFormChange('nutritional_calories', parseFloat(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Protein (g)"
                  type="number"
                  fullWidth
                  value={recipeForm.nutritionalData?.protein || ''}
                  onChange={(e) => handleFormChange('nutritional_protein', parseFloat(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Karbonhidrat (g)"
                  type="number"
                  fullWidth
                  value={recipeForm.nutritionalData?.carbohydrates || ''}
                  onChange={(e) => handleFormChange('nutritional_carbohydrates', parseFloat(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Yağ (g)"
                  type="number"
                  fullWidth
                  value={recipeForm.nutritionalData?.fat || ''}
                  onChange={(e) => handleFormChange('nutritional_fat', parseFloat(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Fiber (g)"
                  type="number"
                  fullWidth
                  value={recipeForm.nutritionalData?.fiber || ''}
                  onChange={(e) => handleFormChange('nutritional_fiber', parseFloat(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Şeker (g)"
                  type="number"
                  fullWidth
                  value={recipeForm.nutritionalData?.sugar || ''}
                  onChange={(e) => handleFormChange('nutritional_sugar', parseFloat(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Sodyum (mg)"
                  type="number"
                  fullWidth
                  value={recipeForm.nutritionalData?.sodium || ''}
                  onChange={(e) => handleFormChange('nutritional_sodium', parseFloat(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Görsel ve Video Yükleme
                </Typography>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Dosya Seç (Resim/Video - Max 50MB)
                  </Button>
                </label>
                
                {selectedFiles.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Seçilen Dosyalar:
                    </Typography>
                    {selectedFiles.map((file, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        p: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Image color="primary" />
                          <Typography variant="body2">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </Typography>
                        </Box>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => removeFile(index)}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} variant="outlined" disabled={uploading}>
              İptal
            </Button>
            <Button 
              onClick={handleSaveRecipe} 
              variant="contained" 
              disabled={uploading || !recipeForm.title.trim() || !recipeForm.categoryId}
            >
              {uploading ? 'Kaydediliyor...' : (editingRecipe ? 'Güncelle' : 'Oluştur')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
} 