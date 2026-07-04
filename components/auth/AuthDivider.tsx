import { View, Text } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export function AuthDivider({ label = "ou par e-mail" }: { label?: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 22, gap: 12 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.border.light }} />
      <Text
        style={{
          fontFamily: typography.fontFamily.medium,
          fontSize: typography.fontSize.xs,
          color: colors.text.secondary,
        }}
      >
        {label}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.border.light }} />
    </View>
  );
}
