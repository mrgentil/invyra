import { useRef, useCallback, useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Animated,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";
import { radius } from "@/theme/radius";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { SearchBar } from "@/components/ui/SearchBar";
import { LocationSelector } from "@/components/ui/LocationSelector";
import { EventCardLarge } from "@/components/cards/EventCardLarge";
import { EditorialSection } from "@/components/home";
import { categories, getFeaturedEvents, getUpcomingEvents, getNearbyEvents, getPopularEvents, getTrendingEvents } from "@/services/mockData";
import { useLocationStore } from "@/store";
import { formatDate, formatPrice } from "@/utils";
import { Event } from "@/types";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = 380;

function HeroSlide({ event, index, total }: { event: Event; index: number; total: number }) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={{ width, paddingHorizontal: 16, transform: [{ scale }] }}>
      <Pressable
        onPress={() => router.push(`/event/${event.id}`)}
        onPressIn={() => Animated.spring(scale, { toValue: 0.98, damping: 16, stiffness: 220, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, damping: 16, stiffness: 220, useNativeDriver: true }).start()}
        style={[{ height: HERO_HEIGHT, borderRadius: 32, overflow: "hidden" }, shadows.xl]}
      >
        <Image source={{ uri: event.images[0] }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
        <LinearGradient
          colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.92)"]}
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        />

        <View style={{ position: "absolute", top: 20, left: 20, right: 20, flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ backgroundColor: colors.primary.DEFAULT, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 7 }}>
              <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xs, color: colors.white }}>
                ✦ À la une
              </Text>
            </View>
            {event.trending && (
              <View style={{ backgroundColor: "#FF4D4F", borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 7 }}>
                <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xs, color: colors.white }}>
                  🔥 Hot
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.16)",
              borderRadius: radius.full,
              paddingHorizontal: 11,
              paddingVertical: 7,
            }}
          >
            <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: colors.white }}>
              {index + 1}/{total}
            </Text>
          </View>
        </View>

        <View style={{ position: "absolute", left: 22, right: 22, bottom: 24 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.bold,
              fontSize: typography.fontSize.huge,
              lineHeight: typography.lineHeight.huge,
              color: colors.white,
            }}
            numberOfLines={2}
          >
            {event.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginTop: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.82)" />
              <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.sm, color: "rgba(255,255,255,0.82)" }}>
                {formatDate(event.date)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, flex: 1 }}>
              <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.82)" />
              <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.sm, color: "rgba(255,255,255,0.82)", flex: 1 }} numberOfLines={1}>
                {event.location.name}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
            <View>
              <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.xs, color: "rgba(255,255,255,0.65)" }}>
                À partir de
              </Text>
              <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xxl, color: colors.white, marginTop: 2 }}>
                {event.price === 0 ? "Gratuit" : formatPrice(event.price)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: colors.white,
                borderRadius: radius.full,
                paddingHorizontal: 18,
                paddingVertical: 12,
              }}
            >
              <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                Réserver
              </Text>
              <Ionicons name="arrow-forward" size={16} color={colors.text.primary} />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const heroListRef = useRef<FlatList<Event>>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const selectedCityId = useLocationStore((state) => state.selectedId);

  const featured = useMemo(() => getFeaturedEvents(selectedCityId), [selectedCityId]);
  const upcoming = useMemo(() => getUpcomingEvents(selectedCityId), [selectedCityId]);
  const nearby = useMemo(() => getNearbyEvents(selectedCityId), [selectedCityId]);
  const popular = useMemo(() => getPopularEvents(selectedCityId), [selectedCityId]);
  const trending = useMemo(() => getTrendingEvents(selectedCityId), [selectedCityId]);
  const heroEvents = featured.length > 0 ? featured.slice(0, 5) : popular.slice(0, 5);

  const handleSearch = useCallback(() => {
    router.push("/(tabs)/discover");
  }, []);

  const handleHeroScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setHeroIndex(nextIndex);
  }, []);

  useEffect(() => {
    if (heroEvents.length <= 1) return;

    const interval = setInterval(() => {
      setHeroIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % heroEvents.length;
        heroListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [heroEvents.length]);

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <LinearGradient
        colors={["#EAF2FF", "#F2F4F8", "#F2F4F8"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, height: 320 }}
      />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ paddingTop: 56, paddingHorizontal: 20, paddingBottom: 4 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                Bonjour 👋
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.bold,
                  fontSize: typography.fontSize.xxl,
                  lineHeight: typography.lineHeight.xxl,
                  color: colors.text.primary,
                  marginTop: 4,
                }}
              >
                Près de vous
              </Text>
              <LocationSelector />
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => router.push("/notifications")}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  backgroundColor: colors.white,
                  alignItems: "center",
                  justifyContent: "center",
                  ...shadows.sm,
                }}
              >
                <Ionicons name="notifications-outline" size={21} color={colors.text.primary} />
                <View
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 11,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.danger.DEFAULT,
                    borderWidth: 1.5,
                    borderColor: colors.white,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/profile")}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  backgroundColor: colors.primary.DEFAULT,
                  alignItems: "center",
                  justifyContent: "center",
                  ...shadows.sm,
                }}
              >
                <Ionicons name="person-outline" size={21} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <SearchBar
            value=""
            onChangeText={() => {}}
            onFocus={handleSearch}
            onFilter={handleSearch}
            placeholder="Concert, expo, soirée..."
          />
        </View>

        {heroEvents.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <FlatList
              ref={heroListRef}
              data={heroEvents}
              horizontal
              pagingEnabled
              bounces={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              onMomentumScrollEnd={handleHeroScroll}
              onScrollToIndexFailed={() => {
                heroListRef.current?.scrollToOffset({ offset: 0, animated: true });
                setHeroIndex(0);
              }}
              renderItem={({ item, index }) => (
                <HeroSlide event={item} index={index} total={heroEvents.length} />
              )}
            />
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 16 }}>
              {heroEvents.map((item, index) => (
                <View
                  key={item.id}
                  style={{
                    width: index === heroIndex ? 24 : 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: index === heroIndex ? colors.primary.DEFAULT : colors.primary[200],
                  }}
                />
              ))}
            </View>
          </View>
        )}

        <View style={{ marginTop: 28 }}>
          <View style={{ paddingHorizontal: 20, marginBottom: 4 }}>
            <SectionTitle title="Ambiances" subtitle="Explorez par envie" accentColor={colors.secondary.DEFAULT} />
          </View>
          <FlatList
            data={categories.slice(0, 8)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item }) => (
              <CategoryChip
                name={item.name}
                icon={item.icon as keyof typeof Ionicons.glyphMap}
                color={item.color}
                variant="visual"
                onPress={() => router.push(`/(tabs)/discover?category=${item.id}`)}
              />
            )}
          />
        </View>

        <EditorialSection
          title="Ce week-end"
          subtitle="Les plans immanquables autour de vous"
          badge="Sélection éditoriale"
          events={upcoming.slice(0, 6)}
          gradient={[colors.primary[900], colors.primary.DEFAULT]}
          onSeeAll={() => router.push("/(tabs)/discover")}
        />

        <EditorialSection
          title="En ce moment"
          subtitle="Ce qui buzz dans votre ville"
          badge="Tendances"
          events={trending.slice(0, 6)}
          gradient={["#0C4A6E", colors.secondary.DEFAULT]}
          onSeeAll={() => router.push("/(tabs)/discover")}
        />

        <EditorialSection
          title="Coups de cœur"
          subtitle="Nos favorites du moment"
          events={popular.slice(0, 6)}
          gradient={["#312E81", "#6366F1"]}
          onSeeAll={() => router.push("/(tabs)/discover")}
        />

        <View style={{ marginTop: 12, paddingHorizontal: 20 }}>
          <SectionTitle
            title="À proximité"
            subtitle="Deux pas de chez vous"
            action="Tout voir"
            accentColor={colors.success.DEFAULT}
            onAction={() => router.push("/(tabs)/discover")}
          />
          {nearby.slice(0, 3).map((event, index) => (
            <EventCardLarge key={event.id} event={event} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
