import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SearchBar from '../components/SearchBar';
import ScrollMenu from '../components/ScrollMenu';
import RecipeCard from '../components/RecipeCard';
import NavigationBar from '../components/NavigationBar';
import { 
  COLORS, 
  COMPONENT_SPACING, 
  FONT_SIZE, 
  DEFAULTS,
  SPACING 
} from '../constants';
import { CATEGORIES_DATA } from '../services/mockData';
import type { Recipe } from '../types';

const { width: screenWidth } = Dimensions.get('window');

interface HomeScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

// Mock recipe data - In production, this would come from API
const MOCK_RECIPES: Recipe[] = [
  {
    id: 'recipe-1',
    title: 'Soğuk Amerikano',
    cookingTime: 3,
    cookingTimeMinutes: 3,
    isPremium: false,
    isFeatured: false,
    difficultyLevel: 1,
    difficulty: 'Easy',
    authorId: 'author-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Soğuk Amerikano',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop',
    averageRating: 4.8,
    isFavorite: false,
  },
  {
    id: 'recipe-2', 
    title: 'Pancake Stack',
    cookingTime: 15,
    cookingTimeMinutes: 15,
    isPremium: false,
    isFeatured: true,
    difficultyLevel: 2,
    difficulty: 'Medium',
    authorId: 'author-2',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Pancake Stack',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
    averageRating: 4.9,
    isFavorite: true,
  },
  {
    id: 'recipe-3',
    title: 'Avocado Toast',
    cookingTime: 5,
    cookingTimeMinutes: 5,
    isPremium: false,
    isFeatured: false,
    difficultyLevel: 1,
    difficulty: 'Easy',
    authorId: 'author-3',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Avocado Toast',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&h=200&fit=crop',
    averageRating: 4.7,
    isFavorite: false,
  },
  {
    id: 'recipe-4',
    title: 'French Omelette',
    cookingTime: 8,
    cookingTimeMinutes: 8,
    isPremium: false,
    isFeatured: false,
    difficultyLevel: 2,
    difficulty: 'Medium',
    authorId: 'author-4',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'French Omelette',
    image: 'https://images.unsplash.com/photo-1582169296194-754c5a464303?w=300&h=200&fit=crop',
    averageRating: 4.6,
    isFavorite: false,
  },
  {
    id: 'recipe-5',
    title: 'Berry Smoothie',
    cookingTime: 2,
    cookingTimeMinutes: 2,
    isPremium: false,
    isFeatured: true,
    difficultyLevel: 1,
    difficulty: 'Easy',
    authorId: 'author-5',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Berry Smoothie',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=300&h=200&fit=crop',
    averageRating: 4.8,
    isFavorite: true,
  },
  {
    id: 'recipe-6',
    title: 'Granola Bowl',
    cookingTime: 5,
    cookingTimeMinutes: 5,
    isPremium: false,
    isFeatured: false,
    difficultyLevel: 1,
    difficulty: 'Easy',
    authorId: 'author-6',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Granola Bowl',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
    averageRating: 4.5,
    isFavorite: false,
  }
];

/**
 * HomeScreen Component
 * 
 * Professional home screen following design system standards
 * Features search, categories, recipe grid, and navigation
 */
const HomeScreen = React.memo<HomeScreenProps>(({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string>('1'); // Breakfast selected
  const [activeTab, setActiveTab] = useState<string>('home');
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);

  // Grid layout calculations using design system
  const gridLayout = useMemo(() => {
    const numColumns = COMPONENT_SPACING.GRID.COLUMNS_PHONE;
    const horizontalPadding = COMPONENT_SPACING.GRID.HORIZONTAL_PADDING * 2;
    const spacing = COMPONENT_SPACING.GRID.SPACING;
    const availableWidth = screenWidth - horizontalPadding - spacing;
    const cardWidth = availableWidth / numColumns;
    
    return { numColumns, cardWidth, spacing };
  }, []);

  const handleSearchPress = useCallback((): void => {
    navigation?.navigate('Chat');
  }, [navigation]);

  const handleCategorySelect = useCallback((categoryId: string): void => {
    setSelectedCategory(categoryId);
    console.log('Category selected:', categoryId);
  }, []);

  const handleRecipePress = useCallback((recipe: Recipe): void => {
    navigation?.navigate('RecipeDetail');
    console.log('Recipe pressed:', recipe.title);
  }, [navigation]);

  const handleFavoritePress = useCallback((recipeId: string): void => {
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
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
      case 'profile':
        navigation?.navigate('Profile');
        break;
      default:
        console.log('Unknown tab pressed:', tabId);
    }
  }, [navigation]);

  // Dynamic inspiration text based on selected category
  const inspirationText = useMemo(() => {
    const selectedCategoryData = CATEGORIES_DATA.find(cat => cat.id === selectedCategory);
    const categoryName = selectedCategoryData?.name?.toLowerCase() || 'breakfast';
    return `${DEFAULTS.INSPIRATION_TEXT.COUNT} types of ${categoryName} ${DEFAULTS.INSPIRATION_TEXT.SUFFIX}`;
  }, [selectedCategory]);

  const renderRecipeGrid = useCallback(() => {
    const rows: React.ReactElement[] = [];
    const { numColumns } = gridLayout;
    
    for (let i = 0; i < recipes.length; i += numColumns) {
      const rowRecipes = recipes.slice(i, i + numColumns);
      
      rows.push(
        <View key={`row-${i}`} style={styles.recipeRow}>
          {rowRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onPress={handleRecipePress}
              onFavoritePress={handleFavoritePress}
            />
          ))}
        </View>
      );
    }
    
    return rows;
  }, [recipes, gridLayout, handleRecipePress, handleFavoritePress]);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + SPACING.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <SearchBar onPress={handleSearchPress} />

        {/* Categories ScrollMenu */}
        <ScrollMenu
          categories={CATEGORIES_DATA}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Inspiration Text */}
        <Text style={styles.inspirationText}>
          {inspirationText}
        </Text>

        {/* Recipe Grid */}
        <View style={styles.recipeGrid}>
          {renderRecipeGrid()}
        </View>

        {/* Bottom spacing for NavigationBar */}
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
  inspirationText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
    lineHeight: FONT_SIZE.LG + 2,
    marginLeft: COMPONENT_SPACING.GRID.HORIZONTAL_PADDING,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  recipeGrid: {
    paddingHorizontal: COMPONENT_SPACING.GRID.HORIZONTAL_PADDING,
    gap: SPACING.xl,
  },
  recipeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: COMPONENT_SPACING.GRID.SPACING,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});

export default HomeScreen; 