import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router, Stack } from "expo-router";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { AuthLayout, AuthDivider, SocialAuthButtons, AuthSubmitButton, AuthErrorBanner } from "@/components/auth";
import { useSocialAuth } from "@/hooks/useSocialAuth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { signUpWithEmail } from "@/services/supabase/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { formatAuthError } from "@/utils/authErrors";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const applySession = useAuthStore((state) => state.applySession);
  const { signInGoogle, signInApple, isGoogleLoading, isAppleLoading, error: socialError, clearError } =
    useSocialAuth();

  const displayError = formError ?? socialError;

  const clearErrors = () => {
    setFormError(null);
    clearError();
  };

  const handleRegister = async () => {
    clearErrors();
    setSuccessMessage(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError("Veuillez remplir tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setFormError("Supabase non configuré. Vérifiez .env puis relancez avec `npx expo start -c`.");
      return;
    }

    setLoading(true);
    try {
      const { session, user } = await signUpWithEmail(name.trim(), email.trim(), password);
      if (!user?.email) {
        setFormError("Impossible de créer le compte.");
        return;
      }

      if (session) {
        await applySession(session);
        router.replace("/(tabs)/profile");
        return;
      }

      const message = "Compte créé ! Vérifiez votre e-mail pour confirmer, puis connectez-vous.";
      setSuccessMessage(message);
      Alert.alert("Vérifiez votre e-mail", message);
      router.replace("/auth/login");
    } catch (error) {
      const message = formatAuthError(error);
      setFormError(message);
      Alert.alert("Inscription impossible", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AuthLayout
        scrollable
        title="Créer un compte"
        subtitle="Rejoignez Invyra et ne ratez plus les événements qui vous plaisent."
        footer={
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: typography.fontSize.sm,
                color: "rgba(255,255,255,0.56)",
              }}
            >
              Déjà inscrit ?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")} activeOpacity={0.75}>
              <Text
                style={{
                  fontFamily: typography.fontFamily.semiBold,
                  fontSize: typography.fontSize.sm,
                  color: colors.white,
                }}
              >
                Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        }
      >
        {displayError ? <AuthErrorBanner message={displayError} onDismiss={clearErrors} /> : null}

        {successMessage ? (
          <View
            style={{
              backgroundColor: "#ECFDF5",
              borderWidth: 1,
              borderColor: "#A7F3D0",
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: 13, color: "#047857" }}>
              {successMessage}
            </Text>
          </View>
        ) : null}

        <SocialAuthButtons
          onGoogle={signInGoogle}
          onApple={signInApple}
          loadingGoogle={isGoogleLoading}
          loadingApple={isAppleLoading}
          disabled={loading}
        />

        <AuthDivider />

        <Input label="Nom complet" value={name} onChangeText={setName} placeholder="Jean Mbuyi" autoCapitalize="words" />
        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="votre@email.com"
          keyboardType="email-address"
        />
        <PasswordInput label="Mot de passe" value={password} onChangeText={setPassword} />
        <PasswordInput
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirmer"
        />

        <AuthSubmitButton title="Créer mon compte" onPress={handleRegister} loading={loading} />

        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: typography.fontSize.xs,
            color: colors.text.secondary,
            textAlign: "center",
            marginTop: 16,
            lineHeight: typography.lineHeight.xs + 4,
          }}
        >
          En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </Text>
      </AuthLayout>
    </>
  );
}
