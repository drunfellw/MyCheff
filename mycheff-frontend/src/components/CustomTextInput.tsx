import React, { forwardRef, useImperativeHandle, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, FONT_FAMILY, SPACING, BORDER_RADIUS } from '../constants';

export interface CustomTextInputProps extends Omit<TextInputProps, 'style'> {
  // Basic Props
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  
  // Validation Props
  required?: boolean;
  showValidationOnBlur?: boolean;
  showValidationOnChange?: boolean;
  
  // Icon Props
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  rightIconAccessibilityLabel?: string;
  
  // Style Props
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  
  // Focus Management Props
  nextInputRef?: React.RefObject<TextInput>;
  onSubmitEditing?: () => void;
  
  // Special Input Types
  isPassword?: boolean;
  isMultiline?: boolean;
  maxCharacters?: number;
  showCharacterCount?: boolean;
  
  // Formatting Props
  format?: 'none' | 'phone' | 'card' | 'expiry' | 'currency';
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface CustomTextInputRef {
  focus: () => void;
  blur: () => void;
  isFocused: () => boolean;
  clear: () => void;
}

const CustomTextInput = forwardRef<CustomTextInputRef, CustomTextInputProps>(
  (
    {
      // Basic Props
      label,
      placeholder,
      value = '',
      onChangeText,
      error,
      success = false,
      disabled = false,
      
      // Validation Props
      required = false,
      showValidationOnBlur = true,
      showValidationOnChange = false,
      
      // Icon Props
      leftIcon,
      rightIcon,
      onRightIconPress,
      rightIconAccessibilityLabel,
      
      // Style Props
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      
      // Focus Management Props
      nextInputRef,
      onSubmitEditing,
      
      // Special Input Types
      isPassword = false,
      isMultiline = false,
      maxCharacters,
      showCharacterCount = false,
      
      // Formatting Props
      format = 'none',
      
      // Accessibility
      accessibilityLabel,
      accessibilityHint,
      
      // Rest of TextInput props
      ...textInputProps
    },
    ref
  ) => {
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasBeenTouched, setHasBeenTouched] = useState(false);
    
    // Expose methods through ref
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      isFocused: () => inputRef.current?.isFocused() || false,
      clear: () => {
        onChangeText?.('');
        setHasBeenTouched(false);
      },
    }));
    
    // Format text based on type
    const formatText = useCallback((text: string): string => {
      switch (format) {
        case 'phone':
          return text.replace(/[^\d]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
        case 'card':
          return text.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();
        case 'expiry':
          return text.replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
        case 'currency':
          return text.replace(/[^\d.,]/g, '');
        default:
          return text;
      }
    }, [format]);
    
    // Handle text change with formatting
    const handleTextChange = useCallback((text: string) => {
      const formattedText = formatText(text);
      
      // Check max characters
      if (maxCharacters && formattedText.length > maxCharacters) {
        return;
      }
      
      if (!hasBeenTouched && showValidationOnChange) {
        setHasBeenTouched(true);
      }
      
      onChangeText?.(formattedText);
    }, [formatText, maxCharacters, hasBeenTouched, showValidationOnChange, onChangeText]);
    
    // Handle focus
    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);
    
    // Handle blur
    const handleBlur = useCallback(() => {
      setIsFocused(false);
      if (showValidationOnBlur) {
        setHasBeenTouched(true);
      }
    }, [showValidationOnBlur]);
    
    // Handle submit editing
    const handleSubmitEditing = useCallback(() => {
      if (nextInputRef?.current) {
        nextInputRef.current.focus();
      } else {
        onSubmitEditing?.();
      }
    }, [nextInputRef, onSubmitEditing]);
    
    // Handle password toggle
    const handlePasswordToggle = useCallback(() => {
      setShowPassword(!showPassword);
    }, [showPassword]);
    
    // Determine if should show error
    const shouldShowError = hasBeenTouched && error;
    const shouldShowSuccess = hasBeenTouched && success && !error;
    
    // Determine border color
    const getBorderColor = () => {
      if (shouldShowError) return COLORS.error;
      if (shouldShowSuccess) return COLORS.success;
      if (isFocused) return COLORS.primary;
      return COLORS.border;
    };
    
    // Determine return key type
    const getReturnKeyType = () => {
      if (isMultiline) return 'default';
      if (nextInputRef) return 'next';
      return 'done';
    };
    
    return (
      <View style={[styles.container, containerStyle]}>
        {/* Label */}
        {label && (
          <Text style={[styles.label, labelStyle]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}
        
        {/* Input Container */}
        <View
          style={[
            styles.inputContainer,
            { borderColor: getBorderColor() },
            disabled && styles.disabled,
            isMultiline && styles.multilineContainer,
          ]}
        >
          {/* Left Icon */}
          {leftIcon && (
            <Feather
              name={leftIcon as any}
              size={20}
              color={shouldShowError ? COLORS.error : COLORS.textSecondary}
              style={styles.leftIcon}
            />
          )}
          
          {/* Text Input */}
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              isMultiline && styles.multilineInput,
              inputStyle,
            ]}
            value={value}
            onChangeText={handleTextChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmitEditing}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textSecondary}
            secureTextEntry={isPassword && !showPassword}
            multiline={isMultiline}
            textAlignVertical={isMultiline ? 'top' : 'center'}
            returnKeyType={getReturnKeyType()}
            blurOnSubmit={!nextInputRef}
            editable={!disabled}
            accessibilityLabel={accessibilityLabel || label}
            accessibilityHint={accessibilityHint}
            // Prevent keyboard dismissal
            keyboardShouldPersistTaps="handled"
            {...textInputProps}
          />
          
          {/* Right Icon / Password Toggle */}
          {(rightIcon || isPassword) && (
            <TouchableOpacity
              onPress={isPassword ? handlePasswordToggle : onRightIconPress}
              style={styles.rightIconContainer}
              accessibilityLabel={
                isPassword 
                  ? showPassword ? 'Hide password' : 'Show password'
                  : rightIconAccessibilityLabel
              }
              accessibilityRole="button"
            >
              <Feather
                name={
                  isPassword 
                    ? (showPassword ? 'eye-off' : 'eye')
                    : (rightIcon as any)
                }
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Helper Text Row */}
        <View style={styles.helperRow}>
          {/* Error Message */}
          {shouldShowError && (
            <Text style={[styles.errorText, errorStyle]}>{error}</Text>
          )}
          
          {/* Character Count */}
          {showCharacterCount && maxCharacters && (
            <Text style={styles.characterCount}>
              {value.length}/{maxCharacters}
            </Text>
          )}
        </View>
      </View>
    );
  }
);

CustomTextInput.displayName = 'CustomTextInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.SM,
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  required: {
    color: COLORS.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.md,
    minHeight: 48,
  },
  multilineContainer: {
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
  },
  disabled: {
    backgroundColor: COLORS.background,
    opacity: 0.6,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
    // Prevent text input from losing focus
    includeFontPadding: false,
  },
  multilineInput: {
    paddingTop: SPACING.sm,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  rightIconContainer: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
    minHeight: 16,
  },
  errorText: {
    fontSize: FONT_SIZE.XS,
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.error,
    flex: 1,
  },
  characterCount: {
    fontSize: FONT_SIZE.XS,
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.textSecondary,
  },
});

export default CustomTextInput; 