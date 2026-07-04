import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface RatingProps {
  rating: number;
  count?: number;
  size?: number;
  showCount?: boolean;
}

export function Rating({ rating, count, size = 14, showCount = true }: RatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {Array.from({ length: 5 }, (_, i) => {
          if (i < fullStars) {
            return <Ionicons key={i} name="star" size={size} color="#FFB800" />;
          } else if (i === fullStars && hasHalf) {
            return <Ionicons key={i} name="star-half" size={size} color="#FFB800" />;
          }
          return <Ionicons key={i} name="star-outline" size={size} color="#FFB800" />;
        })}
      </View>
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: size,
          color: colors.text.primary,
        }}
      >
        {rating.toFixed(1)}
      </Text>
      {showCount && count !== undefined && (
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: size - 2,
            color: colors.text.secondary,
          }}
        >
          ({count})
        </Text>
      )}
    </View>
  );
}
