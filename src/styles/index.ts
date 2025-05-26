import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, LINE_HEIGHT, BORDER_RADIUS, SHADOW_PRESETS } from '../constants';
import { normalizeFont } from '../utils/responsive';

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  safeAreaContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  // Typography styles
  headlineText: {
    fontSize: normalizeFont(FONT_SIZE.LG),
    lineHeight: normalizeFont(LINE_HEIGHT.LG),
    fontWeight: '500',
    color: COLORS.textPrimary,
  },

  primaryButtonText: {
    fontSize: normalizeFont(FONT_SIZE.MD),
    lineHeight: normalizeFont(LINE_HEIGHT.MD),
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  secondaryText: {
    fontSize: normalizeFont(FONT_SIZE.MD),
    lineHeight: normalizeFont(LINE_HEIGHT.MD),
    fontWeight: '400',
    color: COLORS.textMuted,
  },

  categoryText: {
    fontSize: normalizeFont(FONT_SIZE.SM),
    lineHeight: normalizeFont(LINE_HEIGHT.SM),
    fontWeight: '500',
    color: COLORS.textPrimary,
  },

  categoryTextActive: {
    fontSize: normalizeFont(FONT_SIZE.SM),
    lineHeight: normalizeFont(LINE_HEIGHT.SM),
    fontWeight: '500',
    color: COLORS.textPrimary,
  },

  categoryTextInactive: {
    fontSize: normalizeFont(FONT_SIZE.SM),
    lineHeight: normalizeFont(LINE_HEIGHT.SM),
    fontWeight: '500',
    color: COLORS.textSecondary,
  },

  labelText: {
    fontSize: normalizeFont(FONT_SIZE.SM),
    lineHeight: normalizeFont(LINE_HEIGHT.MD),
    fontWeight: '500',
    color: COLORS.surfaceOverlay2,
  },

  navigationText: {
    fontSize: normalizeFont(FONT_SIZE.SM),
    lineHeight: normalizeFont(LINE_HEIGHT.MD),
    fontWeight: '500',
    textAlign: 'center',
  },

  inspirationText: {
    fontSize: normalizeFont(FONT_SIZE.SM),
    lineHeight: normalizeFont(LINE_HEIGHT.SM),
    fontWeight: '400',
    color: COLORS.textPrimary,
  },

  titleText: {
    fontSize: normalizeFont(FONT_SIZE.TITLE),
    lineHeight: normalizeFont(LINE_HEIGHT.TITLE),
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  subtitleText: {
    fontSize: normalizeFont(FONT_SIZE.XL),
    lineHeight: normalizeFont(LINE_HEIGHT.XL),
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  bodyText: {
    fontSize: normalizeFont(FONT_SIZE.MD),
    lineHeight: normalizeFont(LINE_HEIGHT.MD),
    fontWeight: '400',
    color: COLORS.textPrimary,
  },

  captionText: {
    fontSize: normalizeFont(FONT_SIZE.XS),
    lineHeight: normalizeFont(LINE_HEIGHT.XS),
    fontWeight: '400',
    color: COLORS.textSecondary,
  },

  // Layout styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  column: {
    flexDirection: 'column',
  },

  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Shadow styles
  shadowSmall: {
    ...SHADOW_PRESETS.SMALL,
    shadowColor: COLORS.shadowLight,
  },

  shadowMedium: {
    ...SHADOW_PRESETS.MEDIUM,
    shadowColor: COLORS.shadowMedium,
  },

  shadowLarge: {
    ...SHADOW_PRESETS.LARGE,
    shadowColor: COLORS.shadowMedium,
  },

  shadowNavigation: {
    ...SHADOW_PRESETS.NAVIGATION,
    shadowColor: COLORS.shadowDark,
  },

  // Border radius styles
  borderRadiusXS: {
    borderRadius: BORDER_RADIUS.XS,
  },

  borderRadiusSmall: {
    borderRadius: BORDER_RADIUS.SM,
  },

  borderRadiusMedium: {
    borderRadius: BORDER_RADIUS.MD,
  },

  borderRadiusLarge: {
    borderRadius: BORDER_RADIUS.LG,
  },

  borderRadiusXL: {
    borderRadius: BORDER_RADIUS.XL,
  },

  borderRadiusRounded: {
    borderRadius: BORDER_RADIUS.ROUND,
  },

  borderRadiusCircle: {
    borderRadius: BORDER_RADIUS.CIRCLE,
  },

  // Spacing styles
  paddingXS: {
    padding: SPACING.xs,
  },

  paddingSM: {
    padding: SPACING.sm,
  },

  paddingMD: {
    padding: SPACING.md,
  },

  paddingLG: {
    padding: SPACING.lg,
  },

  paddingXL: {
    padding: SPACING.xl,
  },

  paddingXXL: {
    padding: SPACING.xxl,
  },

  marginXS: {
    margin: SPACING.xs,
  },

  marginSM: {
    margin: SPACING.sm,
  },

  marginMD: {
    margin: SPACING.md,
  },

  marginLG: {
    margin: SPACING.lg,
  },

  marginXL: {
    margin: SPACING.xl,
  },

  marginXXL: {
    margin: SPACING.xxl,
  },

  // Horizontal spacing
  paddingHorizontalSM: {
    paddingHorizontal: SPACING.sm,
  },

  paddingHorizontalMD: {
    paddingHorizontal: SPACING.md,
  },

  paddingHorizontalLG: {
    paddingHorizontal: SPACING.lg,
  },

  paddingHorizontalXL: {
    paddingHorizontal: SPACING.xl,
  },

  // Vertical spacing
  paddingVerticalSM: {
    paddingVertical: SPACING.sm,
  },

  paddingVerticalMD: {
    paddingVertical: SPACING.md,
  },

  paddingVerticalLG: {
    paddingVertical: SPACING.lg,
  },

  paddingVerticalXL: {
    paddingVertical: SPACING.xl,
  },

  // Common component styles
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.lg,
    ...SHADOW_PRESETS.MEDIUM,
    shadowColor: COLORS.shadowMedium,
  },

  button: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
  },

  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  disabledButton: {
    backgroundColor: COLORS.border,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: normalizeFont(FONT_SIZE.MD),
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },

  focusedInput: {
    borderColor: COLORS.primary,
  },

  // Utility styles
  fullWidth: {
    width: '100%',
  },

  fullHeight: {
    height: '100%',
  },

  flex1: {
    flex: 1,
  },

  flexGrow: {
    flexGrow: 1,
  },

  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
  },

  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  // Text alignment
  textCenter: {
    textAlign: 'center',
  },

  textLeft: {
    textAlign: 'left',
  },

  textRight: {
    textAlign: 'right',
  },

  // Background colors
  backgroundPrimary: {
    backgroundColor: COLORS.primary,
  },

  backgroundWhite: {
    backgroundColor: COLORS.white,
  },

  backgroundTransparent: {
    backgroundColor: COLORS.transparent,
  },
});

export { COLORS, SPACING, FONT_SIZE, LINE_HEIGHT, BORDER_RADIUS } from '../constants'; 