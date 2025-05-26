import React, { useState } from 'react';
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
import { COLORS, SPACING, FONT_SIZE, DEFAULTS } from '../constants';
import { CATEGORIES_DATA } from '../services/mockData';
import type { Recipe } from '../types';

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
 * Ana sayfa ekranı - Figma tasarımına tam uygun
 * SearchBar, kategoriler, tarif kartları ve navigation bar içerir
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('1'); // Breakfast seçili
  const [activeTab, setActiveTab] = useState<string>('home');
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: 'recipe-1',
      title: 'Soğuk Amerikano',
      time: '3 min',
      category: 'Beverages',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop',
      rating: 4.8,
      isFavorite: false,
    },
    {
      id: 'recipe-2', 
      title: 'Pancake Stack',
      time: '15 min',
      category: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
      rating: 4.9,
      isFavorite: true,
    },
    {
      id: 'recipe-3',
      title: 'Avocado Toast',
      time: '5 min', 
      category: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&h=200&fit=crop',
      rating: 4.7,
      isFavorite: false,
    },
    {
      id: 'recipe-4',
      title: 'French Omelette',
      time: '8 min',
      category: 'Breakfast', 
      image: 'https://images.unsplash.com/photo-1582169296194-754c5a464303?w=300&h=200&fit=crop',
      rating: 4.6,
      isFavorite: false,
    },
    {
      id: 'recipe-5',
      title: 'Berry Smoothie',
      time: '2 min',
      category: 'Beverages',
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=300&h=200&fit=crop', 
      rating: 4.8,
      isFavorite: true,
    },
    {
      id: 'recipe-6',
      title: 'Granola Bowl',
      time: '5 min',
      category: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
      rating: 4.5,
      isFavorite: false,
    }
  ]);
  const insets = useSafeAreaInsets();

  // Recipe grid için layout hesaplama
  const numColumns = 2;
  const cardSpacing = SPACING.lg;
  const horizontalPadding = SPACING.lg * 2;
  const availableWidth = screenWidth - horizontalPadding - cardSpacing;
  const cardWidth = availableWidth / numColumns;

  const handleSearchPress = (): void => {
    // SearchScreen'e yönlendir
    navigation?.navigate('Search');
  };

  const handleCategorySelect = (categoryId: string): void => {
    setSelectedCategory(categoryId);
    console.log('Category selected:', categoryId);
  };

  const handleRecipePress = (recipe: Recipe): void => {
    console.log('Recipe pressed:', recipe.title);
  };

  const handleFavoritePress = (recipeId: string): void => {
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
    console.log('Favorite toggled for recipe:', recipeId);
  };

  const handleTabPress = (tabId: string): void => {
    setActiveTab(tabId);
    console.log('Tab pressed:', tabId);
  };

  // Seçili kategoriye göre inspiration text
  const selectedCategoryData = CATEGORIES_DATA.find(cat => cat.id === selectedCategory);
  const categoryName = selectedCategoryData?.name?.toLowerCase() || 'breakfast';
  const inspirationText = `${DEFAULTS.INSPIRATION_TEXT.COUNT} types of ${categoryName} ${DEFAULTS.INSPIRATION_TEXT.SUFFIX}`;

  const renderRecipeGrid = () => {
    const rows = [];
    
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
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // NavigationBar için space
  },
  inspirationText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginLeft: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  recipeGrid: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xl,
  },
  recipeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});

export default HomeScreen; 