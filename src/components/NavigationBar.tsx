import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOW_PRESETS } from '../constants';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface NavigationBarProps {
  activeTab?: string;
  onTabPress?: (tabId: string) => void;
}

/**
 * NavigationBar Component
 * 
 * Alt navigation bar komponenti - Figma tasarımına uygun
 */
const NavigationBar = ({ activeTab = 'home', onTabPress }: NavigationBarProps) => {
  const tabs: Tab[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'search', label: 'Search', icon: 'search' },
    { id: 'favorites', label: 'Favorites', icon: 'heart' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  const renderTab = (tab: Tab) => {
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
            size={24}
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
  };

  return (
    <View style={styles.container}>
      {tabs.map(renderTab)}
    </View>
  );
};

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
    paddingHorizontal: SPACING.sm,
    gap: SPACING.sm,
    ...SHADOW_PRESETS.NAVIGATION,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.xs,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    width: '100%',
  },
  activeTabLabel: {
    color: COLORS.primary,
  },
});

export default NavigationBar; 