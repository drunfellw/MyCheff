import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  COLORS, 
  COMPONENT_SPACING, 
  FONT_SIZE, 
  BORDER_RADIUS, 
  SHADOW_PRESETS 
} from '../constants';

interface Recipe {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  cookingTimeMinutes?: number;
  difficultyLevel?: number;
  isFavorite?: boolean;
  categories?: { name: string }[];
}

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: (recipe: Recipe) => void;
  onFavoritePress?: (recipeId: string) => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop';

/**
 * RecipeCard Component
 * 
 * Professional recipe card following design system standards
 * Features modern design with optimized performance
 */
const RecipeCard = React.memo<RecipeCardProps>(({ 
  recipe, 
  onPress, 
  onFavoritePress, 
  isSelected = false, 
  isSelectionMode = false 
}) => {
  const handlePress = useCallback(() => {
    onPress?.(recipe);
  }, [onPress, recipe]);

  const handleFavoritePress = useCallback((e: any) => {
    e.stopPropagation();
    onFavoritePress?.(recipe.id);
  }, [onFavoritePress, recipe.id]);

  const favoriteIconName = useMemo(() => {
    if (isSelectionMode) {
      return isSelected ? "checkmark-circle" : "ellipse-outline";
    }
    return recipe.isFavorite ? "heart" : "heart-outline";
  }, [isSelectionMode, isSelected, recipe.isFavorite]);

  const favoriteIconColor = useMemo(() => {
    if (isSelectionMode) {
      return COLORS.white;
    }
    return recipe.isFavorite ? COLORS.primary : COLORS.white;
  }, [isSelectionMode, recipe.isFavorite]);

  const imageSource = recipe.imageUrl || DEFAULT_IMAGE;
  const categoryName = recipe.categories?.[0]?.name || 'Delicious recipe';

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isSelected && styles.selectedContainer
      ]} 
      onPress={handlePress}
      activeOpacity={0.95}
    >
      {/* Recipe Image Container */}
      <View style={[
        styles.imageContainer, 
        isSelected && styles.selectedImageContainer
      ]}>
        <Image
          source={{ uri: imageSource }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Selection Overlay */}
        {isSelectionMode && (
          <View style={[
            styles.selectionOverlay, 
            isSelected && styles.selectedOverlay
          ]} />
        )}
        
        {/* Favorite/Selection Button */}
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isSelectionMode && styles.selectionButton,
            isSelected && styles.selectedButton
          ]}
          onPress={handleFavoritePress}
          activeOpacity={0.8}
        >
          <Ionicons
            name={favoriteIconName as any}
            size={isSelectionMode ? 24 : 22}
            color={favoriteIconColor}
          />
        </TouchableOpacity>
      </View>

      {/* Recipe Info */}
      <View style={styles.infoContainer}>
        {/* Recipe Title */}
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title || 'Soğuk Amerikano'}
        </Text>

        {/* Recipe Category */}
        <Text style={styles.subtitle} numberOfLines={1}>
          {categoryName}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

RecipeCard.displayName = 'RecipeCard';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  selectedContainer: {
    opacity: 0.8,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: COMPONENT_SPACING.CARD.IMAGE_HEIGHT,
    borderRadius: COMPONENT_SPACING.CARD.BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...SHADOW_PRESETS.MEDIUM,
  },
  selectedImageContainer: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: COMPONENT_SPACING.CARD.MARGIN,
    right: COMPONENT_SPACING.CARD.MARGIN,
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.CIRCLE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
  },
  selectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  selectedOverlay: {
    backgroundColor: 'rgba(249, 58, 59, 0.3)',
  },
  infoContainer: {
    paddingTop: COMPONENT_SPACING.CARD.PADDING,
    gap: 4, // Minimal gap between title and subtitle
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: FONT_SIZE.LG + 2,
  },
  subtitle: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '400',
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZE.MD + 2,
  },
});

export default RecipeCard; 