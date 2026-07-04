import { View, Text } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";
import { User } from "@/types";
import { formatNumber } from "@/utils";

interface ProfileCardProps {
  user: User;
  stats?: { label: string; value: number }[];
}

export function ProfileCard({ user, stats }: ProfileCardProps) {
  const defaultStats = [
    { label: "Sorties", value: user.tickets.length },
    { label: "Favoris", value: user.favorites.length },
    { label: "Avis", value: 12 },
  ];

  const displayStats = stats || defaultStats;

  return (
    <View
      style={[
        {
          backgroundColor: colors.card.light,
          borderRadius: radius.card,
          padding: 24,
          alignItems: "center",
        },
        shadows.md,
      ]}
    >
      <Image
        source={{ uri: user.avatar }}
        style={{ width: 88, height: 88, borderRadius: 44 }}
        contentFit="cover"
      />
      <Text
        style={{
          fontFamily: typography.fontFamily.bold,
          fontSize: typography.fontSize.xxl,
          color: colors.text.primary,
          marginTop: 12,
        }}
      >
        {user.name}
      </Text>
      <Text
        style={{
          fontFamily: typography.fontFamily.regular,
          fontSize: typography.fontSize.md,
          color: colors.text.secondary,
          marginTop: 2,
        }}
      >
        {user.email}
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: 20,
          gap: 32,
        }}
      >
        {displayStats.map((stat, index) => (
          <View key={index} style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.fontSize.xxl,
                color: colors.primary.DEFAULT,
              }}
            >
              {formatNumber(stat.value)}
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginTop: 2,
              }}
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
