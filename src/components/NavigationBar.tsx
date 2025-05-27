import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  COLORS, 
  COMPONENT_SPACING, 
  TEXT_STYLES,
  FONT_SIZE, 
  SHADOW_PRESETS,
  NAVIGATION_TABS 
} from '../constants';

interface NavigationBarProps {
  activeTab?: string;
  onTabPress?: (tabId: string) => void;
}

/**
 * NavigationBar Component
 * 
 * Professional bottom navigation bar following design system
 * Uses centralized tab configuration from constants
 */
const NavigationBar = React.memo<NavigationBarProps>(({ 
  activeTab = 'home', 
  onTabPress 
}) => {
  const renderTab = useCallback((tab: typeof NAVIGATION_TABS[0]) => {
    const isActive = tab.id === activeTab;
    
    return (
      <TouchableOpacity
        key={tab.id}
        style={styles.tabItem}
        onPress={() => onTabPress?.(tab.id)}
        activeOpacity={0.7}
      >
        {/* Tab Icon */}
        <View style={styles.iconContainer}>
          <Ionicons
            name={`${tab.icon}${isActive ? '' : '-outline'}` as any}
            size={COMPONENT_SPACING.NAVIGATION.ICON_SIZE}
            color={isActive ? COLORS.primary : COLORS.textSecondary}
          />
        </View>

        {/* Tab Label */}
        <Text style={[
          styles.tabLabel,
          isActive && styles.activeTabLabel
        ]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  }, [activeTab, onTabPress]);

  return (
    <View style={styles.container}>
      {NAVIGATION_TABS.map(renderTab)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: COLORS.white,
    paddingHorizontal: COMPONENT_SPACING.NAVIGATION.PADDING,
    height: COMPONENT_SPACING.NAVIGATION.HEIGHT,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOW_PRESETS.NAVIGATION,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: COMPONENT_SPACING.NAVIGATION.PADDING,
    gap: 4, // Minimal gap between icon and label
  },
  iconContainer: {
    width: COMPONENT_SPACING.NAVIGATION.ICON_SIZE,
    height: COMPONENT_SPACING.NAVIGATION.ICON_SIZE,
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
  },
});

export default NavigationBar; 