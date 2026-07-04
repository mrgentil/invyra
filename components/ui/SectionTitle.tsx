import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
  accentColor?: string;
}

export function SectionTitle({ title, subtitle, action, onAction, accentColor = colors.primary.DEFAULT }: SectionTitleProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
        <View
          style={{
            width: 4,
            height: subtitle ? 36 : 22,
            borderRadius: 2,
            backgroundColor: accentColor,
            marginTop: 2,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.bold,
              fontSize: typography.fontSize.xl,
              color: colors.text.primary,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginTop: 3,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {action && onAction && (
        <TouchableOpacity
          onPress={onAction}
          activeOpacity={0.75}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: colors.primary[50],
            borderRadius: 999,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Text
            style={{
              fontFamily: typography.fontFamily.semiBold,
              fontSize: typography.fontSize.xs,
              color: colors.primary.DEFAULT,
            }}
          >
            {action}
          </Text>
          <Ionicons name="arrow-forward" size={14} color={colors.primary.DEFAULT} />
        </TouchableOpacity>
      )}
    </View>
  );
}
