import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";

const ACCENT = colors.primary.DEFAULT;

interface AuthSubmitButtonProps {
  title: string;
  onPress: () => void;
}

export function AuthSubmitButton({ title, onPress }: AuthSubmitButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.86}
      style={{
        height: 54,
        borderRadius: radius.full,
        backgroundColor: ACCENT,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        marginTop: 8,
        shadowColor: ACCENT,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.24,
        shadowRadius: 18,
        elevation: 8,
      }}
    >
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: typography.fontSize.md,
          color: colors.white,
        }}
      >
        {title}
      </Text>
      <Ionicons name="arrow-forward" size={18} color={colors.white} />
    </TouchableOpacity>
  );
}
