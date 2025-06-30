import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, FONT_FAMILY, SPACING, BORDER_RADIUS } from '../constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Image with Gradient Overlay */}
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d05f5?w=800&h=1200&fit=crop'
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <Animated.View style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ],
              },
            ]}>
              {/* Logo/Brand Section */}
              <View style={styles.brandSection}>
                <View style={styles.logoContainer}>
                  <Feather name="menu" size={60} color={COLORS.white} />
                </View>
                <Text style={styles.brandName}>MyCheff</Text>
                <Text style={styles.tagline}>Mutfağınızın Dijital Asistanı</Text>
              </View>

              {/* Features Section */}
              <View style={styles.featuresSection}>
                <View style={styles.feature}>
                  <Feather name="search" size={24} color={COLORS.white} />
                  <Text style={styles.featureText}>Binlerce nefis tarif</Text>
                </View>
                <View style={styles.feature}>
                  <Feather name="users" size={24} color={COLORS.white} />
                  <Text style={styles.featureText}>Kişisel menü önerileri</Text>
                </View>
                <View style={styles.feature}>
                  <Feather name="heart" size={24} color={COLORS.white} />
                  <Text style={styles.featureText}>Favorilerinizi kaydedin</Text>
                </View>
              </View>

              {/* CTA Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => navigation.navigate('Register')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Hesap Oluştur</Text>
                  <Feather name="arrow-right" size={20} color={COLORS.white} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.secondaryButtonText}>Giriş Yap</Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Devam ederek <Text style={styles.footerLink}>Kullanım Koşulları</Text> ve{' '}
                  <Text style={styles.footerLink}>Gizlilik Politikası</Text>'nı kabul etmiş olursunuz.
                </Text>
              </View>
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'space-between',
    paddingVertical: SPACING.xxxl,
  },
  brandSection: {
    alignItems: 'center',
    marginTop: SPACING.xxxl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  brandName: {
    fontSize: FONT_SIZE.DISPLAY_LARGE,
    fontFamily: FONT_FAMILY.BOLD,
    color: COLORS.white,
    marginBottom: SPACING.sm,
    textShadow: '0px 2px 10px rgba(0,0,0,0.3)',
  },
  tagline: {
    fontSize: FONT_SIZE.BODY_LARGE,
    fontFamily: FONT_FAMILY.REGULAR,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    paddingVertical: SPACING.xxxl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  featureText: {
    fontSize: FONT_SIZE.BODY_LARGE,
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.white,
    marginLeft: SPACING.lg,
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: SPACING.xl,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.XL,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: FONT_SIZE.BUTTON_LARGE,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: COLORS.white,
    marginRight: SPACING.sm,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.XL,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  secondaryButtonText: {
    fontSize: FONT_SIZE.BUTTON_LARGE,
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.white,
  },
  footer: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZE.BODY_SMALL,
    fontFamily: FONT_FAMILY.REGULAR,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  footerLink: {
    color: COLORS.white,
    fontFamily: FONT_FAMILY.MEDIUM,
  },
});

export default WelcomeScreen; 