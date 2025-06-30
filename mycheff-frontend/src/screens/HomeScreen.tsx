import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  FlatList,
  StyleSheet, 
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import SearchBar from '../components/SearchBar';
import ScrollMenu from '../components/ScrollMenu';
import RecipeCard from '../components/RecipeCard';
import NavigationBar from '../components/NavigationBar';
import { recipeAPI, categoryAPI, userAPI } from '../services/api';
import { 
  COLORS, 
  COMPONENT_SPACING, 
  FONT_SIZE, 
  DEFAULTS,
  SPACING,
  TEXT_STYLES 
} from '../constants';

const { width: screenWidth } = Dimensions.get('window');

interface HomeScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

/**
 * HomeScreen Component
 * 
 * ORIJINAL TASARIM - Backend hibrit ile
 * Kategoriler başlık yok, recipe grid tek liste
 */
const HomeScreen = React.memo<HomeScreenProps>(({ navigation }) => {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

  // Backend'den recipes ve kategoriler al
  const { 
    data: categoriesResponse, 
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getCategories(),
  });

  // Favorite mutations
  const addToFavoritesMutation = useMutation({
    mutationFn: userAPI.addToFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
      Toast.show({
        type: 'success',
        text1: 'Added to favorites',
        text2: 'Recipe saved successfully',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to add to favorites',
      });
    },
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: userAPI.removeFromFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
      Toast.show({
        type: 'success',
        text1: 'Removed from favorites',
        text2: 'Recipe removed successfully',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to remove from favorites',
      });
    },
  });

  // API call to get recipes
  const fetchRecipes = async (categoryId?: string) => {
    try {
      setIsLoading(true);
      let response;
      
      if (categoryId && categoryId !== '') {
        // Fetch recipes by category using search endpoint
        response = await recipeAPI.searchRecipes({ 
          query: '', // Empty query to get all recipes
          page: 1, 
          limit: 20,
          categories: [categoryId]
        });
      } else {
        // Fetch featured recipes when no category selected
        response = await recipeAPI.getFeaturedRecipes(1, 20);
      }
      
      setRecipes(response.data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Grid layout calculations using design system
  const gridLayout = useMemo(() => {
    const numColumns = 2; // Force 2 columns
    const horizontalPadding = COMPONENT_SPACING.GRID.HORIZONTAL_PADDING * 2;
    const columnSpacing = COMPONENT_SPACING.GRID.SPACING;
    const availableWidth = screenWidth - horizontalPadding;
    const cardWidth = (availableWidth - columnSpacing) / numColumns;
    
    return { numColumns, cardWidth, columnSpacing };
  }, []);

  // Backend kategoriler ve recipes
  const categories = categoriesResponse || [];
  const displayRecipes = recipes;

  // Refresh handler
  const onRefresh = useCallback(() => {
    refetchCategories();
    fetchRecipes(selectedCategory);
  }, [refetchCategories, selectedCategory]);

  // Fetch recipes on component mount
  React.useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearchPress = useCallback((): void => {
    navigation?.navigate('Chat');
  }, [navigation]);

  const handleCategorySelect = useCallback((categoryId: string): void => {
    setSelectedCategory(categoryId);
    fetchRecipes(categoryId);
    console.log('Category selected:', categoryId);
  }, []);

  const handleRecipePress = useCallback((recipe: any): void => {
    navigation?.navigate('RecipeDetail', { recipeId: recipe.id });
    console.log('Recipe pressed:', recipe.title);
  }, [navigation]);

  const handleFavoritePress = useCallback((recipeId: string): void => {
    // For now, just add to favorites - we can check isFavorite status later
    addToFavoritesMutation.mutate(recipeId);
    console.log('Favorite toggled for recipe:', recipeId);
  }, [addToFavoritesMutation]);

  const handleTabPress = useCallback((tabId: string): void => {
    setActiveTab(tabId);
    
    switch (tabId) {
      case 'home':
        break;
      case 'cheff':
        navigation?.navigate('Chat');
        break;
      case 'search':
        navigation?.navigate('Search');
        break;
      case 'favorites':
        navigation?.navigate('Favorites');
        break;
      case 'profile':
        navigation?.navigate('Profile');
        break;
      default:
        break;
    }
  }, [navigation]);

  // Render individual recipe item for FlatList
  const renderRecipeItem = useCallback(({ item, index }: { item: any; index: number }) => {
    return (
      <View style={[styles.recipeCardWrapper, { width: gridLayout.cardWidth }]}>
        <RecipeCard
          recipe={item}
          onPress={() => handleRecipePress(item)}
          onFavoritePress={() => handleFavoritePress(item.id)}
        />
      </View>
    );
  }, [gridLayout.cardWidth, handleRecipePress, handleFavoritePress]);

  const keyExtractor = useCallback((item: any) => item.id, []);

  // Error handling
  if (categoriesError) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Veri yüklenirken hata oluştu</Text>
        <Text style={styles.errorSubtext}>Lütfen tekrar deneyin</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar onPress={handleSearchPress} />
        </View>

        {/* Categories (Başlık yok - orijinal tasarım) */}
        <View style={styles.categoriesSection}>
          {isLoadingCategories ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : (
            <ScrollMenu
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          )}
        </View>

        {/* Recipe Grid (Tek liste - başlık yok) */}
        <View style={styles.recipesSection}>
          <FlatList
            data={displayRecipes}
            renderItem={renderRecipeItem}
            keyExtractor={keyExtractor}
            numColumns={gridLayout.numColumns}
            columnWrapperStyle={gridLayout.numColumns > 1 ? styles.recipeRow : undefined}
            ItemSeparatorComponent={() => <View style={{ height: SPACING.lg }} />}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.recipesGrid}
          />
        </View>

        {/* Loading state */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        )}

        {/* Bottom spacing for navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Navigation Bar */}
      <NavigationBar 
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
});

HomeScreen.displayName = 'HomeScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: COMPONENT_SPACING.NAVIGATION.HEIGHT + SPACING.xl, // Proper navigation clearance
  },
  searchContainer: {
    paddingHorizontal: COMPONENT_SPACING.GRID.HORIZONTAL_PADDING,
    paddingTop: SPACING.md,
  },
  categoriesSection: {
    paddingTop: SPACING.lg,
  },
  recipesSection: {
    paddingTop: SPACING.xl,
    paddingHorizontal: COMPONENT_SPACING.GRID.HORIZONTAL_PADDING,
  },
  recipesGrid: {
    flexGrow: 1,
  },
  recipeRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  recipeCardWrapper: {
    // Width set dynamically from gridLayout.cardWidth
    marginBottom: SPACING.sm,
  },
  loadingContainer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...TEXT_STYLES.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...TEXT_STYLES.heading4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  errorSubtext: {
    ...TEXT_STYLES.bodyMedium,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen; 