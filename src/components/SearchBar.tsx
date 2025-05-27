import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW_PRESETS, DEFAULTS } from '../constants';
import FilterModal from './FilterModal';

interface SearchBarProps {
  onPress?: () => void;
  onFiltersApplied?: (filters: any) => void;
  style?: ViewStyle;
}

/**
 * SearchBar Component
 * 
 * Figma tasarımına uygun search bar component'i
 * Bu bir buton olarak çalışır, gerçek input değil
 * Typewriter animasyonu ile secondary text
 * 
 * @param {SearchBarProps} props - Component props
 */
const SearchBar = ({ onPress, onFiltersApplied, style }: SearchBarProps): React.JSX.Element => {
  const [displayText, setDisplayText] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [typeIndex, setTypeIndex] = useState<number>(0);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  
  const typewriterTexts: string[] = [
    'Search recipes by what you have',
    'Find meals with your ingredients',
    'Discover dishes you can cook now',
    'Cook with available ingredients'
  ];

  useEffect(() => {
    const currentText = typewriterTexts[typeIndex];
    
    const typeSpeed = isDeleting ? 20 : 40; // Daha da hızlandırdık
    const delay = isDeleting ? 0 : (displayText === currentText ? 1200 : 0); // Bekleme süresini daha da kısalttık
    
    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentText) {
        // Tam yazıldı, bekle sonra silmeye başla
        setIsDeleting(true);
      } else if (isDeleting && displayText === '') {
        // Tamamen silindi, sonraki metne geç
        setIsDeleting(false);
        setTypeIndex((prev) => (prev + 1) % typewriterTexts.length);
      } else if (isDeleting) {
        // Sil
        setDisplayText(currentText.substring(0, displayText.length - 1));
      } else {
        // Yaz
        setDisplayText(currentText.substring(0, displayText.length + 1));
      }
    }, delay || typeSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, typeIndex]);

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Sol taraftaki arama ikonu */}
      <View style={styles.iconContainer}>
        <Ionicons 
          name="search" 
          size={24} 
          color={COLORS.textPrimary} 
        />
      </View>

      {/* Orta kısımdaki text'ler */}
      <View style={styles.textContainer}>
        <Text style={styles.primaryText}>
          {DEFAULTS.SEARCH_PLACEHOLDER.PRIMARY}
        </Text>
        <Text style={styles.secondaryText}>
          {displayText}
          {!isDeleting && displayText === typewriterTexts[typeIndex] && (
            <Text style={styles.cursor}>...</Text>
          )}
        </Text>
      </View>

      {/* Sağ taraftaki filter butonu */}
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={() => setShowFilterModal(true)}
        activeOpacity={0.7}
      >
        <View style={styles.filterIconContainer}>
          <Ionicons 
            name="options" 
            size={16} 
            color={COLORS.textPrimary} 
          />
        </View>
      </TouchableOpacity>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={(filters) => {
          onFiltersApplied?.(filters);
          console.log('Filters applied:', filters);
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.ROUND,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    gap: SPACING.md,
    ...SHADOW_PRESETS.MEDIUM,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: SPACING.xs,
  },
  primaryText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 16,
  },
  secondaryText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '400',
    color: COLORS.textMuted,
    lineHeight: 16,
    minHeight: 16, // Animasyon sırasında yükseklik sabit kalsın
  },
  cursor: {
    color: COLORS.textMuted,
    opacity: 0.8,
  },
  filterButton: {
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
});

export default SearchBar; 