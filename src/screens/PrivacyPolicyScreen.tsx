import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../components/ScreenHeader';
import { 
  COLORS, 
  SPACING, 
  FONT_SIZE, 
  BORDER_RADIUS 
} from '../constants';

interface PrivacyPolicyScreenProps {
  navigation?: {
    goBack: () => void;
  };
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
        {/* Header */}
        <ScreenHeader
          title="Privacy Policy"
          onBackPress={() => navigation?.goBack()}
          backgroundColor={COLORS.background}
        />

        <ScrollView 
          style={styles.content} 
          contentContainerStyle={{ paddingTop: SPACING.lg }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.lastUpdated}>Last updated: January 15, 2024</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.sectionText}>
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support. This includes:
            </Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Personal information (name, email address, phone number)</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Dietary preferences and restrictions</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Recipe interactions and favorites</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Device information and usage data</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.sectionText}>
              We use the information we collect to provide, maintain, and improve our services, including:
            </Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Personalizing your recipe recommendations</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Processing your requests and transactions</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Sending you updates and promotional content</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Analyzing usage patterns to improve our app</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Information Sharing</Text>
            <Text style={styles.sectionText}>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy. We may share information with:
            </Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Service providers who assist in our operations</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Legal authorities when required by law</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Security</Text>
            <Text style={styles.sectionText}>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Your Rights</Text>
            <Text style={styles.sectionText}>
              You have the right to access, update, or delete your personal information. You may also 
              opt out of certain communications from us. To exercise these rights, please contact us 
              at privacy@mycheff.com.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Children's Privacy</Text>
            <Text style={styles.sectionText}>
              Our service is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Changes to This Policy</Text>
            <Text style={styles.sectionText}>
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have any questions about this privacy policy, please contact us at:
            </Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>Email: privacy@mycheff.com</Text>
              <Text style={styles.contactText}>Phone: +1 (555) 123-4567</Text>
              <Text style={styles.contactText}>Address: 123 Recipe Street, Food City, FC 12345</Text>
            </View>
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

  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  section: {
    marginTop: SPACING.xl,
  },
  lastUpdated: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  sectionText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
    paddingLeft: SPACING.sm,
  },
  bullet: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.primary,
    marginRight: SPACING.sm,
    fontWeight: 'bold',
  },
  bulletText: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  contactInfo: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  contactText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});

export default React.memo(PrivacyPolicyScreen); 