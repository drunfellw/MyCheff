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
    navigate: (screen: string, params?: any) => void;
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
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  
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
  const handleSearchRecipes = useCallback(() => {
    if (selectedIngredients.length > 0) {
      navigation?.navigate('SearchResults', { 
        ingredients: selectedIngredients.map(i => i.name)
      });
    }
  }, [selectedIngredients, navigation]);

  const handleTabPress = useCallback((tabId: string) => {
    switch (tabId) {
      case 'home':
        navigation?.navigate('Home');
        break;
      case 'search':
        // Already on search screen
        break;
      case 'favorites':
        navigation?.navigate('Favorites');
        break;
      case 'profile':
        navigation?.navigate('Profile');
        break;
    }
  }, [navigation]);

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="Search Recipes"
        onBackPress={() => navigation?.goBack()}
        backgroundColor={COLORS.background}
        rightElement={
          selectedIngredients.length > 0 ? (
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={handleSearchRecipes}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <View style={styles.content}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} />
            <TextInput
              ref={searchInputRef}
              style={styles.input}
              placeholder="Search ingredients..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="words"
              autoCorrect={false}
              autoFocus={false}
              returnKeyType="search"
              blurOnSubmit={false}
            />
            
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="hourglass" size={20} color={COLORS.textMuted} />
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.filterButtonInside}
                onPress={() => {/* TODO: Filter modal */}}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <View style={styles.filterIconContainer}>
                  <Ionicons name="options" size={20} color={COLORS.textPrimary} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <View style={styles.selectedSection}>
            <FlatList
              data={selectedIngredients}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.selectedItem} 
                  onPress={() => handleRemoveIngredient(item.id)}
                >
                  <Text style={styles.selectedText}>{item.name}</Text>
                  <Ionicons name="close" size={16} color={COLORS.error} />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectedList}
              ItemSeparatorComponent={() => <View style={{ width: SPACING.sm }} />}
            />
          </View>
        )}

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
    padding: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? SPACING.sm : SPACING.xs,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
    padding: 0,
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
  loadingContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  filterButtonInside: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.CIRCLE,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSection: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultsContainer: {
    flex: 1,
  },
  searchButton: {
    padding: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.ROUND,
  },
  searchButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.white,
  },
});

export default React.memo(SearchScreen); 