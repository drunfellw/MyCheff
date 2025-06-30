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
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';

import NavigationBar from '../components/NavigationBar';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW_PRESETS } from '../constants';
import { recipeAPI } from '../services/api';
import type { Recipe } from '../types';

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

// Component-specific Recipe interface for UI display
interface ComponentRecipe {
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
      recipe?: Recipe;
      recipeId?: string;
    };
  };
}

/**
 * RecipeDetailScreen Component
 * 
 * Modern Instagram-style recipe detail page
 * Full-screen image with overlay content
 * Smooth scrolling with parallax effect
 * Backend-integrated with real Turkish recipe data
 */
const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [navActiveTab, setNavActiveTab] = useState<string>('home'); // For navigation bar
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [isFullScreenVisible, setIsFullScreenVisible] = useState<boolean>(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState<number>(0);

  // Get recipe ID from route params
  const recipeId = route?.params?.recipeId || route?.params?.recipe?.id;

  // Debug logs
  console.log('🔍 RecipeDetailScreen Debug:');
  console.log('- route.params:', route?.params);
  console.log('- recipeId:', recipeId);

  // Fetch recipe data from backend
  const { data: recipeResponse, isLoading, error } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => {
      console.log('📡 API Call: recipeAPI.getRecipeById with ID:', recipeId);
      return recipeAPI.getRecipeById(recipeId!);
    },
    enabled: !!recipeId,
    onError: (err) => {
      console.error('❌ Recipe fetch error:', err);
    },
    onSuccess: (data) => {
      console.log('✅ Recipe fetch success:', data?.title || 'No title');
    }
  });

  // Transform recipe data from backend format to component format
  const recipe: ComponentRecipe | null = React.useMemo(() => {
    if (!recipeResponse) return null;
    
    // DEBUG: Check backend response key fields
    console.log('🔍 Instructions found:', !!recipeResponse.instructions);
    console.log('🔍 Nutrition found:', !!recipeResponse.nutrition);
    console.log('🔍 Instructions count:', recipeResponse.instructions?.length || 0);
    console.log('🔍 Nutrition calories:', recipeResponse.nutrition?.calories || 'N/A');
    
    // Instructions'ları farklı kaynaklardan alma
    let instructions: Instruction[] = [];
    
    // 1. Backend'den instructions field'ı (backend'de 'instructions' olarak dönüyor)
    if (Array.isArray(recipeResponse.instructions) && recipeResponse.instructions.length > 0) {
      instructions = recipeResponse.instructions.map((step, index) => ({
        id: step.id || (index + 1).toString(),
        step: step.step || index + 1,
        description: step.description || ''
      }));
    }
    // 2. Ana recipe'den preparationSteps (fallback)
    else if (Array.isArray(recipeResponse.preparationSteps) && recipeResponse.preparationSteps.length > 0) {
      instructions = recipeResponse.preparationSteps.map((step, index) => ({
        id: (index + 1).toString(),
        step: index + 1,
        description: typeof step === 'string' ? step : step.description || step.text || ''
      }));
    }
    // 3. Translation'dan preparationSteps
    else if (recipeResponse.translations?.[0]?.preparationSteps) {
      const translationSteps = recipeResponse.translations[0].preparationSteps;
      if (Array.isArray(translationSteps) && translationSteps.length > 0) {
        instructions = translationSteps.map((step: any, index: number) => ({
          id: (index + 1).toString(),
          step: index + 1,
          description: typeof step === 'string' ? step : step.description || step.text || ''
        }));
      }
    }
    // 4. Fallback: description'ı nokta ile böl
    else if (recipeResponse.description || recipeResponse.translations?.[0]?.description) {
      const desc = recipeResponse.description || recipeResponse.translations?.[0]?.description || '';
      const steps = desc.split('.').filter(step => step.trim().length > 10); // 10 karakterden uzun olanları al
      instructions = steps.map((step, index) => ({
        id: (index + 1).toString(),
        step: index + 1,
        description: step.trim()
      }));
    }
    
    // 5. En son fallback: Sample steps (sadece test için)
    if (instructions.length === 0) {
      instructions = [
        { id: '1', step: 1, description: 'Malzemeleri hazırlayın' },
        { id: '2', step: 2, description: 'Karıştırın ve pişirin' },
        { id: '3', step: 3, description: 'Servis yapın' }
      ];
    }
    
    const transformedRecipe: ComponentRecipe = {
      id: recipeResponse.id,
      title: recipeResponse.title || recipeResponse.translations?.[0]?.title || 'Tarif',
      description: recipeResponse.description || recipeResponse.translations?.[0]?.description || '',
      media: recipeResponse.media?.map(m => ({
        type: m.mediaType === 'photo' ? 'image' as const : 'video' as const,
        url: m.url
      })) || [{ type: 'image' as const, url: recipeResponse.image_url || recipeResponse.image || 'https://via.placeholder.com/400x300?text=Tarif+Resmi' }],
      category: recipeResponse.categories?.[0]?.name || recipeResponse.categories?.[0]?.translations?.[0]?.name || 'Diğer',
      difficulty: recipeResponse.difficultyLevel <= 2 ? 'Easy' as const : 
                 recipeResponse.difficultyLevel <= 4 ? 'Medium' as const : 'Hard' as const,
      cookingTime: `${recipeResponse.cookingTimeMinutes || recipeResponse.cookingTime || recipeResponse.cooking_time_minutes || 30} dk`,
      servings: recipeResponse.details?.servingSize ? parseInt(recipeResponse.details.servingSize) : 4,
      rating: recipeResponse.averageRating || recipeResponse.average_rating || 4.5,
      reviewCount: recipeResponse.ratings?.length || recipeResponse.rating_count || 0,
      isFavorite: recipeResponse.isFavorite || false,
      ingredients: recipeResponse.ingredients?.map(ri => ({
        id: ri.id,
        name: ri.name || ri.ingredient?.name || ri.ingredient?.translations?.[0]?.name || 'Malzeme',
        amount: ri.quantity?.toString() || '1',
        unit: ri.unit || 'adet'
      })) || [
        { id: '1', name: 'Malzeme 1', amount: '1', unit: 'adet' },
        { id: '2', name: 'Malzeme 2', amount: '2', unit: 'su bardağı' }
      ],
      instructions: instructions,
      nutrition: {
        calories: recipeResponse.nutrition?.calories || 
                 recipeResponse.details?.nutritionalData?.calories || 
                 recipeResponse.nutritionalData?.calories || 
                 0, // Backend should provide this
        protein: recipeResponse.nutrition?.protein || 
                recipeResponse.details?.nutritionalData?.protein || 
                recipeResponse.nutritionalData?.protein || 
                0, // Backend should provide this
        carbs: recipeResponse.nutrition?.carbs || 
              recipeResponse.details?.nutritionalData?.carbohydrates || 
              recipeResponse.nutritionalData?.carbohydrates ||
              0, // Backend should provide this
        fat: recipeResponse.nutrition?.fat || 
            recipeResponse.details?.nutritionalData?.fat || 
            recipeResponse.nutritionalData?.fat ||
            0, // Backend should provide this
        fiber: recipeResponse.nutrition?.fiber || 
              recipeResponse.details?.nutritionalData?.fiber || 
              recipeResponse.nutritionalData?.fiber ||
              0 // Backend should provide this
      },
      author: {
        name: recipeResponse.creator?.fullName || recipeResponse.chef?.name || 'MyCheff',
        avatar: recipeResponse.creator?.avatar || recipeResponse.chef?.avatar || 'https://via.placeholder.com/50x50?text=👨‍🍳',
        verified: recipeResponse.creator?.isVerified || recipeResponse.chef?.isVerified || false
      },
      tags: []
    };
    
    return transformedRecipe;
  }, [recipeResponse]);

  // Update favorite state when recipe data changes - MOVED BEFORE EARLY RETURNS
  React.useEffect(() => {
    if (recipe) {
      setIsFavorite(recipe.isFavorite || false);
    }
  }, [recipe]);

  // Toggle favorite - MOVED BEFORE EARLY RETURNS
  const handleToggleFavorite = useCallback(async () => {
    if (!recipe) return;
    
    setIsFavorite(prev => !prev);
    
    try {
      // Call backend to toggle favorite status
      await userAPI.toggleFavoriteRecipe(recipe.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      setIsFavorite(prev => !prev);
    }
  }, [recipe]);

  // Share recipe - MOVED BEFORE EARLY RETURNS
  const handleShare = useCallback(async () => {
    try {
      if (recipe) {
        await Share.share({
          message: `Check out this amazing recipe: ${recipe.title}`,
          url: `https://mycheff.com/recipe/${recipe.id}`,
        });
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [recipe]);

  // Start cooking - MOVED BEFORE EARLY RETURNS
  const handleStartCooking = useCallback(() => {
    navigation?.navigate('CookingSteps');
  }, [navigation]);

  // ALL RENDER FUNCTIONS - MOVED BEFORE EARLY RETURNS TO FIX HOOKS ORDER
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

  const renderPaginationDots = useCallback(() => {
    if (!recipe?.media?.length) return null;
    
    return (
      <View style={styles.paginationContainer}>
        {recipe.media.map((_, index) => (
          <View
            key={index}
            style={[styles.paginationDot, index === activeMediaIndex && styles.paginationDotActive]}
          />
        ))}
      </View>
    );
  }, [recipe?.media, activeMediaIndex]);

  const renderFullScreenModal = useCallback(() => {
    if (!recipe?.media?.length) return null;
    
    return (
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
  }, [recipe?.media, isFullScreenVisible, fullScreenImageIndex]);

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

  const renderTabContent = useCallback(() => {
    if (!recipe) return null;
    
    switch (activeTab) {
      case 'ingredients':
        return (
          <View style={styles.tabContent}>
            {recipe.ingredients?.map(renderIngredient) || <Text>Malzemeler yükleniyor...</Text>}
          </View>
        );
      case 'instructions':
        return (
          <View style={styles.tabContent}>
            {recipe.instructions?.map(renderInstruction) || <Text>Tarif adımları yükleniyor...</Text>}
          </View>
        );
      case 'nutrition':
        return (
          <View style={styles.tabContent}>
            <View style={styles.nutritionGrid}>
              {renderNutritionItem('Kalori', recipe.nutrition?.calories || 0, '', '#FF6B6B', 'flame')}
              {renderNutritionItem('Protein', recipe.nutrition?.protein || 0, 'g', '#4ECDC4', 'fitness')}
              {renderNutritionItem('Karbonhidrat', recipe.nutrition?.carbs || 0, 'g', '#45B7D1', 'leaf')}
              {renderNutritionItem('Yağ', recipe.nutrition?.fat || 0, 'g', '#FFA726', 'water')}
              {renderNutritionItem('Lif', recipe.nutrition?.fiber || 0, 'g', '#66BB6A', 'nutrition')}
            </View>
          </View>
        );
      default:
        return null;
    }
  }, [activeTab, recipe, renderIngredient, renderInstruction, renderNutritionItem]);

  // Handle navigation bar tab press - MOVED BEFORE EARLY RETURNS
  const handleNavTabPress = useCallback((tabId: string) => {
    setNavActiveTab(tabId);
    
    switch (tabId) {
      case 'home':
        navigation?.navigate('Home');
        break;
      case 'cheff':
        navigation?.navigate('Chat');
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

  // Loading state - MOVED AFTER ALL HOOKS
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Tarif yükleniyor...</Text>
      </View>
    );
  }

  // Error state - MOVED AFTER ALL HOOKS
  if (error || !recipe) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.textMuted} />
        <Text style={styles.errorText}>Tarif bulunamadı</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.retryButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            data={recipe?.media || []}
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
            <Text style={styles.recipeTitle}>{recipe?.title || 'Tarif Yükleniyor...'}</Text>
            <Text style={styles.recipeDescription}>{recipe?.description || ''}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{recipe?.cookingTime || '-- dk'}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.statText}>{recipe?.rating || 0} ({recipe?.reviewCount || 0})</Text>
            </View>
          </View>

          {/* Author */}
          <View style={styles.authorContainer}>
            <Image
              source={{ uri: recipe?.author?.avatar || '/chef-avatar.jpg' }}
              style={styles.authorAvatar}
            />
            <View style={styles.authorInfo}>
              <View style={styles.authorNameContainer}>
                <Text style={styles.authorName}>{recipe?.author?.name || 'MyCheff'}</Text>
                {recipe?.author?.verified && (
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
            name={recipe?.isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={recipe?.isFavorite ? COLORS.primary : COLORS.textPrimary} 
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textMuted,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  retryButton: {
    padding: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.MD,
  },
  retryButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default React.memo(RecipeDetailScreen); 