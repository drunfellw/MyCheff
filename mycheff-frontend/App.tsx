import React, { useState, useCallback, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

// Providers
import { QueryProvider } from './src/providers/QueryProvider';
import { ModalProvider } from './src/providers/ModalProvider';

// Screens
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
 * Features optimized navigation system and performance
 */
const AppContent = React.memo(() => {
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
      case 'PaymentMethods':
        return <PaymentMethodsScreen {...screenProps} />;
      case 'PrivacyPolicy':
        return <PrivacyPolicyScreen {...screenProps} />;
      case 'TermsOfService':
        return <TermsOfServiceScreen {...screenProps} />;
      case 'HelpSupport':
        return <HelpSupportScreen {...screenProps} />;
      case 'ProfileEdit':
        return <ProfileEditScreen {...screenProps} />;
      case 'AddCard':
        return <AddCardScreen {...screenProps} />;
      default:
        return <HomeScreen {...screenProps} />;
    }
  }, [currentScreen, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={COLORS.background} />
      {renderScreen()}
    </View>
  );
});

AppContent.displayName = 'AppContent';

const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryProvider>
          <ModalProvider>
            <AppContent />
            <Toast />
          </ModalProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;
