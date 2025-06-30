import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  Alert,
  Keyboard,
  SafeAreaView,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenHeader from '../components/ScreenHeader';
import RecipeCard from '../components/RecipeCard';
import NavigationBar from '../components/NavigationBar';
import { ingredientAPI, recipeAPI } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, FONT_FAMILY, COMPONENT_SPACING, SHADOW_PRESETS } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

// Storage keys
const STORAGE_KEYS = {
  SELECTED_INGREDIENTS: '@chef_assistant_selected_ingredients',
  RECIPES: '@chef_assistant_recipes',
};

interface Ingredient {
  id: string;
  name: string;
  emoji?: string;
  category?: string;
  aliases?: string[];
  slug?: string;
  imageUrl?: string;
}

interface Recipe {
  id: string;
  title?: string;
  category?: string;
  image?: string;
  time?: string;
  rating?: string;
  isFavorite?: boolean;
  name?: string;
  emoji?: string;
  description?: string;
  cookingTime?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  requiredIngredients?: string[];
  missingIngredients?: string[];
  matchScore?: number;
}

interface Props {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

// All data will come from backend - no more mock data!

const ChatScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  
  const [inputText, setInputText] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('cheff');
  const [searchQuery, setSearchQuery] = useState('');

  // Backend'den tüm ingredient'ları çek
  const { data: allIngredients = [], isLoading: isLoadingIngredients } = useQuery({
    queryKey: ['ingredients'],
    queryFn: () => ingredientAPI.getAllIngredients(),
    staleTime: 5 * 60 * 1000, // 5 dakika cache
  });

  // Search ingredient'ları
  const { data: searchedIngredients = [], isFetching: isSearching } = useQuery({
    queryKey: ['ingredientSearch', searchQuery],
    queryFn: () => ingredientAPI.searchIngredients(searchQuery, 10),
    enabled: searchQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 dakika cache
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

  // Load persisted data on component mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  // Save data whenever selectedIngredients or recipes change
  useEffect(() => {
    saveSelectedIngredients();
  }, [selectedIngredients]);

  useEffect(() => {
    saveRecipes();
  }, [recipes]);

  // Load persisted data
  const loadPersistedData = async () => {
    try {
      const [savedIngredients, savedRecipes] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_INGREDIENTS),
        AsyncStorage.getItem(STORAGE_KEYS.RECIPES),
      ]);

      if (savedIngredients) {
        setSelectedIngredients(JSON.parse(savedIngredients));
      }

      if (savedRecipes) {
        setRecipes(JSON.parse(savedRecipes));
      }
    } catch (error) {
      console.error('Error loading persisted data:', error);
    }
  };

  // Save selected ingredients
  const saveSelectedIngredients = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SELECTED_INGREDIENTS,
        JSON.stringify(selectedIngredients)
      );
    } catch (error) {
      console.error('Error saving selected ingredients:', error);
    }
  };

  // Save recipes
  const saveRecipes = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.RECIPES,
        JSON.stringify(recipes)
      );
    } catch (error) {
      console.error('Error saving recipes:', error);
    }
  };

  // Clear all data
  const handleClearAll = async () => {
    setSelectedIngredients([]);
    setRecipes([]);
    setInputText('');
    setShowSuggestions(false);
    
    // Clear from storage
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.SELECTED_INGREDIENTS),
        AsyncStorage.removeItem(STORAGE_KEYS.RECIPES),
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  // Backend ingredient search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText.length >= 2) {
        setSearchQuery(inputText);
      } else {
        setShowSuggestions(false);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputText]);

  // Update suggestions when backend search results change
  useEffect(() => {
    if (searchedIngredients && searchedIngredients.length > 0) {
      // Filter out already selected ingredients
      const filtered = searchedIngredients.filter(ingredient => 
        !selectedIngredients.some(selected => selected.id === ingredient.id)
      );
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else if (searchQuery.length >= 2) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchedIngredients, selectedIngredients, searchQuery]);

  // Select ingredient
  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredients(prev => [...prev, ingredient]);
    setInputText('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Remove ingredient
  const handleRemoveIngredient = (id: string) => {
    setSelectedIngredients(prev => prev.filter(item => item.id !== id));
  };

  // Get recipe suggestions from backend using ingredient matching
  const getRecipeSuggestions = async (ingredients: Ingredient[]): Promise<Recipe[]> => {
    try {
      const ingredientIds = ingredients.map(ing => ing.id);
      
      console.log('🔍 Getting recipe suggestions for ingredients:', ingredientIds);
      
      // Use new backend ingredient matching endpoint
      const matchingResults = await recipeAPI.getRecipesByIngredients({
        ingredientIds,
        minMatchPercentage: 25, // Lower threshold for better results
        includePartialMatches: true,
        page: 1,
        limit: 20,
      });
      
      if (matchingResults.data && matchingResults.data.length > 0) {
        console.log(`✅ Found ${matchingResults.data.length} matching recipes`);
        
        // Convert to Recipe format with additional matching info
        return matchingResults.data.map(recipe => ({
          ...recipe,
          time: `${recipe.cookingTime || recipe.cookingTimeMinutes || 30} min`,
          rating: recipe.averageRating?.toString() || '4.5',
          category: 'Main Course',
          image: recipe.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
          // Include matching information for display
          matchScore: recipe.matchingIngredientsCount || 0,
          matchPercentage: recipe.matchPercentage || 0,
          missingIngredients: recipe.missingIngredients || [],
          matchingIngredients: recipe.matchingIngredients || [],
        }));
      }
      
      // Fallback to featured recipes if no matches
      console.log('📋 No ingredient matches found, falling back to featured recipes');
      const featuredResults = await recipeAPI.getFeaturedRecipes(1, 10);
      return featuredResults.data?.map(recipe => ({
        ...recipe,
        time: `${recipe.cookingTime || recipe.cookingTimeMinutes || 30} min`,
        rating: recipe.averageRating?.toString() || '4.5',
        category: recipe.categories?.[0]?.name || 'Main Course',
        image: recipe.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        matchScore: 0,
        matchPercentage: 0,
      })) || [];
      
    } catch (error) {
      console.error('Error fetching recipe suggestions:', error);
      
      // Return empty array if all backend requests fail
      console.log('❌ All backend requests failed, returning empty array');
      return [];
    }
  };

  // Get recipes from backend
  const handleGetRecipes = async () => {
    if (selectedIngredients.length === 0) {
      Alert.alert('Warning', 'Please select at least one ingredient.');
      return;
    }

    // Close keyboard
    Keyboard.dismiss();
    setIsLoading(true);
    
    try {
      const suggestedRecipes = await getRecipeSuggestions(selectedIngredients);
      setRecipes(suggestedRecipes);
    } catch (error) {
      console.error('Error getting recipe suggestions:', error);
      Alert.alert('Error', 'Failed to get recipe suggestions. Please try again.');
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle recipe press
  const handleRecipePress = useCallback((recipe: Recipe) => {
    navigation?.navigate('RecipeDetail', { recipeId: recipe.id });
  }, [navigation]);

  // Handle favorite press
  const handleFavoritePress = useCallback((recipeId: string) => {
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
  }, []);

  // Render recipe grid
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

  // Handle tab press
  const handleTabPress = useCallback((tabId: string) => {
    setActiveTab(tabId);
    
    switch (tabId) {
      case 'home':
        navigation?.navigate('Home');
        break;
      case 'cheff':
        // Already on chat screen
        break;
      case 'search':
        navigation?.navigate('Search');
        break;
      case 'profile':
        navigation?.navigate('Profile');
        break;
    }
  }, [navigation]);

  const handleInputChange = useCallback((text: string) => {
    setInputText(text);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <ScreenHeader
            title="Chef Assistant"
            onBackPress={() => navigation?.goBack()}
            backgroundColor={COLORS.background}
            rightElement={
              (selectedIngredients.length > 0 || recipes.length > 0) ? (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={handleClearAll}
                >
                  <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
              ) : undefined
            }
          />

          {/* Search Input */}
          <View style={styles.searchSection}>
            <View style={styles.searchRow}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
                <TextInput
                  ref={inputRef}
                  style={styles.searchInput}
                  placeholder="Search ingredients (e.g. tomato, onion)..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={inputText}
                  onChangeText={handleInputChange}
                  autoFocus={false}
                  returnKeyType="search"
                  autoCorrect={false}
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  textContentType="none"
                  autoComplete="off"
                  onSubmitEditing={() => {
                    if (suggestions.length > 0) {
                      handleSelectIngredient(suggestions[0]);
                    }
                  }}
                />
                {inputText.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => setInputText('')}
                    style={styles.clearInputButton}
                  >
                    <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Get Recipes Button */}
              {selectedIngredients.length > 0 && (
                <TouchableOpacity 
                  style={styles.getRecipesButton}
                  onPress={handleGetRecipes}
                  disabled={isLoading}
                >
                  <Text style={styles.getRecipesButtonText}>
                    {isLoading ? 'Loading...' : 'Get Recipes'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Suggestions */}
            {showSuggestions && (
              <View style={styles.suggestionsContainer}>
                {suggestions.map((item) => (
                  <TouchableOpacity 
                    key={item.id}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectIngredient(item)}
                  >
                    <Text style={styles.suggestionText}>{item.name}</Text>
                    <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Selected Ingredients */}
          {selectedIngredients.length > 0 && (
            <View style={styles.selectedSection}>
              <Text style={styles.selectedTitle}>Selected Ingredients ({selectedIngredients.length})</Text>
              <View style={styles.ingredientsContainer}>
                {selectedIngredients.map((ingredient) => (
                  <View key={ingredient.id} style={styles.ingredientChip}>
                    <Text style={styles.ingredientText}>{ingredient.name}</Text>
                    <TouchableOpacity 
                      onPress={() => handleRemoveIngredient(ingredient.id)}
                      style={styles.chipRemove}
                    >
                      <Ionicons name="close" size={14} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={styles.sectionDivider} />
            </View>
          )}

          {/* Content */}
          <ScrollView 
            style={styles.content} 
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {recipes.length > 0 ? (
              <View style={styles.recipesSection}>
                <Text style={styles.recipesSectionTitle}>
                  {recipes.length} Recipe{recipes.length > 1 ? 's' : ''} Found
                </Text>
                
                {/* Recipe Grid */}
                <View style={styles.recipeGrid}>
                  {renderRecipeGrid()}
                </View>
              </View>
            ) : selectedIngredients.length > 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.chefHatContainer}>
                  <Text style={styles.chefHat}>👨‍🍳</Text>
                </View>
                <Text style={styles.emptyStateTitle}>Click "Get Recipes"</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Let's see what you can make with {selectedIngredients.length} ingredient{selectedIngredients.length > 1 ? 's' : ''}!
                </Text>
              </View>
            ) : (
              <View style={styles.welcomeState}>
                <View style={styles.chefHatContainer}>
                  <Text style={styles.chefHat}>👨‍🍳</Text>
                </View>
                <Text style={styles.welcomeTitle}>Search Ingredients</Text>
                <Text style={styles.welcomeSubtitle}>
                  Find and select ingredients from your kitchen to discover personalized recipes
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Navigation Bar */}
          <NavigationBar
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Search Section
  searchSection: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.XL,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
    fontFamily: FONT_FAMILY.REGULAR,
  },
  clearInputButton: {
    padding: SPACING.xs,
  },
  
  // Get Recipes Button
  getRecipesButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.LG,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minWidth: 120,
  },
  getRecipesButtonText: {
    fontSize: FONT_SIZE.SM,
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.white,
    textAlign: 'center',
  },
  
  // Suggestions
  suggestionsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.MD,
    marginTop: SPACING.sm,
    ...SHADOW_PRESETS.SMALL,
    elevation: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  suggestionText: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
    fontFamily: FONT_FAMILY.REGULAR,
  },
  
  // Selected Ingredients
  selectedSection: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  selectedTitle: {
    fontSize: FONT_SIZE.SM,
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    gap: SPACING.sm,
  },
  ingredientText: {
    fontSize: FONT_SIZE.SM,
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.white,
  },
  chipRemove: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
    paddingBottom: COMPONENT_SPACING.NAVIGATION.HEIGHT + SPACING.lg,
  },
  
  // Recipes Section
  recipesSection: {
  },
  recipesSectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontFamily: FONT_FAMILY.BOLD,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  
  // Recipe Grid
  recipeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  recipeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  
  // Empty States
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  chefHatContainer: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.ROUND,
    padding: SPACING.lg,
    ...SHADOW_PRESETS.LARGE,
    elevation: 8,
  },
  chefHat: {
    fontSize: 60,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT_FAMILY.BOLD,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: FONT_SIZE.MD,
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.xl,
  },
  
  welcomeState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  welcomeTitle: {
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT_FAMILY.BOLD,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: FONT_SIZE.MD,
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
    lineHeight: 22,
  },
   
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xs,
    gap: SPACING.xs,
  },
  clearButtonText: {
    fontSize: FONT_SIZE.SM,
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.error,
  },
  
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: SPACING.md,
  },
});

export default ChatScreen; 