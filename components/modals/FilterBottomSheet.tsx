import { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";
import { useFilterStore } from "@/store";
import { BottomSheet } from "@/components/modals/BottomSheet";
import { categories } from "@/services/mockData";
import { formatPrice } from "@/utils";

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
}

function SectionTitle({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.primary[50],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={16} color={colors.primary.DEFAULT} />
      </View>
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: typography.fontSize.lg,
          color: colors.text.primary,
        }}
      >
        {title}
      </Text>
    </View>
  );
}

function countActiveFilters(filters: ReturnType<typeof useFilterStore.getState>["filters"]) {
  let count = 0;
  if (filters.category) count += 1;
  if (filters.priceRange && filters.priceRange[1] < 500) count += 1;
  if (filters.distance != null && filters.distance < 50) count += 1;
  if (filters.rating && filters.rating > 0) count += 1;
  if (filters.sortBy && filters.sortBy !== "popularity") count += 1;
  return count;
}

export function FilterBottomSheet({ visible, onClose, onApply }: FilterBottomSheetProps) {
  const { filters, setFilters, resetFilters } = useFilterStore();
  const [priceValue, setPriceValue] = useState(filters.priceRange?.[1] ?? 500);
  const [distanceValue, setDistanceValue] = useState(filters.distance ?? 50);

  useEffect(() => {
    if (visible) {
      setPriceValue(filters.priceRange?.[1] ?? 500);
      setDistanceValue(filters.distance ?? 50);
    }
  }, [filters.distance, filters.priceRange, visible]);

  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);

  const handleReset = () => {
    resetFilters();
    setPriceValue(500);
    setDistanceValue(50);
  };

  const sortOptions = [
    { key: "popularity" as const, label: "Populaires", description: "Les plus demandés", icon: "flame-outline" as const },
    { key: "date" as const, label: "Date", description: "Les plus proches", icon: "calendar-outline" as const },
    { key: "price" as const, label: "Prix", description: "Du moins cher", icon: "pricetag-outline" as const },
    { key: "rating" as const, label: "Note", description: "Mieux notés", icon: "star-outline" as const },
  ];

  const ratingOptions = [
    { value: 0, label: "Toutes" },
    { value: 3, label: "3+" },
    { value: 4, label: "4+" },
    { value: 4.5, label: "4.5+" },
  ];

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Affiner la recherche"
      subtitle="Trouvez l'événement qui correspond à vos critères."
      badge={activeCount}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {activeCount > 0 && (
          <View
            style={[
              {
                backgroundColor: colors.white,
                borderRadius: 22,
                padding: 14,
                marginBottom: 18,
                borderWidth: 1,
                borderColor: colors.primary[100],
              },
              shadows.sm,
            ]}
          >
            <Text
              style={{
                fontFamily: typography.fontFamily.semiBold,
                fontSize: typography.fontSize.sm,
                color: colors.primary.DEFAULT,
                marginBottom: 4,
              }}
            >
              {activeCount} filtre{activeCount > 1 ? "s" : ""} actif{activeCount > 1 ? "s" : ""}
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: typography.fontSize.xs,
                color: colors.text.secondary,
              }}
            >
              Ajustez ou réinitialisez pour élargir les résultats.
            </Text>
          </View>
        )}

        <View style={{ marginBottom: 24 }}>
          <SectionTitle icon="grid-outline" title="Catégorie" />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {categories.slice(0, 8).map((cat) => {
              const selected = filters.category === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.82}
                  onPress={() =>
                    setFilters({
                      category: filters.category === cat.id ? undefined : cat.id,
                    })
                  }
                  style={{
                    width: "48%",
                    borderRadius: 20,
                    padding: 12,
                    backgroundColor: selected ? colors.primary[50] : colors.white,
                    borderWidth: 1.5,
                    borderColor: selected ? colors.primary.DEFAULT : colors.border.light,
                  }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor: selected ? colors.primary.DEFAULT : cat.color + "18",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name={cat.icon as keyof typeof Ionicons.glyphMap}
                      size={16}
                      color={selected ? colors.white : cat.color}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.semiBold,
                      fontSize: typography.fontSize.sm,
                      color: colors.text.primary,
                    }}
                    numberOfLines={1}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <SectionTitle icon="wallet-outline" title="Budget max." />
          <LinearGradient
            colors={[colors.primary[50], colors.white]}
            style={[
              {
                borderRadius: 24,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.primary[100],
              },
              shadows.sm,
            ]}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                }}
              >
                0 €
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.bold,
                  fontSize: typography.fontSize.lg,
                  color: colors.primary.DEFAULT,
                }}
              >
                {formatPrice(priceValue)}
              </Text>
            </View>
            <Slider
              minimumValue={0}
              maximumValue={500}
              step={10}
              value={priceValue}
              onValueChange={(val: number) => {
                setPriceValue(val);
                setFilters({ priceRange: [0, val] });
              }}
              minimumTrackTintColor={colors.primary.DEFAULT}
              maximumTrackTintColor={colors.border.light}
              thumbTintColor={colors.primary.DEFAULT}
            />
          </LinearGradient>
        </View>

        <View style={{ marginBottom: 24 }}>
          <SectionTitle icon="location-outline" title="Distance" />
          <View
            style={[
              {
                backgroundColor: colors.white,
                borderRadius: 24,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border.light,
              },
              shadows.sm,
            ]}
          >
            <Text
              style={{
                fontFamily: typography.fontFamily.semiBold,
                fontSize: typography.fontSize.md,
                color: colors.text.primary,
                marginBottom: 10,
              }}
            >
              Jusqu'à {distanceValue} km
            </Text>
            <Slider
              minimumValue={5}
              maximumValue={50}
              step={5}
              value={distanceValue}
              onValueChange={(val: number) => {
                setDistanceValue(val);
                setFilters({ distance: val });
              }}
              minimumTrackTintColor={colors.secondary.DEFAULT}
              maximumTrackTintColor={colors.border.light}
              thumbTintColor={colors.secondary.DEFAULT}
            />
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <SectionTitle icon="star-outline" title="Note minimum" />
          <View style={{ flexDirection: "row", gap: 8 }}>
            {ratingOptions.map((option) => {
              const selected = (filters.rating ?? 0) === option.value;
              return (
                <TouchableOpacity
                  key={option.label}
                  activeOpacity={0.82}
                  onPress={() => setFilters({ rating: option.value })}
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: radius.full,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: selected ? colors.primary.DEFAULT : colors.white,
                    borderWidth: 1,
                    borderColor: selected ? colors.primary.DEFAULT : colors.border.light,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.semiBold,
                      fontSize: typography.fontSize.sm,
                      color: selected ? colors.white : colors.text.primary,
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ marginBottom: 8 }}>
          <SectionTitle icon="swap-vertical-outline" title="Trier par" />
          <View style={{ gap: 10 }}>
            {sortOptions.map((option) => {
              const selected = (filters.sortBy ?? "popularity") === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  activeOpacity={0.82}
                  onPress={() => setFilters({ sortBy: option.key })}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    borderRadius: 22,
                    padding: 14,
                    backgroundColor: selected ? colors.primary[50] : colors.white,
                    borderWidth: 1.5,
                    borderColor: selected ? colors.primary.DEFAULT : colors.border.light,
                  }}
                >
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 21,
                      backgroundColor: selected ? colors.primary.DEFAULT : colors.background.light,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={option.icon}
                      size={18}
                      color={selected ? colors.white : colors.primary.DEFAULT}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: typography.fontFamily.semiBold,
                        fontSize: typography.fontSize.md,
                        color: colors.text.primary,
                      }}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={{
                        fontFamily: typography.fontFamily.regular,
                        fontSize: typography.fontSize.xs,
                        color: colors.text.secondary,
                        marginTop: 2,
                      }}
                    >
                      {option.description}
                    </Text>
                  </View>
                  {selected && <Ionicons name="checkmark-circle" size={20} color={colors.primary.DEFAULT} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 28,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border.light,
          flexDirection: "row",
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={handleReset}
          activeOpacity={0.82}
          style={{
            flex: 1,
            height: 52,
            borderRadius: radius.full,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.background.light,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <Text
            style={{
              fontFamily: typography.fontFamily.semiBold,
              fontSize: typography.fontSize.md,
              color: colors.text.primary,
            }}
          >
            Réinitialiser
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onApply}
          activeOpacity={0.86}
          style={{
            flex: 1.4,
            height: 52,
            borderRadius: radius.full,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary.DEFAULT,
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Text
            style={{
              fontFamily: typography.fontFamily.semiBold,
              fontSize: typography.fontSize.md,
              color: colors.white,
            }}
          >
            Appliquer
          </Text>
          <Ionicons name="checkmark" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
