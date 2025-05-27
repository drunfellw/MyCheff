import React, { useState } from 'react';
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

/**
 * Main App Component
 * 
 * MyCheff Frontend - Professional Recipe App
 * Basit navigation sistemi ile screen yönetimi
 */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');

  const navigation = {
    navigate: (screen: string, params?: any) => {
      setCurrentScreen(screen as Screen);
    },
    goBack: () => {
      setCurrentScreen('Home');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen navigation={navigation} />;
      case 'Search':
        return <SearchScreen navigation={navigation} />;
      case 'SearchResults':
        return <SearchResultsScreen navigation={navigation} />;
      case 'Favorites':
        return <FavoritesScreen navigation={navigation} />;
      case 'RecipeDetail':
        return <RecipeDetailScreen navigation={navigation} />;
      case 'Profile':
        return <ProfileScreen navigation={navigation} />;
      case 'Chat':
        return <ChatScreen navigation={navigation} />;
      case 'CookingSteps':
        return <CookingStepsScreen navigation={navigation} />;
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={COLORS.background} />
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
