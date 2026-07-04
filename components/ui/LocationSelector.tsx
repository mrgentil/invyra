import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { getRdcLocationLabel } from "@/constants/rdcLocations";
import { useLocationStore } from "@/store";

interface LocationSelectorProps {
  variant?: "compact" | "header";
  showChevron?: boolean;
}

export function LocationSelector({ variant = "compact", showChevron = true }: LocationSelectorProps) {
  const openPicker = useLocationStore((state) => state.openPicker);
  const selectedId = useLocationStore((state) => state.selectedId);
  const label = getRdcLocationLabel(selectedId);

  if (variant === "header") {
    return (
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={openPicker}
        style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8, alignSelf: "flex-start" }}
      >
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: colors.primary.DEFAULT,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="location" size={14} color={colors.white} />
        </View>
        <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.md, color: colors.text.primary }}>
          {label}
        </Text>
        {showChevron && <Ionicons name="chevron-down" size={16} color={colors.text.secondary} />}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={openPicker}
      style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6, alignSelf: "flex-start" }}
    >
      <Ionicons name="location" size={14} color={colors.primary.DEFAULT} />
      <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.sm, color: colors.primary.DEFAULT }}>
        {label}
      </Text>
      {showChevron && <Ionicons name="chevron-down" size={14} color={colors.primary.DEFAULT} />}
    </TouchableOpacity>
  );
}
