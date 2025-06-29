import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  COLORS, 
  COMPONENT_SPACING, 
  FONT_SIZE, 
  BORDER_RADIUS, 
  SHADOW_PRESETS,
  SPACING 
} from '../constants';
import { recipesAPI } from '../services/recipesAPI';

const { width: screenWidth } = Dimensions.get('window');

interface Instruction {
  id: string;
  step: number;
  description: string;
  tips?: string;
}

interface CookingStepsScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
  route: {
    params: {
      recipeId: string;
      recipeTitle: string;
    };
  };
}

/**
 * CookingStepsScreen Component
 * 
 * Professional step-by-step cooking instructions screen
 * Features progress tracking and intuitive navigation
 */
const CookingStepsScreen: React.FC<CookingStepsScreenProps> = ({ navigation, route }) => {
  const { recipeId, recipeTitle } = route.params;
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recipe instructions from API
  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        setIsLoading(true);
        const response = await recipesAPI.getById(recipeId);
        if (response.instructions) {
          setInstructions(response.instructions);
        }
      } catch (error) {
        console.error('Error fetching recipe instructions:', error);
        setInstructions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructions();
  }, [recipeId]);

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

  const currentInstruction = useMemo(() => 
    instructions[currentStep - 1], 
    [instructions, currentStep]
  );
  
  const progress = useMemo(() => 
    ((currentStep) / instructions.length) * 100, 
    [currentStep, instructions.length]
  );

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === instructions.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md, backgroundColor: COLORS.background }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {recipeTitle}
        </Text>
        <View style={styles.progressText}>
          <Text style={styles.stepCount}>
            {currentStep}/{instructions.length}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Step Content */}
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepNumberText}>
            Step {currentInstruction?.step}
          </Text>
        </View>
        
        <Text style={styles.stepDescription}>
          {currentInstruction?.description}
        </Text>

        {currentInstruction?.tips && (
          <View style={styles.tipsContainer}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb-outline" size={18} color={COLORS.warning} />
              <Text style={styles.tipsTitle}>Pro Tip</Text>
            </View>
            <Text style={styles.tipsText}>
              {currentInstruction.tips}
            </Text>
          </View>
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={[styles.navigation, { paddingBottom: insets.bottom + SPACING.xl }]}>
        <TouchableOpacity
          style={[
            styles.navButton, 
            styles.prevButton, 
            isFirstStep && styles.disabledButton
          ]}
          onPress={handlePreviousStep}
          disabled={isFirstStep}
          activeOpacity={isFirstStep ? 1 : 0.8}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isFirstStep ? COLORS.textMuted : COLORS.white} 
          />
          <Text style={[
            styles.navButtonText, 
            isFirstStep && styles.disabledText
          ]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton, 
            styles.nextButton, 
            isLastStep && styles.finishButton
          ]}
          onPress={isLastStep ? handleClose : handleNextStep}
          activeOpacity={0.8}
        >
          <Text style={styles.navButtonText}>
            {isLastStep ? 'Finish Cooking' : 'Next Step'}
          </Text>
          <Ionicons 
            name={isLastStep ? "checkmark-circle" : "arrow-forward"} 
            size={24} 
            color={COLORS.white} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

CookingStepsScreen.displayName = 'CookingStepsScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: COMPONENT_SPACING.MODAL.PADDING,
    paddingVertical: SPACING.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW_PRESETS.SMALL,
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
    alignItems: 'flex-end',
  },
  stepCount: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: COMPONENT_SPACING.MODAL.PADDING,
    borderRadius: BORDER_RADIUS.XS,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.XS,
  },
  stepContent: {
    flex: 1,
    padding: COMPONENT_SPACING.MODAL.PADDING,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  stepNumberText: {
    fontSize: FONT_SIZE.LARGE_TITLE,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: FONT_SIZE.COOKING_STEP,
    color: COLORS.textPrimary,
    lineHeight: FONT_SIZE.COOKING_STEP * 1.6,
    marginBottom: SPACING.xl,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  tipsContainer: {
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.LG,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tipsTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.warning,
  },
  tipsText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZE.MD * 1.4,
    fontStyle: 'italic',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: COMPONENT_SPACING.MODAL.PADDING,
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
    ...SHADOW_PRESETS.MEDIUM,
  },
  prevButton: {
    backgroundColor: COLORS.primary,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
  },
  finishButton: {
    backgroundColor: COLORS.success,
  },
  disabledButton: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
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