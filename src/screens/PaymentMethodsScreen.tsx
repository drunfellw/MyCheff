import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
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
  
  // Mock payment methods - Backend'den gelecek
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

  const handleSetDefault = useCallback(async (cardId: string) => {
    try {
      // TODO: API call to set default card
      // await paymentService.setDefaultCard(cardId);
      
      setPaymentMethods(prev => 
        prev.map(card => ({
          ...card,
          isDefault: card.id === cardId
        }))
      );
      
      Alert.alert('Success', 'Default payment method updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update default payment method');
    }
  }, []);

  const handleDeleteCard = useCallback((cardId: string, cardLastFour: string) => {
    Alert.alert(
      'Delete Card',
      `Are you sure you want to delete card ending in ${cardLastFour}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: API call to delete card
              // await paymentService.deleteCard(cardId);
              
              setPaymentMethods(prev => prev.filter(card => card.id !== cardId));
              Alert.alert('Success', 'Card deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete card');
            }
          }
        }
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
      case 'discover':
        return 'card';
      default:
        return 'card';
    }
  }, []);

  const getCardColor = useCallback((type: PaymentMethod['type']) => {
    switch (type) {
      case 'visa':
        return '#1A1F71';
      case 'mastercard':
        return '#EB001B';
      case 'amex':
        return '#006FCF';
      case 'discover':
        return '#FF6000';
      default:
        return COLORS.textSecondary;
    }
  }, []);

  const renderPaymentCard = useCallback((method: PaymentMethod) => (
    <View key={method.id} style={styles.paymentCard}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <View style={[styles.cardIconContainer, { backgroundColor: getCardColor(method.type) }]}>
            <Ionicons name={getCardIcon(method.type)} size={24} color={COLORS.white} />
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

      {/* Card Footer */}
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
  ), [getCardIcon, getCardColor, handleSetDefault, handleDeleteCard]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Ionicons name="card-outline" size={64} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No Payment Methods</Text>
      <Text style={styles.emptySubtitle}>
        Add a payment method to make purchases easier
      </Text>
      <TouchableOpacity style={styles.addFirstCardButton} onPress={handleAddCard}>
        <Text style={styles.addFirstCardButtonText}>Add Your First Card</Text>
      </TouchableOpacity>
    </View>
  ), [handleAddCard]);

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
        
        <Text style={styles.headerTitle}>Payment Methods</Text>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddCard}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {paymentMethods.length > 0 ? (
          <>
            {/* Payment Methods List */}
            <View style={styles.cardsContainer}>
              {paymentMethods.map(renderPaymentCard)}
            </View>

            {/* Add New Card Button */}
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
          </>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW_PRESETS.SMALL,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  cardsContainer: {
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  paymentCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.lg,
    ...SHADOW_PRESETS.MEDIUM,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  cardIconContainer: {
    width: 50,
    height: 32,
    borderRadius: BORDER_RADIUS.SM,
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
    marginBottom: SPACING.xs,
  },
  cardNumber: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    letterSpacing: 1,
  },
  cardHolder: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
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
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cardExpiry: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: COLORS.textPrimary,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: SPACING.sm,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  addCardButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.primary,
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxxl,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  addFirstCardButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.LG,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    ...SHADOW_PRESETS.MEDIUM,
  },
  addFirstCardButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default React.memo(PaymentMethodsScreen); 