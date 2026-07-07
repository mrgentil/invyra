import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";

const ACCENT = colors.primary.DEFAULT;

interface AuthSubmitButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

export function AuthSubmitButton({ title, onPress, loading = false }: AuthSubmitButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.86}
      disabled={loading}
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
        {loading ? "Chargement..." : title}
      </Text>
      {loading ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <Ionicons name="arrow-forward" size={18} color={colors.white} />
      )}
    </TouchableOpacity>
  );
}
