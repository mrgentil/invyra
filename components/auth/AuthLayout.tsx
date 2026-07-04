import { ReactNode } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";
import { shadows } from "@/theme/shadows";

const DARK = "#101012";
const MUTED = "rgba(255,255,255,0.64)";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  scrollable?: boolean;
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  scrollable = false,
}: AuthLayoutProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <>
      <View style={{ paddingHorizontal: 24, paddingTop: insets.top + 12 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.75}
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: "rgba(255,255,255,0.08)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.white} />
        </TouchableOpacity>

        <View style={{ marginTop: 28 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.semiBold,
              fontSize: typography.fontSize.sm,
              color: colors.primary[400],
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            Invyra
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.bold,
              fontSize: typography.fontSize.xxxl,
              lineHeight: typography.lineHeight.xxxl,
              color: colors.white,
              marginTop: 10,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: typography.fontSize.sm,
              lineHeight: typography.lineHeight.sm + 4,
              color: MUTED,
              marginTop: 8,
              maxWidth: 300,
            }}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginTop: 28,
          marginHorizontal: 20,
          backgroundColor: colors.white,
          borderRadius: radius.card,
          padding: 22,
          ...shadows.lg,
        }}
      >
        {children}
      </View>

      {footer && (
        <View style={{ paddingHorizontal: 24, marginTop: 24, marginBottom: insets.bottom + 16 }}>
          {footer}
        </View>
      )}
    </>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: DARK }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />

      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 320,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={["rgba(59,130,246,0.22)", "rgba(59,130,246,0.06)", "transparent"]}
          style={{ flex: 1 }}
        />
        <View
          style={{
            position: "absolute",
            top: 60,
            right: -40,
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: "rgba(59,130,246,0.1)",
          }}
        />
      </View>

      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24, flexGrow: 1 }}
        >
          {content}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, justifyContent: "center", paddingBottom: insets.bottom }}>
          {content}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
