import { ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";

interface SubScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}

export function SubScreenHeader({ title, subtitle, onBack, right }: SubScreenHeaderProps) {
  return (
    <LinearGradient colors={["#EAF2FF", "#F2F4F8"]} style={{ paddingTop: 56, paddingHorizontal: 20, paddingBottom: 18 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14, flex: 1 }}>
          <TouchableOpacity
            onPress={onBack ?? (() => router.back())}
            activeOpacity={0.82}
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              backgroundColor: colors.white,
              alignItems: "center",
              justifyContent: "center",
              ...shadows.sm,
            }}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xxxl, color: colors.text.primary }}>
              {title}
            </Text>
            {subtitle && (
              <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: 4 }}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {right}
      </View>
    </LinearGradient>
  );
}
