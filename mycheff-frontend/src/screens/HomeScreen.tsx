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
  SPACING 
} from '../constants';
import type { Recipe, Category } from '../types';

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
 * Professional home screen following design system standards
 * Features search, categories, recipe grid, and navigation
 */
const HomeScreen = React.memo<HomeScreenProps>(({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('home');

  // Fetch featured recipes
  const { 
    data: featuredRecipesResponse, 
    isLoading: isLoadingFeatured,
    error: featuredError,
    refetch: refetchFeatured
  } = useQuery({
    queryKey: ['featured-recipes'],
    queryFn: () => recipeAPI.getFeaturedRecipes(1, 10),
  });

  // Fetch popular recipes
  const { 
    data: popularRecipesResponse, 
    isLoading: isLoadingPopular,
    error: popularError,
    refetch: refetchPopular
  } = useQuery({
    queryKey: ['popular-recipes'],
    queryFn: () => recipeAPI.getPopularRecipes(1, 10),
  });

  // Fetch categories
  const { 
    data: categoriesResponse, 
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getCategories(),
  });

  // Grid layout calculations using design system
  const gridLayout = useMemo(() => {
    const numColumns = COMPONENT_SPACING.GRID.COLUMNS_PHONE;
    const horizontalPadding = COMPONENT_SPACING.GRID.HORIZONTAL_PADDING * 2;
    const spacing = COMPONENT_SPACING.GRID.SPACING;
    const availableWidth = screenWidth - horizontalPadding - spacing;
    const cardWidth = availableWidth / numColumns;
    
    return { numColumns, cardWidth, spacing };
  }, []);

  // Transform API data to match component expectations
  const featuredRecipes = featuredRecipesResponse?.data || [];
  const popularRecipes = popularRecipesResponse?.data || [];
  const categories = categoriesResponse || [];

  // Combine recipes for display (show featured first, then popular)
  const displayRecipes = useMemo(() => {
    const featured = featuredRecipes.slice(0, 4);
    const popular = popularRecipes.slice(0, 6);
    return [...featured, ...popular];
  }, [featuredRecipes, popularRecipes]);

  // Transform categories for ScrollMenu
  const categoryData = useMemo(() => {
    return categories.map(category => ({
      id: category.id,
      name: category.translations?.[0]?.name || category.name || 'Category',
      icon: category.icon || '🍽️',
    }));
  }, [categories]);

  // Loading state
  const isLoading = isLoadingFeatured || isLoadingPopular || isLoadingCategories;

  // Refresh handler
  const onRefresh = useCallback(() => {
    refetchFeatured();
    refetchPopular();
    refetchCategories();
  }, [refetchFeatured, refetchPopular, refetchCategories]);

  const handleSearchPress = useCallback((): void => {
    navigation?.navigate('Chat');
  }, [navigation]);

  const handleCategorySelect = useCallback((categoryId: string): void => {
    setSelectedCategory(categoryId);
    console.log('Category selected:', categoryId);
    // In the future, filter recipes by category
  }, []);

  const handleRecipePress = useCallback((recipe: Recipe): void => {
    navigation?.navigate('RecipeDetail');
    console.log('Recipe pressed:', recipe.title);
  }, [navigation]);

  const handleFavoritePress = useCallback((recipeId: string): void => {
    // TODO: Implement favorite API call
    console.log('Favorite toggled for recipe:', recipeId);
  }, []);

  const handleTabPress = useCallback((tabId: string): void => {
    setActiveTab(tabId);
    
    // Navigation logic
    switch (tabId) {
      case 'home':
        // Already on home screen
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
  if (featuredError || popularError || categoriesError) {
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

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
          {isLoadingCategories ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <ScrollMenu
              data={categoryData}
              selectedId={selectedCategory}
              onItemPress={handleCategorySelect}
            />
          )}
        </View>

        {/* Featured Recipes Section */}
        {featuredRecipes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Öne Çıkan Tarifler</Text>
            <View style={styles.recipesGrid}>
              {featuredRecipes.slice(0, 4).map((recipe) => (
                <View key={recipe.id} style={[styles.recipeCard, { width: gridLayout.cardWidth }]}>
                  <RecipeCard
                    recipe={recipe}
                    onPress={() => handleRecipePress(recipe)}
                    onFavoritePress={() => handleFavoritePress(recipe.id)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Popular Recipes Section */}
        {popularRecipes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popüler Tarifler</Text>
            <View style={styles.recipesGrid}>
              {popularRecipes.slice(0, 6).map((recipe) => (
                <View key={recipe.id} style={[styles.recipeCard, { width: gridLayout.cardWidth }]}>
                  <RecipeCard
                    recipe={recipe}
                    onPress={() => handleRecipePress(recipe)}
                    onFavoritePress={() => handleFavoritePress(recipe.id)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Loading state */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Tarifler yükleniyor...</Text>
          </View>
        )}

        {/* Empty state */}
        {!isLoading && displayRecipes.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz tarif bulunmuyor</Text>
            <Text style={styles.emptySubtext}>Lütfen daha sonra tekrar deneyin</Text>
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
    paddingBottom: COMPONENT_SPACING.NAVIGATION.HEIGHT + SPACING.lg,
  },
  searchContainer: {
    padding: COMPONENT_SPACING.GRID.HORIZONTAL_PADDING,
  },
  categoriesContainer: {
    padding: COMPONENT_SPACING.GRID.HORIZONTAL_PADDING,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
    lineHeight: FONT_SIZE.LG + 2,
    marginBottom: SPACING.sm,
  },
  recipesGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: COMPONENT_SPACING.GRID.SPACING,
  },
  recipeCard: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textSecondary,
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
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  errorSubtext: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen; 