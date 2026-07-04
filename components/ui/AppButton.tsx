import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: object;
}

export function AppButton({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}: AppButtonProps) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";

  const bgColor = isPrimary
    ? colors.primary.DEFAULT
    : isSecondary
    ? colors.secondary.DEFAULT
    : isOutline || isGhost
    ? colors.transparent
    : colors.primary.DEFAULT;

  const textColor =
    isOutline || isGhost ? colors.primary.DEFAULT : colors.white;

  const borderStyle = isOutline
    ? { borderWidth: 1.5, borderColor: colors.primary.DEFAULT }
    : {};

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
      style={[
        {
          backgroundColor: bgColor,
          borderRadius: radius.button,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        },
        sizeStyle,
        borderStyle,
        fullWidth && { width: "100%" },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          <Text
            style={{
              color: textColor,
              fontSize,
              fontFamily: typography.fontFamily.semiBold,
            }}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
