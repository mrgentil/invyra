import { useEffect, useRef } from "react";
import { Animated, Pressable, View, Text } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";
import { Event } from "@/types";
import { formatDate, formatPrice } from "@/utils";

interface EventCardSmallProps {
  event: Event;
  index?: number;
  variant?: "grid" | "list" | "immersive";
}

export function EventCardSmall({ event, index = 0, variant = "list" }: EventCardSmallProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        delay: Math.min(index, 8) * 45,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay: Math.min(index, 8) * 45,
        damping: 16,
        stiffness: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      damping: 14,
      stiffness: 220,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      damping: 14,
      stiffness: 220,
      useNativeDriver: true,
    }).start();
  };

  if (variant === "immersive") {
    const spotsLeft = Math.max(event.capacity - event.attendees, 0);
    const showUrgency = spotsLeft > 0 && spotsLeft < 150;

    return (
      <Animated.View style={{ opacity, transform: [{ translateY }, { scale }] }}>
        <Pressable
          onPress={() => router.push(`/event/${event.id}`)}
          onPressIn={pressIn}
          onPressOut={pressOut}
          style={[{ borderRadius: 28, marginBottom: 18, overflow: "hidden" }, shadows.lg]}
        >
          <View style={{ height: 248 }}>
            <Image source={{ uri: event.images[0] }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
            <LinearGradient
              colors={["rgba(0,0,0,0.08)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.9)"]}
              style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
            />

            <View style={{ position: "absolute", top: 14, left: 14, right: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
                <View style={{ backgroundColor: event.category.color, borderRadius: radius.full, paddingHorizontal: 11, paddingVertical: 6 }}>
                  <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xs, color: colors.white }}>
                    {event.category.name}
                  </Text>
                </View>
                {event.trending && (
                  <View style={{ backgroundColor: "#FF4D4F", borderRadius: radius.full, paddingHorizontal: 11, paddingVertical: 6 }}>
                    <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xs, color: colors.white }}>
                      🔥 Hot
                    </Text>
                  </View>
                )}
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 6 }}>
                <Ionicons name="star" size={12} color="#FFD166" />
                <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: colors.white }}>
                  {event.rating}
                </Text>
              </View>
            </View>

            {showUrgency && (
              <View style={{ position: "absolute", top: 52, left: 14, backgroundColor: "rgba(255,77,79,0.92)", borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 5 }}>
                <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: colors.white }}>
                  Plus que {spotsLeft} places
                </Text>
              </View>
            )}

            <View style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}>
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
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.85)" />
                  <Text style={{ fontSize: typography.fontSize.xs, color: "rgba(255,255,255,0.85)", fontFamily: typography.fontFamily.medium }}>
                    {formatDate(event.date)}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flex: 1 }}>
                  <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.85)" />
                  <Text style={{ fontSize: typography.fontSize.xs, color: "rgba(255,255,255,0.85)", fontFamily: typography.fontFamily.medium, flex: 1 }} numberOfLines={1}>
                    {event.location.distance != null ? `${event.location.distance} km` : event.location.name}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.lg, color: colors.white }}>
                  {event.price === 0 ? "Gratuit" : formatPrice(event.price)}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.16)", borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 8 }}>
                  <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: colors.white }}>
                    Voir
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.white} />
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  if (variant === "grid") {
    return (
      <Animated.View style={{ opacity, transform: [{ translateY }, { scale }] }}>
      <Pressable
        onPress={() => router.push(`/event/${event.id}`)}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={[
          {
            backgroundColor: colors.card.light,
            borderRadius: 24,
            marginBottom: 16,
            overflow: "hidden",
          },
          shadows.md,
        ]}
      >
        <View style={{ height: 138 }}>
          <Image
            source={{ uri: event.images[0] }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(15,23,42,0.76)"]}
            style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
          />
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "rgba(255,255,255,0.94)",
              borderRadius: radius.full,
              paddingHorizontal: 9,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.fontSize.xs,
                color: colors.primary.DEFAULT,
              }}
            >
              {event.price === 0 ? "Free" : formatPrice(event.price)}
            </Text>
          </View>
          <Text
            style={{
              position: "absolute",
              left: 12,
              right: 12,
              bottom: 12,
              fontFamily: typography.fontFamily.bold,
              fontSize: typography.fontSize.md,
              color: colors.white,
              lineHeight: typography.lineHeight.md,
            }}
            numberOfLines={2}
          >
            {event.title}
          </Text>
        </View>
        <View style={{ padding: 12, gap: 7 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Ionicons name="calendar-outline" size={13} color={colors.primary.DEFAULT} />
            <Text
              style={{
                flex: 1,
                fontSize: typography.fontSize.xs,
                color: colors.text.secondary,
                fontFamily: typography.fontFamily.regular,
              }}
              numberOfLines={1}
            >
              {formatDate(event.date)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Ionicons name="location-outline" size={13} color={colors.primary.DEFAULT} />
            <Text
              style={{
                flex: 1,
                fontSize: typography.fontSize.xs,
                color: colors.text.secondary,
                fontFamily: typography.fontFamily.regular,
              }}
              numberOfLines={1}
            >
              {event.location.name}
            </Text>
          </View>
        </View>
      </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }, { scale }] }}>
      <Pressable
        onPress={() => router.push(`/event/${event.id}`)}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={[
          {
            flexDirection: "row",
            backgroundColor: colors.card.light,
            borderRadius: 24,
            marginBottom: 14,
            overflow: "hidden",
          },
          shadows.md,
        ]}
      >
        <Image
          source={{ uri: event.images[0] }}
          style={{ width: 112, height: 118 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, padding: 14, justifyContent: "center" }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.bold,
              fontSize: typography.fontSize.lg,
              color: colors.text.primary,
            }}
            numberOfLines={2}
          >
            {event.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 }}>
            <Ionicons name="calendar-outline" size={13} color={colors.primary.DEFAULT} />
            <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, fontFamily: typography.fontFamily.regular }}>
              {formatDate(event.date)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
            <Ionicons name="location-outline" size={13} color={colors.primary.DEFAULT} />
            <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, fontFamily: typography.fontFamily.regular }} numberOfLines={1}>
              {event.location.name}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: typography.fontFamily.bold,
              fontSize: typography.fontSize.lg,
              color: colors.primary.DEFAULT,
              marginTop: 8,
            }}
          >
            {event.price === 0 ? "Gratuit" : formatPrice(event.price)}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
