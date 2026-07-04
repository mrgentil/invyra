import { View, Text } from "react-native";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";

interface QRCardProps {
  code: string;
  size?: number;
}

export function QRCard({ code, size = 200 }: QRCardProps) {
  const cellSize = size / 11;
  const cells = Array.from({ length: 11 }, (_, i) =>
    Array.from({ length: 11 }, (_, j) => {
      if (
        i === 0 || i === 10 || j === 0 || j === 10 ||
        (i === 1 && j === 1) ||
        ((i < 3 || i > 7) && (j < 3 || j > 7))
      ) {
        return true;
      }
      return (i * j + i + j) % 3 === 0;
    })
  );

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
        QR Code
      </Text>
      <View
        style={{
          width: size,
          height: size,
          backgroundColor: colors.white,
          borderRadius: radius.md,
          padding: cellSize,
          borderWidth: 1,
          borderColor: colors.border.light,
        }}
      >
        {cells.map((row, i) => (
          <View key={i} style={{ flexDirection: "row" }}>
            {row.map((filled, j) => (
              <View
                key={j}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: filled ? colors.black : colors.white,
                }}
              />
            ))}
          </View>
        ))}
      </View>
      <Text
        style={{
          fontFamily: typography.fontFamily.regular,
          fontSize: typography.fontSize.xs,
          color: colors.text.secondary,
          marginTop: 12,
          textAlign: "center",
        }}
      >
        {code}
      </Text>
    </View>
  );
}
