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
import { PaymentCard } from "@/components/cards/PaymentCard";
import { Price } from "@/components/ui/Price";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SubScreenHeader } from "@/components/ui/SubScreenHeader";
import { GradientButton } from "@/components/ui/GradientButton";
import { SuccessModal } from "@/components/modals/SuccessModal";
import { FailedModal } from "@/components/modals/FailedModal";
import { getEventById } from "@/services/mockData";
import { formatPrice } from "@/utils";

export default function PaymentScreen() {
  const { id, amount, qty } = useLocalSearchParams<{ id: string; amount: string; qty: string }>();
  const event = getEventById(id!);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [selectedMobileProvider, setSelectedMobileProvider] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    { type: "paypal" as const },
    { type: "apple-pay" as const },
    { type: "google-pay" as const },
    { type: "mobile-money" as const },
    { type: "visa" as const },
    { type: "mastercard" as const },
    { type: "card" as const },
  ];

  const mobileMoneyProviders = [
    { id: "orange-money", label: "Orange Money", color: "#FF7900", icon: "radio-outline" as const },
    { id: "wave", label: "Wave", color: "#00AEEF", icon: "water-outline" as const },
    { id: "mpesa", label: "MPESA", color: "#2ECC71", icon: "leaf-outline" as const },
    { id: "airtel-money", label: "Airtel Money", color: "#E40000", icon: "phone-portrait-outline" as const },
  ];

  const requiresMobileProvider = selectedMethod === "mobile-money";
  const canPay = Boolean(selectedMethod) && (!requiresMobileProvider || Boolean(selectedMobileProvider));

  const handlePayment = () => {
    if (!canPay) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const success = Math.random() > 0.3;
      if (success) {
        setShowSuccess(true);
      } else {
        setShowFailed(true);
      }
    }, 2000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader title="Paiement" subtitle="Checkout sécurisé" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      >
        {event && (
          <LinearGradient
            colors={[colors.primary[900], colors.primary.DEFAULT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              {
                borderRadius: 32,
                padding: 18,
                marginBottom: 24,
                overflow: "hidden",
              },
              shadows.lg,
            ]}
          >
            <View
              style={{
                position: "absolute",
                width: 150,
                height: 150,
                borderRadius: 75,
                backgroundColor: "rgba(255,255,255,0.08)",
                right: -38,
                top: -44,
              }}
            />
            <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
              <Image
                source={{ uri: event.images[0] }}
                style={{ width: 82, height: 82, borderRadius: 22 }}
                contentFit="cover"
              />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: "rgba(255,255,255,0.16)",
                    borderRadius: radius.full,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: colors.white }}>
                    Commande sécurisée
                  </Text>
                </View>
                <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.lg, color: colors.white }} numberOfLines={2}>
                  {event.title}
                </Text>
                <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
                  {qty || 1} billet{Number(qty || 1) > 1 ? "s" : ""}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.18)" }}>
              <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.sm, color: "rgba(255,255,255,0.72)" }}>
                Total
              </Text>
              <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.huge, color: colors.white }}>
                {formatPrice(Number(amount) || 0)}
              </Text>
            </View>
          </LinearGradient>
        )}

        <SectionTitle
          title="Moyen de paiement"
          subtitle="Choisissez une méthode pour finaliser votre réservation."
        />
        <View style={{ marginBottom: 24, marginTop: -8 }}>
          <View style={{ gap: 12 }}>
            {paymentMethods.map((method) => (
              <View key={method.type}>
                <PaymentCard
                  type={method.type}
                  selected={selectedMethod === method.type}
                  onPress={() => {
                    setSelectedMethod(method.type);
                    if (method.type !== "mobile-money") {
                      setSelectedMobileProvider("");
                    }
                  }}
                />

                {method.type === "mobile-money" && selectedMethod === "mobile-money" && (
                  <View
                    style={[
                      {
                        backgroundColor: colors.white,
                        borderRadius: 24,
                        padding: 14,
                        marginTop: 10,
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
                        marginBottom: 4,
                      }}
                    >
                      Choisir un opérateur
                    </Text>
                    <Text
                      style={{
                        fontFamily: typography.fontFamily.regular,
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: 12,
                      }}
                    >
                      Sélectionnez le service Mobile Money à utiliser.
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                      {mobileMoneyProviders.map((provider) => {
                        const isSelected = selectedMobileProvider === provider.id;
                        return (
                          <TouchableOpacity
                            key={provider.id}
                            activeOpacity={0.82}
                            onPress={() => setSelectedMobileProvider(provider.id)}
                            style={{
                              width: "48%",
                              borderRadius: 20,
                              padding: 12,
                              backgroundColor: isSelected ? colors.primary[50] : "#F2F4F8",
                              borderWidth: 1.5,
                              borderColor: isSelected ? colors.primary.DEFAULT : colors.border.light,
                            }}
                          >
                            <View
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: provider.color + "18",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 9,
                              }}
                            >
                              <Ionicons name={provider.icon} size={18} color={provider.color} />
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                              <Text
                                style={{
                                  flex: 1,
                                  fontFamily: typography.fontFamily.semiBold,
                                  fontSize: typography.fontSize.sm,
                                  color: colors.text.primary,
                                }}
                                numberOfLines={1}
                              >
                                {provider.label}
                              </Text>
                              {isSelected && (
                                <Ionicons name="checkmark-circle" size={18} color={colors.primary.DEFAULT} />
                              )}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {event && (
          <View style={[{
            backgroundColor: colors.white,
            borderRadius: 28,
            padding: 18,
            borderWidth: 1,
            borderColor: colors.border.light,
          }, shadows.sm]}>
            <SectionTitle title="Détail commande" />
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16, marginBottom: 10 }}>
              <Text style={{ flex: 1, fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.md, color: colors.text.secondary }} numberOfLines={1}>
                {event.title}
              </Text>
              <Price price={event.price} size="small" />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.md, color: colors.text.secondary }}>
                Qté
              </Text>
              <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.md, color: colors.text.primary }}>
                x{qty || 1}
              </Text>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: colors.border.light, paddingTop: 12, marginTop: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xl, color: colors.text.primary }}>
                  Total
                </Text>
                <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xxl, color: colors.primary.DEFAULT }}>
                  {formatPrice(Number(amount) || 0)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[{ paddingHorizontal: 20, paddingBottom: 30, paddingTop: 16, backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28 }, shadows.lg]}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
            <Ionicons name="lock-closed-outline" size={17} color={colors.success.DEFAULT} />
            <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
              Paiement protégé
            </Text>
          </View>
          <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xl, color: colors.text.primary }}>
            {formatPrice(Number(amount) || 0)}
          </Text>
        </View>
        <GradientButton
          title={
            processing
              ? "..."
              : requiresMobileProvider && selectedMobileProvider
                ? `Payer via ${mobileMoneyProviders.find((provider) => provider.id === selectedMobileProvider)?.label}`
                : `Payer ${formatPrice(Number(amount) || 0)}`
          }
          onPress={handlePayment}
          fullWidth
          size="large"
          disabled={!canPay || processing}
          loading={processing}
        />
      </View>

      <SuccessModal
        visible={showSuccess}
        variant="payment"
        onClose={() => {
          setShowSuccess(false);
          router.replace("/(tabs)/tickets");
        }}
      />
      <FailedModal
        visible={showFailed}
        variant="payment"
        onClose={() => setShowFailed(false)}
        onRetry={() => {
          setShowFailed(false);
          handlePayment();
        }}
      />
    </View>
  );
}
