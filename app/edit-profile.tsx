import { useEffect, useMemo, useState } from "react";
import { View, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { colors } from "@/theme/colors";
import { shadows } from "@/theme/shadows";
import { Input } from "@/components/ui/Input";
import { GradientButton } from "@/components/ui/GradientButton";
import { SubScreenHeader } from "@/components/ui/SubScreenHeader";
import { LocationSelector } from "@/components/ui/LocationSelector";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { isSupabaseConfigured } from "@/lib/supabase";
import { updateProfileInSupabase } from "@/services/supabase/auth";
import { uploadAvatar } from "@/services/supabase/storage";
import { mockData } from "@/services";
import { useAuthStore } from "@/store";
import { getRdcLocationLabel } from "@/constants/rdcLocations";
import { useLocationStore } from "@/store/useLocationStore";

const PLACEHOLDER_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200";

export default function EditProfileScreen() {
  const authUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const fallback = mockData.users[0];
  const user = authUser ?? fallback;
  const selectedCityId = useLocationStore((state) => state.selectedId);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [avatar, setAvatar] = useState(user.avatar);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const canEditRemote = useMemo(() => Boolean(isSupabaseConfigured() && authUser), [authUser]);

  // Garde l'UI synchronisée avec l'avatar venant du store (ex: après refresh/hydrate)
  useEffect(() => {
    if (uploadingAvatar) return;
    if (authUser?.avatar && authUser.avatar !== avatar) {
      setAvatar(authUser.avatar);
      setAvatarLoadFailed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.avatar, uploadingAvatar]);

  const handlePickAvatar = async () => {
    if (!authUser) {
      router.push("/auth/login");
      return;
    }

    try {
      setUploadingAvatar(true);

      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permission requise", "Autorisez l'accès à la galerie pour choisir une photo.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      const uri = asset?.uri;
      if (!uri) {
        throw new Error("Image introuvable.");
      }

      // upload + persist
      const { publicUrl } = await uploadAvatar(authUser.id, {
        uri,
        base64: asset?.base64 ?? undefined,
        mimeType: asset?.mimeType ?? undefined,
      });
      await updateProfileInSupabase(authUser.id, { avatarUrl: publicUrl });

      setAvatar(publicUrl);
      setAvatarLoadFailed(false);
      setUser({ ...authUser, avatar: publicUrl });
    } catch (error) {
      Alert.alert("Erreur", error instanceof Error ? error.message : "Impossible de changer la photo.");
    } finally {
      setUploadingAvatar(false);
    }
  };

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
          avatar,
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
          <TouchableOpacity activeOpacity={0.85} onPress={handlePickAvatar} disabled={!authUser || uploadingAvatar}>
            <View>
              {/*
                Sur mobile, `expo-image` peut échouer si l'URL est vide ou si un chargement a échoué.
                On garde un placeholder stable pour éviter un avatar "invisible".
              */}
              <Image
                key={avatarLoadFailed ? "placeholder" : avatar}
                source={{ uri: !avatar || avatarLoadFailed ? PLACEHOLDER_AVATAR : avatar }}
                style={{ width: 104, height: 104, borderRadius: 52 }}
                contentFit="cover"
                cachePolicy="none"
                onError={() => setAvatarLoadFailed(true)}
              />
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
                  opacity: uploadingAvatar ? 0.55 : 1,
                }}
              >
                <Ionicons name={uploadingAvatar ? "cloud-upload-outline" : "camera-outline"} size={17} color={colors.white} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[{ marginHorizontal: 20, backgroundColor: colors.white, borderRadius: 28, padding: 18, borderWidth: 1, borderColor: colors.border.light }, shadows.sm]}>
          <Input label="Nom complet" value={name} onChangeText={setName} placeholder="Votre nom" />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="votre@email.com"
            keyboardType="email-address"
            editable={false}
          />
          <Input label="Téléphone" value={phone} onChangeText={setPhone} placeholder="+243 81 234 5678" keyboardType="phone-pad" />
        </View>

        <View style={[{ marginHorizontal: 20, marginTop: 16, backgroundColor: colors.white, borderRadius: 28, padding: 18, borderWidth: 1, borderColor: colors.border.light }, shadows.sm]}>
          <SectionTitle title="Ville" subtitle="Utilisée pour personnaliser vos recommandations" />
          <LocationSelector variant="compact" />
        </View>
      </ScrollView>

      <View style={[{ position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30, backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28 }, shadows.lg]}>
        <GradientButton
          title={uploadingAvatar ? "Upload photo..." : "Enregistrer"}
          onPress={handleSave}
          fullWidth
          size="large"
          loading={saving || uploadingAvatar}
          disabled={!canEditRemote}
        />
      </View>
    </View>
  );
}
