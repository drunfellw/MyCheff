import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW_PRESETS } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

interface Recipe {
  id: string;
  title?: string;
  category?: string;
  image?: string;
  time?: string;
  rating?: string;
  reviewCount?: string;
  isFavorite?: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: (recipe: Recipe) => void;
  onFavoritePress?: (recipeId: string) => void;
}

/**
 * RecipeCard Component - Airbnb Style
 * 
 * Modern, profesyonel recipe kartı - Airbnb HostCard'ına benzer
 */
const RecipeCard = ({ recipe, onPress, onFavoritePress }: RecipeCardProps) => {
  const defaultImage = 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop';
  
  // Kart genişliği hesaplama - 2 kartlı grid için
  const horizontalMargin = SPACING.lg * 2;
  const cardGap = SPACING.lg;
  const cardWidth = (screenWidth - horizontalMargin - cardGap) / 2;

  return (
    <TouchableOpacity 
      style={[styles.container, { width: cardWidth }]} 
      onPress={() => onPress?.(recipe)}
      activeOpacity={0.95}
    >
      {/* Recipe Image Container - Sadece fotoğraf kart */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image || defaultImage }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            onFavoritePress?.(recipe.id);
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={recipe.isFavorite ? "heart" : "heart-outline"}
            size={22}
            color={recipe.isFavorite ? COLORS.primary : COLORS.white}
          />
        </TouchableOpacity>

        {/* Time Badge */}
        <View style={styles.timeBadge}>
          <Ionicons
            name="time-outline"
            size={14}
            color={COLORS.white}
          />
          <Text style={styles.timeText}>
            {recipe.time || '3 min'}
          </Text>
        </View>
      </View>

      {/* Recipe Info - Sayfa üzerinde normal text */}
      <View style={styles.infoContainer}>
        {/* Recipe Title */}
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title || 'Soğuk Amerikano'}
        </Text>

        {/* Recipe Category - Review kaldırıldı */}
        <Text style={styles.subtitle} numberOfLines={1}>
          {recipe.category || 'Delicious beverage'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    borderRadius: BORDER_RADIUS.LG,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...SHADOW_PRESETS.MEDIUM,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.CIRCLE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.MD,
    gap: SPACING.xs,
  },
  timeText: {
    fontSize: FONT_SIZE.XS,
    fontWeight: '600',
    color: COLORS.white,
    lineHeight: 14,
  },
  infoContainer: {
    paddingTop: SPACING.md,
    gap: SPACING.xs,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  subtitle: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '400',
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  ratingText: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 16,
  },
});

export default RecipeCard; 