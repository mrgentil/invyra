export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
  screen: 16,
} as const;

export const padding = {
  screen: spacing.screen,
  card: spacing.lg,
  section: spacing.xxl,
} as const;
