import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
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

interface HelpSupportScreenProps {
  navigation?: {
    goBack: () => void;
  };
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isExpanded: boolean;
}

const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      id: '1',
      question: 'How do I search for recipes by ingredients?',
      answer: 'Use the ingredient search feature on the main screen. Simply type the ingredients you have, and we\'ll show you recipes you can make with them.',
      isExpanded: false,
    },
    {
      id: '2',
      question: 'Can I save my favorite recipes?',
      answer: 'Yes! Tap the heart icon on any recipe to add it to your favorites. You can access all your saved recipes from the Favorites tab.',
      isExpanded: false,
    },
    {
      id: '3',
      question: 'How do I adjust serving sizes?',
      answer: 'On the recipe detail page, you can adjust the serving size using the + and - buttons. All ingredient quantities will automatically scale.',
      isExpanded: false,
    },
    {
      id: '4',
      question: 'Are the nutritional values accurate?',
      answer: 'We provide estimated nutritional information based on standard ingredient databases. For precise values, consult with a nutritionist.',
      isExpanded: false,
    },
    {
      id: '5',
      question: 'How do I report a problem with a recipe?',
      answer: 'You can report issues using the contact form below or by tapping the "Report Issue" button on the recipe page.',
      isExpanded: false,
    },
    {
      id: '6',
      question: 'Can I submit my own recipes?',
      answer: 'Recipe submission feature is coming soon! Follow us on social media for updates on new features.',
      isExpanded: false,
    },
  ]);

  const toggleFAQ = (id: string) => {
    setFaqItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isExpanded: !item.isExpanded }
          : { ...item, isExpanded: false }
      )
    );
  };

  const handleSendMessage = () => {
    if (!email.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in both email and message fields.');
      return;
    }

    Alert.alert(
      'Message Sent',
      'Thank you for contacting us! We\'ll get back to you within 24 hours.',
      [
        {
          text: 'OK',
          onPress: () => {
            setEmail('');
            setMessage('');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
        {/* Header */}
        <ScreenHeader
          title="Help & Support"
          onBackPress={() => navigation?.goBack()}
          backgroundColor={COLORS.background}
        />

        <ScrollView 
          style={styles.content} 
          contentContainerStyle={{ paddingTop: SPACING.lg }}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="chatbubble-ellipses" size={32} color={COLORS.primary} />
                <Text style={styles.actionTitle}>Live Chat</Text>
                <Text style={styles.actionSubtitle}>Chat with our support team</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="call" size={32} color={COLORS.primary} />
                <Text style={styles.actionTitle}>Call Us</Text>
                <Text style={styles.actionSubtitle}>+1 (555) 123-4567</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {faqItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.faqItem}
                onPress={() => toggleFAQ(item.id)}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Ionicons 
                    name={item.isExpanded ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={COLORS.textSecondary} 
                  />
                </View>
                {item.isExpanded && (
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Contact Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Send us a Message</Text>
            <View style={styles.contactForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your.email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Message</Text>
                <TextInput
                  style={[styles.input, styles.messageInput]}
                  placeholder="Describe your issue or question..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <Ionicons name="send" size={20} color={COLORS.white} />
                <Text style={styles.sendButtonText}>Send Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Other Ways to Reach Us</Text>
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Ionicons name="mail" size={20} color={COLORS.primary} />
                <Text style={styles.contactText}>support@mycheff.com</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Ionicons name="call" size={20} color={COLORS.primary} />
                <Text style={styles.contactText}>+1 (555) 123-4567</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Ionicons name="time" size={20} color={COLORS.primary} />
                <Text style={styles.contactText}>Mon-Fri: 9AM-6PM EST</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Ionicons name="location" size={20} color={COLORS.primary} />
                <Text style={styles.contactText}>123 Recipe Street, Food City, FC 12345</Text>
              </View>
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
  sectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
    alignItems: 'center',
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  actionSubtitle: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  faqItem: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  faqAnswer: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: SPACING.md,
  },
  contactForm: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
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
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  sendButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.white,
  },
  contactInfo: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  contactText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
    flex: 1,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});

export default React.memo(HelpSupportScreen); 