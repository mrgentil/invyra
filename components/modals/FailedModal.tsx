import { useEffect, useRef } from "react";
import { View, Text, Modal, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";

type FailedVariant = "default" | "payment" | "booking";

interface FailedModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  variant?: FailedVariant;
  onClose: () => void;
  onRetry?: () => void;
}

const VARIANT_PRESETS: Record<
  FailedVariant,
  { icon: keyof typeof Ionicons.glyphMap; title: string; message: string }
> = {
  default: {
    icon: "alert-circle",
    title: "Une erreur est survenue",
    message: "Impossible de finaliser l'opération pour le moment.",
  },
  payment: {
    icon: "card-outline",
    title: "Paiement refusé",
    message: "Vérifiez votre moyen de paiement ou réessayez dans quelques instants.",
  },
  booking: {
    icon: "document-text-outline",
    title: "Informations incomplètes",
    message: "Complétez tous les champs requis avant de continuer vers le paiement.",
  },
};

export function FailedModal({
  visible,
  title,
  message,
  variant = "default",
  onClose,
  onRetry,
}: FailedModalProps) {
  const preset = VARIANT_PRESETS[variant];
  const scale = useRef(new Animated.Value(0.88)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0.88);
      opacity.setValue(0);
      shake.setValue(0);

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, damping: 16, stiffness: 180, useNativeDriver: true }),
      ]).start();

      Animated.sequence([
        Animated.delay(140),
        Animated.timing(shake, { toValue: 1, duration: 70, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 70, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 70, useNativeDriver: true }),
      ]).start();
    }
  }, [opacity, scale, shake, visible]);

  const shakeTranslate = shake.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-6, 0, 6],
  });

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(16,16,18,0.72)",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          opacity,
        }}
      >
        <Animated.View
          style={{
            width: "100%",
            maxWidth: 340,
            transform: [{ scale }, { translateX: shakeTranslate }],
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: radius.card,
              overflow: "hidden",
              ...shadows.xl,
            }}
          >
            <LinearGradient
              colors={[colors.danger[600], colors.danger.DEFAULT]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 6 }}
            />

            <View style={{ padding: 28, alignItems: "center" }}>
              <View
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 42,
                  backgroundColor: colors.danger[50],
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                  borderWidth: 1,
                  borderColor: colors.danger[100],
                }}
              >
                <View
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 29,
                    backgroundColor: colors.danger.DEFAULT,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={preset.icon} size={28} color={colors.white} />
                </View>
              </View>

              <Text
                style={{
                  fontFamily: typography.fontFamily.bold,
                  fontSize: typography.fontSize.xxl,
                  color: colors.text.primary,
                  textAlign: "center",
                }}
              >
                {title ?? preset.title}
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                  textAlign: "center",
                  marginTop: 10,
                  lineHeight: typography.lineHeight.sm + 6,
                }}
              >
                {message ?? preset.message}
              </Text>

              <View style={{ width: "100%", marginTop: 26, gap: 10 }}>
                {onRetry && (
                  <TouchableOpacity
                    onPress={onRetry}
                    activeOpacity={0.86}
                    style={{
                      height: 52,
                      borderRadius: radius.full,
                      backgroundColor: colors.primary.DEFAULT,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: typography.fontFamily.semiBold,
                        fontSize: typography.fontSize.md,
                        color: colors.white,
                      }}
                    >
                      Réessayer
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={onClose}
                  activeOpacity={0.82}
                  style={{
                    height: 52,
                    borderRadius: radius.full,
                    backgroundColor: colors.background.light,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: colors.border.light,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.semiBold,
                      fontSize: typography.fontSize.md,
                      color: colors.text.primary,
                    }}
                  >
                    Fermer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
