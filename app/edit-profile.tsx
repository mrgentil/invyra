import { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Image } from "expo-image";
import { colors } from "@/theme/colors";
import { shadows } from "@/theme/shadows";
import { Input } from "@/components/ui/Input";
import { GradientButton } from "@/components/ui/GradientButton";
import { SubScreenHeader } from "@/components/ui/SubScreenHeader";
import { LocationSelector } from "@/components/ui/LocationSelector";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { isSupabaseConfigured } from "@/lib/supabase";
import { updateProfileInSupabase } from "@/services/supabase/auth";
import { mockData } from "@/services";
import { useAuthStore } from "@/store";
import { getRdcLocationLabel } from "@/constants/rdcLocations";
import { useLocationStore } from "@/store/useLocationStore";

export default function EditProfileScreen() {
  const authUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const fallback = mockData.users[0];
  const user = authUser ?? fallback;
  const selectedCityId = useLocationStore((state) => state.selectedId);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isSupabaseConfigured() && authUser) {
        await updateProfileInSupabase(authUser.id, {
          name: name.trim(),
          phone: phone.trim(),
          cityId: selectedCityId,
          cityLabel: getRdcLocationLabel(selectedCityId),
        });
        setUser({
          ...authUser,
          name: name.trim(),
          phone: phone.trim(),
          location: getRdcLocationLabel(selectedCityId),
        });
      }
      router.back();
    } catch (error) {
      Alert.alert("Erreur", error instanceof Error ? error.message : "Impossible d'enregistrer le profil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader title="Modifier profil" subtitle="Informations personnelles" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <View>
            <Image source={{ uri: user.avatar }} style={{ width: 104, height: 104, borderRadius: 52 }} contentFit="cover" />
            <View
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: colors.primary.DEFAULT,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 3,
                borderColor: "#F2F4F8",
              }}
            >
              <Ionicons name="camera-outline" size={17} color={colors.white} />
            </View>
          </View>
        </View>

        <View style={[{ marginHorizontal: 20, backgroundColor: colors.white, borderRadius: 28, padding: 18, borderWidth: 1, borderColor: colors.border.light }, shadows.sm]}>
          <Input label="Nom complet" value={name} onChangeText={setName} placeholder="Votre nom" />
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="votre@email.com" keyboardType="email-address" />
          <Input label="Téléphone" value={phone} onChangeText={setPhone} placeholder="+243 81 234 5678" keyboardType="phone-pad" />
        </View>

        <View style={[{ marginHorizontal: 20, marginTop: 16, backgroundColor: colors.white, borderRadius: 28, padding: 18, borderWidth: 1, borderColor: colors.border.light }, shadows.sm]}>
          <SectionTitle title="Ville" subtitle="Utilisée pour personnaliser vos recommandations" />
          <LocationSelector variant="compact" />
        </View>
      </ScrollView>

      <View style={[{ position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30, backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28 }, shadows.lg]}>
        <GradientButton title="Enregistrer" onPress={handleSave} fullWidth size="large" loading={saving} />
      </View>
    </View>
  );
}
