import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";
import { SubScreenHeader } from "@/components/ui/SubScreenHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";

const faqs = [
  { question: "Comment retrouver mon billet ?", answer: "Allez dans l'onglet Billets puis ouvrez le pass digital." },
  { question: "Puis-je annuler une réservation ?", answer: "Les conditions dépendent de l'organisateur de l'événement." },
  { question: "Le paiement est-il sécurisé ?", answer: "Oui, le checkout est protégé et les billets sont générés après validation." },
  { question: "Quels paiements sont acceptés ?", answer: "Carte bancaire, PayPal et Mobile Money selon disponibilité." },
];

export default function HelpScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader title="Aide" subtitle="Support et questions fréquentes" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}>
        <TouchableOpacity
          activeOpacity={0.82}
          style={[{ backgroundColor: colors.primary.DEFAULT, borderRadius: 28, padding: 18, flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 24 }, shadows.md]}
        >
          <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.lg, color: colors.white }}>
              Contacter le support
            </Text>
            <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>
              Réponse rapide par l'équipe Invyra
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.white} />
        </TouchableOpacity>

        <SectionTitle title="Questions fréquentes" />
        <View style={{ gap: 12, marginTop: -8 }}>
          {faqs.map((item) => (
            <View
              key={item.question}
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
              <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.md, color: colors.text.primary }}>
                {item.question}
              </Text>
              <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: 6, lineHeight: 20 }}>
                {item.answer}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
