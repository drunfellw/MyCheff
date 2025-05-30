import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { NavigationBar } from '../components';
import ScreenHeader from '../components/ScreenHeader';
import RecipeCard from '../components/RecipeCard';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW_PRESETS } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

interface Recipe {
  id: string;
  title?: string;
  category?: string;
  image?: string;
  time?: string;
  rating?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  ingredients?: string[];
  isFavorite?: boolean;
}

interface SearchScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

/**
 * SearchScreen Component - Recipe Search
 * 
 * Modern recipe search interface
 * Real-time search with 2-column grid layout
 * Backend-ready with clean API integration points
 */
const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  const searchInputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Mock recipes data - Backend'den gelecek
  const mockRecipes: Recipe[] = useMemo(() => [
    { 
      id: '1', 
      title: 'Chicken Alfredo Pasta', 
      category: 'Italian',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
      time: '25 min',
      rating: '4.8',
      difficulty: 'Medium',
      ingredients: ['Chicken', 'Pasta', 'Cream', 'Parmesan']
    },
    { 
      id: '2', 
      title: 'Margherita Pizza', 
      category: 'Italian',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
      time: '30 min',
      rating: '4.7',
      difficulty: 'Medium',
      ingredients: ['Dough', 'Tomato', 'Mozzarella', 'Basil']
    },
    { 
      id: '3', 
      title: 'Caesar Salad', 
      category: 'Salads',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      time: '15 min',
      rating: '4.5',
      difficulty: 'Easy',
      ingredients: ['Lettuce', 'Croutons', 'Parmesan', 'Caesar Dressing']
    },
    { 
      id: '4', 
      title: 'Beef Stir Fry', 
      category: 'Asian',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
      time: '20 min',
      rating: '4.6',
      difficulty: 'Easy',
      ingredients: ['Beef', 'Vegetables', 'Soy Sauce', 'Rice']
    },
    { 
      id: '5', 
      title: 'Chocolate Cake', 
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
      time: '60 min',
      rating: '4.9',
      difficulty: 'Hard',
      ingredients: ['Flour', 'Chocolate', 'Eggs', 'Sugar']
    },
    { 
      id: '6', 
      title: 'Greek Salad', 
      category: 'Mediterranean',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
      time: '10 min',
      rating: '4.4',
      difficulty: 'Easy',
      ingredients: ['Tomatoes', 'Cucumber', 'Feta', 'Olives']
    },
    { 
      id: '7', 
      title: 'Chicken Curry', 
      category: 'Indian',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      time: '40 min',
      rating: '4.7',
      difficulty: 'Medium',
      ingredients: ['Chicken', 'Curry Spices', 'Coconut Milk', 'Rice']
    },
    { 
      id: '8', 
      title: 'Fish Tacos', 
      category: 'Mexican',
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop',
      time: '25 min',
      rating: '4.6',
      difficulty: 'Medium',
      ingredients: ['Fish', 'Tortillas', 'Cabbage', 'Lime']
    },
  ], []);

  // Search functionality - Backend API call point
  const searchRecipes = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await recipeService.search(query);
      // setSearchResults(response.data);
      
      // Mock search simulation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filtered = mockRecipes.filter(recipe =>
        recipe.title?.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered);
      setShowResults(true);
      
      // Animate results appearance
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [mockRecipes, fadeAnim]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchRecipes(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchRecipes]);

  // Search recipes with selected ingredients
  const handleSearchRecipes = useCallback(() => {
    if (searchResults.length > 0) {
      navigation?.navigate('SearchResults', { 
        recipes: searchResults.map(r => r.title)
      });
    }
  }, [searchResults, navigation]);

  // Handle recipe press
  const handleRecipePress = useCallback((recipe: Recipe) => {
    navigation?.navigate('RecipeDetail', { recipeId: recipe.id });
  }, [navigation]);

  // Handle favorite press
  const handleFavoritePress = useCallback((recipeId: string) => {
    // TODO: Implement favorite functionality
    console.log('Favorite pressed:', recipeId);
  }, []);

  // Render recipe grid
  const renderRecipeGrid = useCallback(() => {
    const rows: React.ReactElement[] = [];
    const numColumns = 2;
    
    for (let i = 0; i < searchResults.length; i += numColumns) {
      const rowRecipes = searchResults.slice(i, i + numColumns);
      
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
  }, [searchResults, handleRecipePress, handleFavoritePress]);

  const handleTabPress = useCallback((tabId: string) => {
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

  // Render search result item
  const renderSearchResult = useCallback(({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSearchRecipes()}
      activeOpacity={0.7}
    >
      <View style={styles.resultContent}>
        <Text style={styles.resultName}>{item.title}</Text>
        <Text style={styles.resultCategory}>{item.category}</Text>
      </View>
      <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  ), [handleSearchRecipes]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="Search Recipes"
        onBackPress={() => navigation?.goBack()}
        backgroundColor={COLORS.background}
      />

      <View style={styles.content}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={22} color={COLORS.textMuted} />
            <TextInput
              ref={searchInputRef}
              style={styles.input}
              placeholder="Search recipes..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="words"
              autoCorrect={false}
              autoFocus={false}
              returnKeyType="search"
              blurOnSubmit={false}
            />
            
            {isLoading && (
              <View style={styles.loadingContainer}>
                <Ionicons name="hourglass" size={20} color={COLORS.textMuted} />
              </View>
            )}
            
            {searchQuery.length > 0 && !isLoading && (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search Results */}
        {showResults && (
          <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
            {searchResults.length > 0 ? (
              <View style={styles.recipeGrid}>
                {renderRecipeGrid()}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="search" size={48} color={COLORS.textMuted} />
                <Text style={styles.emptyText}>No recipes found</Text>
                <Text style={styles.emptySubtext}>Try a different search term</Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Empty State */}
        {!showResults && (
          <View style={styles.welcomeState}>
            <Ionicons name="restaurant-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.welcomeTitle}>Find Your Perfect Recipe</Text>
            <Text style={styles.welcomeSubtitle}>
              Search for delicious recipes by name or ingredient
            </Text>
          </View>
        )}
      </View>
      
      {/* Navigation Bar */}
      <NavigationBar
        activeTab="search"
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
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.LG,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
    minHeight: 52,
    ...SHADOW_PRESETS.SMALL,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.LG,
    color: COLORS.textPrimary,
    paddingVertical: 0,
    fontWeight: '400',
  },
  selectedList: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.ROUND,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    marginRight: SPACING.sm,
    gap: SPACING.xs,
  },
  selectedText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textPrimary,
  },
  resultsList: {
    padding: SPACING.md,
    paddingBottom: 100, // NavigationBar için extra padding
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  resultCategory: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
  },
  loadingContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  clearButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyText: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  welcomeState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  welcomeTitle: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  recipeRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  recipeGrid: {
    flex: 1,
    padding: SPACING.lg,
    paddingBottom: 100, // NavigationBar için extra padding
  },
});

export default React.memo(SearchScreen); 