import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RecipeCard from '../components/RecipeCard';
import NavigationBar from '../components/NavigationBar';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW_PRESETS } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

interface Recipe {
  id: string;
  title?: string;
  time?: string;
  category?: string;
  image?: string;
  rating?: string;
  isFavorite?: boolean;
}

interface FavoritesScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

/**
 * FavoritesScreen Component
 * 
 * Modern favorites page with recipe management
 * Grid layout with empty state
 * Swipe actions for quick management
 */
const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'rating'>('recent');
  const [activeTab, setActiveTab] = useState<string>('favorites');
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [selectedRecipes, setSelectedRecipes] = useState<Set<string>>(new Set());

  // Mock favorite recipes - Backend'den gelecek
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([
    {
      id: 'fav-1',
      title: 'Mushroom Risotto',
      time: '35 min',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300&h=200&fit=crop',
      rating: '4.8',
      isFavorite: true,
    },
    {
      id: 'fav-2',
      title: 'Chicken Alfredo',
      time: '25 min',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop',
      rating: '4.7',
      isFavorite: true,
    },
    {
      id: 'fav-3',
      title: 'Berry Smoothie',
      time: '2 min',
      category: 'Beverages',
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=300&h=200&fit=crop',
      rating: '4.8',
      isFavorite: true,
    },
    {
      id: 'fav-4',
      title: 'Pancake Stack',
      time: '15 min',
      category: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
      rating: '4.9',
      isFavorite: true,
    },
    {
      id: 'fav-5',
      title: 'Greek Salad',
      time: '8 min',
      category: 'Salad',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
      rating: '4.5',
      isFavorite: true,
    },
  ]);

  // Sort recipes based on selected option
  const sortedRecipes = useMemo(() => {
    const recipes = [...favoriteRecipes];
    switch (sortBy) {
      case 'name':
        return recipes.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'rating':
        return recipes.sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'));
      case 'recent':
      default:
        return recipes; // Assume already sorted by recent
    }
  }, [favoriteRecipes, sortBy]);

  const handleRecipePress = useCallback((recipe: Recipe) => {
    navigation?.navigate('RecipeDetail', { recipe });
  }, [navigation]);

  const handleFavoritePress = useCallback((recipeId: string) => {
    if (isSelectionMode) {
      // Toggle selection
      setSelectedRecipes(prev => {
        const newSet = new Set(prev);
        if (newSet.has(recipeId)) {
          newSet.delete(recipeId);
        } else {
          newSet.add(recipeId);
        }
        return newSet;
      });
    } else {
      // Remove from favorites immediately
      setFavoriteRecipes(prevRecipes => 
        prevRecipes.filter(recipe => recipe.id !== recipeId)
      );
      // TODO: API call to remove from favorites
      // await recipeService.removeFavorite(recipeId);
    }
  }, [isSelectionMode]);

  const handleDeletePress = useCallback(() => {
    if (isSelectionMode) {
      // Delete selected recipes
      setFavoriteRecipes(prevRecipes => 
        prevRecipes.filter(recipe => !selectedRecipes.has(recipe.id))
      );
      setSelectedRecipes(new Set());
      setIsSelectionMode(false);
      // TODO: API call to remove selected favorites
      // await recipeService.removeMultipleFavorites(Array.from(selectedRecipes));
    } else {
      // Enter selection mode
      setIsSelectionMode(true);
    }
  }, [isSelectionMode, selectedRecipes]);

  const handleCancelSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedRecipes(new Set());
  }, []);

  const handleTabPress = useCallback((tabId: string) => {
    setActiveTab(tabId);
    
    switch (tabId) {
      case 'home':
        navigation?.navigate('Home');
        break;
      case 'search':
        navigation?.navigate('SearchResults');
        break;
      case 'favorites':
        // Already on favorites screen
        break;
      case 'profile':
        navigation?.navigate('Profile');
        break;
    }
  }, [navigation]);

  // Grid layout calculations - Always 2 columns
  const numColumns = 2;
  const cardSpacing = SPACING.lg;
  const horizontalPadding = SPACING.lg * 2;
  const availableWidth = screenWidth - horizontalPadding - cardSpacing;
  const cardWidth = availableWidth / numColumns;

  const renderRecipeItem = useCallback(({ item, index }: { item: Recipe; index: number }) => (
    <View style={[
      styles.recipeItemContainer,
      { width: cardWidth },
      index % 2 === 0 ? { marginRight: cardSpacing } : {}
    ]}>
      <RecipeCard
        recipe={item}
        onPress={handleRecipePress}
        onFavoritePress={handleFavoritePress}
        isSelected={selectedRecipes.has(item.id)}
        isSelectionMode={isSelectionMode}
      />
    </View>
  ), [cardWidth, cardSpacing, handleRecipePress, handleFavoritePress]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Ionicons name="heart-outline" size={64} color={COLORS.textMuted} />
      <Text style={styles.emptyStateTitle}>No favorites yet</Text>
      <Text style={styles.emptyStateText}>
        Start adding recipes to your favorites to see them here
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation?.navigate('Search')}
      >
        <Text style={styles.exploreButtonText}>Explore Recipes</Text>
      </TouchableOpacity>
    </View>
  ), [navigation]);

  const renderSortOption = useCallback((option: 'recent' | 'name' | 'rating', label: string) => (
    <TouchableOpacity
      key={option}
      style={[styles.sortOption, sortBy === option && styles.sortOptionActive]}
      onPress={() => setSortBy(option)}
    >
      <Text style={[styles.sortOptionText, sortBy === option && styles.sortOptionTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  ), [sortBy]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {isSelectionMode ? `${selectedRecipes.size} Selected` : 'My Favorites'}
        </Text>
        
        <View style={styles.headerActions}>
          {favoriteRecipes.length > 0 && (
            <>
              {isSelectionMode && (
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={handleCancelSelection}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.headerButton, isSelectionMode && selectedRecipes.size > 0 && styles.deleteButtonActive]}
                onPress={handleDeletePress}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons 
                  name={isSelectionMode ? "trash" : "trash-outline"} 
                  size={20} 
                  color={isSelectionMode && selectedRecipes.size > 0 ? COLORS.white : COLORS.textPrimary} 
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {favoriteRecipes.length > 0 && (
        <>
          {/* Stats and Sort */}
          <View style={styles.controlsContainer}>
            <Text style={styles.statsText}>
              {favoriteRecipes.length} recipe{favoriteRecipes.length !== 1 ? 's' : ''}
            </Text>
            
            <View style={styles.sortContainer}>
              {renderSortOption('recent', 'Recent')}
              {renderSortOption('name', 'Name')}
              {renderSortOption('rating', 'Rating')}
            </View>
          </View>

          {/* Recipe List */}
          <FlatList
            data={sortedRecipes}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            key={`grid-${numColumns}`} // Force re-render on layout change
            contentContainerStyle={styles.recipeList}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.1}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        </>
      )}

      {favoriteRecipes.length === 0 && renderEmptyState()}

      {/* Navigation Bar */}
      <NavigationBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW_PRESETS.SMALL,
  },
  headerTitle: {
    fontSize: FONT_SIZE.XL,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW_PRESETS.SMALL,
  },
  deleteButtonActive: {
    backgroundColor: COLORS.primary,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  statsText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  sortContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.xs,
    ...SHADOW_PRESETS.SMALL,
  },
  sortOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.MD,
  },
  sortOptionActive: {
    backgroundColor: COLORS.textPrimary,
  },
  sortOptionText: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  sortOptionTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  recipeList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  recipeItemContainer: {
    marginBottom: SPACING.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZE.XL,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  exploreButton: {
    backgroundColor: COLORS.textPrimary,
    borderRadius: BORDER_RADIUS.LG,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    ...SHADOW_PRESETS.MEDIUM,
  },
  exploreButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default React.memo(FavoritesScreen); 