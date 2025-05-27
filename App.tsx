import React, { useState, useCallback, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import SearchResultsScreen from './src/screens/SearchResultsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatScreen from './src/screens/ChatScreen';
import CookingStepsScreen from './src/screens/CookingStepsScreen';
import { COLORS } from './src/constants';

type Screen = 'Home' | 'Search' | 'SearchResults' | 'Favorites' | 'RecipeDetail' | 'Profile' | 'Chat' | 'CookingSteps';

interface NavigationParams {
  [key: string]: any;
}

interface Navigation {
  navigate: (screen: string, params?: NavigationParams) => void;
  goBack: () => void;
  getCurrentScreen: () => Screen;
}

/**
 * Main App Component
 * 
 * MyCheff Frontend - Professional Recipe App
 * Features optimized navigation system and performance
 */
const App = React.memo(() => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>(['Home']);

  const navigation: Navigation = useMemo(() => ({
    navigate: (screen: string, params?: NavigationParams) => {
      const targetScreen = screen as Screen;
      setCurrentScreen(targetScreen);
      setNavigationHistory(prev => [...prev, targetScreen]);
    },
    goBack: () => {
      setNavigationHistory(prev => {
        if (prev.length > 1) {
          const newHistory = prev.slice(0, -1);
          const previousScreen = newHistory[newHistory.length - 1];
          setCurrentScreen(previousScreen);
          return newHistory;
        }
        return prev;
      });
    },
    getCurrentScreen: () => currentScreen,
  }), [currentScreen]);

  const renderScreen = useCallback(() => {
    const screenProps = { navigation };
    
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen {...screenProps} />;
      case 'Search':
        return <SearchScreen {...screenProps} />;
      case 'SearchResults':
        return <SearchResultsScreen {...screenProps} />;
      case 'Favorites':
        return <FavoritesScreen {...screenProps} />;
      case 'RecipeDetail':
        return <RecipeDetailScreen {...screenProps} />;
      case 'Profile':
        return <ProfileScreen {...screenProps} />;
      case 'Chat':
        return <ChatScreen {...screenProps} />;
      case 'CookingSteps':
        return <CookingStepsScreen {...screenProps} />;
      default:
        return <HomeScreen {...screenProps} />;
    }
  }, [currentScreen, navigation]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={COLORS.background} />
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
});

App.displayName = 'App';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;
