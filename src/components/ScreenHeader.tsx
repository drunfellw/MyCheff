import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  COLORS, 
  SPACING, 
  TEXT_STYLES, 
  BORDER_RADIUS,
  SHADOW_PRESETS 
} from '../constants';

interface ScreenHeaderProps {
  title: string;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  centerElement?: React.ReactNode;
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
  centerElement,
  showBackButton = true,
  backgroundColor = COLORS.background,
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top, backgroundColor }]}>
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
        
        <View style={styles.centerContainer}>
          {centerElement ? (
            centerElement
          ) : (
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>
        
        <View style={styles.rightContainer}>
          {rightElement || <View style={styles.rightSpacer} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.background,
  },
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
    ...TEXT_STYLES.navigationTitle,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  rightContainer: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rightSpacer: {
    width: 40,
    height: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(ScreenHeader); 