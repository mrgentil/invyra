import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  colors?: [string, string];
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: object;
}

export function GradientButton({
  title,
  onPress,
  colors: gradientColors = [colors.primary.DEFAULT, colors.secondary.DEFAULT],
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: GradientButtonProps) {
  const sizeStyle =
    size === "small"
      ? { paddingVertical: 8, paddingHorizontal: 16 }
      : size === "large"
      ? { paddingVertical: 16, paddingHorizontal: 32 }
      : { paddingVertical: 12, paddingHorizontal: 24 };

  const fontSize =
    size === "small"
      ? typography.fontSize.sm
      : size === "large"
      ? typography.fontSize.lg
      : typography.fontSize.md;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[fullWidth && { width: "100%" }, style]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          {
            borderRadius: radius.button,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          },
          sizeStyle,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <Text
            style={{
              color: colors.white,
              fontSize,
              fontFamily: typography.fontFamily.semiBold,
            }}
            >
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
