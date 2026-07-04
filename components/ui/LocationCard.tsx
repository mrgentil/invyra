import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";
import { Location } from "@/types";

interface LocationCardProps {
  location: Location;
  onPress?: () => void;
  onDirections?: () => void;
}

export function LocationCard({ location, onPress, onDirections }: LocationCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card.light,
        borderRadius: radius.md,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border.light,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.primary[50],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="location-outline" size={20} color={colors.primary.DEFAULT} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontSize: typography.fontSize.md,
            color: colors.text.primary,
          }}
        >
          {location.name}
        </Text>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            marginTop: 2,
          }}
          numberOfLines={1}
        >
          {location.address}
        </Text>
      </View>
      {onDirections && (
        <TouchableOpacity
          onPress={onDirections}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.primary.DEFAULT,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="navigate-outline" size={18} color={colors.white} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
