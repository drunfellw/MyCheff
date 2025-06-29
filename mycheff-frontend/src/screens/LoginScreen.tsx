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

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

interface FormErrors {
  email: string;
  password: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
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

  const validateEmail = (email: string): string => {
    if (!email) return 'E-posta adresi gerekli';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Geçerli bir e-posta adresi giriniz';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Şifre gerekli';
    if (password.length < 6) return 'Şifre en az 6 karakter olmalı';
    return '';
  };

  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    setIsFormValid(!emailError && !passwordError && formData.email && formData.password);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
    if (!isFormValid || isLoading) return;

    try {
      await login(formData.email, formData.password);
      // Navigation will be handled by App.tsx based on auth state
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Giriş yapılırken bir hata oluştu';
      if (error.message?.includes('Invalid credentials')) {
        errorMessage = 'E-posta veya şifre hatalı';
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
                <Text style={styles.title}>Hoş Geldin!</Text>
                <Text style={styles.subtitle}>MyCheff hesabına giriş yap ve yemek dünyasını keşfet</Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
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
                  placeholder="Şifrenizi giriniz"
                  secureTextEntry={!showPassword}
                  icon="lock"
                  error={errors.password}
                  rightIcon={showPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />

                {/* Forgot Password */}
                <TouchableOpacity 
                  style={styles.forgotPasswordContainer}
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    isFormValid ? styles.loginButtonActive : styles.loginButtonDisabled,
                  ]}
                  onPress={handleLogin}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={COLORS.white} size="small" />
                  ) : (
                    <Text style={styles.loginButtonText}>Giriş Yap</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>veya</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login */}
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Feather name="globe" size={20} color={COLORS.primary} />
                  <Text style={styles.socialButtonText}>Google ile Giriş</Text>
                </TouchableOpacity>
              </View>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Hesabın yok mu? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>Kayıt Ol</Text>
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
    paddingTop: SPACING.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  title: {
    fontSize: FONT_SIZE.DISPLAY_SMALL,
    fontFamily: FONT_FAMILY.BOLD,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.BODY_LARGE,
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.xxxl,
  },
  inputContainer: {
    marginBottom: SPACING.xl,
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: SPACING.xl,
  },
  forgotPasswordText: {
    fontSize: FONT_SIZE.BODY_MEDIUM,
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.primary,
  },
  loginButton: {
    height: 56,
    borderRadius: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonActive: {
    backgroundColor: COLORS.primary,
  },
  loginButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  loginButtonText: {
    fontSize: FONT_SIZE.BUTTON_LARGE,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: COLORS.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xxxl,
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
    marginBottom: SPACING.xxxl,
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  registerText: {
    fontSize: FONT_SIZE.BODY_MEDIUM,
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.textSecondary,
  },
  registerLink: {
    fontSize: FONT_SIZE.BODY_MEDIUM,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: COLORS.primary,
  },
});

export default LoginScreen; 