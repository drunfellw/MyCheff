import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../providers/AuthProvider';
import { CustomTextInput, CustomTextInputRef } from '../components';
import { COLORS, FONT_SIZE, FONT_FAMILY, SPACING } from '../constants';

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Refs for focus management
  const emailRef = useRef<CustomTextInputRef>(null);
  const passwordRef = useRef<CustomTextInputRef>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Feather name="chevron-left" size={24} color={COLORS.textPrimary} />
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          bounces={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Giriş Yap</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <CustomTextInput
                ref={emailRef}
                label="E-posta"
                placeholder="E-posta adresiniz"
                value={email}
                onChangeText={setEmail}
                leftIcon="mail"
                keyboardType="email-address"
                autoCapitalize="none"
                required
                nextInputRef={passwordRef}
              />

              <CustomTextInput
                ref={passwordRef}
                label="Şifre"
                placeholder="Şifreniz"
                value={password}
                onChangeText={setPassword}
                leftIcon="lock"
                isPassword
                required
                onSubmitEditing={handleLogin}
              />

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Hesabın yok mu? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    paddingBottom: 100,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: 80,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 8,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: FONT_FAMILY.BOLD,
    color: COLORS.textPrimary,
  },
  form: {
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: COLORS.white,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: COLORS.primary,
  },
});

export default LoginScreen; 