import { useEffect, useRef } from "react";
import { View, Animated, Text } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export default function SplashScreen() {
  const scale = useRef(new Animated.Value(0.88)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const hydrate = useOnboardingStore((s) => s.hydrate);
  const hydrated = useOnboardingStore((s) => s.hydrated);
  const completed = useOnboardingStore((s) => s.completed);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 12,
        stiffness: 90,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 900,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const timer = setTimeout(() => {
      router.replace(completed ? "/(tabs)/home" : "/onboarding");
    }, 2200);

    return () => clearTimeout(timer);
  }, [hydrated, completed]);

  return (
    <LinearGradient
      colors={["#0F172A", "#1E3A8A", "#101012"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: 140,
          backgroundColor: "rgba(59,130,246,0.12)",
          top: "28%",
        }}
      />
      <Animated.View style={{ transform: [{ scale }], opacity, alignItems: "center" }}>
        <Image
          source={require("../assets/icon.png")}
          style={{ width: 120, height: 120, borderRadius: 28 }}
          contentFit="contain"
        />
        <Animated.Text
          style={{
            opacity: textOpacity,
            fontFamily: typography.fontFamily.bold,
            fontSize: typography.fontSize.huge,
            color: colors.white,
            marginTop: 20,
            letterSpacing: 0.5,
          }}
        >
          Invyra
        </Animated.Text>
        <Animated.Text
          style={{
            opacity: textOpacity,
            fontFamily: typography.fontFamily.regular,
            fontSize: typography.fontSize.sm,
            color: "rgba(255,255,255,0.62)",
            marginTop: 8,
          }}
        >
          Vos événements, partout en RDC
        </Animated.Text>
      </Animated.View>
    </LinearGradient>
  );
}
