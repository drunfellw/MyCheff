import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import RecipeCard from '../components/RecipeCard';
import NavigationBar from '../components/NavigationBar';
import FilterModal from '../components/FilterModal';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW_PRESETS } from '../constants';
import type { Recipe as ImportedRecipe, FilterOptions } from '../types';

interface Recipe {
  id: string;
  title?: string;
  time?: string;
  category?: string;
  image?: string;
  rating?: string;
  isFavorite?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

interface SearchResultsScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
  route?: {
    params?: {
      initialQuery?: string;
    };
  };
}

/**
 * SearchResultsScreen Component
 * 
 * Modern search results page with filtering
 * Real-time search with debounced input
 * Grid layout for recipe results
 */
const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>(route?.params?.initialQuery || '');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({
    categories: [],
    difficulty: [],
    cookingTime: [],
    dietary: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('search');

  // Mock search results - Backend'den gelecek
  const [searchResults, setSearchResults] = useState<Recipe[]>([
    {
      id: 'search-1',
      title: 'Mushroom Risotto',
      time: '35 min',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300&h=200&fit=crop',
      rating: '4.8',
      isFavorite: false,
    },
    {
      id: 'search-2',
      title: 'Chicken Alfredo',
      time: '25 min',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop',
      rating: '4.7',
      isFavorite: true,
    },
    {
      id: 'search-3',
      title: 'Caesar Salad',
      time: '10 min',
      category: 'Salad',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
      rating: '4.6',
      isFavorite: false,
    },
    {
      id: 'search-4',
      title: 'Chocolate Cake',
      time: '60 min',
      category: 'Dessert',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
      rating: '4.9',
      isFavorite: false,
    },
    {
      id: 'search-5',
      title: 'Greek Salad',
      time: '8 min',
      category: 'Salad',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
      rating: '4.5',
      isFavorite: true,
    },
    {
      id: 'search-6',
      title: 'Beef Steak',
      time: '20 min',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
      rating: '4.8',
      isFavorite: false,
    },
  ]);

  // Search functionality with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      // TODO: API call to search recipes
      // const results = await recipeService.searchRecipes(query, appliedFilters);
      // setSearchResults(results);
      
      // Mock search delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Searching for:', query);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [appliedFilters]);

  const handleFilterPress = useCallback(() => {
    setIsFilterModalVisible(true);
  }, []);

  // Convert FilterModal's FilterState to our FilterOptions
  const convertFilterStateToOptions = useCallback((filterState: any): FilterOptions => {
    return {
      categories: filterState.categories.filter((cat: any) => cat.isSelected).map((cat: any) => cat.name),
      difficulty: filterState.difficulty.filter((opt: any) => opt.isSelected).map((opt: any) => opt.value),
      cookingTime: filterState.cookingTime.filter((opt: any) => opt.isSelected).map((opt: any) => opt.value),
      dietary: filterState.dietary.filter((opt: any) => opt.isSelected).map((opt: any) => opt.value),
    };
  }, []);

  // Convert our FilterOptions to FilterModal's FilterState
  const convertOptionsToFilterState = useCallback((options: FilterOptions) => {
    return {
      categories: [
        { id: '1', name: 'Breakfast', icon: 'sunny', isSelected: options.categories.includes('Breakfast') },
        { id: '2', name: 'Lunch', icon: 'restaurant', isSelected: options.categories.includes('Lunch') },
        { id: '3', name: 'Dinner', icon: 'moon', isSelected: options.categories.includes('Dinner') },
        { id: '4', name: 'Snacks', icon: 'fast-food', isSelected: options.categories.includes('Snacks') },
        { id: '5', name: 'Desserts', icon: 'ice-cream', isSelected: options.categories.includes('Desserts') },
        { id: '6', name: 'Beverages', icon: 'wine', isSelected: options.categories.includes('Beverages') },
      ],
      difficulty: [
        { id: 'easy', label: 'Easy', value: 'easy', isSelected: options.difficulty.includes('easy') },
        { id: 'medium', label: 'Medium', value: 'medium', isSelected: options.difficulty.includes('medium') },
        { id: 'hard', label: 'Hard', value: 'hard', isSelected: options.difficulty.includes('hard') },
      ],
      cookingTime: [
        { id: 'quick', label: 'Under 15 min', value: '0-15', isSelected: options.cookingTime.includes('0-15') },
        { id: 'medium', label: '15-30 min', value: '15-30', isSelected: options.cookingTime.includes('15-30') },
        { id: 'long', label: '30+ min', value: '30+', isSelected: options.cookingTime.includes('30+') },
      ],
      dietary: [
        { id: 'vegetarian', label: 'Vegetarian', value: 'vegetarian', isSelected: options.dietary.includes('vegetarian') },
        { id: 'vegan', label: 'Vegan', value: 'vegan', isSelected: options.dietary.includes('vegan') },
        { id: 'gluten-free', label: 'Gluten Free', value: 'gluten-free', isSelected: options.dietary.includes('gluten-free') },
        { id: 'dairy-free', label: 'Dairy Free', value: 'dairy-free', isSelected: options.dietary.includes('dairy-free') },
      ],
    };
  }, []);

  const handleFilterApply = useCallback((filterState: any) => {
    const filterOptions = convertFilterStateToOptions(filterState);
    setAppliedFilters(filterOptions);
    setIsFilterModalVisible(false);
    
    // Re-search with new filters
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  }, [searchQuery, performSearch, convertFilterStateToOptions]);

  const handleRecipePress = useCallback((recipe: Recipe) => {
    navigation?.navigate('RecipeDetail', { recipe });
  }, [navigation]);

  const handleFavoritePress = useCallback((recipeId: string) => {
    setSearchResults(prevResults => 
      prevResults.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
    // TODO: API call to toggle favorite
    // await recipeService.toggleFavorite(recipeId);
  }, []);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(appliedFilters).reduce((count: number, filterArray: string[]) => count + filterArray.length, 0);
  }, [appliedFilters]);

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
        // Already on search screen
        break;
      case 'profile':
        navigation?.navigate('Profile');
        break;
    }
  }, [navigation]);

  // Grid layout calculations
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
      />
    </View>
  ), [cardWidth, cardSpacing, handleRecipePress, handleFavoritePress]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={64} color={COLORS.textMuted} />
      <Text style={styles.emptyStateTitle}>No recipes found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search or filters to find what you're looking for
      </Text>
    </View>
  ), []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          {/* Header with Search */}
          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <View style={styles.searchWrapper}>
                <Ionicons 
                  name="search" 
                  size={20} 
                  color={COLORS.textSecondary}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search recipes..."
                  placeholderTextColor={COLORS.textSecondary}
                  autoCorrect={false}
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  returnKeyType="search"
                  textContentType="none"
                  autoComplete="off"
                  enablesReturnKeyAutomatically={true}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setSearchQuery('')}
                  >
                    <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
              
              <TouchableOpacity
                style={styles.filterButton}
                onPress={handleFilterPress}
              >
                <Ionicons name="options" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Results */}
          <FlatList
            data={searchResults}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.resultsContainer}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.1}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
          />

          {/* Navigation Bar */}
          <NavigationBar
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />

          {/* Filter Modal */}
          <FilterModal
            visible={isFilterModalVisible}
            onClose={() => setIsFilterModalVisible(false)}
            onApply={handleFilterApply}
            initialFilters={convertOptionsToFilterState(appliedFilters)}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
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
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    paddingHorizontal: SPACING.md,
    height: 48,
    gap: SPACING.sm,
    ...SHADOW_PRESETS.SMALL,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW_PRESETS.SMALL,
  },
  filterButtonActive: {
    backgroundColor: COLORS.textPrimary,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.CIRCLE,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  resultsText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  clearFiltersText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.primary,
    fontWeight: '600',
  },
  recipeList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  recipeItemContainer: {
    marginBottom: SPACING.lg,
  },
  resultsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
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
  },
  clearButton: {
    padding: SPACING.sm,
  },
});

export default React.memo(SearchResultsScreen); 