import React, { useState, useCallback, useMemo } from 'react';
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

const { width: screenWidth } = Dimensions.get('window');

interface Instruction {
  id: string;
  step: number;
  description: string;
  tips?: string;
}

interface CookingStepsScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
  route?: {
    params: {
      instructions?: Instruction[];
      recipeName?: string;
    };
  };
}

// Mock recipe instructions - Backend'den gelecek
const MOCK_INSTRUCTIONS: Instruction[] = [
  {
    id: 'step-1',
    step: 1,
    description: 'Heat olive oil in a large, heavy-bottomed pan over medium heat. Add the diced onion and cook until softened and translucent.',
    tips: 'Make sure the onion doesn\'t brown, just softened'
  },
  {
    id: 'step-2',
    step: 2,
    description: 'Add the minced garlic and cook until fragrant. Be careful not to burn the garlic.',
    tips: 'Garlic burns quickly, so keep stirring'
  },
  {
    id: 'step-3',
    step: 3,
    description: 'Add the Arborio rice to the pan and stir to coat each grain with the oil. Toast the rice until the edges become translucent.',
    tips: 'This step is crucial for creamy risotto texture'
  },
  {
    id: 'step-4',
    step: 4,
    description: 'Pour in the white wine and stir constantly until the wine is completely absorbed by the rice. The alcohol will cook off, leaving a rich flavor.',
    tips: 'Keep stirring to prevent sticking'
  },
  {
    id: 'step-5',
    step: 5,
    description: 'Add the warm mushroom broth one ladle at a time, stirring constantly. Wait until each addition is almost completely absorbed before adding the next.',
    tips: 'Patience is key - don\'t rush this process'
  },
  {
    id: 'step-6',
    step: 6,
    description: 'Add the sliced mushrooms and continue stirring. The rice should be creamy but still have a slight bite (al dente).',
    tips: 'Taste test for perfect texture'
  },
  {
    id: 'step-7',
    step: 7,
    description: 'Remove from heat and stir in the grated Parmesan cheese, butter, and fresh herbs. Season with salt and pepper to taste.',
    tips: 'The residual heat will melt the cheese perfectly'
  },
  {
    id: 'step-8',
    step: 8,
    description: 'Serve immediately in warmed bowls, garnished with extra Parmesan, fresh herbs, and a drizzle of truffle oil if desired.',
    tips: 'Risotto is best served immediately while hot and creamy'
  }
];

/**
 * CookingStepsScreen Component
 * 
 * Professional step-by-step cooking instructions screen
 * Features progress tracking and intuitive navigation
 */
const CookingStepsScreen = React.memo<CookingStepsScreenProps>(({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Use mock data if no instructions provided
  const instructions = useMemo(() => 
    route?.params?.instructions || MOCK_INSTRUCTIONS, 
    [route?.params?.instructions]
  );
  
  const recipeName = useMemo(() => 
    route?.params?.recipeName || 'Mushroom Risotto', 
    [route?.params?.recipeName]
  );

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
    instructions[currentStep], 
    [instructions, currentStep]
  );
  
  const progress = useMemo(() => 
    ((currentStep + 1) / instructions.length) * 100, 
    [currentStep, instructions.length]
  );

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === instructions.length - 1;

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
          {recipeName}
        </Text>
        <View style={styles.progressText}>
          <Text style={styles.stepCount}>
            {currentStep + 1}/{instructions.length}
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
});

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