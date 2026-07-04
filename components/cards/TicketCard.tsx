import { useEffect, useRef } from "react";
import { Animated, Pressable, View, Text } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";
import { Ticket } from "@/types";
import { formatDate, formatPrice } from "@/utils";

interface TicketCardProps {
  ticket: Ticket;
  index?: number;
  onPress?: () => void;
}

const STATUS_CONFIG = {
  active: { label: "Prêt à scanner", color: colors.success.DEFAULT, bg: colors.success[50] },
  used: { label: "Utilisé", color: colors.text.secondary, bg: "#F3F4F6" },
  expired: { label: "Expiré", color: colors.danger.DEFAULT, bg: colors.danger[50] },
  cancelled: { label: "Annulé", color: colors.danger.DEFAULT, bg: colors.danger[50] },
};

const TYPE_LABEL = {
  vip: "VIP",
  standard: "Standard",
  "early-bird": "Early Bird",
};

export function TicketCard({ ticket, index = 0, onPress }: TicketCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const status = STATUS_CONFIG[ticket.status];
  const isActive = ticket.status === "active";
  const qrCells = new Set([0, 1, 2, 4, 6, 8, 10, 12, 13, 15, 18, 20, 21, 23, 24]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 360,
        delay: Math.min(index, 6) * 70,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay: Math.min(index, 6) * 70,
        damping: 18,
        stiffness: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }, { scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.98, damping: 16, stiffness: 220, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, damping: 16, stiffness: 220, useNativeDriver: true }).start()}
        style={[
          {
            borderRadius: 28,
            marginBottom: 18,
            overflow: "hidden",
            backgroundColor: colors.white,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.04)",
          },
          shadows.lg,
        ]}
      >
        <View style={{ height: 168, opacity: isActive ? 1 : 0.72 }}>
          <Image source={{ uri: ticket.event.images[0] }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.88)"]}
            style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
          />

          <View style={{ position: "absolute", top: 14, left: 14, right: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ backgroundColor: status.bg, borderRadius: radius.full, paddingHorizontal: 11, paddingVertical: 6, flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: status.color }} />
              <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: status.color }}>
                {status.label}
              </Text>
            </View>
            <View style={{ backgroundColor: "rgba(255,255,255,0.18)", borderRadius: radius.full, paddingHorizontal: 11, paddingVertical: 6 }}>
              <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xs, color: colors.white }}>
                {TYPE_LABEL[ticket.type]}
              </Text>
            </View>
          </View>

          <View style={{ position: "absolute", left: 16, right: 16, bottom: 14 }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.fontSize.xl,
                lineHeight: typography.lineHeight.xl,
                color: colors.white,
              }}
              numberOfLines={2}
            >
              {ticket.event.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6 }}>
              <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.82)" />
              <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.xs, color: "rgba(255,255,255,0.82)" }}>
                {formatDate(ticket.event.date)} · {ticket.event.time}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: -12, zIndex: 2 }}>
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#F2F4F8", marginLeft: -12 }} />
          <View style={{ flex: 1, borderTopWidth: 1, borderStyle: "dashed", borderColor: colors.border.light }} />
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#F2F4F8", marginRight: -12 }} />
        </View>

        <View style={{ paddingHorizontal: 18, paddingTop: 6, paddingBottom: 18 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <Ionicons name="location-outline" size={15} color={colors.primary.DEFAULT} />
            <Text style={{ flex: 1, fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.sm, color: colors.text.secondary }} numberOfLines={1}>
              {ticket.event.location.name}
            </Text>
            <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.md, color: colors.text.primary }}>
              {ticket.quantity}x · {formatPrice(ticket.totalAmount)}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1, marginRight: 14 }}>
              <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
                Code billet
              </Text>
              <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.sm, color: colors.text.primary, marginTop: 3 }} numberOfLines={1}>
                {ticket.barcode.slice(0, 16).toUpperCase()}
              </Text>
              {isActive && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 10 }}>
                  <Ionicons name="scan-outline" size={15} color={colors.primary.DEFAULT} />
                  <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: colors.primary.DEFAULT }}>
                    Présentez à l'entrée
                  </Text>
                </View>
              )}
            </View>

            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 20,
                backgroundColor: colors.background.light,
                padding: 8,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 3,
                borderWidth: 1,
                borderColor: colors.border.light,
                opacity: isActive ? 1 : 0.45,
              }}
            >
              {Array.from({ length: 25 }).map((_, cellIndex) => (
                <View
                  key={cellIndex}
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 2,
                    backgroundColor: qrCells.has(cellIndex) ? colors.text.primary : colors.border.light,
                  }}
                />
              ))}
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
