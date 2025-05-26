import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface ScrollMenuProps {
  categories?: Category[];
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
}

/**
 * ScrollMenu Component - Airbnb Style
 * 
 * Horizontal kategoriler listesi - Airbnb tarzında auto-scroll indicator
 */
const ScrollMenu = ({ categories = [], selectedCategory, onCategorySelect }: ScrollMenuProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const categoryWidth = 70;
  const categoryGap = SPACING.xs;

  // İkon mapping'i
  const getCategoryIcon = (iconName: string): string => {
    const iconMap: { [key: string]: string } = {
      'breakfast-icon': 'cafe-outline',
      'sandwich-icon': 'fast-food-outline',
      'salad-icon': 'leaf-outline',
      'steak-icon': 'restaurant-outline',
      'chicken-icon': 'nutrition-outline',
      'vegetable-icon': 'flower-outline',
      'pastas-icon': 'cafe-outline',
      'main-meals-icon': 'pizza-outline',
      'desserts-icon': 'ice-cream-outline',
      'drinks-icon': 'wine-outline',
    };
    return iconMap[iconName] || 'ellipse-outline';
  };

  // Seçili kategori değiştiğinde sadece indicator animate et
  useEffect(() => {
    const selectedIndex = categories.findIndex(cat => cat.id === selectedCategory);
    
    if (selectedIndex !== -1) {
      // Sadece indicator animasyonu
      const indicatorPosition = selectedIndex * (categoryWidth + categoryGap);
      
      Animated.spring(slideAnimation, {
        toValue: indicatorPosition,
        useNativeDriver: true,
        tension: 120,
        friction: 9,
      }).start();

      // Auto-scroll'u kaldırdık - sadece manuel scroll
    }
  }, [selectedCategory, categories, slideAnimation]);

  const handleCategoryPress = (categoryId: string) => {
    onCategorySelect?.(categoryId);
  };

  const renderCategoryItem = (category: Category, index: number) => {
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
            name={getCategoryIcon(category.icon) as any}
            size={32}
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
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

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
        {categories.map((category, index) => renderCategoryItem(category, index))}
        
        {/* Indicator ScrollView içinde - kategorilerle birlikte hareket eder */}
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
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
  },
  scrollView: {
    marginHorizontal: SPACING.lg,
  },
  scrollContent: {
    paddingRight: SPACING.lg,
    gap: SPACING.xs,
    position: 'relative',
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 65,
    gap: 6,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  categoryText: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
    width: 70,
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
    width: 70,
    height: 2,
    backgroundColor: COLORS.textPrimary,
    borderRadius: BORDER_RADIUS.XS,
  },
});

export default ScrollMenu; 