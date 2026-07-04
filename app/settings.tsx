import { useState } from "react";
import { View, Text, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";
import { SubScreenHeader } from "@/components/ui/SubScreenHeader";
import { useThemeStore } from "@/store";

const options = [
  { icon: "mail-outline" as const, title: "Emails promotionnels", subtitle: "Recevoir les nouveautés Invyra" },
  { icon: "location-outline" as const, title: "Localisation", subtitle: "Améliorer les recommandations" },
  { icon: "calendar-outline" as const, title: "Rappels événement", subtitle: "Notifications avant vos sorties" },
];

export default function SettingsScreen() {
  const { isDark, toggleTheme } = useThemeStore();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    "Emails promotionnels": true,
    Localisation: true,
    "Rappels événement": true,
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader title="Réglages" subtitle="Préférences du compte" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}>
        <View style={[{ backgroundColor: colors.white, borderRadius: 28, padding: 8, borderWidth: 1, borderColor: colors.border.light }, shadows.sm]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
              <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: colors.primary[50], alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={isDark ? "moon-outline" : "sunny-outline"} size={20} color={colors.primary.DEFAULT} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.md, color: colors.text.primary }}>
                  Mode sombre
                </Text>
                <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  {isDark ? "Activé" : "Désactivé"}
                </Text>
              </View>
            </View>
            <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: colors.border.light, true: colors.primary[200] }} thumbColor={isDark ? colors.primary.DEFAULT : "#f4f3f4"} />
          </View>

          {options.map((option) => (
            <View key={option.title} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, borderTopWidth: 1, borderTopColor: colors.border.light }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: colors.primary[50], alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name={option.icon} size={20} color={colors.primary.DEFAULT} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.md, color: colors.text.primary }}>
                    {option.title}
                  </Text>
                  <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    {option.subtitle}
                  </Text>
                </View>
              </View>
              <Switch
                value={enabled[option.title]}
                onValueChange={(value) => setEnabled((current) => ({ ...current, [option.title]: value }))}
                trackColor={{ false: colors.border.light, true: colors.primary[200] }}
                thumbColor={enabled[option.title] ? colors.primary.DEFAULT : "#f4f3f4"}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
