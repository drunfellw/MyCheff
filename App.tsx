import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import { COLORS } from './src/constants';

type Screen = 'Home' | 'Search';

/**
 * Main App Component
 * 
 * MyCheff Frontend - Professional Recipe App
 * Basit navigation sistemi ile screen yönetimi
 */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');

  const navigation = {
    navigate: (screen: Screen) => {
      setCurrentScreen(screen);
    },
    goBack: () => {
      setCurrentScreen('Home');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Search':
        return <SearchScreen navigation={navigation} />;
      case 'Home':
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
