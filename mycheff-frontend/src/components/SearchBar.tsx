import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  COLORS, 
  COMPONENT_SPACING, 
  FONT_SIZE, 
  BORDER_RADIUS, 
  SHADOW_PRESETS, 
  DEFAULTS,
  ANIMATION_DURATION 
} from '../constants';
import FilterModal from './FilterModal';

interface SearchBarProps {
  onPress?: () => void;
  onFiltersApplied?: (filters: any) => void;
  style?: ViewStyle;
}

/**
 * SearchBar Component
 * 
 * Professional search bar component following design system
 * Features typewriter animation with configurable texts
 * Includes filter functionality
 * 
 * @param {SearchBarProps} props - Component props
 */
const SearchBar = React.memo<SearchBarProps>(({ onPress, onFiltersApplied, style }) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [typeIndex, setTypeIndex] = useState<number>(0);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  
  const typewriterTexts = useMemo(() => DEFAULTS.TYPEWRITER_TEXTS, []);

  const handleFilterPress = useCallback(() => {
    setShowFilterModal(true);
  }, []);

  const handleFilterClose = useCallback(() => {
    setShowFilterModal(false);
  }, []);

  const handleFiltersApply = useCallback((filters: any) => {
    onFiltersApplied?.(filters);
    console.log('Filters applied:', filters);
  }, [onFiltersApplied]);

  useEffect(() => {
    const currentText = typewriterTexts[typeIndex];
    
    const typeSpeed = isDeleting 
      ? ANIMATION_DURATION.TYPEWRITER.DELETE_SPEED 
      : ANIMATION_DURATION.TYPEWRITER.TYPE_SPEED;
    
    const delay = isDeleting 
      ? 0 
      : (displayText === currentText ? ANIMATION_DURATION.TYPEWRITER.PAUSE_DURATION : 0);
    
    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentText) {
        setIsDeleting(true);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setTypeIndex((prev) => (prev + 1) % typewriterTexts.length);
      } else if (isDeleting) {
        setDisplayText(currentText.substring(0, displayText.length - 1));
      } else {
        setDisplayText(currentText.substring(0, displayText.length + 1));
      }
    }, delay || typeSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, typeIndex, typewriterTexts]);

  const isTypingComplete = useMemo(() => 
    !isDeleting && displayText === typewriterTexts[typeIndex], 
    [isDeleting, displayText, typewriterTexts, typeIndex]
  );

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Search Icon */}
      <View style={styles.iconContainer}>
        <Ionicons 
          name="search" 
          size={COMPONENT_SPACING.SEARCH_BAR.ICON_SIZE} 
          color={COLORS.textPrimary} 
        />
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.primaryText}>
          {DEFAULTS.SEARCH_PLACEHOLDER.PRIMARY}
        </Text>
        <Text style={styles.secondaryText}>
          {displayText}
          {isTypingComplete && (
            <Text style={styles.cursor}>...</Text>
          )}
        </Text>
      </View>

      {/* Filter Button */}
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={handleFilterPress}
        activeOpacity={0.7}
      >
        <View style={styles.filterIconContainer}>
          <Ionicons 
            name="options" 
            size={20} 
            color={COLORS.textPrimary} 
          />
        </View>
      </TouchableOpacity>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={handleFilterClose}
        onApply={handleFiltersApply}
      />
    </TouchableOpacity>
  );
});

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed from 'center' to 'flex-start'
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.ROUND,
    paddingVertical: COMPONENT_SPACING.SEARCH_BAR.VERTICAL,
    paddingHorizontal: COMPONENT_SPACING.SEARCH_BAR.HORIZONTAL,
    marginHorizontal: COMPONENT_SPACING.SEARCH_BAR.HORIZONTAL,
    marginTop: COMPONENT_SPACING.SEARCH_BAR.HORIZONTAL,
    gap: COMPONENT_SPACING.SEARCH_BAR.GAP,
    ...SHADOW_PRESETS.MEDIUM,
  },
  iconContainer: {
    width: COMPONENT_SPACING.SEARCH_BAR.ICON_SIZE,
    height: COMPONENT_SPACING.SEARCH_BAR.ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2, // Slight adjustment to align with text
  },
  textContainer: {
    flex: 1,
    gap: 4, // Using minimal gap for text elements
    minHeight: COMPONENT_SPACING.SEARCH_BAR.ICON_SIZE, // Ensure minimum height
  },
  primaryText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: FONT_SIZE.MD + 2,
  },
  secondaryText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '400',
    color: COLORS.textMuted,
    lineHeight: FONT_SIZE.MD + 2,
    minHeight: FONT_SIZE.MD + 2, // Prevent layout shift during animation
  },
  cursor: {
    color: COLORS.textMuted,
    opacity: 0.8,
  },
  filterButton: {
    width: COMPONENT_SPACING.SEARCH_BAR.FILTER_BUTTON_SIZE,
    height: COMPONENT_SPACING.SEARCH_BAR.FILTER_BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2, // Align with search icon
  },
  filterIconContainer: {
    width: COMPONENT_SPACING.SEARCH_BAR.FILTER_BUTTON_SIZE,
    height: COMPONENT_SPACING.SEARCH_BAR.FILTER_BUTTON_SIZE,
    borderRadius: BORDER_RADIUS.CIRCLE,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar; 