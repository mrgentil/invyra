import { Platform } from "react-native";

const fontFamily = {
  regular: "Poppins",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
};

const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 28,
  massive: 32,
  hero: 40,
};

const lineHeight = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 22,
  xl: 24,
  xxl: 28,
  xxxl: 32,
  huge: 36,
  massive: 40,
  hero: 48,
};

export const typography = {
  fontFamily,
  fontSize,
  lineHeight,
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.huge,
    lineHeight: lineHeight.huge,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxxl,
    lineHeight: lineHeight.xxxl,
  },
  h3: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xxl,
    lineHeight: lineHeight.xxl,
  },
  h4: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
  },
  button: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
  },
};
