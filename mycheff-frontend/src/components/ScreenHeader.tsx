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
import { 
  createButtonAccessibility,
  createHeadingAccessibility 
} from '../utils/accessibility';
import { 
  useResponsiveDimensions,
  getHitSlop,
  getMinTouchTarget 
} from '../utils/responsiveDesign';

interface ScreenHeaderProps {
  title: string;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  centerElement?: React.ReactNode;
  showBackButton?: boolean;
  backgroundColor?: string;
  testID?: string;
}

/**
 * ScreenHeader Component
 * 
 * Standardized header for all screens with:
 * - Full accessibility support (WCAG 2.1 AA)
 * - Responsive design for all device sizes
 * - Safe area handling
 * - Performance optimizations
 * - Consistent design system integration
 */
const ScreenHeader: React.FC<ScreenHeaderProps> = React.memo(({
  title,
  onBackPress,
  rightElement,
  centerElement,
  showBackButton = true,
  backgroundColor = COLORS.background,
  testID = 'screen-header',
}) => {
  const insets = useSafeAreaInsets();
  const { isSmallDevice } = useResponsiveDimensions();
  
  // Accessibility props for back button
  const backButtonAccessibility = createButtonAccessibility(
    'Go back',
    'Navigate to previous screen',
    !onBackPress
  );
  
  // Accessibility props for title
  const titleAccessibility = createHeadingAccessibility(title, 1);
  
  return (
    <View 
      style={[
        styles.headerContainer, 
        { 
          paddingTop: insets.top, 
          backgroundColor 
        }
      ]}
      testID={testID}
    >
      <View style={[styles.header, { backgroundColor }]}>
        {/* Back Button */}
        {showBackButton ? (
          <TouchableOpacity 
            style={[
              styles.backButton,
              { minHeight: getMinTouchTarget() }
            ]}
            onPress={onBackPress}
            hitSlop={getHitSlop()}
            disabled={!onBackPress}
            {...backButtonAccessibility}
            testID={`${testID}-back-button`}
          >
            <Ionicons 
              name="arrow-back" 
              size={isSmallDevice ? 20 : 24} 
              color={COLORS.textPrimary} 
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButtonSpacer} />
        )}
        
        {/* Center Content */}
        <View style={styles.centerContainer}>
          {centerElement ? (
            centerElement
          ) : (
            <Text 
              style={[
                styles.headerTitle,
                isSmallDevice && styles.smallDeviceTitle
              ]} 
              numberOfLines={1}
              adjustsFontSizeToFit={isSmallDevice}
              minimumFontScale={0.8}
              {...titleAccessibility}
              testID={`${testID}-title`}
            >
              {title}
            </Text>
          )}
        </View>
        
        {/* Right Element */}
        <View style={styles.rightContainer}>
          {rightElement || <View style={styles.rightSpacer} />}
        </View>
      </View>
    </View>
  );
});

ScreenHeader.displayName = 'ScreenHeader';

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
  smallDeviceTitle: {
    fontSize: 15,
    lineHeight: 20,
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

export default ScreenHeader; 