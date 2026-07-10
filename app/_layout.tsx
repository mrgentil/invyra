import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { View, ActivityIndicator } from "react-native";
import { colors } from "@/theme/colors";
import { LocationPickerSheet } from "@/components/modals/LocationPickerSheet";
import { isSupabaseConfigured } from "@/lib/supabase";
import { onAuthStateChange } from "@/services/supabase/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { QUERY_KEYS } from "@/constants";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function PushNotificationsSync() {
  const userId = useAuthStore((state) => state.user?.id);
  usePushNotifications(userId);
  return null;
}

function AuthSessionSync() {
  const queryClient = useQueryClient();
  const hydrateAuth = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const { data } = onAuthStateChange(async (event, session) => {
      // Ne pas appeler applySession ici : deadlock avec signInWithPassword (loading infini).
      if (event === "TOKEN_REFRESHED" && session) {
        useAuthStore.setState({ token: session.access_token });
        return;
      }

      if (event === "SIGNED_OUT") {
        useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.events] });
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.categories] });
      }
    });

    return () => data.subscription.unsubscribe();
  }, [queryClient]);

  return null;
}

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
        <AuthSessionSync />
        <PushNotificationsSync />
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
          <Stack.Screen name="become-organizer" options={{ headerShown: false, animation: "slide_from_right" }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false, animation: "fade" }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false, animation: "fade" }} />
          <Stack.Screen name="auth/callback" options={{ headerShown: false, animation: "fade" }} />
        </Stack>
        <LocationPickerSheet />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
