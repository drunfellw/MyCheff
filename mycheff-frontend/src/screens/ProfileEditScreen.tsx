import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../providers/AuthProvider';
import { userAPI } from '../services/api';
import { 
  COLORS, 
  SPACING, 
  FONT_SIZE, 
  BORDER_RADIUS,
  SHADOW_PRESETS 
} from '../constants';

interface ProfileEditScreenProps {
  navigation?: {
    goBack: () => void;
  };
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  location: string;
  website: string;
  birthDate: string;
  isPrivate: boolean;
  allowNotifications: boolean;
}

const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
    location: '',
    website: '',
    birthDate: '',
    isPrivate: false,
    allowNotifications: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize profile data from AuthProvider
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.fullName || user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: user.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        location: user.location || '',
        website: user.website || '',
        birthDate: user.birthDate || '',
        isPrivate: user.isPrivate || false,
        allowNotifications: user.allowNotifications !== false, // Default to true
      });
    }
    setIsInitializing(false);
  }, [user]);

  const handleSave = useCallback(async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      Alert.alert('Error', 'Name and email are required fields.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare user data for backend
      const updateData = {
        username: profile.name.replace(/\s+/g, '').toLowerCase(), // Create username from name
        fullName: profile.name,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
        avatarUrl: profile.avatar,
        location: profile.location,
        website: profile.website,
        birthDate: profile.birthDate,
        isPrivate: profile.isPrivate,
        allowNotifications: profile.allowNotifications,
      };

      // Update profile via backend API
      const updatedUser = await userAPI.updateProfile(updateData);
      
      // Update AuthProvider's user data
      updateUser(updatedUser);
      
      Alert.alert(
        'Success', 
        'Your profile has been updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation?.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert(
        'Error',
        'Failed to update your profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [profile, navigation, updateUser]);

  const handleAvatarChange = useCallback(() => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Photo Library', onPress: () => console.log('Photo Library selected') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  }, []);

  const updateProfile = useCallback((field: keyof UserProfile, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <ScreenHeader
          title="Edit Profile"
          onBackPress={() => navigation?.goBack()}
          backgroundColor={COLORS.background}
          rightElement={
            <TouchableOpacity 
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          }
        />

        <ScrollView 
          style={styles.content} 
          contentContainerStyle={{ paddingTop: SPACING.lg }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarChange}>
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              <View style={styles.avatarOverlay}>
                <Ionicons name="camera" size={24} color={COLORS.white} />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarText}>Tap to change photo</Text>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => updateProfile('name', text)}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.textSecondary}
                blurOnSubmit={false}
                returnKeyType="next"
                autoCapitalize="words"
                textContentType="name"
                autoComplete="name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(text) => updateProfile('email', text)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={COLORS.textSecondary}
                blurOnSubmit={false}
                returnKeyType="next"
                textContentType="emailAddress"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={profile.phone}
                onChangeText={(text) => updateProfile('phone', text)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.textSecondary}
                blurOnSubmit={false}
                returnKeyType="next"
                textContentType="telephoneNumber"
                autoComplete="tel"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={profile.location}
                onChangeText={(text) => updateProfile('location', text)}
                placeholder="Enter your location"
                placeholderTextColor={COLORS.textSecondary}
                blurOnSubmit={false}
                returnKeyType="next"
                textContentType="addressCity"
                autoComplete="postal-address-locality"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Website</Text>
              <TextInput
                style={styles.input}
                value={profile.website}
                onChangeText={(text) => updateProfile('website', text)}
                placeholder="Enter your website URL"
                keyboardType="url"
                autoCapitalize="none"
                placeholderTextColor={COLORS.textSecondary}
                blurOnSubmit={false}
                returnKeyType="next"
                textContentType="URL"
                autoComplete="off"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Birth Date</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateText}>
                  {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString() : 'Select date'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={profile.bio}
                onChangeText={(text) => updateProfile('bio', text)}
                placeholder="Tell us about yourself..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={COLORS.textSecondary}
              />
              <Text style={styles.characterCount}>{profile.bio.length}/200</Text>
            </View>
          </View>

          {/* Privacy Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy & Notifications</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="lock-closed" size={24} color={COLORS.textSecondary} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Private Profile</Text>
                  <Text style={styles.settingSubtitle}>Only followers can see your recipes</Text>
                </View>
              </View>
              <Switch
                value={profile.isPrivate}
                onValueChange={(value) => updateProfile('isPrivate', value)}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications" size={24} color={COLORS.textSecondary} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingSubtitle}>Receive updates and recommendations</Text>
                </View>
              </View>
              <Switch
                value={profile.allowNotifications}
                onValueChange={(value) => updateProfile('allowNotifications', value)}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Actions</Text>
            
            <TouchableOpacity style={styles.dangerButton}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              <Text style={styles.dangerButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  avatarText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textSecondary,
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
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  dateInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  settingSubtitle: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  dangerButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: '#FF3B30',
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
  emptyStateText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default React.memo(ProfileEditScreen); 