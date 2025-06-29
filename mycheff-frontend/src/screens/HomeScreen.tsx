import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

import SearchBar from '../components/SearchBar';
import ScrollMenu from '../components/ScrollMenu';
import RecipeCard from '../components/RecipeCard';
import NavigationBar from '../components/NavigationBar';
import { recipeAPI, categoryAPI } from '../services/api';
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

  // API call to get recipes
  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await recipeAPI.getFeatured(1, 20);
      setRecipes(response.data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      // Show error message but don't use mock data
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Grid layout calculations using design system
  const gridLayout = useMemo(() => {
    const numColumns = DEFAULTS.GRID_COLUMNS.PHONE;
    const horizontalPadding = COMPONENT_SPACING.GRID.HORIZONTAL_PADDING * 2;
    const spacing = COMPONENT_SPACING.GRID.SPACING;
    const availableWidth = screenWidth - horizontalPadding - spacing;
    const cardWidth = (availableWidth - spacing) / numColumns;
    
    return { numColumns, cardWidth, spacing };
  }, []);

  // Backend kategoriler ve recipes
  const categories = categoriesResponse || [];
  const displayRecipes = recipes;

  // Refresh handler
  const onRefresh = useCallback(() => {
    refetchCategories();
    fetchRecipes();
  }, [refetchCategories, fetchRecipes]);

  const handleSearchPress = useCallback((): void => {
    navigation?.navigate('Chat');
  }, [navigation]);

  const handleCategorySelect = useCallback((categoryId: string): void => {
    setSelectedCategory(categoryId);
    console.log('Category selected:', categoryId);
  }, []);

  const handleRecipePress = useCallback((recipe: any): void => {
    navigation?.navigate('RecipeDetail', { recipeId: recipe.id });
    console.log('Recipe pressed:', recipe.title);
  }, [navigation]);

  const handleFavoritePress = useCallback((recipeId: string): void => {
    console.log('Favorite toggled for recipe:', recipeId);
  }, []);

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
          <View style={styles.recipesGrid}>
            {displayRecipes.map((recipe, index) => (
              <View key={recipe.id} style={[styles.recipeCardWrapper, { width: gridLayout.cardWidth }]}>
                <RecipeCard
                  recipe={recipe}
                  onPress={() => handleRecipePress(recipe)}
                  onFavoritePress={() => handleFavoritePress(recipe.id)}
                />
              </View>
            ))}
          </View>
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
    paddingBottom: COMPONENT_SPACING.NAVIGATION.HEIGHT + SPACING.xl,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  recipeCardWrapper: {
    marginBottom: SPACING.lg,
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