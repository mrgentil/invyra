import { useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";
import { shadows } from "@/theme/shadows";
import { SearchBar } from "@/components/ui/SearchBar";
import { LocationSelector } from "@/components/ui/LocationSelector";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { EventCardSmall } from "@/components/cards/EventCardSmall";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBottomSheet } from "@/components/modals/FilterBottomSheet";
import { categories, getEvents } from "@/services/mockData";
import { useFilterStore, useLocationStore } from "@/store";
import { Event } from "@/types";

type QuickFilter = "all" | "weekend" | "free" | "popular";
type ViewMode = "immersive" | "grid";

const QUICK_FILTERS: { id: QuickFilter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "all", label: "Tous", icon: "apps-outline" },
  { id: "weekend", label: "Ce week-end", icon: "calendar-outline" },
  { id: "free", label: "Gratuit", icon: "gift-outline" },
  { id: "popular", label: "Populaire", icon: "flame-outline" },
];

function isThisWeekend(dateIso: string) {
  const day = new Date(dateIso).getDay();
  return day === 0 || day === 6;
}

export default function DiscoverScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("immersive");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(params.category);
  const { filters, isVisible, showFilters, hideFilters } = useFilterStore();
  const selectedCityId = useLocationStore((state) => state.selectedId);

  const filteredEvents = useMemo(() => {
    let result = getEvents({
      category: selectedCategory ?? filters.category,
      search: searchQuery || undefined,
      cityId: selectedCityId,
    });

    if (filters.priceRange) {
      result = result.filter(
        (event) => event.price >= filters.priceRange![0] && event.price <= filters.priceRange![1]
      );
    }

    if (filters.rating && filters.rating > 0) {
      result = result.filter((event) => event.rating >= filters.rating!);
    }

    if (filters.distance != null) {
      result = result.filter((event) => (event.location.distance ?? 99) <= filters.distance!);
    }

    if (quickFilter === "free") {
      result = result.filter((event) => event.price === 0);
    } else if (quickFilter === "weekend") {
      result = result.filter((event) => isThisWeekend(event.date));
    } else if (quickFilter === "popular") {
      result = [...result].sort((a, b) => b.attendees - a.attendees);
    }

    switch (filters.sortBy) {
      case "date":
        result = [...result].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "price":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      default:
        if (quickFilter !== "popular") {
          result = [...result].sort((a, b) => b.attendees - a.attendees);
        }
        break;
    }

    return result;
  }, [filters, quickFilter, searchQuery, selectedCategory, selectedCityId]);

  const handleApplyFilters = useCallback(() => {
    if (filters.category) {
      setSelectedCategory(filters.category);
    }
    hideFilters();
  }, [filters.category, hideFilters]);

  const selectedCategoryName = useMemo(
    () => categories.find((category) => category.id === selectedCategory)?.name,
    [selectedCategory]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory || filters.category) count += 1;
    if (filters.priceRange && filters.priceRange[1] < 500) count += 1;
    if (filters.distance != null && filters.distance < 50) count += 1;
    if (filters.rating && filters.rating > 0) count += 1;
    if (filters.sortBy && filters.sortBy !== "popularity") count += 1;
    return count;
  }, [filters.category, filters.distance, filters.priceRange, filters.rating, filters.sortBy, selectedCategory]);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(undefined);
    setQuickFilter("all");
    useFilterStore.getState().resetFilters();
  }, []);

  const ListHeader = useMemo(
    () => (
      <View>
        <LinearGradient
          colors={["#EAF2FF", "#F2F4F8"]}
          style={{ paddingTop: 56, paddingHorizontal: 20, paddingBottom: 18 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <View>
              <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xxxl, color: colors.text.primary }}>
                Explorer
              </Text>
              <LocationSelector variant="header" />
            </View>
            <TouchableOpacity
              onPress={showFilters}
              activeOpacity={0.82}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.white,
                alignItems: "center",
                justifyContent: "center",
                ...shadows.sm,
              }}
            >
              <Ionicons name="options-outline" size={22} color={colors.text.primary} />
              {activeFilterCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: colors.primary.DEFAULT,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 4,
                    borderWidth: 2,
                    borderColor: colors.white,
                  }}
                >
                  <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: 9, color: colors.white }}>
                    {activeFilterCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery("")}
            onFilter={showFilters}
            placeholder="Concert, expo, soirée..."
          />
        </LinearGradient>

        <FlatList
          horizontal
          data={QUICK_FILTERS}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, marginBottom: 4 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
          renderItem={({ item }) => {
            const active = quickFilter === item.id;
            return (
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => setQuickFilter(item.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: radius.full,
                  backgroundColor: active ? colors.text.primary : colors.white,
                  borderWidth: 1,
                  borderColor: active ? colors.text.primary : colors.border.light,
                  ...shadows.sm,
                }}
              >
                <Ionicons name={item.icon} size={15} color={active ? colors.white : colors.text.secondary} />
                <Text
                  style={{
                    fontFamily: typography.fontFamily.semiBold,
                    fontSize: typography.fontSize.sm,
                    color: active ? colors.white : colors.text.primary,
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <FlatList
          horizontal
          data={[{ id: "all", name: "Tous", icon: "grid-outline" as const, color: colors.primary.DEFAULT }, ...categories.slice(0, 10)]}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
          renderItem={({ item }) => (
            <CategoryChip
              name={item.name}
              icon={item.icon as keyof typeof Ionicons.glyphMap}
              color={item.color}
              variant="visual"
              selected={item.id === "all" ? !selectedCategory : selectedCategory === item.id}
              onPress={() =>
                setSelectedCategory(
                  item.id === "all" ? undefined : selectedCategory === item.id ? undefined : item.id
                )
              }
            />
          )}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xl, color: colors.text.primary }}>
              {selectedCategoryName || "Tous les événements"}
            </Text>
            <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: 3 }}>
              {filteredEvents.length} expérience{filteredEvents.length > 1 ? "s" : ""}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.white,
              borderRadius: radius.full,
              padding: 4,
              borderWidth: 1,
              borderColor: colors.border.light,
              ...shadows.sm,
            }}
          >
            <TouchableOpacity
              onPress={() => setViewMode("immersive")}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: viewMode === "immersive" ? colors.text.primary : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="albums-outline" size={17} color={viewMode === "immersive" ? colors.white : colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode("grid")}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: viewMode === "grid" ? colors.text.primary : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="grid-outline" size={17} color={viewMode === "grid" ? colors.white : colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [
      activeFilterCount,
      filteredEvents.length,
      quickFilter,
      searchQuery,
      selectedCategory,
      selectedCategoryName,
      showFilters,
      viewMode,
    ]
  );

  if (filteredEvents.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
        {ListHeader}
        <EmptyState variant="search" actionLabel="Réinitialiser" onAction={resetFilters} />
        <FilterBottomSheet visible={isVisible} onClose={hideFilters} onApply={handleApplyFilters} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <FlatList
        key={viewMode}
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        numColumns={viewMode === "grid" ? 2 : 1}
        columnWrapperStyle={viewMode === "grid" ? { gap: 10, paddingHorizontal: 20 } : undefined}
        renderItem={({ item, index }: { item: Event; index: number }) =>
          viewMode === "grid" ? (
            <View style={{ flex: 1 }}>
              <EventCardSmall event={item} index={index} variant="grid" />
            </View>
          ) : (
            <View style={{ paddingHorizontal: 20 }}>
              <EventCardSmall event={item} index={index} variant="immersive" />
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      <FilterBottomSheet visible={isVisible} onClose={hideFilters} onApply={handleApplyFilters} />
    </View>
  );
}
