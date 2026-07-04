import { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RDC_LOCATIONS, RdcLocation } from "@/constants/rdcLocations";
import { useLocationStore } from "@/store";
import { BottomSheet } from "@/components/modals/BottomSheet";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";

export function LocationPickerSheet() {
  const visible = useLocationStore((state) => state.pickerVisible);
  const selectedId = useLocationStore((state) => state.selectedId);
  const closePicker = useLocationStore((state) => state.closePicker);
  const setLocation = useLocationStore((state) => state.setLocation);
  const [query, setQuery] = useState("");

  const filteredLocations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return RDC_LOCATIONS;
    return RDC_LOCATIONS.filter(
      (location) =>
        location.city.toLowerCase().includes(normalized) ||
        location.province.toLowerCase().includes(normalized) ||
        location.label.toLowerCase().includes(normalized)
    );
  }, [query]);

  const handleClose = () => {
    setQuery("");
    closePicker();
  };

  const handleSelect = async (location: RdcLocation) => {
    await setLocation(location.id);
    setQuery("");
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title="Choisir une ville"
      subtitle="Provinces et villes de la RDC"
      badge={filteredLocations.length}
    >
      <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.white,
            borderRadius: radius.input,
            paddingHorizontal: 14,
            height: 48,
            borderWidth: 1,
            borderColor: colors.border.light,
            marginBottom: 12,
          }}
        >
          <Ionicons name="search-outline" size={18} color={colors.text.secondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher une ville ou province..."
            placeholderTextColor={colors.text.secondary}
            style={{
              flex: 1,
              marginLeft: 10,
              fontFamily: typography.fontFamily.regular,
              fontSize: typography.fontSize.md,
              color: colors.text.primary,
            }}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        renderItem={({ item }) => {
          const selected = item.id === selectedId;
          return (
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => handleSelect(item)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                paddingHorizontal: 14,
                borderRadius: 18,
                marginBottom: 8,
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
                  backgroundColor: selected ? colors.primary.DEFAULT : colors.primary[50],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="location" size={18} color={selected ? colors.white : colors.primary.DEFAULT} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.md, color: colors.text.primary }}>
                  {item.city}
                </Text>
                <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: 2 }}>
                  {item.province}
                </Text>
              </View>
              {selected && <Ionicons name="checkmark-circle" size={22} color={colors.primary.DEFAULT} />}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 32 }}>
            <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
              Aucune ville trouvée
            </Text>
          </View>
        }
      />
    </BottomSheet>
  );
}
