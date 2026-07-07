import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { AuthLayout, AuthDivider, SocialAuthButtons, AuthSubmitButton, AuthErrorBanner } from "@/components/auth";
import { useSocialAuth } from "@/hooks/useSocialAuth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { signInWithEmail } from "@/services/supabase/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { formatAuthError } from "@/utils/authErrors";
import { withTimeout } from "@/utils/authSession";

export default function LoginScreen() {
  const params = useLocalSearchParams<{ error?: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const applySession = useAuthStore((state) => state.applySession);
  const { signInGoogle, signInApple, isGoogleLoading, isAppleLoading, error: socialError, clearError } =
    useSocialAuth();

  const displayError = formError ?? socialError ?? (typeof params.error === "string" ? params.error : null);

  useEffect(() => {
    if (typeof params.error === "string" && params.error) {
      setFormError(params.error);
    }
  }, [params.error]);

  const clearErrors = () => {
    setFormError(null);
    clearError();
  };

  const handleLogin = async () => {
    clearErrors();

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password;

    if (!trimmedEmail || !trimmedPassword) {
      setFormError("Veuillez renseigner votre e-mail et mot de passe.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setFormError("Supabase non configuré. Vérifiez .env puis relancez avec `npx expo start -c`.");
      return;
    }

    setLoading(true);
    try {
      const session = await withTimeout(
        signInWithEmail(trimmedEmail, trimmedPassword),
        20000,
        "Connexion trop longue. Vérifiez votre réseau puis réessayez."
      );
      await applySession(session);
      router.replace("/(tabs)/profile");
    } catch (error) {
      const message = formatAuthError(error);
      setFormError(message);
      Alert.alert("Connexion impossible", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AuthLayout
        title="Bon retour"
        subtitle="Connectez-vous pour retrouver vos billets et réservations."
        footer={
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: typography.fontSize.sm,
                color: "rgba(255,255,255,0.56)",
              }}
            >
              Pas de compte ?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")} activeOpacity={0.75}>
              <Text
                style={{
                  fontFamily: typography.fontFamily.semiBold,
                  fontSize: typography.fontSize.sm,
                  color: colors.white,
                }}
              >
                S'inscrire
              </Text>
            </TouchableOpacity>
          </View>
        }
      >
        {displayError ? <AuthErrorBanner message={displayError} onDismiss={clearErrors} /> : null}

        <SocialAuthButtons
          onGoogle={signInGoogle}
          onApple={signInApple}
          loadingGoogle={isGoogleLoading}
          loadingApple={isAppleLoading}
          disabled={loading}
        />

        <AuthDivider />

        <Input
          label="E-mail"
          value={email}
          onChangeText={(value) => {
            if (formError) setFormError(null);
            setEmail(value);
          }}
          placeholder="votre@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <PasswordInput
          label="Mot de passe"
          value={password}
          onChangeText={(value) => {
            if (formError) setFormError(null);
            setPassword(value);
          }}
        />

        <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: -4, marginBottom: 4 }} activeOpacity={0.75}>
          <Text
            style={{
              fontFamily: typography.fontFamily.medium,
              fontSize: typography.fontSize.xs,
              color: colors.primary.DEFAULT,
            }}
          >
            Mot de passe oublié ?
          </Text>
        </TouchableOpacity>

        <AuthSubmitButton title="Se connecter" onPress={handleLogin} loading={loading} />
      </AuthLayout>
    </>
  );
}
