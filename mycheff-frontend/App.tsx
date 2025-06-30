import React, { useState, useCallback, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

// Providers
import { QueryProvider } from './src/providers/QueryProvider';
import { ModalProvider } from './src/providers/ModalProvider';
import { AuthProvider, useAuth } from './src/providers/AuthProvider';
import { I18nProvider } from './src/providers/I18nProvider';

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
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { COLORS } from './src/constants';

type Screen = 'Home' | 'Search' | 'SearchResults' | 'Favorites' | 'RecipeDetail' | 'Profile' | 'Chat' | 'CookingSteps' | 'PaymentMethods' | 'PrivacyPolicy' | 'TermsOfService' | 'HelpSupport' | 'ProfileEdit' | 'AddCard' | 'Login' | 'Register' | 'Welcome';

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
  const { isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('Welcome');
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>(['Welcome']);
  const [currentParams, setCurrentParams] = useState<NavigationParams>({});

  const navigation: Navigation = useMemo(() => ({
    navigate: (screen: string, params?: NavigationParams) => {
      console.log('🧭 Navigation: Going to', screen, 'with params:', params);
      const targetScreen = screen as Screen;
      setCurrentScreen(targetScreen);
      setNavigationHistory(prev => [...prev, targetScreen]);
      setCurrentParams(params || {});
    },
    goBack: () => {
      setNavigationHistory(prev => {
        if (prev.length > 1) {
          const newHistory = prev.slice(0, -1);
          const previousScreen = newHistory[newHistory.length - 1];
          setCurrentScreen(previousScreen);
          setCurrentParams({}); // Clear params when going back
          return newHistory;
        }
        return prev;
      });
    },
    getCurrentScreen: () => currentScreen,
  }), [currentScreen]);

  const renderScreen = useCallback(() => {
    console.log('🎬 Rendering screen:', currentScreen, 'with params:', currentParams);
    const screenProps = { navigation, route: { params: currentParams } };
    
    // Show authentication screens if not authenticated
    if (!isAuthenticated) {
      switch (currentScreen) {
        case 'Register':
          return <RegisterScreen {...screenProps} />;
        case 'Login':
          return <LoginScreen {...screenProps} />;
        case 'Welcome':
        default:
          return <WelcomeScreen {...screenProps} />;
      }
    }
    
    // Show main app screens if authenticated
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
        console.log('🍳 Rendering RecipeDetail with params:', currentParams);
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
      case 'Welcome':
        return <WelcomeScreen {...screenProps} />;
      default:
        return <HomeScreen {...screenProps} />;
    }
  }, [currentScreen, navigation, isAuthenticated, currentParams]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

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
        <I18nProvider>
          <QueryProvider>
            <AuthProvider>
              <ModalProvider>
                <AppContent />
                <Toast />
              </ModalProvider>
            </AuthProvider>
          </QueryProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});

export default App;
