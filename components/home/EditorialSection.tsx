import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";
import { FeaturedCard } from "@/components/cards/FeaturedCard";
import { Event } from "@/types";

interface EditorialSectionProps {
  title: string;
  subtitle: string;
  events: Event[];
  gradient: [string, string];
  badge?: string;
  onSeeAll?: () => void;
}

export function EditorialSection({
  title,
  subtitle,
  events,
  gradient,
  badge,
  onSeeAll,
}: EditorialSectionProps) {
  if (events.length === 0) return null;

  return (
    <View style={{ marginTop: 28 }}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          marginHorizontal: 20,
          borderRadius: 24,
          padding: 18,
          marginBottom: 16,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "rgba(255,255,255,0.1)",
            right: -20,
            top: -30,
          }}
        />
        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            {badge && (
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: radius.full,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: typography.fontFamily.semiBold,
                    fontSize: typography.fontSize.xs,
                    color: colors.white,
                  }}
                >
                  {badge}
                </Text>
              </View>
            )}
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.fontSize.xxl,
                color: colors.white,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: typography.fontSize.sm,
                color: "rgba(255,255,255,0.78)",
                marginTop: 4,
              }}
            >
              {subtitle}
            </Text>
          </View>
          {onSeeAll && (
            <TouchableOpacity
              onPress={onSeeAll}
              activeOpacity={0.82}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: "rgba(255,255,255,0.18)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <FlatList
        data={events}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <FeaturedCard event={item} index={index} badge={index === 0 ? "hot" : item.featured ? "featured" : "default"} />
        )}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
      />
    </View>
  );
}
