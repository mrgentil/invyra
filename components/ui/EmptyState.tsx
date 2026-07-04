import { useEffect, useRef } from "react";
import { View, Text, Animated, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";
import { shadows } from "@/theme/shadows";

type EmptyVariant = "default" | "tickets" | "favorites" | "search" | "notifications";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: EmptyVariant;
  compact?: boolean;
}

const VARIANT_PRESETS: Record<
  EmptyVariant,
  { icon: keyof typeof Ionicons.glyphMap; title: string; message: string }
> = {
  default: {
    icon: "sparkles-outline",
    title: "Rien ici pour l'instant",
    message: "Revenez bientôt, de nouvelles choses arrivent.",
  },
  tickets: {
    icon: "ticket-outline",
    title: "Aucun billet",
    message: "Réservez un événement pour retrouver vos QR codes ici.",
  },
  favorites: {
    icon: "heart-outline",
    title: "Aucun favori",
    message: "Enregistrez les événements qui vous plaisent pour les retrouver facilement.",
  },
  search: {
    icon: "search-outline",
    title: "Aucun résultat",
    message: "Essayez d'autres mots-clés ou ajustez vos filtres.",
  },
  notifications: {
    icon: "notifications-outline",
    title: "Aucune notification",
    message: "Vos confirmations et rappels apparaîtront ici.",
  },
};

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  variant = "default",
  compact = false,
}: EmptyStateProps) {
  const preset = VARIANT_PRESETS[variant];
  const resolvedIcon = icon ?? preset.icon;
  const resolvedTitle = title ?? preset.title;
  const resolvedMessage = message ?? preset.message;

  const pulse = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    );

    pulseLoop.start();
    floatLoop.start();

    return () => {
      pulseLoop.stop();
      floatLoop.stop();
    };
  }, [float, pulse]);

  const ringScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });
  const ringOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.08],
  });
  const iconTranslateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: compact ? 20 : 32,
        paddingVertical: compact ? 28 : 48,
      }}
    >
      <Animated.View style={{ transform: [{ translateY: iconTranslateY }] }}>
        <View style={{ width: compact ? 96 : 112, height: compact ? 96 : 112, alignItems: "center", justifyContent: "center" }}>
          <Animated.View
            style={{
              position: "absolute",
              width: compact ? 96 : 112,
              height: compact ? 96 : 112,
              borderRadius: compact ? 48 : 56,
              backgroundColor: colors.primary[100],
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
            }}
          />
          <LinearGradient
            colors={[colors.primary[50], colors.primary[100], colors.secondary[50]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: compact ? 72 : 84,
              height: compact ? 72 : 84,
              borderRadius: compact ? 36 : 42,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: colors.primary[100],
              ...shadows.md,
            }}
          >
            <Ionicons name={resolvedIcon} size={compact ? 30 : 36} color={colors.primary.DEFAULT} />
          </LinearGradient>
        </View>
      </Animated.View>

      <Text
        style={{
          fontFamily: typography.fontFamily.bold,
          fontSize: compact ? typography.fontSize.lg : typography.fontSize.xl,
          color: colors.text.primary,
          textAlign: "center",
          marginTop: compact ? 16 : 22,
        }}
      >
        {resolvedTitle}
      </Text>
      <Text
        style={{
          fontFamily: typography.fontFamily.regular,
          fontSize: typography.fontSize.sm,
          color: colors.text.secondary,
          textAlign: "center",
          marginTop: 8,
          lineHeight: typography.lineHeight.sm + 6,
          maxWidth: 280,
        }}
      >
        {resolvedMessage}
      </Text>

      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          activeOpacity={0.86}
          style={{
            marginTop: compact ? 18 : 24,
            height: 48,
            paddingHorizontal: 24,
            borderRadius: radius.full,
            backgroundColor: colors.primary.DEFAULT,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,
            shadowColor: colors.primary.DEFAULT,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.22,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          <Text
            style={{
              fontFamily: typography.fontFamily.semiBold,
              fontSize: typography.fontSize.sm,
              color: colors.white,
            }}
          >
            {actionLabel}
          </Text>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}
