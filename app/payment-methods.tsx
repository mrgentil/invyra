import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";
import { PaymentCard } from "@/components/cards/PaymentCard";
import { SubScreenHeader } from "@/components/ui/SubScreenHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";

const methods = [
  { type: "mobile-money" as const },
  { type: "visa" as const },
  { type: "mastercard" as const },
  { type: "paypal" as const },
  { type: "card" as const },
];

export default function PaymentMethodsScreen() {
  const [selectedMethod, setSelectedMethod] = useState("mobile-money");

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader title="Paiement" subtitle="Cartes, mobile money et reçus" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}>
        <LinearGradient
          colors={[colors.primary[900], colors.primary.DEFAULT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[{ borderRadius: 30, padding: 20, overflow: "hidden", marginBottom: 24 }, shadows.lg]}
        >
          <View
            style={{
              position: "absolute",
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "rgba(255,255,255,0.09)",
              right: -28,
              top: -30,
            }}
          />
          <Ionicons name="phone-portrait-outline" size={30} color={colors.white} />
          <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xxl, color: colors.white, marginTop: 14 }}>
            Mobile Money disponible
          </Text>
          <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: "rgba(255,255,255,0.75)", marginTop: 6, lineHeight: 20 }}>
            Orange Money, Wave, MPESA et Airtel Money sont pris en charge.
          </Text>
        </LinearGradient>

        <SectionTitle title="Méthodes enregistrées" />
        <View style={{ gap: 12, marginTop: -8 }}>
          {methods.map((method) => (
            <PaymentCard
              key={method.type}
              type={method.type}
              selected={selectedMethod === method.type}
              onPress={() => setSelectedMethod(method.type)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
