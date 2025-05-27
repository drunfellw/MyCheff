import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW_PRESETS } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

interface Instruction {
  id: string;
  step: number;
  description: string;
  duration?: string;
}

interface CookingStepsScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
  route?: {
    params: {
      instructions: Instruction[];
      recipeName: string;
    };
  };
}

const CookingStepsScreen: React.FC<CookingStepsScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const instructions = route?.params?.instructions || [];
  const recipeName = route?.params?.recipeName || '';

  const handleNextStep = useCallback(() => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, instructions.length]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleClose = useCallback(() => {
    navigation?.goBack();
  }, [navigation]);

  const currentInstruction = instructions[currentStep];
  const progress = ((currentStep + 1) / instructions.length) * 100;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{recipeName}</Text>
        <View style={styles.progressText}>
          <Text style={styles.stepCount}>
            {currentStep + 1}/{instructions.length}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Step Content */}
      <View style={styles.stepContent}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>Step {currentInstruction?.step}</Text>
          {currentInstruction?.duration && (
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={16} color={COLORS.primary} />
              <Text style={styles.durationText}>{currentInstruction.duration}</Text>
            </View>
          )}
        </View>
        <Text style={styles.stepDescription}>
          {currentInstruction?.description}
        </Text>
      </View>

      {/* Navigation Buttons */}
      <View style={[styles.navigation, { paddingBottom: insets.bottom + SPACING.xl }]}>
        <TouchableOpacity
          style={[styles.navButton, styles.prevButton, currentStep === 0 && styles.disabledButton]}
          onPress={handlePreviousStep}
          disabled={currentStep === 0}
        >
          <Ionicons name="arrow-back" size={24} color={currentStep === 0 ? COLORS.textMuted : COLORS.white} />
          <Text style={[styles.navButtonText, currentStep === 0 && styles.disabledText]}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton, currentStep === instructions.length - 1 && styles.finishButton]}
          onPress={currentStep === instructions.length - 1 ? handleClose : handleNextStep}
        >
          <Text style={styles.navButtonText}>
            {currentStep === instructions.length - 1 ? 'Finish' : 'Next'}
          </Text>
          <Ionicons 
            name={currentStep === instructions.length - 1 ? "checkmark" : "arrow-forward"} 
            size={24} 
            color={COLORS.white} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.md,
  },
  progressText: {
    width: 40,
  },
  stepCount: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.XS,
  },
  stepContent: {
    flex: 1,
    padding: SPACING.xl,
  },
  stepNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  stepNumberText: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.ROUND,
    gap: SPACING.xs,
  },
  durationText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.primary,
  },
  stepDescription: {
    fontSize: FONT_SIZE.LG,
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.LG,
    gap: SPACING.sm,
  },
  prevButton: {
    backgroundColor: COLORS.primary,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
  },
  finishButton: {
    backgroundColor: COLORS.textPrimary,
  },
  disabledButton: {
    backgroundColor: COLORS.border,
  },
  navButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.white,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
});

export default CookingStepsScreen; 