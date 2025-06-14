import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Toast from '../components/Toast';
import ScreenHeader from '../components/ScreenHeader';
import { useToast } from '../hooks/useToast';
import { 
  COLORS, 
  SPACING, 
  FONT_SIZE, 
  BORDER_RADIUS, 
  SHADOW_PRESETS 
} from '../constants';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'discover';
  lastFour: string;
  expiryDate: string;
  holderName: string;
  isDefault: boolean;
  brand: string;
}

interface PaymentMethodsScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

/**
 * PaymentMethodsScreen Component
 * 
 * Professional payment methods management screen
 * Features card listing, adding, removing, and setting default
 */
const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'visa',
      lastFour: '4532',
      expiryDate: '12/26',
      holderName: 'İsmail Uzun',
      isDefault: true,
      brand: 'Visa',
    },
    {
      id: '2',
      type: 'mastercard',
      lastFour: '8901',
      expiryDate: '08/25',
      holderName: 'İsmail Uzun',
      isDefault: false,
      brand: 'Mastercard',
    },
    {
      id: '3',
      type: 'amex',
      lastFour: '1234',
      expiryDate: '03/27',
      holderName: 'İsmail Uzun',
      isDefault: false,
      brand: 'American Express',
    },
  ]);

  const handleAddCard = useCallback(() => {
    navigation?.navigate('AddCard');
  }, [navigation]);



  const handleSetDefault = useCallback((cardId: string) => {
    setPaymentMethods(prev => 
      prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    );
    showSuccess('Default payment method updated');
  }, [showSuccess]);

  const handleDeleteCard = useCallback((cardId: string, cardLastFour: string) => {
    Alert.alert(
      'Delete Card',
      `Are you sure you want to delete card ending in ${cardLastFour}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(card => card.id !== cardId));
            showSuccess('Card deleted successfully');
          }
        }
      ]
    );
  }, [showSuccess]);

  const getCardColor = useCallback((type: PaymentMethod['type']) => {
    switch (type) {
      case 'visa': return '#1A1F71';
      case 'mastercard': return '#EB001B';
      case 'amex': return '#006FCF';
      case 'discover': return '#FF6000';
      default: return COLORS.primary;
    }
  }, []);



  const renderPaymentCard = useCallback((method: PaymentMethod) => (
    <View key={method.id} style={styles.paymentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <View style={[styles.cardIconContainer, { backgroundColor: getCardColor(method.type) }]}>
            <Ionicons name="card" size={24} color={COLORS.white} />
          </View>
          <View style={styles.cardDetails}>
            <Text style={styles.cardBrand}>{method.brand}</Text>
            <Text style={styles.cardNumber}>•••• •••• •••• {method.lastFour}</Text>
            <Text style={styles.cardHolder}>{method.holderName}</Text>
          </View>
        </View>
        
        {method.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardExpiry}>Expires {method.expiryDate}</Text>
        
        <View style={styles.cardActions}>
          {!method.isDefault && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSetDefault(method.id)}
            >
              <Text style={styles.actionButtonText}>Set Default</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteCard(method.id, method.lastFour)}
          >
            <Ionicons name="trash-outline" size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [getCardColor, handleSetDefault, handleDeleteCard]);

    return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="Payment Methods"
        onBackPress={() => navigation?.goBack()}
        backgroundColor={COLORS.background}
        rightElement={
          <TouchableOpacity onPress={handleAddCard}>
            <Ionicons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{ paddingTop: SPACING.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cards List */}
        <View style={styles.cardsContainer}>
          {paymentMethods.map(renderPaymentCard)}
        </View>

        {/* Add Card Button */}
        <TouchableOpacity style={styles.addCardButton} onPress={handleAddCard}>
          <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
          <Text style={styles.addCardButtonText}>Add New Card</Text>
        </TouchableOpacity>

        {/* Security Info */}
        <View style={styles.securityInfo}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure
          </Text>
        </View>
      </ScrollView>

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
  },
  cardsContainer: {
    paddingTop: SPACING.lg,
  },
  paymentCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  cardInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.MD,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  cardDetails: {
    flex: 1,
  },
  cardBrand: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  cardHolder: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
  },
  defaultBadge: {
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.SM,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  defaultBadgeText: {
    fontSize: FONT_SIZE.XS,
    fontWeight: '600',
    color: COLORS.white,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardExpiry: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
  },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.background,
  },
  actionButtonText: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '500',
    color: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: '#FFF2F2',
    paddingHorizontal: SPACING.sm,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.lg,
    marginVertical: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  addCardButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  securityText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    flex: 1,
  },


});

export default React.memo(PaymentMethodsScreen); 