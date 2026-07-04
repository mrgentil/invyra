import { View, Text } from "react-native";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";

interface TagProps {
  label: string;
  variant?: "primary" | "success" | "danger" | "warning" | "info";
  size?: "small" | "medium";
}

const variantColors = {
  primary: { bg: colors.primary[50], text: colors.primary.DEFAULT },
  success: { bg: colors.success[50], text: colors.success.DEFAULT },
  danger: { bg: colors.danger[50], text: colors.danger.DEFAULT },
  warning: { bg: "#FFF3E0", text: "#FF9800" },
  info: { bg: "#E3F2FD", text: "#2196F3" },
};

export function Tag({ label, variant = "primary", size = "small" }: TagProps) {
  const vc = variantColors[variant];

  return (
    <View
      style={{
        backgroundColor: vc.bg,
        borderRadius: radius.sm,
        paddingVertical: size === "small" ? 3 : 5,
        paddingHorizontal: size === "small" ? 8 : 12,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          fontFamily: typography.fontFamily.medium,
          fontSize: size === "small" ? typography.fontSize.xs : typography.fontSize.sm,
          color: vc.text,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
