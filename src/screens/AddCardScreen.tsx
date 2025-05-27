import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  COLORS, 
  SPACING, 
  FONT_SIZE, 
  BORDER_RADIUS, 
  SHADOW_PRESETS 
} from '../constants';

interface AddCardScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

interface CardForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  holderName: string;
  isDefault: boolean;
}

/**
 * AddCardScreen Component
 * 
 * Professional card addition form with validation
 * Features real-time formatting and security
 */
const AddCardScreen: React.FC<AddCardScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  const [cardForm, setCardForm] = useState<CardForm>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    isDefault: false,
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<CardForm>>({});
  
  // Refs for input navigation
  const expiryRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);
  const holderNameRef = useRef<TextInput>(null);

  // Format card number with spaces
  const formatCardNumber = useCallback((text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  }, []);

  // Format expiry date MM/YY
  const formatExpiryDate = useCallback((text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  }, []);

  // Detect card type
  const getCardType = useCallback((cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'mastercard';
    if (cleaned.startsWith('3')) return 'amex';
    if (cleaned.startsWith('6')) return 'discover';
    
    return 'unknown';
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors: Partial<CardForm> = {};
    
    // Card number validation
    const cleanedCardNumber = cardForm.cardNumber.replace(/\s/g, '');
    if (!cleanedCardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cleanedCardNumber.length < 13 || cleanedCardNumber.length > 19) {
      newErrors.cardNumber = 'Invalid card number';
    }
    
    // Expiry date validation
    if (!cardForm.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(cardForm.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date format';
    } else {
      const [month, year] = cardForm.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    // CVV validation
    if (!cardForm.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (cardForm.cvv.length < 3 || cardForm.cvv.length > 4) {
      newErrors.cvv = 'Invalid CVV';
    }
    
    // Holder name validation
    if (!cardForm.holderName.trim()) {
      newErrors.holderName = 'Cardholder name is required';
    } else if (cardForm.holderName.trim().length < 2) {
      newErrors.holderName = 'Name too short';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [cardForm]);

  // Handle input changes
  const handleInputChange = useCallback((field: keyof CardForm, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    } else if (field === 'holderName') {
      formattedValue = value.toUpperCase();
    }
    
    setCardForm(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [formatCardNumber, formatExpiryDate, errors]);

  // Handle save card
  const handleSaveCard = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // TODO: API call to save card
      // await paymentService.addCard({
      //   cardNumber: cardForm.cardNumber.replace(/\s/g, ''),
      //   expiryDate: cardForm.expiryDate,
      //   cvv: cardForm.cvv,
      //   holderName: cardForm.holderName,
      //   isDefault: cardForm.isDefault,
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Card added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation?.goBack()
          }
        ]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Failed to add card. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [cardForm, validateForm, navigation]);

  const cardType = getCardType(cardForm.cardNumber);
  const isFormValid = cardForm.cardNumber && cardForm.expiryDate && 
                     cardForm.cvv && cardForm.holderName;

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
        
        <Text style={styles.headerTitle}>Add New Card</Text>
        
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card Preview */}
          <View style={[styles.cardPreview, cardType !== 'unknown' && styles.cardPreviewActive]}>
            <View style={styles.cardPreviewHeader}>
              <Text style={styles.cardPreviewTitle}>
                {cardType !== 'unknown' ? cardType.toUpperCase() : 'CARD'}
              </Text>
              <Ionicons 
                name="card" 
                size={32} 
                color={cardType !== 'unknown' ? COLORS.white : COLORS.textMuted} 
              />
            </View>
            
            <Text style={styles.cardPreviewNumber}>
              {cardForm.cardNumber || '•••• •••• •••• ••••'}
            </Text>
            
            <View style={styles.cardPreviewFooter}>
              <Text style={styles.cardPreviewName}>
                {cardForm.holderName || 'CARDHOLDER NAME'}
              </Text>
              <Text style={styles.cardPreviewExpiry}>
                {cardForm.expiryDate || 'MM/YY'}
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Card Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <View style={[styles.inputContainer, errors.cardNumber && styles.inputError]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="1234 5678 9012 3456"
                  value={cardForm.cardNumber}
                  onChangeText={(text) => handleInputChange('cardNumber', text)}
                  keyboardType="numeric"
                  maxLength={19}
                  returnKeyType="next"
                  onSubmitEditing={() => expiryRef.current?.focus()}
                />
                {cardType !== 'unknown' && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                )}
              </View>
              {errors.cardNumber && (
                <Text style={styles.errorText}>{errors.cardNumber}</Text>
              )}
            </View>

            {/* Expiry Date & CVV */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, styles.halfInput]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <View style={[styles.inputContainer, errors.expiryDate && styles.inputError]}>
                  <TextInput
                    ref={expiryRef}
                    style={styles.textInput}
                    placeholder="MM/YY"
                    value={cardForm.expiryDate}
                    onChangeText={(text) => handleInputChange('expiryDate', text)}
                    keyboardType="numeric"
                    maxLength={5}
                    returnKeyType="next"
                    onSubmitEditing={() => cvvRef.current?.focus()}
                  />
                </View>
                {errors.expiryDate && (
                  <Text style={styles.errorText}>{errors.expiryDate}</Text>
                )}
              </View>

              <View style={[styles.inputGroup, styles.halfInput]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <View style={[styles.inputContainer, errors.cvv && styles.inputError]}>
                  <TextInput
                    ref={cvvRef}
                    style={styles.textInput}
                    placeholder="123"
                    value={cardForm.cvv}
                    onChangeText={(text) => handleInputChange('cvv', text)}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    returnKeyType="next"
                    onSubmitEditing={() => holderNameRef.current?.focus()}
                  />
                  <Ionicons name="help-circle-outline" size={20} color={COLORS.textMuted} />
                </View>
                {errors.cvv && (
                  <Text style={styles.errorText}>{errors.cvv}</Text>
                )}
              </View>
            </View>

            {/* Cardholder Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <View style={[styles.inputContainer, errors.holderName && styles.inputError]}>
                <TextInput
                  ref={holderNameRef}
                  style={styles.textInput}
                  placeholder="JOHN DOE"
                  value={cardForm.holderName}
                  onChangeText={(text) => handleInputChange('holderName', text)}
                  autoCapitalize="characters"
                  returnKeyType="done"
                />
              </View>
              {errors.holderName && (
                <Text style={styles.errorText}>{errors.holderName}</Text>
              )}
            </View>

            {/* Set as Default */}
            <TouchableOpacity 
              style={styles.defaultOption}
              onPress={() => setCardForm(prev => ({ ...prev, isDefault: !prev.isDefault }))}
            >
              <View style={styles.defaultOptionContent}>
                <Ionicons name="star-outline" size={20} color={COLORS.textSecondary} />
                <Text style={styles.defaultOptionText}>Set as default payment method</Text>
              </View>
              <View style={[styles.checkbox, cardForm.isDefault && styles.checkboxActive]}>
                {cardForm.isDefault && (
                  <Ionicons name="checkmark" size={16} color={COLORS.white} />
                )}
              </View>
            </TouchableOpacity>

            {/* Security Info */}
            <View style={styles.securityInfo}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
              <Text style={styles.securityText}>
                Your card information is encrypted and secure
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + SPACING.md }]}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!isFormValid || isLoading) && styles.saveButtonDisabled
            ]}
            onPress={handleSaveCard}
            disabled={!isFormValid || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <Text style={styles.saveButtonText}>Adding Card...</Text>
            ) : (
              <>
                <Ionicons name="card" size={20} color={COLORS.white} />
                <Text style={styles.saveButtonText}>Add Card</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  cardPreview: {
    backgroundColor: COLORS.textSecondary,
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    minHeight: 200,
    justifyContent: 'space-between',
    ...SHADOW_PRESETS.LARGE,
  },
  cardPreviewActive: {
    backgroundColor: COLORS.primary,
  },
  cardPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPreviewTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 1,
  },
  cardPreviewNumber: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: '500',
    color: COLORS.white,
    letterSpacing: 2,
    marginVertical: SPACING.lg,
  },
  cardPreviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPreviewName: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '500',
    color: COLORS.white,
    letterSpacing: 1,
  },
  cardPreviewExpiry: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '500',
    color: COLORS.white,
    letterSpacing: 1,
  },
  form: {
    gap: SPACING.lg,
  },
  inputGroup: {
    gap: SPACING.sm,
  },
  inputLabel: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW_PRESETS.SMALL,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  textInput: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  errorText: {
    fontSize: FONT_SIZE.SM,
    color: '#FF3B30',
    marginTop: SPACING.xs,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfInput: {
    flex: 1,
  },
  defaultOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
    ...SHADOW_PRESETS.SMALL,
  },
  defaultOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  defaultOptionText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.SM,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOW_PRESETS.SMALL,
  },
  securityText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.LG,
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOW_PRESETS.MEDIUM,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.textMuted,
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default React.memo(AddCardScreen); 