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
import PaymentMethodsScreen from './src/screens/PaymentMethodsScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from './src/screens/TermsOfServiceScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import ProfileEditScreen from './src/screens/ProfileEditScreen';
import AddCardScreen from './src/screens/AddCardScreen';
import { COLORS } from './src/constants';

type Screen = 'Home' | 'Search' | 'SearchResults' | 'Favorites' | 'RecipeDetail' | 'Profile' | 'Chat' | 'CookingSteps' | 'PaymentMethods' | 'PrivacyPolicy' | 'TermsOfService' | 'HelpSupport' | 'ProfileEdit' | 'AddCard';

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
 * Features optimized navigation system and performance with state preservation
 */
const App = React.memo(() => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>(['Home']);
  const [mountedScreens, setMountedScreens] = useState<Set<Screen>>(new Set(['Home']));

  const navigation: Navigation = useMemo(() => ({
    navigate: (screen: string, params?: NavigationParams) => {
      const targetScreen = screen as Screen;
      setCurrentScreen(targetScreen);
      setNavigationHistory(prev => [...prev, targetScreen]);
      setMountedScreens(prev => new Set([...prev, targetScreen]));
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

  const renderAllScreens = useCallback(() => {
    const screenProps = { navigation };
    
    return (
      <>
        {mountedScreens.has('Home') && (
          <View style={[styles.screen, currentScreen === 'Home' ? styles.activeScreen : styles.hiddenScreen]}>
            <HomeScreen {...screenProps} />
          </View>
        )}
        {mountedScreens.has('Search') && (
          <View style={[styles.screen, currentScreen === 'Search' ? styles.activeScreen : styles.hiddenScreen]}>
            <SearchScreen {...screenProps} />
          </View>
        )}
        {mountedScreens.has('SearchResults') && (
          <View style={[styles.screen, currentScreen === 'SearchResults' ? styles.activeScreen : styles.hiddenScreen]}>
            <SearchResultsScreen {...screenProps} />
          </View>
        )}
        {mountedScreens.has('Favorites') && (
          <View style={[styles.screen, currentScreen === 'Favorites' ? styles.activeScreen : styles.hiddenScreen]}>
            <FavoritesScreen {...screenProps} />
          </View>
        )}
        {mountedScreens.has('RecipeDetail') && (
          <View style={[styles.screen, currentScreen === 'RecipeDetail' ? styles.activeScreen : styles.hiddenScreen]}>
            <RecipeDetailScreen {...screenProps} />
          </View>
        )}
        {mountedScreens.has('Profile') && (
          <View style={[styles.screen, currentScreen === 'Profile' ? styles.activeScreen : styles.hiddenScreen]}>
            <ProfileScreen {...screenProps} />
          </View>
        )}
        {mountedScreens.has('Chat') && (
          <View style={[styles.screen, currentScreen === 'Chat' ? styles.activeScreen : styles.hiddenScreen]}>
            <ChatScreen {...screenProps} />
          </View>
        )}
        {mountedScreens.has('CookingSteps') && (
          <View style={[styles.screen, currentScreen === 'CookingSteps' ? styles.activeScreen : styles.hiddenScreen]}>
            <CookingStepsScreen {...screenProps} />
          </View>
        )}
        {mountedScreens.has('PaymentMethods') && (
          <View style={[styles.screen, currentScreen === 'PaymentMethods' ? styles.activeScreen : styles.hiddenScreen]}>
            <PaymentMethodsScreen {...screenProps} />
          </View>
        )}
        {mountedScreens.has('PrivacyPolicy') && (
          <View style={[styles.screen, currentScreen === 'PrivacyPolicy' ? styles.activeScreen : styles.hiddenScreen]}>
            <PrivacyPolicyScreen {...screenProps} />
          </View>
        )}
        {mountedScreens.has('TermsOfService') && (
          <View style={[styles.screen, currentScreen === 'TermsOfService' ? styles.activeScreen : styles.hiddenScreen]}>
            <TermsOfServiceScreen {...screenProps} />
          </View>
        )}
        {mountedScreens.has('HelpSupport') && (
          <View style={[styles.screen, currentScreen === 'HelpSupport' ? styles.activeScreen : styles.hiddenScreen]}>
            <HelpSupportScreen {...screenProps} />
          </View>
        )}
        {mountedScreens.has('ProfileEdit') && (
          <View style={[styles.screen, currentScreen === 'ProfileEdit' ? styles.activeScreen : styles.hiddenScreen]}>
            <ProfileEditScreen {...screenProps} />
          </View>
        )}
        {mountedScreens.has('AddCard') && (
          <View style={[styles.screen, currentScreen === 'AddCard' ? styles.activeScreen : styles.hiddenScreen]}>
            <AddCardScreen {...screenProps} />
          </View>
        )}
      </>
    );
  }, [currentScreen, navigation, mountedScreens]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={COLORS.background} />
        {renderAllScreens()}
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
  screen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  activeScreen: {
    zIndex: 1,
  },
  hiddenScreen: {
    zIndex: 0,
  },
});

export default App;
