import { View, Text } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { formatPrice } from "@/utils";

interface PriceProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: "small" | "medium" | "large";
  freeLabel?: string;
}

export function Price({
  price,
  originalPrice,
  currency = "EUR",
  size = "medium",
  freeLabel = "Gratuit",
}: PriceProps) {
  const isFree = price === 0;

  const sizes = {
    small: { price: typography.fontSize.md, original: typography.fontSize.xs },
    medium: { price: typography.fontSize.xxl, original: typography.fontSize.sm },
    large: { price: typography.fontSize.huge, original: typography.fontSize.md },
  };

  const s = sizes[size];

  return (
    <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
      <Text
        style={{
          fontFamily: typography.fontFamily.bold,
          fontSize: s.price,
          color: isFree ? colors.success.DEFAULT : colors.primary.DEFAULT,
        }}
      >
        {isFree ? freeLabel : formatPrice(price, currency)}
      </Text>
      {originalPrice && !isFree && (
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: s.original,
            color: colors.text.secondary,
            textDecorationLine: "line-through",
          }}
        >
          {formatPrice(originalPrice, currency)}
        </Text>
      )}
    </View>
  );
}
