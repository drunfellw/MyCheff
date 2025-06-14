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
  InputAdornment,
  TablePagination,
} from '@mui/material';
import {
  Inventory as IngredientIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { apiService } from '../../services/api';

interface Ingredient {
  id: string;
  name: string;
  defaultUnit: string;
  slug?: string;
  image?: string;
  nutritionalInfo?: any;
  isActive: boolean;
  categoryId?: string;
  unitId?: string;
  createdAt: string;
  updatedAt: string;
  translations?: Array<{
    languageCode: string;
    name: string;
    aliases?: string[];
  }>;
}

export default function IngredientsPage() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    name: '',
    defaultUnit: 'gram',
    isActive: true,
  });

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching ingredients from API...');
      
      const data = await apiService.getIngredients();
      console.log('📥 Ingredients fetched successfully:', data?.length || 0);
      
      if (Array.isArray(data)) {
        setIngredients(data);
      } else {
        console.warn('⚠️ Ingredients data is not an array:', data);
        setIngredients([]);
      }
      
      setError(null);
    } catch (err) {
      console.warn('⚠️ Error fetching ingredients:', err);
      setError('Malzemeler yüklenirken hata oluştu. Lütfen backend\'in çalıştığından emin olun.');
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        setError('Malzeme adı gereklidir');
        return;
      }

      // Generate slug from name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();

      // Create ingredient data in the format backend expects
      const ingredientData = {
        slug: slug,
        defaultUnit: formData.defaultUnit,
        translations: [
          {
            languageCode: 'tr', // Default language
            name: formData.name,
          }
        ]
      };

      console.log('Creating ingredient with data:', ingredientData);
      await apiService.createIngredient(ingredientData);
      setSuccess('Malzeme başarıyla oluşturuldu!');
      setOpenDialog(false);
      setFormData({ name: '', defaultUnit: 'gram', isActive: true });
      fetchIngredients();
    } catch (err) {
      console.warn('⚠️ Error creating ingredient:', err);
      setError('Malzeme oluşturulurken hata oluştu: ' + (err?.message || 'Bilinmeyen hata'));
    }
  };

  const handleDelete = async (ingredientId: string) => {
    try {
      await apiService.deleteIngredient(ingredientId);
      setSuccess('Malzeme başarıyla silindi');
      fetchIngredients();
    } catch (err) {
      console.warn('⚠️ Error deleting ingredient:', err);
      setError('Malzeme silinirken hata oluştu');
    }
  };

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingredient.defaultUnit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          <IngredientIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Malzeme Yönetimi
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Malzemeleri görüntüle, düzenle ve yönet
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Toplam Malzeme
              </Typography>
              <Typography variant="h4">
                {ingredients.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Aktif Malzeme
              </Typography>
              <Typography variant="h4">
                {ingredients.filter(i => i.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Farklı Birim
              </Typography>
              <Typography variant="h4">
                {new Set(ingredients.map(i => i.defaultUnit)).size}
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
                {ingredients.filter(i => 
                  new Date(i.createdAt).toDateString() === new Date().toDateString()
                ).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <TextField
              placeholder="Malzeme ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, maxWidth: 400 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Yeni Malzeme
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Ingredients Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Typography>Yükleniyor...</Typography>
          ) : ingredients.length === 0 ? (
            <Alert severity="info">
              Henüz malzeme bulunmuyor. Yeni malzeme eklemek için "Yeni Malzeme" butonunu kullanın.
            </Alert>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Malzeme Adı</TableCell>
                      <TableCell>Varsayılan Birim</TableCell>
                      <TableCell>Durum</TableCell>
                      <TableCell>Oluşturulma</TableCell>
                      <TableCell>İşlemler</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredIngredients
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((ingredient) => (
                        <TableRow key={ingredient.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <IngredientIcon sx={{ mr: 1, fontSize: 16 }} />
                              {ingredient.name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={ingredient.defaultUnit} 
                              size="small" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={ingredient.isActive ? 'Aktif' : 'Pasif'} 
                              color={ingredient.isActive ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(ingredient.createdAt).toLocaleDateString('tr-TR')}
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" color="info">
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleDelete(ingredient.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredIngredients.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Sayfa başına:"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} / ${count !== -1 ? count : `${to}'den fazla`}`
                }
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Ingredient Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Malzeme Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Malzeme Adı"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Varsayılan Birim"
              value={formData.defaultUnit}
              onChange={(e) => setFormData({ ...formData, defaultUnit: e.target.value })}
              fullWidth
              required
              helperText="Örn: gram, adet, çay kaşığı, su bardağı"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name.trim()}
          >
            Malzeme Ekle
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