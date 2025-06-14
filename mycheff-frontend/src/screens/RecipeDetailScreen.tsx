import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Share,
  FlatList,
  Modal,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import NavigationBar from '../components/NavigationBar';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW_PRESETS } from '../constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

interface Instruction {
  id: string;
  step: number;
  description: string;
}

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  media: Array<{
    type: 'image' | 'video';
    url: string;
  }>;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookingTime: string;
  servings: number;
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
  ingredients: Ingredient[];
  instructions: Instruction[];
  nutrition: NutritionInfo;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  tags: string[];
}

interface RecipeDetailScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
  route?: {
    params: {
      recipe: Recipe;
    };
  };
}

/**
 * RecipeDetailScreen Component
 * 
 * Modern Instagram-style recipe detail page
 * Full-screen image with overlay content
 * Smooth scrolling with parallax effect
 * Backend-ready structure
 */
const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [navActiveTab, setNavActiveTab] = useState<string>('home'); // For navigation bar
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [isFullScreenVisible, setIsFullScreenVisible] = useState<boolean>(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState<number>(0);

  // Mock recipe data - Backend'den gelecek
  const recipe: Recipe = useMemo(() => route?.params?.recipe || {
    id: '1',
    title: 'Creamy Mushroom Risotto',
    description: 'A rich and creamy Italian risotto made with fresh mushrooms, parmesan cheese, and aromatic herbs. Perfect for a cozy dinner.',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?w=800&h=600&fit=crop' },
    ],
    category: 'Main Course',
    difficulty: 'Medium',
    cookingTime: '35 min',
    servings: 4,
    rating: 4.8,
    reviewCount: 127,
    isFavorite: false,
    ingredients: [
      { id: '1', name: 'Arborio Rice', amount: '1.5', unit: 'cups' },
      { id: '2', name: 'Mixed Mushrooms', amount: '300', unit: 'g' },
      { id: '3', name: 'Vegetable Broth', amount: '4', unit: 'cups' },
      { id: '4', name: 'Onion', amount: '1', unit: 'medium' },
      { id: '5', name: 'Garlic Cloves', amount: '3', unit: 'pieces' },
      { id: '6', name: 'Parmesan Cheese', amount: '100', unit: 'g' },
      { id: '7', name: 'White Wine', amount: '1/2', unit: 'cup' },
      { id: '8', name: 'Butter', amount: '2', unit: 'tbsp' },
      { id: '9', name: 'Olive Oil', amount: '2', unit: 'tbsp' },
      { id: '10', name: 'Fresh Thyme', amount: '1', unit: 'tsp' },
    ],
    instructions: [
      { id: '1', step: 1, description: 'Heat the vegetable broth in a saucepan and keep it warm over low heat.' },
      { id: '2', step: 2, description: 'In a large pan, heat olive oil and butter. Add diced onion and cook until translucent.' },
      { id: '3', step: 3, description: 'Add minced garlic and sliced mushrooms. Cook until mushrooms are golden brown.' },
      { id: '4', step: 4, description: 'Add arborio rice and stir until the grains are well coated.' },
      { id: '5', step: 5, description: 'Pour in white wine and stir until absorbed.' },
      { id: '6', step: 6, description: 'Add warm broth one ladle at a time, stirring constantly until absorbed before adding more.' },
      { id: '7', step: 7, description: 'Stir in grated parmesan cheese and fresh thyme. Season with salt and pepper.' },
    ],
    nutrition: {
      calories: 385,
      protein: 12,
      carbs: 58,
      fat: 14,
      fiber: 3,
    },
    author: {
      name: 'Chef Maria',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    tags: ['Italian', 'Vegetarian', 'Comfort Food', 'Dinner'],
  }, [route?.params?.recipe]);

  // Toggle favorite
  const handleToggleFavorite = useCallback(() => {
    setIsFavorite(prev => !prev);
    // TODO: API call to update favorite status
    // await recipeService.toggleFavorite(recipe.id);
  }, []);

  // Share recipe
  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Check out this amazing recipe: ${recipe.title}`,
        url: `https://mycheff.com/recipe/${recipe.id}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [recipe]);

  // Start cooking
  const handleStartCooking = useCallback(() => {
    navigation?.navigate('CookingSteps');
  }, [navigation]);

  // Handle navigation bar tab press
  const handleNavTabPress = useCallback((tabId: string) => {
    setNavActiveTab(tabId);
    
    switch (tabId) {
      case 'home':
        navigation?.navigate('Home');
        break;
      case 'search':
        navigation?.navigate('SearchResults');
        break;
      case 'favorites':
        navigation?.navigate('Favorites');
        break;
      case 'profile':
        navigation?.navigate('Profile');
        break;
    }
  }, [navigation]);

  // Render media item for carousel
  const renderMediaItem = useCallback(({ item, index }: { item: { type: 'image' | 'video'; url: string }, index: number }) => (
    <TouchableOpacity
      onPress={() => {
        setFullScreenImageIndex(index);
        setIsFullScreenVisible(true);
      }}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.url }}
        style={styles.heroImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  ), []);

  // Render pagination dots
  const renderPaginationDots = () => (
    <View style={styles.paginationContainer}>
      {recipe.media.map((_, index) => (
        <View
          key={index}
          style={[styles.paginationDot, index === activeMediaIndex && styles.paginationDotActive]}
        />
      ))}
    </View>
  );

  // Render full screen image modal
  const renderFullScreenModal = () => (
    <Modal
      visible={isFullScreenVisible}
      transparent={false}
      animationType="fade"
      onRequestClose={() => setIsFullScreenVisible(false)}
      statusBarTranslucent={true}
    >
      <View style={styles.fullScreenContainer}>
        <StatusBar hidden />
        <TouchableOpacity
          style={styles.fullScreenCloseButton}
          onPress={() => setIsFullScreenVisible(false)}
        >
          <Ionicons name="close" size={30} color={COLORS.white} />
        </TouchableOpacity>
        
        <FlatList
          data={recipe.media}
          renderItem={({ item }) => (
            <View style={styles.fullScreenImageContainer}>
              <Image
                source={{ uri: item.url }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            </View>
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={fullScreenImageIndex}
          getItemLayout={(data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </Modal>
  );

  // Render ingredient item
  const renderIngredient = useCallback((ingredient: Ingredient) => (
    <View key={ingredient.id} style={styles.ingredientItem}>
      <View style={styles.ingredientAmount}>
        <Text style={styles.ingredientAmountText}>
          {ingredient.amount} {ingredient.unit}
        </Text>
      </View>
      <Text style={styles.ingredientName}>{ingredient.name}</Text>
    </View>
  ), []);

  // Render instruction item
  const renderInstruction = useCallback((instruction: Instruction) => (
    <View key={instruction.id} style={styles.instructionItem}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{instruction.step}</Text>
      </View>
      <View style={styles.instructionContent}>
        <Text style={styles.instructionText}>{instruction.description}</Text>
      </View>
    </View>
  ), []);

  // Render nutrition item
  const renderNutritionItem = useCallback((label: string, value: number, unit: string, color: string, icon: string) => (
    <View style={styles.nutritionItem}>
      <View style={[styles.nutritionIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={20} color={COLORS.white} />
      </View>
      <View style={styles.nutritionContent}>
        <Text style={styles.nutritionValue}>{value}{unit}</Text>
        <Text style={styles.nutritionLabel}>{label}</Text>
      </View>
    </View>
  ), []);

  // Render tab content
  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 'ingredients':
        return (
          <View style={styles.tabContent}>
            {recipe.ingredients.map(renderIngredient)}
          </View>
        );
      case 'instructions':
        return (
          <View style={styles.tabContent}>
            {recipe.instructions.map(renderInstruction)}
          </View>
        );
      case 'nutrition':
        return (
          <View style={styles.tabContent}>
            <View style={styles.nutritionGrid}>
              {renderNutritionItem('Calories', recipe.nutrition.calories, '', '#FF6B6B', 'flame')}
              {renderNutritionItem('Protein', recipe.nutrition.protein, 'g', '#4ECDC4', 'fitness')}
              {renderNutritionItem('Carbs', recipe.nutrition.carbs, 'g', '#45B7D1', 'leaf')}
              {renderNutritionItem('Fat', recipe.nutrition.fat, 'g', '#FFA726', 'water')}
              {renderNutritionItem('Fiber', recipe.nutrition.fiber, 'g', '#66BB6A', 'nutrition')}
            </View>
          </View>
        );
      default:
        return null;
    }
  }, [activeTab, recipe, renderIngredient, renderInstruction, renderNutritionItem]);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: insets.top }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Carousel */}
        <View style={styles.heroContainer}>
          <FlatList
            data={recipe.media}
            renderItem={renderMediaItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / screenWidth
              );
              setActiveMediaIndex(newIndex);
            }}
            keyExtractor={(item, index) => index.toString()}
          />
          {renderPaginationDots()}
        </View>

        {/* Recipe Info */}
        <View style={styles.recipeInfo}>
          <View style={styles.recipeHeader}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <Text style={styles.recipeDescription}>{recipe.description}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{recipe.cookingTime}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.statText}>{recipe.rating} ({recipe.reviewCount})</Text>
            </View>
          </View>

          {/* Author */}
          <View style={styles.authorContainer}>
            <Image
              source={{ uri: recipe.author.avatar }}
              style={styles.authorAvatar}
            />
            <View style={styles.authorInfo}>
              <View style={styles.authorNameContainer}>
                <Text style={styles.authorName}>{recipe.author.name}</Text>
                {recipe.author.verified && (
                  <Ionicons name="checkmark-circle" size={16} color="#1DA1F2" />
                )}
              </View>
              <Text style={styles.authorTitle}>Recipe Creator</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'ingredients' && styles.activeTab]}
              onPress={() => setActiveTab('ingredients')}
            >
              <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>
                Ingredients
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'instructions' && styles.activeTab]}
              onPress={() => setActiveTab('instructions')}
            >
              <Text style={[styles.tabText, activeTab === 'instructions' && styles.activeTabText]}>
                Instructions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'nutrition' && styles.activeTab]}
              onPress={() => setActiveTab('nutrition')}
            >
              <Text style={[styles.tabText, activeTab === 'nutrition' && styles.activeTabText]}>
                Nutrition
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {renderTabContent()}

          {/* Start Cooking Button */}
          <View style={[styles.bottomAction, { paddingBottom: insets.bottom + SPACING.lg }]}>
            <TouchableOpacity style={styles.startCookingButton} onPress={handleStartCooking}>
              <Text style={styles.startCookingButtonText}>Start Cooking</Text>
              <Ionicons name="play" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Header */}
      <View style={[styles.floatingHeader, { paddingTop: insets.top + SPACING.sm }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons 
            name={recipe.isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={recipe.isFavorite ? COLORS.primary : COLORS.textPrimary} 
          />
        </TouchableOpacity>
      </View>

      {/* Navigation Bar */}
      <NavigationBar
        activeTab={navActiveTab}
        onTabPress={handleNavTabPress}
      />

      {/* Full Screen Image Modal */}
      {renderFullScreenModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    zIndex: 10,
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
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW_PRESETS.SMALL,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    position: 'relative',
    height: screenHeight * 0.4,
  },
  heroImage: {
    width: screenWidth,
    height: '100%',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    zIndex: 5,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  paginationDotActive: {
    backgroundColor: COLORS.white,
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  recipeInfo: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.XXL,
    borderTopRightRadius: BORDER_RADIUS.XXL,
    marginTop: -SPACING.xl,
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  recipeHeader: {
    marginBottom: SPACING.xl,
  },
  recipeTitle: {
    fontSize: FONT_SIZE.XXXL,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    lineHeight: 32,
  },
  recipeDescription: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.LG,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  authorAvatar: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.CIRCLE,
  },
  authorInfo: {
    flex: 1,
  },
  authorNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  authorName: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  authorTitle: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  tag: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  tagText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.xs,
    marginBottom: SPACING.xl,
    ...SHADOW_PRESETS.SMALL,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.MD,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    ...SHADOW_PRESETS.MEDIUM,
  },
  tabText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  tabContent: {
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOW_PRESETS.SMALL,
  },
  ingredientAmount: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minWidth: 90,
    alignItems: 'center',
  },
  ingredientAmountText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  ingredientName: {
    flex: 1,
    fontSize: FONT_SIZE.LG,
    color: COLORS.textPrimary,
    fontWeight: '600',
    lineHeight: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: COLORS.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.white,
  },
  instructionContent: {
    flex: 1,
  },
  instructionText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  nutritionGrid: {
    gap: SPACING.md,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    ...SHADOW_PRESETS.SMALL,
  },
  nutritionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.CIRCLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  nutritionContent: {
    flex: 1,
  },
  nutritionValue: {
    fontSize: FONT_SIZE.XL,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  nutritionLabel: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  bottomAction: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  startCookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.LG,
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOW_PRESETS.MEDIUM,
  },
  startCookingButtonText: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.white,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImageContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  fullScreenImage: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#000000',
  },
});

export default React.memo(RecipeDetailScreen); 