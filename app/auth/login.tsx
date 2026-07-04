import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { AuthLayout, AuthDivider, SocialAuthButtons, AuthSubmitButton } from "@/components/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    router.replace("/(tabs)/home");
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
        <SocialAuthButtons onGoogle={handleLogin} onApple={handleLogin} />

        <AuthDivider />

        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="votre@email.com"
          keyboardType="email-address"
        />
        <PasswordInput label="Mot de passe" value={password} onChangeText={setPassword} />

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

        <AuthSubmitButton title="Se connecter" onPress={handleLogin} />
      </AuthLayout>
    </>
  );
}
