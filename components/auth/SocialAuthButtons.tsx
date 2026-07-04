import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";

interface SocialAuthButtonsProps {
  onGoogle?: () => void;
  onApple?: () => void;
}

export function SocialAuthButtons({ onGoogle, onApple }: SocialAuthButtonsProps) {
  return (
    <View style={{ gap: 10 }}>
      <TouchableOpacity
        onPress={onGoogle}
        activeOpacity={0.82}
        style={{
          height: 52,
          borderRadius: radius.button,
          borderWidth: 1,
          borderColor: colors.border.light,
          backgroundColor: colors.white,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Ionicons name="logo-google" size={20} color="#DB4437" />
        <Text
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontSize: typography.fontSize.sm,
            color: colors.text.primary,
          }}
        >
          Continuer avec Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onApple}
        activeOpacity={0.82}
        style={{
          height: 52,
          borderRadius: radius.button,
          backgroundColor: colors.text.primary,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Ionicons name="logo-apple" size={20} color={colors.white} />
        <Text
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontSize: typography.fontSize.sm,
            color: colors.white,
          }}
        >
          Continuer avec Apple
        </Text>
      </TouchableOpacity>
    </View>
  );
}
