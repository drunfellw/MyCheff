import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import NavigationBar from '../components/NavigationBar';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW_PRESETS } from '../constants';

interface ProfileScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

interface UserInfo {
  name: string;
  email: string;
  avatar: string;
  isPremium: boolean;
  memberSince: string;
  recipesCreated: number;
  favoriteCount: number;
}

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
}

/**
 * ProfileScreen Component
 * 
 * Comprehensive profile page with user info, premium status,
 * payment methods, and settings
 */
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  // Mock user data - Backend'den gelecek
  const [userInfo] = useState<UserInfo>({
    name: 'İsmail Uzun',
    email: 'ismail@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isPremium: true,
    memberSince: 'January 2024',
    recipesCreated: 12,
    favoriteCount: 45,
  });

  // Mock payment methods - Backend'den gelecek
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'visa',
      lastFour: '4532',
      expiryDate: '12/26',
      isDefault: true,
    },
    {
      id: '2',
      type: 'mastercard',
      lastFour: '8901',
      expiryDate: '08/25',
      isDefault: false,
    },
  ]);

  const handleTabPress = useCallback((tabId: string) => {
    setActiveTab(tabId);
    
    switch (tabId) {
      case 'home':
        navigation?.navigate('Home');
        break;
      case 'cheff':
        navigation?.navigate('Chat');
        break;
      case 'search':
        navigation?.navigate('Search');
        break;
      case 'profile':
        // Already on profile screen
        break;
    }
  }, [navigation]);

  const handleEditProfile = useCallback(() => {
    navigation?.navigate('ProfileEdit');
  }, [navigation]);

  const handleUpgradeToPremium = useCallback(() => {
    // TODO: Navigate to premium upgrade screen
    Alert.alert('Upgrade to Premium', 'Premium upgrade functionality coming soon!');
  }, []);

  const handleAddPaymentMethod = useCallback(() => {
    navigation?.navigate('PaymentMethods');
  }, [navigation]);

  const handleSocialLogin = useCallback((provider: 'google' | 'facebook' | 'apple') => {
    // TODO: Implement social login
    Alert.alert('Social Login', `${provider} login functionality coming soon!`);
  }, []);

  const handleLegalDocument = useCallback((document: string) => {
    switch (document) {
      case 'Privacy Policy':
        navigation?.navigate('PrivacyPolicy');
        break;
      case 'Terms of Service':
        navigation?.navigate('TermsOfService');
        break;
      case 'Help & Support':
        navigation?.navigate('HelpSupport');
        break;
      default:
        Alert.alert('Legal Document', `${document} will be displayed here.`);
    }
  }, [navigation]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement logout
            console.log('User logged out');
          }
        },
      ]
    );
  }, []);

  const getCardIcon = useCallback((type: PaymentMethod['type']) => {
    switch (type) {
      case 'visa':
        return 'card';
      case 'mastercard':
        return 'card';
      case 'amex':
        return 'card';
      default:
        return 'card';
    }
  }, []);

  const renderProfileHeader = useCallback(() => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
        {userInfo.isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={16} color={COLORS.white} />
          </View>
        )}
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userInfo.name}</Text>
        <Text style={styles.userEmail}>{userInfo.email}</Text>
        <Text style={styles.memberSince}>Member since {userInfo.memberSince}</Text>
      </View>
      
      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Ionicons name="pencil" size={20} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  ), [userInfo, handleEditProfile]);

  const renderStats = useCallback(() => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{userInfo.recipesCreated}</Text>
        <Text style={styles.statLabel}>Recipes</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{userInfo.favoriteCount}</Text>
        <Text style={styles.statLabel}>Favorites</Text>
      </View>
    </View>
  ), [userInfo]);

  const renderFavoritesSection = useCallback(() => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>My Favorites</Text>
      
      {/* Favorites Card */}
      <TouchableOpacity 
        style={styles.favoritesCard} 
        onPress={() => navigation?.navigate('Favorites')}
        activeOpacity={0.7}
      >
        <View style={styles.favoritesCardHeader}>
          <View style={styles.favoritesIconContainer}>
            <Ionicons name="heart" size={28} color={COLORS.primary} />
          </View>
          <View style={styles.favoritesCardContent}>
            <Text style={styles.favoritesCardTitle}>Saved Recipes</Text>
            <Text style={styles.favoritesCardSubtitle}>
              {userInfo.favoriteCount} recipes saved to your favorites
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
        </View>
      </TouchableOpacity>
    </View>
  ), [navigation, userInfo.favoriteCount]);

  const renderPremiumSection = useCallback(() => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Premium Status</Text>
      <View style={[styles.premiumCard, userInfo.isPremium && styles.premiumCardActive]}>
        <View style={styles.premiumInfo}>
          <Ionicons 
            name={userInfo.isPremium ? "star" : "star-outline"} 
            size={24} 
            color={userInfo.isPremium ? COLORS.white : COLORS.textSecondary} 
          />
          <View style={styles.premiumText}>
            <Text style={[styles.premiumTitle, userInfo.isPremium && styles.premiumTitleActive]}>
              {userInfo.isPremium ? 'Premium Member' : 'Free Member'}
            </Text>
            <Text style={[styles.premiumSubtitle, userInfo.isPremium && styles.premiumSubtitleActive]}>
              {userInfo.isPremium 
                ? 'Unlimited access to all features' 
                : 'Upgrade to unlock premium features'
              }
            </Text>
          </View>
        </View>
        
        {!userInfo.isPremium && (
          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgradeToPremium}>
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  ), [userInfo, handleUpgradeToPremium]);

  const renderSocialLogins = useCallback(() => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Connected Accounts</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity 
          style={styles.socialButton} 
          onPress={() => handleSocialLogin('google')}
        >
          <Ionicons name="logo-google" size={24} color="#DB4437" />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.socialButton} 
          onPress={() => handleSocialLogin('facebook')}
        >
          <Ionicons name="logo-facebook" size={24} color="#4267B2" />
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.socialButton} 
          onPress={() => handleSocialLogin('apple')}
        >
          <Ionicons name="logo-apple" size={24} color={COLORS.textPrimary} />
          <Text style={styles.socialButtonText}>Apple</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [handleSocialLogin]);

  const renderPaymentMethods = useCallback(() => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment & Billing</Text>
      
      {/* Payment Methods Card */}
      <TouchableOpacity style={styles.paymentMethodsCard} onPress={handleAddPaymentMethod}>
        <View style={styles.paymentMethodsHeader}>
          <View style={styles.paymentMethodsInfo}>
            <Ionicons name="card" size={24} color={COLORS.primary} />
            <View style={styles.paymentMethodsText}>
              <Text style={styles.paymentMethodsTitle}>Payment Methods</Text>
              <Text style={styles.paymentMethodsSubtitle}>
                {paymentMethods.length} card{paymentMethods.length !== 1 ? 's' : ''} added
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </View>
        
        {/* Preview of cards */}
        {paymentMethods.length > 0 && (
          <View style={styles.paymentMethodsPreview}>
            {paymentMethods.slice(0, 2).map((method, index) => (
              <View key={method.id} style={styles.paymentMethodPreview}>
                <Ionicons name={getCardIcon(method.type)} size={16} color={COLORS.textSecondary} />
                <Text style={styles.paymentMethodPreviewText}>
                  •••• {method.lastFour}
                </Text>
                {method.isDefault && (
                  <View style={styles.defaultBadgeSmall}>
                    <Text style={styles.defaultBadgeSmallText}>Default</Text>
                  </View>
                )}
              </View>
            ))}
            {paymentMethods.length > 2 && (
              <Text style={styles.moreCardsText}>+{paymentMethods.length - 2} more</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  ), [paymentMethods, handleAddPaymentMethod, getCardIcon]);

  const renderSettings = useCallback(() => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Settings</Text>
      
      {/* Dark Mode */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="moon" size={24} color={COLORS.textSecondary} />
          <Text style={styles.settingText}>Dark Mode</Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
      </View>
      
      {/* Notifications */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="notifications" size={24} color={COLORS.textSecondary} />
          <Text style={styles.settingText}>Push Notifications</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
      </View>
    </View>
  ), [isDarkMode, notificationsEnabled]);

  const renderLegalSection = useCallback(() => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Legal & Support</Text>
      
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => handleLegalDocument('Privacy Policy')}
      >
        <Ionicons name="shield-checkmark" size={24} color={COLORS.textSecondary} />
        <Text style={styles.menuItemText}>Privacy Policy</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => handleLegalDocument('Terms of Service')}
      >
        <Ionicons name="document-text" size={24} color={COLORS.textSecondary} />
        <Text style={styles.menuItemText}>Terms of Service</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => handleLegalDocument('Help & Support')}
      >
        <Ionicons name="help-circle" size={24} color={COLORS.textSecondary} />
        <Text style={styles.menuItemText}>Help & Support</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="#FF3B30" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  ), [handleLegalDocument, handleLogout]);

  return (
    <View style={styles.container}>
        {/* Header */}
        <ScreenHeader
          title="Profile"
          onBackPress={() => navigation?.goBack()}
          backgroundColor={COLORS.background}
          rightElement={
            <TouchableOpacity onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          }
        />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: SPACING.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {renderProfileHeader()}
        {renderStats()}
        {renderFavoritesSection()}
        {renderPremiumSection()}
        {renderSocialLogins()}
        {renderPaymentMethods()}
        {renderSettings()}
        {renderLegalSection()}
        
        {/* Bottom spacing for NavigationBar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Navigation Bar */}
        <NavigationBar
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOW_PRESETS.MEDIUM,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.CIRCLE,
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.CIRCLE,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZE.XL,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  memberSince: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOW_PRESETS.MEDIUM,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  premiumCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOW_PRESETS.MEDIUM,
  },
  premiumCardActive: {
    backgroundColor: COLORS.primary,
  },
  premiumInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumText: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  premiumTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  premiumTitleActive: {
    color: COLORS.white,
  },
  premiumSubtitle: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
  },
  premiumSubtitleActive: {
    color: COLORS.white,
    opacity: 0.8,
  },
  upgradeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.LG,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  upgradeButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.white,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.md,
    gap: SPACING.sm,
    ...SHADOW_PRESETS.SMALL,
  },
  socialButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  paymentMethodsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.lg,
    ...SHADOW_PRESETS.MEDIUM,
  },
  paymentMethodsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  paymentMethodsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodsText: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  paymentMethodsTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  paymentMethodsSubtitle: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
  },
  paymentMethodsPreview: {
    gap: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  paymentMethodPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  paymentMethodPreviewText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textSecondary,
    flex: 1,
  },
  defaultBadgeSmall: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.XS,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
  },
  defaultBadgeSmallText: {
    fontSize: FONT_SIZE.XS,
    fontWeight: '600',
    color: COLORS.white,
  },
  moreCardsText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  defaultBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.SM,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  defaultBadgeText: {
    fontSize: FONT_SIZE.XS,
    fontWeight: '600',
    color: COLORS.white,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW_PRESETS.SMALL,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW_PRESETS.SMALL,
  },
  menuItemText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    ...SHADOW_PRESETS.SMALL,
  },
  logoutButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: SPACING.md,
  },
  bottomSpacing: {
    height: 120, // NavigationBar + extra space için
  },
  favoritesCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.lg,
    ...SHADOW_PRESETS.MEDIUM,
  },
  favoritesCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  favoritesIconContainer: {
    marginRight: SPACING.md,
  },
  favoritesCardContent: {
    flex: 1,
  },
  favoritesCardTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  favoritesCardSubtitle: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
  },
});

export default React.memo(ProfileScreen); 