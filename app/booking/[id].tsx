import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";
import { shadows } from "@/theme/shadows";
import { Input } from "@/components/ui/Input";
import { GradientButton } from "@/components/ui/GradientButton";
import { Price } from "@/components/ui/Price";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SubScreenHeader } from "@/components/ui/SubScreenHeader";
import { FailedModal } from "@/components/modals/FailedModal";
import { getEventById } from "@/services/mockData";
import { formatDate, formatPrice } from "@/utils";

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = getEventById(id!);
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showFailed, setShowFailed] = useState(false);

  if (!event) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F2F4F8" }}>
        <Text style={{ fontFamily: typography.fontFamily.medium, color: colors.text.secondary }}>Événement introuvable</Text>
      </View>
    );
  }

  const totalAmount = event.price * quantity;
  const serviceFee = totalAmount > 0 ? 4 : 0;
  const finalAmount = totalAmount + serviceFee;

  const handleProceed = () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setShowFailed(true);
      return;
    }

    router.push(`/payment/${event.id}?amount=${finalAmount}&qty=${quantity}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader title="Réserver" subtitle="Confirmation instantanée" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      >
        <View style={[{ borderRadius: 32, overflow: "hidden", marginBottom: 24 }, shadows.lg]}>
          <Image source={{ uri: event.images[0] }} style={{ width: "100%", height: 210 }} contentFit="cover" />
          <LinearGradient
            colors={["transparent", "rgba(15,23,42,0.9)"]}
            style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
          />
          <View style={{ position: "absolute", left: 18, right: 18, bottom: 18 }}>
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: colors.primary.DEFAULT,
                borderRadius: radius.full,
                paddingHorizontal: 12,
                paddingVertical: 7,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: colors.white }}>
                {event.category.name}
              </Text>
            </View>
            <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xxxl, color: colors.white }} numberOfLines={2}>
              {event.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Ionicons name="calendar-outline" size={15} color="rgba(255,255,255,0.82)" />
                <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.sm, color: "rgba(255,255,255,0.82)" }}>
                  {formatDate(event.date)}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, flex: 1 }}>
                <Ionicons name="location-outline" size={15} color="rgba(255,255,255,0.82)" />
                <Text style={{ flex: 1, fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.sm, color: "rgba(255,255,255,0.82)" }} numberOfLines={1}>
                  {event.location.name}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <SectionTitle title="Vos billets" />
        <View style={[{
          backgroundColor: colors.white,
          borderRadius: 28,
          padding: 18,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: colors.border.light,
        }, shadows.sm]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <View>
              <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.lg, color: colors.text.primary }}>
                Entrée standard
              </Text>
              <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: 3 }}>
                Billet digital avec QR code
              </Text>
            </View>
            <Price price={event.price} size="small" />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                backgroundColor: colors.primary[50],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="remove" size={24} color={colors.primary.DEFAULT} />
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.hero, color: colors.text.primary, minWidth: 76, textAlign: "center" }}>
                {quantity}
              </Text>
              <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
                billet{quantity > 1 ? "s" : ""}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setQuantity(Math.min(10, quantity + 1))}
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                backgroundColor: colors.primary.DEFAULT,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="add" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
          {[
            { icon: "shield-checkmark-outline" as const, label: "Paiement sécurisé" },
            { icon: "flash-outline" as const, label: "QR instantané" },
          ].map((item) => (
            <View
              key={item.label}
              style={[
                {
                  flex: 1,
                  backgroundColor: colors.white,
                  borderRadius: 22,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: colors.border.light,
                },
                shadows.sm,
              ]}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: colors.primary[50],
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Ionicons name={item.icon} size={19} color={colors.primary.DEFAULT} />
              </View>
              <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ marginBottom: 24 }}>
          <SectionTitle title="Vos informations" />
          <Input label="Nom" value={fullName} onChangeText={setFullName} placeholder="Jean Mbuyi" />
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="jean@exemple.com" keyboardType="email-address" />
          <Input label="Tél." value={phone} onChangeText={setPhone} placeholder="+243 81 234 5678" keyboardType="phone-pad" />
        </View>

        <View style={[{
          backgroundColor: colors.white,
          borderRadius: 28,
          padding: 18,
          borderWidth: 1,
          borderColor: colors.border.light,
        }, shadows.sm]}>
          <SectionTitle title="Résumé" />
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.md, color: colors.text.secondary }}>
              Prix
            </Text>
            <Price price={event.price} size="small" />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.md, color: colors.text.secondary }}>
              Qté
            </Text>
            <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.md, color: colors.text.primary }}>
              x{quantity}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.md, color: colors.text.secondary }}>
              Frais
            </Text>
            <Price price={serviceFee} size="small" freeLabel="0 €" />
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: colors.border.light, paddingTop: 12, marginTop: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xl, color: colors.text.primary }}>
                Total
              </Text>
              <Price price={finalAmount} size="medium" />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[{ paddingHorizontal: 20, paddingBottom: 30, paddingTop: 16, backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28 }, shadows.lg]}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
            Total à payer
          </Text>
          <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xxl, color: colors.text.primary }}>
            {formatPrice(finalAmount)}
          </Text>
        </View>
        <GradientButton title="Continuer vers le paiement" onPress={handleProceed} fullWidth size="large" />
      </View>

      <FailedModal
        visible={showFailed}
        variant="booking"
        onClose={() => setShowFailed(false)}
      />
    </View>
  );
}
