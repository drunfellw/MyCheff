import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../providers/AuthProvider';
import { CustomTextInput, CustomTextInputRef } from '../components';
import { COLORS, FONT_SIZE, FONT_FAMILY, SPACING } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

interface RegisterScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Refs for focus management
  const fullNameRef = useRef<CustomTextInputRef>(null);
  const usernameRef = useRef<CustomTextInputRef>(null);
  const emailRef = useRef<CustomTextInputRef>(null);
  const passwordRef = useRef<CustomTextInputRef>(null);
  const confirmPasswordRef = useRef<CustomTextInputRef>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Validation functions
  const validateUsername = useCallback((username: string): string => {
    if (!username) return 'Kullanıcı adı gerekli';
    if (username.length < 3) return 'Kullanıcı adı en az 3 karakter olmalı';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Sadece harf, rakam ve _ kullanabilirsiniz';
    return '';
  }, []);

  const validateEmail = useCallback((email: string): string => {
    if (!email) return 'E-posta adresi gerekli';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Geçerli bir e-posta adresi giriniz';
    return '';
  }, []);

  const validatePassword = useCallback((password: string): string => {
    if (!password) return 'Şifre gerekli';
    if (password.length < 6) return 'Şifre en az 6 karakter olmalı';
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) return 'En az bir büyük ve bir küçük harf içermeli';
    if (!/(?=.*\d)/.test(password)) return 'En az bir rakam içermeli';
    return '';
  }, []);

  const validateConfirmPassword = useCallback((confirmPassword: string, password: string): string => {
    if (!confirmPassword) return 'Şifre onayı gerekli';
    if (confirmPassword !== password) return 'Şifreler eşleşmiyor';
    return '';
  }, []);

  const validateFullName = useCallback((fullName: string): string => {
    if (!fullName) return 'Ad soyad gerekli';
    if (fullName.length < 2) return 'Ad soyad en az 2 karakter olmalı';
    return '';
  }, []);

  // Validate form and update errors & validity
  useEffect(() => {
    const newErrors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
      fullName: validateFullName(formData.fullName),
    };
    
    setErrors(newErrors);
    
    const isValid = !Object.values(newErrors).some(error => error !== '') &&
                   Object.values(formData).every(value => value.trim() !== '');
    
    setIsFormValid(isValid);
  }, [formData, validateUsername, validateEmail, validatePassword, validateConfirmPassword, validateFullName]);

  // Handle input changes
  const handleInputChange = useCallback((field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Handle register
  const handleRegister = async () => {
    if (!isFormValid || isLoading) return;

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        preferredLanguageCode: 'tr',
      });
    } catch (error: any) {
      console.error('Register error:', error);
      
      let errorMessage = 'Kayıt olurken bir hata oluştu';
      if (error.message?.includes('already exists')) {
        errorMessage = 'Bu e-posta veya kullanıcı adı zaten kullanılıyor';
      } else if (error.message?.includes('network')) {
        errorMessage = 'İnternet bağlantınızı kontrol edin';
      }

      Alert.alert('Hata', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="chevron-left" size={24} color={COLORS.textPrimary} />
            <Text style={styles.backButtonText}>Geri</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          bounces={false}
        >
          <Animated.View style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Hesap Oluştur</Text>
              <Text style={styles.subtitle}>MyCheff'e katıl ve lezzetli tarifleri keşfet</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <CustomTextInput
                ref={fullNameRef}
                label="Ad Soyad"
                placeholder="Adınız ve soyadınız"
                value={formData.fullName}
                onChangeText={handleInputChange('fullName')}
                error={errors.fullName}
                leftIcon="user"
                autoCapitalize="words"
                required
                nextInputRef={usernameRef}
              />

              <CustomTextInput
                ref={usernameRef}
                label="Kullanıcı Adı"
                placeholder="kullanici_adi"
                value={formData.username}
                onChangeText={handleInputChange('username')}
                error={errors.username}
                leftIcon="at-sign"
                autoCapitalize="none"
                required
                nextInputRef={emailRef}
              />

              <CustomTextInput
                ref={emailRef}
                label="E-posta Adresi"
                placeholder="ornek@email.com"
                value={formData.email}
                onChangeText={handleInputChange('email')}
                error={errors.email}
                leftIcon="mail"
                keyboardType="email-address"
                autoCapitalize="none"
                required
                nextInputRef={passwordRef}
              />

              <CustomTextInput
                ref={passwordRef}
                label="Şifre"
                placeholder="Güçlü bir şifre oluşturun"
                value={formData.password}
                onChangeText={handleInputChange('password')}
                error={errors.password}
                leftIcon="lock"
                isPassword
                required
                nextInputRef={confirmPasswordRef}
              />

              <CustomTextInput
                ref={confirmPasswordRef}
                label="Şifre Onayı"
                placeholder="Şifrenizi tekrar giriniz"
                value={formData.confirmPassword}
                onChangeText={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                leftIcon="lock"
                isPassword
                required
                onSubmitEditing={handleRegister}
              />

              {/* Register Button */}
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  isFormValid ? styles.registerButtonActive : styles.registerButtonDisabled,
                ]}
                onPress={handleRegister}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.registerButtonText}>Hesap Oluştur</Text>
                )}
              </TouchableOpacity>

              {/* Terms */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  Hesap oluşturarak{' '}
                  <Text style={styles.termsLink}>Kullanım Koşulları</Text>
                  {' '}ve{' '}
                  <Text style={styles.termsLink}>Gizlilik Politikası</Text>
                  'nı kabul etmiş olursunuz.
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Register */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Feather name="globe" size={20} color={COLORS.primary} />
                <Text style={styles.socialButtonText}>Google ile Kayıt Ol</Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Zaten hesabın var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 100 : 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xxxl,
  },
  backButtonContainer: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    zIndex: 100,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButtonText: {
    fontSize: FONT_SIZE.BODY_MEDIUM,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.DISPLAY_SMALL,
    fontFamily: FONT_FAMILY.BOLD,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.BODY_LARGE,
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.xl,
  },
  registerButton: {
    height: 56,
    borderRadius: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  registerButtonActive: {
    backgroundColor: COLORS.primary,
  },
  registerButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  registerButtonText: {
    fontSize: FONT_SIZE.BUTTON_LARGE,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: COLORS.white,
  },
  termsContainer: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  termsText: {
    fontSize: FONT_SIZE.BODY_SMALL,
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.MEDIUM,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: FONT_SIZE.BODY_MEDIUM,
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.lg,
  },
  socialContainer: {
    marginBottom: SPACING.xl,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  socialButtonText: {
    fontSize: FONT_SIZE.BUTTON_LARGE,
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  loginText: {
    fontSize: FONT_SIZE.BODY_MEDIUM,
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontSize: FONT_SIZE.BODY_MEDIUM,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: COLORS.primary,
  },
});

export default RegisterScreen; 