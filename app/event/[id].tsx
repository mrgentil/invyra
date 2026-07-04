import { useState, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, Dimensions, Animated, ScrollView, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";
import { shadows } from "@/theme/shadows";
import { Tag } from "@/components/ui/Tag";
import { Rating } from "@/components/ui/Rating";
import { Price } from "@/components/ui/Price";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DateCard } from "@/components/ui/DateCard";
import { LocationCard } from "@/components/ui/LocationCard";
import { OrganizerCard } from "@/components/cards/OrganizerCard";
import { Gallery } from "@/components/cards/Gallery";
import { GradientButton } from "@/components/ui/GradientButton";
import { SocialShareSheet } from "@/components/modals/SocialShareSheet";
import { getEventById } from "@/services/mockData";
import { useFavoritesStore } from "@/store";
import { formatNumber } from "@/utils";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 390;
const SCREEN_BG = "#F2F4F8";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = getEventById(id!);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [showShare, setShowShare] = useState(false);
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const headerTranslateY = scrollOffset.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT / 2],
    extrapolate: "clamp",
  });
  const headerScale = scrollOffset.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [1, 1.3],
    extrapolate: "clamp",
  });
  const backOpacity = scrollOffset.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  if (!event) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: SCREEN_BG }}>
        <Text style={{ fontFamily: typography.fontFamily.medium, color: colors.text.secondary }}>Événement introuvable</Text>
      </View>
    );
  }

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
    { useNativeDriver: true }
  );

  const fav = isFavorite(event.id);
  const spotsLeft = Math.max(event.capacity - event.attendees, 0);
  const showUrgency = spotsLeft > 0 && spotsLeft < 120;
  const locationLabel = [event.location.city, event.location.province].filter(Boolean).join(", ");
  const handleDirections = () => {
    const query = encodeURIComponent(`${event.location.name}, ${event.location.address}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: SCREEN_BG }}>
      <Stack.Screen options={{ headerShown: false }} />

      <Animated.ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={{ height: HEADER_HEIGHT }}>
          <Animated.Image
            source={{ uri: event.images[0] }}
            style={[{ width, height: HEADER_HEIGHT, position: "absolute" }, { transform: [{ translateY: headerTranslateY }, { scale: headerScale }] }]}
          />
          <LinearGradient
            colors={["rgba(15,23,42,0.62)", "transparent", "rgba(15,23,42,0.8)"]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 50,
                left: 20,
                zIndex: 10,
              },
              { opacity: backOpacity },
            ]}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(15,23,42,0.48)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="arrow-back" size={22} color={colors.white} />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 50,
                right: 20,
                flexDirection: "row",
                gap: 8,
                zIndex: 10,
              },
              { opacity: backOpacity },
            ]}
          >
            <TouchableOpacity
              onPress={() => toggleFavorite(event.id)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(15,23,42,0.48)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={fav ? "heart" : "heart-outline"}
                size={22}
                color={fav ? colors.danger.DEFAULT : colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowShare(true)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(15,23,42,0.48)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="share-outline" size={22} color={colors.white} />
            </TouchableOpacity>
          </Animated.View>
          <View style={{ position: "absolute", left: 20, right: 20, bottom: 34 }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.fontSize.hero,
                lineHeight: typography.lineHeight.hero,
                color: colors.white,
              }}
              numberOfLines={2}
            >
              {event.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 }}>
              <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.82)" />
              <Text
                style={{
                  flex: 1,
                  fontFamily: typography.fontFamily.medium,
                  fontSize: typography.fontSize.sm,
                  color: "rgba(255,255,255,0.82)",
                }}
                numberOfLines={1}
              >
                {event.location.name}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: -24 }}>
          <View
            style={[{
              backgroundColor: colors.card.light,
              borderRadius: 32,
              padding: 20,
            }, shadows.lg]}
          >
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <Tag label={event.category.name} variant="primary" />
              {event.trending && <Tag label="Tendance" variant="success" />}
              {event.featured && <Tag label="Top" variant="info" />}
              {showUrgency && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    backgroundColor: colors.danger[50],
                    borderRadius: radius.full,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                  }}
                >
                  <Ionicons name="flame" size={14} color={colors.danger.DEFAULT} />
                  <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: colors.danger[700] }}>
                    Plus que {spotsLeft} places
                  </Text>
                </View>
              )}
            </View>
            <Rating rating={event.rating} count={event.reviewCount} size={16} />
            {locationLabel ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 }}>
                <Ionicons name="navigate-outline" size={15} color={colors.primary.DEFAULT} />
                <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  {locationLabel}
                </Text>
              </View>
            ) : null}
            <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
              {[
                { icon: "people-outline" as const, label: `${formatNumber(event.attendees)} pers.` },
                { icon: "time-outline" as const, label: event.time },
                { icon: "shield-checkmark-outline" as const, label: "Sécurisé" },
              ].map((item) => (
                <View
                  key={item.label}
                  style={{
                    flex: 1,
                    backgroundColor: colors.primary[50],
                    borderRadius: radius.lg,
                    paddingVertical: 12,
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Ionicons name={item.icon} size={18} color={colors.primary.DEFAULT} />
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.medium,
                      fontSize: typography.fontSize.xs,
                      color: colors.text.primary,
                    }}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <SectionTitle title="Description" />
            <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.md, color: colors.text.secondary, lineHeight: 24, marginTop: -8 }}>
              {event.description}
            </Text>
          </View>

          <View style={{ marginTop: 24 }}>
            <SectionTitle title="Date" />
            <DateCard date={event.date} time={event.time} endDate={event.endDate} endTime={event.endTime} />
          </View>

          <View style={{ marginTop: 24 }}>
            <SectionTitle title="Lieu" />
            <LocationCard
              location={event.location}
              onDirections={handleDirections}
            />
          </View>

          <View style={{ marginTop: 24 }}>
            <SectionTitle title="Organisateur" />
            <OrganizerCard organizer={event.organizer} />
          </View>

          <View style={{ marginTop: 24 }}>
            <SectionTitle title="Galerie" />
            <Gallery images={event.images} />
          </View>

          <View style={{ marginTop: 24 }}>
            <SectionTitle title="Prix" />
            <Price price={event.price} originalPrice={event.originalPrice} size="large" />
          </View>
        </View>
      </Animated.ScrollView>

      <View
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingBottom: 30,
            paddingTop: 16,
            backgroundColor: colors.white,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
          },
          shadows.lg,
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <View>
            <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
              Dès
            </Text>
            <Price price={event.price} originalPrice={event.originalPrice} size="medium" />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: colors.success[50],
              borderRadius: radius.full,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.success.DEFAULT} />
            <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.xs, color: colors.success[700] }}>
              Achat sécurisé
            </Text>
          </View>
        </View>
        <GradientButton
          title="Réserver"
          onPress={() => router.push(`/booking/${event.id}`)}
          fullWidth
          size="large"
        />
      </View>

      <SocialShareSheet visible={showShare} onClose={() => setShowShare(false)} />
    </View>
  );
}
