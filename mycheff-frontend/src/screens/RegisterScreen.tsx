import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../providers/AuthProvider';
import { COLORS, FONT_SIZE, FONT_FAMILY, SPACING } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

interface RegisterScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

interface FormErrors {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
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
  const [errors, setErrors] = useState<FormErrors>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
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

  // Real-time validation
  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateUsername = (username: string): string => {
    if (!username) return 'Kullanıcı adı gerekli';
    if (username.length < 3) return 'Kullanıcı adı en az 3 karakter olmalı';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Sadece harf, rakam ve _ kullanabilirsiniz';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email) return 'E-posta adresi gerekli';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Geçerli bir e-posta adresi giriniz';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Şifre gerekli';
    if (password.length < 6) return 'Şifre en az 6 karakter olmalı';
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) return 'En az bir büyük ve bir küçük harf içermeli';
    if (!/(?=.*\d)/.test(password)) return 'En az bir rakam içermeli';
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string => {
    if (!confirmPassword) return 'Şifre onayı gerekli';
    if (confirmPassword !== password) return 'Şifreler eşleşmiyor';
    return '';
  };

  const validateFullName = (fullName: string): string => {
    if (!fullName) return 'Ad soyad gerekli';
    if (fullName.length < 2) return 'Ad soyad en az 2 karakter olmalı';
    return '';
  };

  const validateForm = () => {
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
    const fullNameError = validateFullName(formData.fullName);

    setErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      fullName: fullNameError,
    });

    setIsFormValid(
      !usernameError && 
      !emailError && 
      !passwordError && 
      !confirmPasswordError && 
      !fullNameError &&
      formData.username && 
      formData.email && 
      formData.password && 
      formData.confirmPassword &&
      formData.fullName
    );
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

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
      // Navigation will be handled by App.tsx based on auth state
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

  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    secureTextEntry = false,
    error = '',
    icon,
    keyboardType = 'default',
    autoCapitalize = 'none',
    rightIcon,
    onRightIconPress,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    error?: string;
    icon: string;
    keyboardType?: any;
    autoCapitalize?: any;
    rightIcon?: string;
    onRightIconPress?: () => void;
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        error ? styles.inputWrapperError : null,
        value && !error ? styles.inputWrapperSuccess : null,
      ]}>
        <Feather name={icon as any} size={20} color={error ? COLORS.error : COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconContainer}>
            <Feather name={rightIcon as any} size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Animated.View style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Hesap Oluştur</Text>
                <Text style={styles.subtitle}>MyCheff'e katıl ve yemek keşfet</Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                <InputField
                  label="Ad Soyad"
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange('fullName', text)}
                  placeholder="Adınız ve soyadınız"
                  autoCapitalize="words"
                  icon="user"
                  error={errors.fullName}
                />

                <InputField
                  label="Kullanıcı Adı"
                  value={formData.username}
                  onChangeText={(text) => handleInputChange('username', text)}
                  placeholder="kullanici_adi"
                  icon="at-sign"
                  error={errors.username}
                />

                <InputField
                  label="E-posta Adresi"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  placeholder="ornek@email.com"
                  keyboardType="email-address"
                  icon="mail"
                  error={errors.email}
                />

                <InputField
                  label="Şifre"
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  placeholder="Güçlü bir şifre oluşturun"
                  secureTextEntry={!showPassword}
                  icon="lock"
                  error={errors.password}
                  rightIcon={showPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />

                <InputField
                  label="Şifre Onayı"
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleInputChange('confirmPassword', text)}
                  placeholder="Şifrenizi tekrar giriniz"
                  secureTextEntry={!showConfirmPassword}
                  icon="lock"
                  error={errors.confirmPassword}
                  rightIcon={showConfirmPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
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
      </TouchableWithoutFeedback>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xxxl,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: SPACING.sm,
    marginBottom: SPACING.lg,
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
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZE.LABEL_LARGE,
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    height: 56,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  inputWrapperSuccess: {
    borderColor: COLORS.success,
  },
  inputIcon: {
    marginRight: SPACING.md,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.BODY_LARGE,
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.textPrimary,
  },
  rightIconContainer: {
    padding: SPACING.sm,
  },
  errorText: {
    fontSize: FONT_SIZE.BODY_SMALL,
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.error,
    marginTop: SPACING.xs,
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