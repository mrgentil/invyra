import { TouchableOpacity, View, Text } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";
import { Organizer } from "@/types";
import { formatNumber } from "@/utils";

interface OrganizerCardProps {
  organizer: Organizer;
  onPress?: () => void;
}

export function OrganizerCard({ organizer, onPress }: OrganizerCardProps) {
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
      <Image
        source={{ uri: organizer.avatar }}
        style={{ width: 48, height: 48, borderRadius: 24 }}
        contentFit="cover"
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.semiBold,
              fontSize: typography.fontSize.md,
              color: colors.text.primary,
            }}
          >
            {organizer.name}
          </Text>
          {organizer.verified && (
            <Ionicons name="checkmark-circle" size={16} color={colors.primary.DEFAULT} />
          )}
        </View>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            marginTop: 2,
          }}
        >
          {organizer.eventCount} évt. &middot; {formatNumber(organizer.followers)} abos
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <Ionicons name="star" size={14} color="#FFB800" />
        <Text
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontSize: typography.fontSize.sm,
            color: colors.text.primary,
          }}
        >
          {organizer.rating}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
