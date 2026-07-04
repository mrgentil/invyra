import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { View, ActivityIndicator } from "react-native";
import { colors } from "@/theme/colors";
import { LocationPickerSheet } from "@/components/modals/LocationPickerSheet";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins: Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background.light }}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, animation: "fade" }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="event/[id]" options={{ headerShown: false, animation: "slide_from_bottom" }} />
          <Stack.Screen name="booking/[id]" options={{ headerShown: false, animation: "slide_from_bottom" }} />
          <Stack.Screen name="payment/[id]" options={{ headerShown: false, animation: "slide_from_bottom" }} />
          <Stack.Screen name="favorites" options={{ headerShown: false, animation: "slide_from_right" }} />
          <Stack.Screen name="notifications" options={{ headerShown: false, animation: "slide_from_right" }} />
          <Stack.Screen name="payment-methods" options={{ headerShown: false, animation: "slide_from_right" }} />
          <Stack.Screen name="settings" options={{ headerShown: false, animation: "slide_from_right" }} />
          <Stack.Screen name="help" options={{ headerShown: false, animation: "slide_from_right" }} />
          <Stack.Screen name="about" options={{ headerShown: false, animation: "slide_from_right" }} />
          <Stack.Screen name="edit-profile" options={{ headerShown: false, animation: "slide_from_right" }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false, animation: "fade" }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false, animation: "fade" }} />
        </Stack>
        <LocationPickerSheet />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
