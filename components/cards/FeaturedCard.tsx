import { useEffect, useRef } from "react";
import { Animated, Pressable, View, Text } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";
import { Event } from "@/types";
import { formatDate, formatPrice } from "@/utils";

interface FeaturedCardProps {
  event: Event;
  index?: number;
  badge?: "hot" | "featured" | "default";
}

const BADGE_CONFIG = {
  hot: { label: "🔥 Hot", bg: "#FF4D4F" },
  featured: { label: "✦ Sélection", bg: colors.primary.DEFAULT },
  default: { label: "Populaire", bg: "rgba(0,0,0,0.55)" },
};

export function FeaturedCard({ event, index = 0, badge = "default" }: FeaturedCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(24)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const badgeConfig = BADGE_CONFIG[badge];
  const spotsLeft = Math.max(event.capacity - event.attendees, 0);
  const showUrgency = spotsLeft > 0 && spotsLeft < 120;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 380,
        delay: Math.min(index, 5) * 80,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        delay: Math.min(index, 5) * 80,
        damping: 18,
        stiffness: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateX]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateX }, { scale }] }}>
      <Pressable
        onPress={() => router.push(`/event/${event.id}`)}
        onPressIn={() => {
          Animated.spring(scale, { toValue: 0.96, damping: 14, stiffness: 220, useNativeDriver: true }).start();
        }}
        onPressOut={() => {
          Animated.spring(scale, { toValue: 1, damping: 14, stiffness: 220, useNativeDriver: true }).start();
        }}
        style={[
          {
            width: 260,
            height: 340,
            borderRadius: 28,
            overflow: "hidden",
            marginRight: 14,
          },
          shadows.lg,
        ]}
      >
        <Image source={{ uri: event.images[0] }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.88)"]}
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        />

        <View style={{ position: "absolute", top: 14, left: 14, right: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View
            style={{
              backgroundColor: badgeConfig.bg,
              borderRadius: radius.full,
              paddingVertical: 6,
              paddingHorizontal: 11,
            }}
          >
            <Text style={{ color: colors.white, fontSize: typography.fontSize.xs, fontFamily: typography.fontFamily.bold }}>
              {badgeConfig.label}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: "rgba(255,255,255,0.18)",
              borderRadius: radius.full,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Ionicons name="star" size={12} color="#FFD166" />
            <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: colors.white }}>
              {event.rating}
            </Text>
          </View>
        </View>

        {showUrgency && (
          <View
            style={{
              position: "absolute",
              top: 52,
              left: 14,
              backgroundColor: "rgba(255,77,79,0.92)",
              borderRadius: radius.full,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: colors.white }}>
              Plus que {spotsLeft} places
            </Text>
          </View>
        )}

        <View style={{ position: "absolute", bottom: 18, left: 18, right: 18 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.bold,
              fontSize: typography.fontSize.xl,
              lineHeight: typography.lineHeight.xl,
              color: colors.white,
              marginBottom: 10,
            }}
            numberOfLines={2}
          >
            {event.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.85)" />
              <Text style={{ fontSize: typography.fontSize.xs, color: "rgba(255,255,255,0.85)", fontFamily: typography.fontFamily.medium }}>
                {formatDate(event.date)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flex: 1 }}>
              <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.85)" />
              <Text style={{ fontSize: typography.fontSize.xs, color: "rgba(255,255,255,0.85)", fontFamily: typography.fontFamily.medium, flex: 1 }} numberOfLines={1}>
                {event.location.name}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.lg, color: colors.white }}>
              {event.price === 0 ? "Gratuit" : formatPrice(event.price)}
            </Text>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="arrow-forward" size={16} color={colors.white} />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
