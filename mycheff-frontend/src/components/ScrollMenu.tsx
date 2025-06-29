import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  COLORS, 
  COMPONENT_SPACING, 
  FONT_SIZE, 
  BORDER_RADIUS,
  CATEGORY_ICONS,
  ANIMATION_DURATION 
} from '../constants';

interface CategoryItem {
  id: string;
  name: string;
  icon?: string;
}

interface ScrollMenuProps {
  categories?: CategoryItem[];
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
}

// Category item dimensions from design system
const CATEGORY_ITEM = {
  WIDTH: 70,
  HEIGHT: 65,
  ICON_SIZE: 32,
  GAP: 6,
} as const;

/**
 * ScrollMenu Component
 * 
 * Professional horizontal category menu following design system
 * Features smooth animations and optimized performance
 */
const ScrollMenu = React.memo<ScrollMenuProps>(({ 
  categories = [], 
  selectedCategory, 
  onCategorySelect 
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  // Icon mapping using constants
  const getCategoryIcon = useCallback((iconName: string): string => {
    return CATEGORY_ICONS[iconName as keyof typeof CATEGORY_ICONS] || 'ellipse-outline';
  }, []);

  // Filter unique categories by name to avoid duplicates
  const uniqueCategories = useMemo(() => {
    const seen = new Set<string>();
    return categories.filter(category => {
      if (seen.has(category.name)) {
        return false;
      }
      seen.add(category.name);
      return true;
    });
  }, [categories]);

  // Calculate indicator position
  const indicatorPosition = useMemo(() => {
    const selectedIndex = uniqueCategories.findIndex(cat => cat.id === selectedCategory);
    if (selectedIndex === -1) return 0;
    
    return selectedIndex * (CATEGORY_ITEM.WIDTH + COMPONENT_SPACING.CARD.MARGIN);
  }, [selectedCategory, uniqueCategories]);

  // Animate indicator when selection changes
  useEffect(() => {
    Animated.spring(slideAnimation, {
      toValue: indicatorPosition,
      useNativeDriver: true,
      tension: 120,
      friction: 9,
    }).start();
  }, [indicatorPosition, slideAnimation]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    onCategorySelect?.(categoryId);
  }, [onCategorySelect]);

  const renderCategoryItem = useCallback((category: CategoryItem, index: number) => {
    const isSelected = category.id === selectedCategory;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={styles.categoryItem}
        onPress={() => handleCategoryPress(category.id)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={getCategoryIcon(category.icon || 'ellipse-outline') as any}
            size={CATEGORY_ITEM.ICON_SIZE}
            color={isSelected ? COLORS.textPrimary : COLORS.textSecondary}
          />
        </View>

        <Text 
          style={[
            styles.categoryText,
            isSelected && styles.selectedCategoryText
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {category.name || 'Category'}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedCategory, handleCategoryPress, getCategoryIcon]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        decelerationRate="normal"
      >
        {uniqueCategories.map(renderCategoryItem)}
        
        {/* Animated Indicator */}
        <View style={styles.indicatorContainer}>
          <Animated.View 
            style={[
              styles.slidingIndicator,
              {
                transform: [{ translateX: slideAnimation }]
              }
            ]}
          />
        </View>
      </ScrollView>
    </View>
  );
});

ScrollMenu.displayName = 'ScrollMenu';

const styles = StyleSheet.create({
  container: {
    marginTop: COMPONENT_SPACING.SEARCH_BAR.HORIZONTAL,
  },
  scrollView: {
    marginHorizontal: COMPONENT_SPACING.SEARCH_BAR.HORIZONTAL,
  },
  scrollContent: {
    paddingRight: COMPONENT_SPACING.SEARCH_BAR.HORIZONTAL,
    gap: COMPONENT_SPACING.CARD.MARGIN,
    position: 'relative',
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: CATEGORY_ITEM.WIDTH,
    height: CATEGORY_ITEM.HEIGHT,
    gap: CATEGORY_ITEM.GAP,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2, // Minimal gap for icon alignment
  },
  categoryText: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT_SIZE.SM + 2,
    width: CATEGORY_ITEM.WIDTH,
  },
  selectedCategoryText: {
    color: COLORS.textPrimary,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  slidingIndicator: {
    width: CATEGORY_ITEM.WIDTH,
    height: 2,
    backgroundColor: COLORS.textPrimary,
    borderRadius: BORDER_RADIUS.XS,
  },
});

export default ScrollMenu; 