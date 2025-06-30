import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import RecipeCard from '../components/RecipeCard';
import NavigationBar from '../components/NavigationBar';
import ScreenHeader from '../components/ScreenHeader';
import { userAPI } from '../services/api';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW_PRESETS, COMPONENT_SPACING } from '../constants';

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
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'rating'>('recent');
  const [activeTab, setActiveTab] = useState<string>('favorites');
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [selectedRecipes, setSelectedRecipes] = useState<Set<string>>(new Set());

  // Backend favorites query
  const { 
    data: favoritesResponse, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['userFavorites'],
    queryFn: () => userAPI.getFavorites(1, 50), // Get all favorites for now
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Remove from favorites mutation
  const removeFavoriteMutation = useMutation({
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

  // Bulk remove favorites mutation
  const bulkRemoveFavoritesMutation = useMutation({
    mutationFn: userAPI.removeMultipleFavorites,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
      setSelectedRecipes(new Set());
      setIsSelectionMode(false);
      Toast.show({
        type: 'success',
        text1: 'Removed from favorites',
        text2: `${data.removed} recipe(s) removed successfully`,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to remove recipes from favorites',
      });
    },
  });

  const favoriteRecipes = favoritesResponse?.data || [];

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
      // Remove from favorites with API call
      removeFavoriteMutation.mutate(recipeId);
    }
  }, [isSelectionMode, removeFavoriteMutation]);

  const handleRecipePress = useCallback((recipe: Recipe) => {
    if (isSelectionMode) {
      // Seçim modunda sadece seçim yap
      handleFavoritePress(recipe.id);
    } else {
      // Normal modda tarif detayına git
      navigation?.navigate('RecipeDetail', { recipeId: recipe.id });
    }
  }, [navigation, isSelectionMode, handleFavoritePress]);

  const handleDeletePress = useCallback(() => {
    if (isSelectionMode) {
      // Delete selected recipes with API call
      if (selectedRecipes.size > 0) {
        bulkRemoveFavoritesMutation.mutate(Array.from(selectedRecipes));
      }
    } else {
      // Enter selection mode
      setIsSelectionMode(true);
    }
  }, [isSelectionMode, selectedRecipes, bulkRemoveFavoritesMutation]);

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
      case 'cheff':
        navigation?.navigate('Chat');
        break;
      case 'search':
        navigation?.navigate('Search');
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
  ), [cardWidth, cardSpacing, handleRecipePress, handleFavoritePress, selectedRecipes, isSelectionMode]);

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
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title={isSelectionMode ? `${selectedRecipes.size} Selected` : 'My Favorites'}
        onBackPress={() => navigation?.goBack()}
        backgroundColor={COLORS.background}
        rightElement={
          favoriteRecipes.length > 0 ? (
            <View style={styles.headerActions}>
              {isSelectionMode && (
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={handleCancelSelection}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={18} color={COLORS.textPrimary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.headerButton, isSelectionMode && selectedRecipes.size > 0 && styles.deleteButtonActive]}
                onPress={handleDeletePress}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons 
                  name={isSelectionMode ? "trash" : "trash-outline"} 
                  size={18} 
                  color={isSelectionMode && selectedRecipes.size > 0 ? COLORS.white : COLORS.textPrimary} 
                />
              </TouchableOpacity>
            </View>
          ) : undefined
        }
      />

      {favoriteRecipes.length > 0 && (
        <>
          {/* Stats and Sort - Fixed Position */}
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

      {/* Loading state */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyStateTitle}>Error loading favorites</Text>
          <Text style={styles.emptyStateText}>
            Please try again later
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => refetch()}
          >
            <Text style={styles.exploreButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {favoriteRecipes.length === 0 && !isLoading && !error && renderEmptyState()}

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

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingRight: SPACING.sm,
  },
  headerButton: {
    width: 36,
    height: 36,
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
    backgroundColor: COLORS.primary,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  loadingText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
});

export default React.memo(FavoritesScreen); 