import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW_PRESETS } from '../constants';

interface ChatScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

interface Ingredient {
  id: string;
  name: string;
  category: string;
}

/**
 * ChatScreen Component
 * 
 * Ingredient-based recipe assistant
 * Users can search and select ingredients to find matching recipes
 */
const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const searchInputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Mock ingredients data
  const mockIngredients: Ingredient[] = useMemo(() => [
    { id: '1', name: 'Chicken Breast', category: 'Protein' },
    { id: '2', name: 'Tomatoes', category: 'Vegetables' },
    { id: '3', name: 'Onions', category: 'Vegetables' },
    { id: '4', name: 'Garlic', category: 'Aromatics' },
    { id: '5', name: 'Rice', category: 'Grains' },
    { id: '6', name: 'Pasta', category: 'Grains' },
    { id: '7', name: 'Cheese', category: 'Dairy' },
    { id: '8', name: 'Eggs', category: 'Protein' },
    { id: '9', name: 'Milk', category: 'Dairy' },
    { id: '10', name: 'Bread', category: 'Grains' },
    { id: '11', name: 'Potatoes', category: 'Vegetables' },
    { id: '12', name: 'Carrots', category: 'Vegetables' },
    { id: '13', name: 'Bell Peppers', category: 'Vegetables' },
    { id: '14', name: 'Olive Oil', category: 'Oils' },
    { id: '15', name: 'Salt', category: 'Seasonings' },
    { id: '16', name: 'Black Pepper', category: 'Seasonings' },
    { id: '17', name: 'Butter', category: 'Dairy' },
    { id: '18', name: 'Lemon', category: 'Fruits' },
    { id: '19', name: 'Spinach', category: 'Vegetables' },
    { id: '20', name: 'Mushrooms', category: 'Vegetables' },
  ], []);

  // Search functionality
  const searchIngredients = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filtered = mockIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(query.toLowerCase()) &&
        !selectedIngredients.some(selected => selected.id === ingredient.id)
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
  }, [mockIngredients, selectedIngredients, fadeAnim]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchIngredients(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchIngredients]);

  // Add ingredient to selection
  const handleSelectIngredient = useCallback((ingredient: Ingredient) => {
    setSelectedIngredients(prev => [...prev, ingredient]);
    setSearchQuery('');
    setShowResults(false);
    fadeAnim.setValue(0);
  }, [fadeAnim]);

  // Remove ingredient from selection
  const handleRemoveIngredient = useCallback((ingredientId: string) => {
    setSelectedIngredients(prev => prev.filter(item => item.id !== ingredientId));
  }, []);

  // Navigate to search results
  const handleFindRecipes = useCallback(() => {
    if (selectedIngredients.length === 0) return;
    
    // Navigate to SearchResults with selected ingredients
    navigation?.navigate('SearchResults', { 
      ingredients: selectedIngredients.map(ing => ing.name) 
    });
  }, [selectedIngredients, navigation]);

  // Clear all selections
  const handleClearAll = useCallback(() => {
    setSelectedIngredients([]);
    setSearchQuery('');
    setShowResults(false);
  }, []);

  // Render search result item
  const renderSearchResult = useCallback(({ item }: { item: Ingredient }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSelectIngredient(item)}
      activeOpacity={0.7}
    >
      <View style={styles.resultContent}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultCategory}>{item.category}</Text>
      </View>
      <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  ), [handleSelectIngredient]);

  // Render selected ingredient chip
  const renderSelectedChip = useCallback(({ item }: { item: Ingredient }) => (
    <View style={styles.selectedChip}>
      <Text style={styles.chipText}>{item.name}</Text>
      <TouchableOpacity
        onPress={() => handleRemoveIngredient(item.id)}
        style={styles.chipRemove}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close" size={16} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  ), [handleRemoveIngredient]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Ingredient Assistant</Text>
          
          <View style={styles.headerSpacer} />
        </View>

        {/* Welcome Message Bubble */}
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeBubble}>
            <Text style={styles.welcomeText}>
              Hello! 👋 You can enter the ingredients you have available. I'll help you find amazing recipes based on what you have!
            </Text>
          </View>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search ingredients..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="search"
            />
            {isLoading && (
              <Ionicons name="hourglass" size={20} color={COLORS.textMuted} />
            )}
          </View>
        </View>

        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <View style={styles.selectedSection}>
            <View style={styles.selectedHeader}>
              <Text style={styles.selectedTitle}>
                Selected Ingredients ({selectedIngredients.length})
              </Text>
              <TouchableOpacity onPress={handleClearAll}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={selectedIngredients}
              renderItem={renderSelectedChip}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectedList}
              ItemSeparatorComponent={() => <View style={{ width: SPACING.sm }} />}
            />
          </View>
        )}

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Search Results */}
          {showResults && (
            <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.resultsList}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Ionicons name="search" size={48} color={COLORS.textMuted} />
                    <Text style={styles.emptyText}>No ingredients found</Text>
                    <Text style={styles.emptySubtext}>Try a different search term</Text>
                  </View>
                }
              />
            </Animated.View>
          )}

          {/* Empty State */}
          {!showResults && selectedIngredients.length === 0 && (
            <View style={styles.emptyWelcome}>
              <Ionicons name="restaurant-outline" size={64} color={COLORS.textMuted} />
              <Text style={styles.emptyWelcomeTitle}>Start Adding Ingredients</Text>
              <Text style={styles.emptyWelcomeText}>
                Search and select ingredients you have to discover amazing recipes
              </Text>
            </View>
          )}
        </View>

        {/* Find Recipes Button */}
        {selectedIngredients.length > 0 && (
          <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + SPACING.md }]}>
            <TouchableOpacity
              style={styles.findRecipesButton}
              onPress={handleFindRecipes}
              activeOpacity={0.8}
            >
              <Ionicons name="restaurant" size={20} color={COLORS.white} />
              <Text style={styles.findRecipesButtonText}>
                Find Recipes ({selectedIngredients.length} ingredients)
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
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
  headerSpacer: {
    width: 40,
  },
  welcomeContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  welcomeBubble: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.lg,
    ...SHADOW_PRESETS.MEDIUM,
  },
  welcomeText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
    ...SHADOW_PRESETS.MEDIUM,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  selectedSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  selectedTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  clearText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.primary,
    fontWeight: '500',
  },
  selectedList: {
    paddingVertical: SPACING.sm,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    ...SHADOW_PRESETS.SMALL,
  },
  chipText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  chipRemove: {
    padding: SPACING.xs,
  },
  mainContent: {
    flex: 1,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsList: {
    padding: SPACING.lg,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW_PRESETS.SMALL,
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  resultCategory: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
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
  emptyWelcome: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyWelcomeTitle: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptyWelcomeText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  findRecipesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.LG,
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOW_PRESETS.MEDIUM,
  },
  findRecipesButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default React.memo(ChatScreen); 