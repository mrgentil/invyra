import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { AuthLayout, AuthDivider, SocialAuthButtons, AuthSubmitButton } from "@/components/auth";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    router.replace("/(tabs)/home");
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
        <SocialAuthButtons onGoogle={handleRegister} onApple={handleRegister} />

        <AuthDivider />

        <Input label="Nom complet" value={name} onChangeText={setName} placeholder="Jean Dupont" autoCapitalize="words" />
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

        <AuthSubmitButton title="Créer mon compte" onPress={handleRegister} />

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
