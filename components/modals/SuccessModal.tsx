import { useEffect, useRef } from "react";
import { View, Text, Modal, TouchableOpacity, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";

type SuccessVariant = "default" | "payment" | "booking";

interface SuccessModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  actionLabel?: string;
  variant?: SuccessVariant;
  onClose: () => void;
}

const VARIANT_PRESETS: Record<
  SuccessVariant,
  { icon: keyof typeof Ionicons.glyphMap; title: string; message: string; actionLabel: string }
> = {
  default: {
    icon: "checkmark-circle",
    title: "C'est confirmé !",
    message: "Votre action a bien été enregistrée.",
    actionLabel: "Continuer",
  },
  payment: {
    icon: "ticket",
    title: "Paiement réussi",
    message: "Vos billets sont prêts. Retrouvez-les dans votre wallet Invyra.",
    actionLabel: "Voir mes billets",
  },
  booking: {
    icon: "calendar",
    title: "Réservation confirmée",
    message: "Votre place est réservée. Il ne reste plus qu'à finaliser le paiement.",
    actionLabel: "Continuer",
  },
};

export function SuccessModal({
  visible,
  title,
  message,
  actionLabel,
  variant = "default",
  onClose,
}: SuccessModalProps) {
  const preset = VARIANT_PRESETS[variant];
  const scale = useRef(new Animated.Value(0.88)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0.88);
      opacity.setValue(0);
      iconScale.setValue(0.6);

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, damping: 16, stiffness: 180, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(120),
          Animated.spring(iconScale, { toValue: 1, damping: 12, stiffness: 160, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [iconScale, opacity, scale, visible]);

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
            transform: [{ scale }],
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
              colors={[colors.primary[600], colors.primary.DEFAULT, colors.secondary.DEFAULT]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ height: 6 }}
            />

            <View style={{ padding: 28, alignItems: "center" }}>
              <Animated.View style={{ transform: [{ scale: iconScale }] }}>
                <LinearGradient
                  colors={[colors.success[50], colors.primary[50]]}
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 42,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                    borderWidth: 1,
                    borderColor: colors.success[100],
                  }}
                >
                  <View
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 29,
                      backgroundColor: colors.success.DEFAULT,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name={preset.icon} size={28} color={colors.white} />
                  </View>
                </LinearGradient>
              </Animated.View>

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

              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.86}
                style={{
                  marginTop: 26,
                  width: "100%",
                  height: 52,
                  borderRadius: radius.full,
                  backgroundColor: colors.primary.DEFAULT,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: typography.fontFamily.semiBold,
                    fontSize: typography.fontSize.md,
                    color: colors.white,
                  }}
                >
                  {actionLabel ?? preset.actionLabel}
                </Text>
                <Ionicons name="arrow-forward" size={18} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
