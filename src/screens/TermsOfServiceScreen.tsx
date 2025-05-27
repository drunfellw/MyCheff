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

interface TermsOfServiceScreenProps {
  navigation?: {
    goBack: () => void;
  };
}

const TermsOfServiceScreen: React.FC<TermsOfServiceScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
        {/* Header */}
        <ScreenHeader
          title="Terms of Service"
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
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.sectionText}>
              By accessing and using MyCheff, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to abide by the above, please do 
              not use this service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Description of Service</Text>
            <Text style={styles.sectionText}>
              MyCheff is a recipe discovery and cooking assistance application that provides:
            </Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Personalized recipe recommendations</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Ingredient-based recipe search</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Step-by-step cooking instructions</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Recipe favorites and collections</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Accounts</Text>
            <Text style={styles.sectionText}>
              To access certain features of the service, you may be required to create an account. 
              You are responsible for:
            </Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Maintaining the confidentiality of your account</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>All activities that occur under your account</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Providing accurate and complete information</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Acceptable Use</Text>
            <Text style={styles.sectionText}>
              You agree not to use the service to:
            </Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Violate any applicable laws or regulations</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Transmit harmful or malicious content</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Interfere with the service's functionality</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Attempt to gain unauthorized access</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Content and Intellectual Property</Text>
            <Text style={styles.sectionText}>
              All content provided through MyCheff, including recipes, images, and text, is protected 
              by intellectual property rights. You may not reproduce, distribute, or create derivative 
              works without explicit permission.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Disclaimers</Text>
            <Text style={styles.sectionText}>
              MyCheff is provided "as is" without any warranties. We do not guarantee:
            </Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>The accuracy of nutritional information</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Uninterrupted or error-free service</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Results from following recipes</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
            <Text style={styles.sectionText}>
              In no event shall MyCheff be liable for any indirect, incidental, special, or 
              consequential damages arising out of or in connection with your use of the service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Termination</Text>
            <Text style={styles.sectionText}>
              We may terminate or suspend your account and access to the service at our sole 
              discretion, without prior notice, for conduct that we believe violates these terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
            <Text style={styles.sectionText}>
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting. Your continued use of the service constitutes acceptance 
              of the modified terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Contact Information</Text>
            <Text style={styles.sectionText}>
              If you have any questions about these Terms of Service, please contact us:
            </Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>Email: legal@mycheff.com</Text>
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

export default React.memo(TermsOfServiceScreen); 