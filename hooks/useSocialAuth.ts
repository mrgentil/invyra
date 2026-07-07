import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { isSupabaseConfigured } from "@/lib/supabase";
import { signInWithApple, signInWithGoogle, getOAuthRedirectUri, getOAuthSetupHint } from "@/services/supabase/oauth";
import { useAuthStore } from "@/store/useAuthStore";
import { formatAuthError, isAuthCancellation } from "@/utils/authErrors";

type SocialProvider = "google" | "apple";

export function useSocialAuth() {
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const applySession = useAuthStore((state) => state.applySession);

  const clearError = useCallback(() => setError(null), []);

  const completeSocialSignIn = useCallback(
    async (provider: SocialProvider) => {
      if (!isSupabaseConfigured()) {
        const message = "Supabase non configuré. Vérifiez le fichier .env puis relancez Metro.";
        setError(message);
        Alert.alert("Supabase requis", message);
        return;
      }

      setError(null);
      setLoadingProvider(provider);
      try {
        const session = provider === "google" ? await signInWithGoogle() : await signInWithApple();
        await applySession(session);
        router.replace("/(tabs)/profile");
      } catch (err) {
        if (isAuthCancellation(err)) {
          setError("Connexion annulée.");
          return;
        }

        const message = formatAuthError(err);
        const redirectUri = getOAuthRedirectUri();
        const needsRedirectHelp =
          message.toLowerCase().includes("localhost") ||
          message.toLowerCase().includes("page") ||
          message.toLowerCase().includes("redirect") ||
          message.toLowerCase().includes("url");

        const fullMessage = needsRedirectHelp
          ? `${message}\n\n${getOAuthSetupHint(redirectUri)}`
          : message;

        setError(fullMessage);
        Alert.alert("Connexion impossible", fullMessage);
      } finally {
        setLoadingProvider(null);
      }
    },
    [applySession]
  );

  const signInGoogle = useCallback(() => completeSocialSignIn("google"), [completeSocialSignIn]);
  const signInApple = useCallback(() => completeSocialSignIn("apple"), [completeSocialSignIn]);

  return {
    signInGoogle,
    signInApple,
    loadingProvider,
    isGoogleLoading: loadingProvider === "google",
    isAppleLoading: loadingProvider === "apple",
    error,
    clearError,
  };
}
