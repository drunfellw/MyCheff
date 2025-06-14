import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  COLORS, 
  COMPONENT_SPACING, 
  TEXT_STYLES,
  SHADOW_PRESETS,
  NAVIGATION_TABS 
} from '../constants';
import { createTabAccessibility } from '../utils/accessibility';
import { 
  useResponsiveDimensions,
  getHitSlop, 
  getMinTouchTarget 
} from '../utils/responsiveDesign';

interface NavigationBarProps {
  activeTab?: string;
  onTabPress?: (tabId: string) => void;
}

/**
 * NavigationBar Component
 * 
 * Professional bottom navigation bar with:
 * - Full accessibility support (WCAG 2.1 AA)
 * - Responsive design for all device sizes
 * - Safe area handling
 * - Performance optimizations
 * - Consistent design system integration
 */
const NavigationBar = React.memo<NavigationBarProps>(({ 
  activeTab = 'home', 
  onTabPress 
}) => {
  const insets = useSafeAreaInsets();
  const { navigationBar, isSmallDevice } = useResponsiveDimensions();
  
  const renderTab = useCallback((tab: typeof NAVIGATION_TABS[0], index: number) => {
    const isActive = tab.id === activeTab;
    const totalTabs = NAVIGATION_TABS.length;
    
    // Accessibility props
    const accessibilityProps = createTabAccessibility(
      tab.label,
      isActive,
      index,
      totalTabs
    );
    
    return (
      <TouchableOpacity
        key={tab.id}
        style={[
          styles.tabItem,
          { minHeight: getMinTouchTarget() }
        ]}
        onPress={() => onTabPress?.(tab.id)}
        activeOpacity={0.7}
        hitSlop={getHitSlop()}
        {...accessibilityProps}
      >
        {/* Tab Icon */}
        <View style={[
          styles.iconContainer,
          { 
            width: navigationBar.iconSize,
            height: navigationBar.iconSize 
          }
        ]}>
          <Ionicons
            name={`${tab.icon}${isActive ? '' : '-outline'}` as any}
            size={navigationBar.iconSize}
            color={isActive ? COLORS.primary : COLORS.textSecondary}
          />
        </View>

        {/* Tab Label */}
        <Text 
          style={[
            styles.tabLabel,
            { fontSize: navigationBar.fontSize },
            isActive && styles.activeTabLabel,
            isSmallDevice && styles.smallDeviceLabel
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit={isSmallDevice}
          minimumFontScale={0.8}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  }, [activeTab, onTabPress, navigationBar, isSmallDevice]);

  return (
    <View 
      style={[
        styles.container,
        { 
          height: navigationBar.height + insets.bottom,
          paddingBottom: insets.bottom 
        }
      ]}
      accessibilityRole="tablist"
      accessibilityLabel={`Navigation with ${NAVIGATION_TABS.length} tabs`}
    >
      <View style={styles.tabContainer}>
        {NAVIGATION_TABS.map((tab, index) => renderTab(tab, index))}
      </View>
    </View>
  );
});

NavigationBar.displayName = 'NavigationBar';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOW_PRESETS.NAVIGATION,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingHorizontal: COMPONENT_SPACING.NAVIGATION.PADDING,
    height: COMPONENT_SPACING.NAVIGATION.HEIGHT,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    ...TEXT_STYLES.tabLabel,
    color: COLORS.textSecondary,
    textAlign: 'center',
    width: '100%',
  },
  activeTabLabel: {
    color: COLORS.primary,
    fontFamily: TEXT_STYLES.tabLabel.fontFamily,
  },
  smallDeviceLabel: {
    fontSize: 10,
    lineHeight: 12,
  },
});

export default NavigationBar; 