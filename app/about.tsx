import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";
import { SubScreenHeader } from "@/components/ui/SubScreenHeader";

const items = [
  { label: "Version", value: "1.0.0" },
  { label: "Produit", value: "Invyra Mobile" },
  { label: "Support", value: "support@invyra.com" },
];

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader title="À propos" subtitle="Informations sur l'application" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}>
        <LinearGradient
          colors={[colors.primary[900], colors.primary.DEFAULT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[{ borderRadius: 32, padding: 24, alignItems: "center", overflow: "hidden", marginBottom: 24 }, shadows.lg]}
        >
          <View style={{ width: 74, height: 74, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="sparkles-outline" size={34} color={colors.white} />
          </View>
          <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.huge, color: colors.white, marginTop: 16 }}>
            Invyra
          </Text>
          <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: "rgba(255,255,255,0.76)", textAlign: "center", marginTop: 8, lineHeight: 20 }}>
            Découvrez, réservez et gérez vos événements depuis une seule application.
          </Text>
        </LinearGradient>

        <View style={[{ backgroundColor: colors.white, borderRadius: 28, padding: 8, borderWidth: 1, borderColor: colors.border.light }, shadows.sm]}>
          {items.map((item, index) => (
            <View
              key={item.label}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 14,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: colors.border.light,
              }}
            >
              <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.md, color: colors.text.secondary }}>
                {item.label}
              </Text>
              <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.md, color: colors.text.primary }}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
