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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenHeader from '../components/ScreenHeader';
import RecipeCard from '../components/RecipeCard';
import NavigationBar from '../components/NavigationBar';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, FONT_FAMILY, COMPONENT_SPACING } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

// Storage keys
const STORAGE_KEYS = {
  SELECTED_INGREDIENTS: '@chef_assistant_selected_ingredients',
  RECIPES: '@chef_assistant_recipes',
};

interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  category: string;
  aliases?: string[];
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

// Sample ingredients data
const INGREDIENTS_DATA: Ingredient[] = [
  { id: '1', name: 'Tomato', emoji: '🍅', category: 'vegetables', aliases: ['tomato', 'domates'] },
  { id: '2', name: 'Garlic', emoji: '🧄', category: 'vegetables', aliases: ['garlic', 'sarımsak'] },
  { id: '3', name: 'Onion', emoji: '🧅', category: 'vegetables', aliases: ['onion', 'soğan'] },
  { id: '4', name: 'Bread', emoji: '🥖', category: 'grains', aliases: ['bread', 'ekmek'] },
  { id: '5', name: 'Chicken', emoji: '🍗', category: 'proteins', aliases: ['chicken', 'tavuk'] },
  { id: '6', name: 'Carrot', emoji: '🥕', category: 'vegetables', aliases: ['carrot', 'havuç'] },
  { id: '7', name: 'Cucumber', emoji: '🥒', category: 'vegetables', aliases: ['cucumber', 'salatalık'] },
  { id: '8', name: 'Pepper', emoji: '🌶️', category: 'spices', aliases: ['pepper', 'biber'] },
  { id: '9', name: 'Potato', emoji: '🥔', category: 'vegetables', aliases: ['potato', 'patates'] },
  { id: '10', name: 'Cheese', emoji: '🧀', category: 'dairy', aliases: ['cheese', 'peynir'] },
  { id: '11', name: 'Egg', emoji: '🥚', category: 'proteins', aliases: ['egg', 'yumurta'] },
  { id: '12', name: 'Rice', emoji: '🍚', category: 'grains', aliases: ['rice', 'pirinç'] },
  { id: '13', name: 'Pasta', emoji: '🍝', category: 'grains', aliases: ['pasta', 'makarna'] },
  { id: '14', name: 'Bell Pepper', emoji: '🫑', category: 'vegetables', aliases: ['bell pepper', 'dolmalık biber'] },
  { id: '15', name: 'Mushroom', emoji: '🍄', category: 'vegetables', aliases: ['mushroom', 'mantar'] },
  { id: '16', name: 'Spinach', emoji: '🥬', category: 'vegetables', aliases: ['spinach', 'ıspanak'] },
  { id: '17', name: 'Beef', emoji: '🥩', category: 'proteins', aliases: ['beef', 'et'] },
  { id: '18', name: 'Fish', emoji: '🐟', category: 'proteins', aliases: ['fish', 'balık'] },
  { id: '19', name: 'Milk', emoji: '🥛', category: 'dairy', aliases: ['milk', 'süt'] },
  { id: '20', name: 'Butter', emoji: '🧈', category: 'dairy', aliases: ['butter', 'tereyağı'] },
];

// Sample recipes data with images
const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Tomato Pasta',
    category: 'Italian Cuisine',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
    time: '20 min',
    rating: '4.8',
    isFavorite: false,
    name: 'Tomato Pasta',
    emoji: '🍝',
    description: 'Classic Italian tomato pasta with fresh herbs',
    cookingTime: '20 min',
    difficulty: 'Easy',
    requiredIngredients: ['Pasta', 'Tomato', 'Garlic', 'Onion'],
  },
  {
    id: '2',
    title: 'Chicken Rice',
    category: 'Asian Cuisine',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    time: '45 min',
    rating: '4.6',
    isFavorite: false,
    name: 'Chicken Rice',
    emoji: '🍚',
    description: 'Delicious chicken rice with vegetables',
    cookingTime: '45 min',
    difficulty: 'Medium',
    requiredIngredients: ['Rice', 'Chicken', 'Onion', 'Carrot'],
  },
  {
    id: '3',
    title: 'Mixed Salad',
    category: 'Healthy Food',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    time: '10 min',
    rating: '4.4',
    isFavorite: false,
    name: 'Mixed Salad',
    emoji: '🥗',
    description: 'Fresh and healthy mixed vegetable salad',
    cookingTime: '10 min',
    difficulty: 'Easy',
    requiredIngredients: ['Tomato', 'Cucumber', 'Onion'],
  },
  {
    id: '4',
    title: 'Scrambled Eggs',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
    time: '15 min',
    rating: '4.7',
    isFavorite: false,
    name: 'Scrambled Eggs',
    emoji: '🍳',
    description: 'Traditional Turkish breakfast scrambled eggs',
    cookingTime: '15 min',
    difficulty: 'Easy',
    requiredIngredients: ['Egg', 'Tomato', 'Pepper', 'Onion'],
  },
  {
    id: '5',
    title: 'Mushroom Omelet',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    time: '12 min',
    rating: '4.5',
    isFavorite: false,
    name: 'Mushroom Omelet',
    emoji: '🥚',
    description: 'Protein-rich mushroom omelet with cheese',
    cookingTime: '12 min',
    difficulty: 'Easy',
    requiredIngredients: ['Egg', 'Mushroom', 'Cheese'],
  },
  {
    id: '6',
    title: 'Beef Steak',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    time: '25 min',
    rating: '4.9',
    isFavorite: false,
    name: 'Beef Steak',
    emoji: '🥩',
    description: 'Juicy grilled beef steak with herbs',
    cookingTime: '25 min',
    difficulty: 'Medium',
    requiredIngredients: ['Beef', 'Garlic', 'Butter'],
  },
];

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

  // Ingredient search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText.length >= 2) {
        const filtered = INGREDIENTS_DATA.filter(ingredient => {
          const isAlreadySelected = selectedIngredients.some(selected => selected.id === ingredient.id);
          if (isAlreadySelected) return false;

          const searchTerm = inputText.toLowerCase();
          const nameMatch = ingredient.name.toLowerCase().includes(searchTerm);
          const aliasMatch = ingredient.aliases?.some(alias => 
            alias.toLowerCase().includes(searchTerm)
          );
          
          return nameMatch || aliasMatch;
        }).slice(0, 5);

        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputText, selectedIngredients]);

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

  // Get recipe suggestions
  const getRecipeSuggestions = (ingredients: Ingredient[]): Recipe[] => {
    const ingredientNames = ingredients.map(ing => ing.name);
    
    return SAMPLE_RECIPES
      .map(recipe => {
        const matchingIngredients = recipe.requiredIngredients?.filter(req => 
          ingredientNames.some(ing => ing.toLowerCase() === req.toLowerCase())
        ) || [];
        
        const missingIngredients = recipe.requiredIngredients?.filter(req => 
          !ingredientNames.some(ing => ing.toLowerCase() === req.toLowerCase())
        ) || [];
        
        return {
          ...recipe,
          matchScore: matchingIngredients.length,
          missingIngredients,
        };
      })
      .filter(recipe => recipe.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  // Get recipes
  const handleGetRecipes = () => {
    if (selectedIngredients.length === 0) {
      Alert.alert('Warning', 'Please select at least one ingredient.');
      return;
    }

    // Close keyboard
    Keyboard.dismiss();
    setIsLoading(true);
    
    setTimeout(() => {
      const suggestedRecipes = getRecipeSuggestions(selectedIngredients);
      setRecipes(suggestedRecipes);
      setIsLoading(false);
    }, 1000);
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

  return (
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
            <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search ingredients (e.g. tomato, onion)..."
              placeholderTextColor={COLORS.textMuted}
              value={inputText}
              onChangeText={setInputText}
              autoFocus={false}
              returnKeyType="search"
            />
            {inputText.length > 0 && (
              <TouchableOpacity 
                onPress={() => setInputText('')}
                style={styles.clearInputButton}
              >
                <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
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
    paddingVertical: SPACING.md,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
    color: COLORS.textMuted,
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
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
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
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
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
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxxl,
  },
  chefHatContainer: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.primary,
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chefHat: {
    fontSize: 60,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.REGULAR,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  welcomeState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxxl,
  },
  welcomeTitle: {
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.REGULAR,
    textAlign: 'center',
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
    height: 3,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
    marginHorizontal: SPACING.lg,
  },
});

export default ChatScreen; 