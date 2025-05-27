import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavigationBar from '../components/NavigationBar';
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
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);

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
      case 'search':
        navigation?.navigate('SearchResults');
        break;
      case 'favorites':
        navigation?.navigate('Favorites');
        break;
      case 'profile':
        // Already on profile screen
        break;
    }
  }, [navigation]);

  const handleEditProfile = useCallback(() => {
    // TODO: Navigate to edit profile screen
    Alert.alert('Edit Profile', 'Edit profile functionality coming soon!');
  }, []);

  const handleUpgradeToPremium = useCallback(() => {
    // TODO: Navigate to premium upgrade screen
    Alert.alert('Upgrade to Premium', 'Premium upgrade functionality coming soon!');
  }, []);

  const handleAddPaymentMethod = useCallback(() => {
    // TODO: Navigate to add payment method screen
    Alert.alert('Add Payment Method', 'Add payment method functionality coming soon!');
  }, []);

  const handleSocialLogin = useCallback((provider: 'google' | 'facebook' | 'apple') => {
    // TODO: Implement social login
    Alert.alert('Social Login', `${provider} login functionality coming soon!`);
  }, []);

  const handleLegalDocument = useCallback((document: string) => {
    // TODO: Navigate to legal document screen
    Alert.alert('Legal Document', `${document} will be displayed here.`);
  }, []);

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
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        <TouchableOpacity onPress={handleAddPaymentMethod}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {paymentMethods.map((method) => (
        <View key={method.id} style={styles.paymentMethod}>
          <View style={styles.paymentInfo}>
            <Ionicons name={getCardIcon(method.type)} size={24} color={COLORS.textSecondary} />
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentType}>
                {method.type.toUpperCase()} •••• {method.lastFour}
              </Text>
              <Text style={styles.paymentExpiry}>Expires {method.expiryDate}</Text>
            </View>
          </View>
          
          {method.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
      ))}
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
      
      {/* Email Notifications */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="mail" size={24} color={COLORS.textSecondary} />
          <Text style={styles.settingText}>Email Notifications</Text>
        </View>
        <Switch
          value={emailNotifications}
          onValueChange={setEmailNotifications}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
      </View>
    </View>
  ), [isDarkMode, notificationsEnabled, emailNotifications]);

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
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Profile</Text>
        
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderProfileHeader()}
        {renderStats()}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW_PRESETS.SMALL,
  },
  headerTitle: {
    fontSize: FONT_SIZE.XL,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerSpacer: {
    width: 40,
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
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW_PRESETS.SMALL,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentDetails: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  paymentType: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  paymentExpiry: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
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
    height: SPACING.xl,
  },
});

export default React.memo(ProfileScreen); 