import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";

interface AuthErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function AuthErrorBanner({ message, onDismiss }: AuthErrorBannerProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        backgroundColor: colors.danger[50],
        borderWidth: 1,
        borderColor: colors.danger[200] ?? "#FECACA",
        borderRadius: radius.md,
        padding: 12,
        marginBottom: 16,
      }}
    >
      <Ionicons name="alert-circle" size={20} color={colors.danger.DEFAULT} style={{ marginTop: 1 }} />
      <Text
        style={{
          flex: 1,
          fontFamily: typography.fontFamily.medium,
          fontSize: typography.fontSize.sm,
          lineHeight: typography.lineHeight.sm + 2,
          color: colors.danger[700] ?? "#B91C1C",
        }}
      >
        {message}
      </Text>
      {onDismiss ? (
        <TouchableOpacity onPress={onDismiss} hitSlop={8} activeOpacity={0.7}>
          <Ionicons name="close" size={18} color={colors.danger.DEFAULT} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
