import React, { useState, useCallback } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../components/ScreenHeader';
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
  const [profile, setProfile] = useState<UserProfile>({
    name: 'İsmail Uzun',
    email: 'ismail@example.com',
    phone: '+90 555 123 4567',
    bio: 'Food enthusiast and home chef. Love experimenting with new recipes and sharing culinary adventures.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    location: 'Istanbul, Turkey',
    website: 'www.ismailuzun.com',
    birthDate: '1990-05-15',
    isPrivate: false,
    allowNotifications: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = useCallback(async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      Alert.alert('Error', 'Name and email are required fields.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
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
    }, 1500);
  }, [profile, navigation]);

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
    <View style={styles.container}>
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
                placeholderTextColor={COLORS.textMuted}
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
                placeholderTextColor={COLORS.textMuted}
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
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={profile.location}
                onChangeText={(text) => updateProfile('location', text)}
                placeholder="Enter your location"
                placeholderTextColor={COLORS.textMuted}
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
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Birth Date</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateText}>
                  {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString() : 'Select date'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={COLORS.textMuted} />
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
                placeholderTextColor={COLORS.textMuted}
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
    </View>
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
    color: COLORS.textMuted,
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
    color: COLORS.textMuted,
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
    color: COLORS.textMuted,
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
});

export default React.memo(ProfileEditScreen); 