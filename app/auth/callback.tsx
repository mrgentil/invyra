import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import { colors } from "@/theme/colors";
import { createSessionFromUrl } from "@/services/supabase/oauth";
import { useAuthStore } from "@/store/useAuthStore";
import { formatAuthError } from "@/utils/authErrors";

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<Record<string, string>>();
  const applySession = useAuthStore((state) => state.applySession);

  useEffect(() => {
    let active = true;

    const finishAuth = async (url: string) => {
      try {
        const session = await createSessionFromUrl(url);
        if (!active) return;
        await applySession(session);
        router.replace("/(tabs)/profile");
      } catch (error) {
        if (!active) return;
        router.replace({
          pathname: "/auth/login",
          params: { error: formatAuthError(error) },
        });
      }
    };

    const run = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl?.includes("auth/callback")) {
        await finishAuth(initialUrl);
        return;
      }

      const query = new URLSearchParams(params as Record<string, string>).toString();
      if (query) {
        await finishAuth(`invyra://auth/callback?${query}`);
        return;
      }

      router.replace({
        pathname: "/auth/login",
        params: { error: "Retour OAuth incomplet. Réessayez la connexion Google ou Apple." },
      });
    };

    run();

    return () => {
      active = false;
    };
  }, [applySession, params]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#101012" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
    </View>
  );
}
