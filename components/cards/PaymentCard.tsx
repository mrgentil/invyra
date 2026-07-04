import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";

interface PaymentCardProps {
  type: "paypal" | "apple-pay" | "google-pay" | "visa" | "mastercard" | "card" | "mobile-money";
  selected?: boolean;
  onPress: () => void;
}

const paymentConfig = {
  "paypal": { icon: "logo-paypal" as const, label: "PayPal", color: "#003087" },
  "apple-pay": { icon: "logo-apple" as const, label: "Apple Pay", color: "#000000" },
  "google-pay": { icon: "logo-google" as const, label: "Google Pay", color: "#4285F4" },
  "visa": { icon: "card-outline" as const, label: "Visa", color: "#1A1F71" },
  "mastercard": { icon: "card-outline" as const, label: "Mastercard", color: "#EB001B" },
  "mobile-money": { icon: "phone-portrait-outline" as const, label: "Mobile Money", color: "#F59E0B" },
  "card": { icon: "card-outline" as const, label: "+ Carte", color: colors.primary.DEFAULT },
};

export function PaymentCard({ type, selected = false, onPress }: PaymentCardProps) {
  const config = paymentConfig[type];

  return (
    <View
      style={[
        {
          borderRadius: 24,
          borderWidth: 1.5,
          overflow: "hidden",
          borderColor: selected ? colors.primary.DEFAULT : colors.border.light,
          backgroundColor: selected ? colors.primary[50] : colors.card.light,
        },
        selected ? shadows.md : shadows.sm,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 15,
          gap: 12,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 17,
            backgroundColor: selected ? colors.primary.DEFAULT : config.color + "15",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={config.icon} size={22} color={selected ? colors.white : config.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.semiBold,
              fontSize: typography.fontSize.md,
              color: colors.text.primary,
            }}
          >
            {config.label}
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: typography.fontSize.xs,
              color: colors.text.secondary,
              marginTop: 2,
            }}
          >
            {type === "card"
              ? "Ajouter une nouvelle carte"
              : type === "mobile-money"
                ? "Orange Money, Wave, MPESA, Airtel Money"
                : "Paiement rapide et sécurisé"}
          </Text>
        </View>
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: selected ? colors.primary.DEFAULT : colors.border.light,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: selected ? colors.primary.DEFAULT : colors.transparent,
          }}
        >
          {selected && <Ionicons name="checkmark" size={15} color={colors.white} />}
        </View>
      </TouchableOpacity>
    </View>
  );
}
