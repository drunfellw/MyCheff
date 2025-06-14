import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Toast from '../components/Toast';
import ScreenHeader from '../components/ScreenHeader';
import { useToast } from '../hooks/useToast';
import { 
  COLORS, 
  SPACING, 
  FONT_SIZE, 
  BORDER_RADIUS 
} from '../constants';

interface AddCardScreenProps {
  navigation?: {
    goBack: () => void;
  };
}

const AddCardScreen: React.FC<AddCardScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [holderName, setHolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getCardType = (number: string) => {
    const firstDigit = number.charAt(0);
    if (firstDigit === '4') return 'visa';
    if (firstDigit === '5') return 'mastercard';
    if (firstDigit === '3') return 'amex';
    return 'visa';
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'visa': return '#1A1F71';
      case 'mastercard': return '#EB001B';
      case 'amex': return '#006FCF';
      default: return COLORS.primary;
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/\d{1,4}/g);
    return match ? match.join(' ') : '';
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleSaveCard = useCallback(async () => {
    if (!cardNumber || !expiryDate || !cvv || !holderName) {
      showError('Please fill all fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      showSuccess('Card added successfully');
      
      // Navigate back after showing success
      setTimeout(() => {
        navigation?.goBack();
      }, 1500);
    }, 1000);
  }, [cardNumber, expiryDate, cvv, holderName, showError, showSuccess, navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="Add Payment Card"
        onBackPress={() => navigation?.goBack()}
        backgroundColor={COLORS.background}
      />

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{ paddingTop: SPACING.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Preview */}
        <View style={styles.cardPreview}>
          <View style={[styles.previewCard, { backgroundColor: getCardColor(getCardType(cardNumber)) }]}>
            <View style={styles.previewCardTop}>
              <Text style={styles.previewCardTitle}>MyChef Card</Text>
              <Ionicons name="card" size={32} color="rgba(255,255,255,0.8)" />
            </View>
            <View style={styles.previewCardNumber}>
              <Text style={styles.previewCardNumberText}>
                {formatCardNumber(cardNumber) || '•••• •••• •••• ••••'}
              </Text>
            </View>
            <View style={styles.previewCardBottom}>
              <View>
                <Text style={styles.previewCardLabel}>CARDHOLDER</Text>
                <Text style={styles.previewCardValue}>
                  {holderName || 'YOUR NAME'}
                </Text>
              </View>
              <View>
                <Text style={styles.previewCardLabel}>EXPIRES</Text>
                <Text style={styles.previewCardValue}>
                  {expiryDate || 'MM/YY'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="card-outline" size={20} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                value={formatCardNumber(cardNumber)}
                onChangeText={(text) => setCardNumber(text.replace(/\s/g, ''))}
                keyboardType="numeric"
                maxLength={19}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: SPACING.sm }]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  keyboardType="numeric"
                  maxLength={5}
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: SPACING.sm }]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={holderName}
                onChangeText={setHolderName}
                autoCapitalize="words"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          </View>

          {/* Security Info */}
          <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
            <Text style={styles.securityNoteText}>
              Your card information is encrypted and secure
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.addCardButton, isLoading && styles.addCardButtonDisabled]} 
          onPress={handleSaveCard}
          disabled={isLoading}
        >
          <Text style={styles.addCardButtonText}>
            {isLoading ? 'Adding Card...' : 'Add Card'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
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
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  cardPreview: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  previewCard: {
    width: '90%',
    height: 200,
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.lg,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  previewCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewCardTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  previewCardNumber: {
    marginVertical: SPACING.md,
  },
  previewCardNumberText: {
    fontSize: FONT_SIZE.XL,
    fontWeight: '500',
    color: COLORS.white,
    letterSpacing: 2,
  },
  previewCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewCardLabel: {
    fontSize: FONT_SIZE.XS,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  previewCardValue: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '500',
    color: COLORS.white,
  },
  formContainer: {
    padding: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.md,
    marginTop: SPACING.lg,
  },
  securityNoteText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addCardButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.LG,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  addCardButtonDisabled: {
    opacity: 0.6,
  },
  addCardButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default React.memo(AddCardScreen); 