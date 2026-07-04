import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";

interface CategoryChipProps {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  selected?: boolean;
  variant?: "pill" | "visual";
  onPress: () => void;
}

export function CategoryChip({
  name,
  icon,
  color = colors.primary.DEFAULT,
  selected = false,
  variant = "pill",
  onPress,
}: CategoryChipProps) {
  if (variant === "visual") {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.82} style={{ alignItems: "center", width: 72, marginRight: 12 }}>
        <View
          style={[
            {
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: color + "18",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: selected ? 2 : 0,
              borderColor: color,
            },
            shadows.sm,
          ]}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: color,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name={icon} size={22} color={colors.white} />
          </View>
        </View>
        <Text
          style={{
            fontFamily: typography.fontFamily.medium,
            fontSize: typography.fontSize.xs,
            color: colors.text.primary,
            marginTop: 8,
            textAlign: "center",
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: radius.xl,
        backgroundColor: selected ? color : colors.card.light,
        borderWidth: 1,
        borderColor: selected ? color : colors.border.light,
        flexShrink: 0,
      }}
    >
      <Ionicons name={icon} size={16} color={selected ? colors.white : color} />
      <Text
        style={{
          fontFamily: typography.fontFamily.medium,
          fontSize: typography.fontSize.sm,
          color: selected ? colors.white : colors.text.primary,
        }}
        numberOfLines={1}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}
