import { View, Text } from "react-native";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";

interface BarcodeCardProps {
  code: string;
}

export function BarcodeCard({ code }: BarcodeCardProps) {
  const lines = Array.from({ length: 50 }, () => Math.random() * 0.8 + 0.2);

  return (
    <View
      style={{
        backgroundColor: colors.card.light,
        borderRadius: radius.md,
        padding: 16,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: typography.fontSize.md,
          color: colors.text.primary,
          marginBottom: 12,
        }}
      >
        Barre
      </Text>
      <View
        style={{
          backgroundColor: colors.white,
          borderRadius: radius.sm,
          padding: 12,
          width: "100%",
          borderWidth: 1,
          borderColor: colors.border.light,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          {lines.map((height, index) => (
            <View
              key={index}
              style={{
                width: 3,
                height: 60 * height,
                backgroundColor: colors.black,
                borderRadius: 1,
              }}
            />
          ))}
        </View>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: typography.fontSize.sm,
            color: colors.text.primary,
            textAlign: "center",
            marginTop: 8,
            letterSpacing: 2,
          }}
        >
          {code}
        </Text>
      </View>
    </View>
  );
}
