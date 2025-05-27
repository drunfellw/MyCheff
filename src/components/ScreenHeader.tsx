import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  COLORS, 
  SPACING, 
  FONT_SIZE, 
  BORDER_RADIUS,
  SHADOW_PRESETS 
} from '../constants';

interface ScreenHeaderProps {
  title: string;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  showBackButton?: boolean;
  backgroundColor?: string;
}

/**
 * ScreenHeader Component
 * 
 * Standardized header for all screens
 * Consistent styling, spacing, and behavior
 */
const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBackPress,
  rightElement,
  showBackButton = true,
  backgroundColor = COLORS.white,
}) => {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      {showBackButton ? (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBackPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButtonSpacer} />
      )}
      
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      
      <View style={styles.rightContainer}>
        {rightElement || <View style={styles.rightSpacer} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 56,
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
  backButtonSpacer: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: FONT_SIZE.XL,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.md,
  },
  rightContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSpacer: {
    width: 40,
    height: 40,
  },
});

export default React.memo(ScreenHeader); 