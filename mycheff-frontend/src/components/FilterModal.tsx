import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  StyleSheet,
  ScrollView,
  PanResponder,
} from 'react-native';



import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  COLORS, 
  COMPONENT_SPACING, 
  FONT_SIZE, 
  BORDER_RADIUS, 
  SHADOW_PRESETS,
  SPACING 
} from '../constants';

const { height: screenHeight } = Dimensions.get('window');

interface FilterCategory {
  id: string;
  name: string;
  icon: string;
  isSelected: boolean;
}

interface FilterOption {
  id: string;
  label: string;
  value: string;
  isSelected: boolean;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

interface FilterState {
  categories: FilterCategory[];
  difficulty: FilterOption[];
  cookingTime: FilterOption[];
  dietary: FilterOption[];
}

/**
 * FilterModal Component
 * 
 * Professional bottom sheet filter modal with improved swipe-to-dismiss
 * Features smooth animations and optimized gesture handling
 */
const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollEnabled, setScrollEnabled] = React.useState(true);

  // Mock data - Backend'den gelecek
  const defaultFilters: FilterState = useMemo(() => ({
    categories: [
      { id: '1', name: 'Breakfast', icon: 'sunny', isSelected: false },
      { id: '2', name: 'Lunch', icon: 'restaurant', isSelected: false },
      { id: '3', name: 'Dinner', icon: 'moon', isSelected: false },
      { id: '4', name: 'Snacks', icon: 'fast-food', isSelected: false },
      { id: '5', name: 'Desserts', icon: 'ice-cream', isSelected: false },
      { id: '6', name: 'Beverages', icon: 'wine', isSelected: false },
    ],
    difficulty: [],
    cookingTime: [
      { id: 'quick', label: 'Under 15 min', value: '0-15', isSelected: false },
      { id: 'medium', label: '15-30 min', value: '15-30', isSelected: false },
      { id: 'long', label: '30+ min', value: '30+', isSelected: false },
    ],
    dietary: [],
  }), []);

  const [filters, setFilters] = React.useState<FilterState>(
    initialFilters || defaultFilters
  );

  // Improved pan responder for handle area only
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dy, dx } = gestureState;
        // Only respond to vertical gestures that are more significant than horizontal
        return Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10;
      },
      onPanResponderGrant: () => {
        setScrollEnabled(false); // Disable scroll when dragging
      },
      onPanResponderMove: (evt, gestureState) => {
        // Only allow downward drag
        if (gestureState.dy > 0) {
          dragY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        setScrollEnabled(true); // Re-enable scroll
        
        const { dy, vy } = gestureState;
        const shouldClose = dy > 150 || vy > 0.8;
        
        if (shouldClose) {
          onClose();
        } else {
          // Snap back to original position
          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  // Animation effects
  useEffect(() => {
    if (visible) {
      dragY.setValue(0);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: COMPONENT_SPACING.MODAL.BACKDROP_OPACITY,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(dragY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, backdropOpacity, dragY]);

  // Toggle category selection
  const toggleCategory = useCallback((categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId ? { ...cat, isSelected: !cat.isSelected } : cat
      ),
    }));
  }, []);

  // Toggle filter option
  const toggleFilterOption = useCallback((
    filterType: keyof Omit<FilterState, 'categories'>,
    optionId: string
  ) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].map(option =>
        option.id === optionId ? { ...option, isSelected: !option.isSelected } : option
      ),
    }));
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  // Apply filters
  const handleApplyFilters = useCallback(() => {
    onApply(filters);
    onClose();
  }, [filters, onApply, onClose]);

  // Count selected filters
  const selectedCount = useMemo(() => {
    const categoryCount = filters.categories.filter(cat => cat.isSelected).length;
    const timeCount = filters.cookingTime.filter(opt => opt.isSelected).length;
    
    return categoryCount + timeCount;
  }, [filters]);

  // Render category item
  const renderCategoryItem = useCallback((category: FilterCategory) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryItem,
        category.isSelected && styles.categoryItemSelected,
      ]}
      onPress={() => toggleCategory(category.id)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={category.icon as any}
        size={24}
        color={category.isSelected ? COLORS.white : COLORS.textSecondary}
      />
      <Text
        style={[
          styles.categoryText,
          category.isSelected && styles.categoryTextSelected,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  ), [toggleCategory]);

  // Render filter option
  const renderFilterOption = useCallback((
    option: FilterOption,
    filterType: keyof Omit<FilterState, 'categories'>
  ) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.filterOption,
        option.isSelected && styles.filterOptionSelected,
      ]}
      onPress={() => toggleFilterOption(filterType, option.id)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterOptionText,
          option.isSelected && styles.filterOptionTextSelected,
        ]}
      >
        {option.label}
      </Text>
      {option.isSelected && (
        <Ionicons name="checkmark" size={16} color={COLORS.white} />
      )}
    </TouchableOpacity>
  ), [toggleFilterOption]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View
        style={[styles.backdrop, { opacity: backdropOpacity }]}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Modal Content */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY }, { translateY: dragY }],
            paddingBottom: insets.bottom + SPACING.lg,
          },
        ]}
      >
        {/* Draggable Handle Area */}
        <View style={styles.handleArea} {...panResponder.panHandlers}>
          <View style={styles.handle} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter Recipes</Text>
          <View style={styles.headerActions}>
            {selectedCount > 0 && (
              <TouchableOpacity onPress={clearAllFilters} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={true}
          scrollEnabled={scrollEnabled}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoriesGrid}>
              {filters.categories.map(renderCategoryItem)}
            </View>
          </View>

          {/* Cooking Time */}
          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>Cooking Time</Text>
            <View style={styles.filterOptionsRow}>
              {filters.cookingTime.map(option => renderFilterOption(option, 'cookingTime'))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyFilters}
            activeOpacity={0.8}
          >
            <Text style={styles.applyButtonText}>
              Apply Filters {selectedCount > 0 && `(${selectedCount})`}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.textPrimary,
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: COMPONENT_SPACING.MODAL.BORDER_RADIUS,
    borderTopRightRadius: COMPONENT_SPACING.MODAL.BORDER_RADIUS,
    maxHeight: screenHeight * 0.85,
    ...SHADOW_PRESETS.LARGE,
  },
  handleArea: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: COMPONENT_SPACING.MODAL.PADDING,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZE.XL,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  clearButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  clearButtonText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  closeButton: {
    padding: SPACING.sm,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: COMPONENT_SPACING.MODAL.PADDING,
  },
  section: {
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  lastSection: {
    borderBottomWidth: 0,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.LG,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: COLORS.white,
  },
  filterOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  filterOptionsColumn: {
    gap: SPACING.md,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterOptionText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: COLORS.white,
  },
  footer: {
    paddingHorizontal: COMPONENT_SPACING.MODAL.PADDING,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.LG,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW_PRESETS.MEDIUM,
  },
  applyButtonText: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default FilterModal; 