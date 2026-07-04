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
import { formatDate, formatPrice, formatNumber } from "@/utils";
import { Tag } from "@/components/ui/Tag";

interface EventCardLargeProps {
  event: Event;
  index?: number;
}

export function EventCardLarge({ event, index = 0 }: EventCardLargeProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        delay: Math.min(index, 4) * 70,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay: Math.min(index, 4) * 70,
        damping: 16,
        stiffness: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }, { scale }] }}>
      <Pressable
        onPress={() => router.push(`/event/${event.id}`)}
        onPressIn={() => {
          Animated.spring(scale, {
            toValue: 0.97,
            damping: 14,
            stiffness: 220,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(scale, {
            toValue: 1,
            damping: 14,
            stiffness: 220,
            useNativeDriver: true,
          }).start();
        }}
        style={[
          {
            backgroundColor: colors.card.light,
            borderRadius: 28,
            marginBottom: 18,
            overflow: "hidden",
          },
          shadows.lg,
        ]}
      >
        <View style={{ height: 210 }}>
          <Image
            source={{ uri: event.images[0] }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(15,23,42,0.04)", "rgba(15,23,42,0.72)"]}
            style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
          />
          <View style={{ position: "absolute", top: 14, left: 14, right: 14, flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Tag label={event.category.name} variant="primary" />
              {event.trending && <Tag label="Tendance" variant="success" />}
            </View>
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.92)",
                borderRadius: radius.full,
                paddingHorizontal: 12,
                paddingVertical: 7,
              }}
            >
              <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.sm, color: colors.primary.DEFAULT }}>
                {event.price === 0 ? "Gratuit" : formatPrice(event.price)}
              </Text>
            </View>
          </View>
          <View style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.fontSize.xxl,
                color: colors.white,
              }}
              numberOfLines={2}
            >
              {event.title}
            </Text>
          </View>
        </View>

        <View style={{ padding: 16 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: typography.fontSize.sm,
              color: colors.text.primary,
              lineHeight: 20,
              marginBottom: 14,
            }}
            numberOfLines={2}
          >
            {event.shortDescription || event.description}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="calendar-outline" size={15} color={colors.primary.DEFAULT} />
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, fontFamily: typography.fontFamily.regular }}>
                {formatDate(event.date)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="location-outline" size={15} color={colors.primary.DEFAULT} />
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, fontFamily: typography.fontFamily.regular }} numberOfLines={1}>
                {event.location.distance ? `${event.location.distance} km` : event.location.name}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="people-outline" size={16} color={colors.text.secondary} />
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, fontFamily: typography.fontFamily.regular }}>
                {formatNumber(event.attendees)} pers.
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.sm, color: colors.primary.DEFAULT }}>
                Détails
              </Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primary.DEFAULT} />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
