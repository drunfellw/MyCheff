import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW_PRESETS } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

interface Ingredient {
  id: string;
  name: string;
  category: string;
  isAvailable?: boolean;
}

interface SearchScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

/**
 * SearchScreen Component - Grok AI Style
 * 
 * Modern chat-style ingredient search interface
 * Backend-ready with clean API integration points
 * Minimal design with focus on user experience
 */
const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Mock data - Backend'den gelecek
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
  ], []);

  // Search functionality - Backend API call point
  const searchIngredients = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await ingredientService.search(query);
      // setSearchResults(response.data);
      
      // Mock search simulation
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

  // Search recipes with selected ingredients
  const handleSearchRecipes = useCallback(async () => {
    if (selectedIngredients.length === 0) return;

    try {
      // TODO: Replace with actual API call
      // const response = await recipeService.searchByIngredients(selectedIngredients);
      // navigation?.navigate('SearchResults', { recipes: response.data });
      
      console.log('Searching recipes with:', selectedIngredients);
      // Mock navigation for now
      
    } catch (error) {
      console.error('Recipe search error:', error);
    }
  }, [selectedIngredients]);

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
      <Ionicons name="add-circle-outline" size={24} color={COLORS.textSecondary} />
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
        <View style={[styles.header, { paddingTop: SPACING.sm }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>What's available?</Text>
            <Text style={styles.headerSubtitle}>
              {selectedIngredients.length > 0 
                ? `${selectedIngredients.length} ingredient${selectedIngredients.length > 1 ? 's' : ''} selected`
                : 'Start typing to search ingredients'
              }
            </Text>
          </View>

          {selectedIngredients.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={handleClearAll}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <View style={styles.selectedSection}>
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
            <View style={styles.welcomeState}>
              <Ionicons name="restaurant-outline" size={64} color={COLORS.textMuted} />
              <Text style={styles.welcomeTitle}>Find Your Perfect Recipe</Text>
              <Text style={styles.welcomeSubtitle}>
                Search and select ingredients you have available to discover amazing recipes
              </Text>
            </View>
          )}
        </View>

        {/* Search Input */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + SPACING.md }]}>
          <View style={styles.inputWrapper}>
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

          {selectedIngredients.length > 0 && (
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchRecipes}
              activeOpacity={0.8}
            >
              <Ionicons name="restaurant" size={20} color={COLORS.white} />
              <Text style={styles.searchButtonText}>Find Recipes</Text>
            </TouchableOpacity>
          )}
        </View>
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZE.XL,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
  },
  clearButton: {
    padding: SPACING.sm,
  },
  clearText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  selectedSection: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedList: {
    paddingHorizontal: SPACING.lg,
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
  inputContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textPrimary,
    borderRadius: BORDER_RADIUS.LG,
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  searchButtonText: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default React.memo(SearchScreen); 