import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useFocusEffect } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";
import { QUERY_KEYS } from "@/constants";
import { Input } from "@/components/ui/Input";
import { GradientButton } from "@/components/ui/GradientButton";
import { SubScreenHeader } from "@/components/ui/SubScreenHeader";
import { LocationSelector } from "@/components/ui/LocationSelector";
import { useAuthStore } from "@/store";
import { useOrganizerStatus } from "@/hooks/useOrganizerStatus";
import { submitOrganizerApplication } from "@/services/supabase/organizerApplications";
import { useLocationStore } from "@/store/useLocationStore";
import { getRdcLocationLabel } from "@/constants/rdcLocations";

function isProfileCompleteForApplication(
  phone: string | undefined,
  cityId: string | undefined,
  cityLabel: string | undefined,
  selectedCityId: string
) {
  const hasPhone = Boolean(phone?.trim());
  const hasCity = Boolean(
    cityId?.trim() || cityLabel?.trim() || getRdcLocationLabel(selectedCityId)
  );
  return hasPhone && hasCity;
}

export default function BecomeOrganizerScreen() {
  const authUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const selectedCityId = useLocationStore((s) => s.selectedId);
  const queryClient = useQueryClient();
  const { data, isLoading, refetch, isRefetching } = useOrganizerStatus(authUser?.id);
  const prefilledRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (authUser?.id) void refetch();
    }, [authUser?.id, refetch])
  );

  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const status = data?.status ?? "none";
  const cityLabel =
    authUser?.location?.trim() ||
    getRdcLocationLabel(authUser?.cityId ?? selectedCityId) ||
    getRdcLocationLabel(selectedCityId) ||
    "";
  const profileComplete = isProfileCompleteForApplication(
    authUser?.phone,
    authUser?.cityId,
    authUser?.location,
    selectedCityId
  );

  useEffect(() => {
    if (prefilledRef.current || isLoading || isRefetching) return;
    if (status === "approved" || status === "pending") return;

    if (status === "rejected" && data?.application?.business_name) {
      setBusinessName(data.application.business_name);
      prefilledRef.current = true;
      return;
    }

    if (authUser?.name?.trim()) {
      setBusinessName(authUser.name.trim());
      prefilledRef.current = true;
    }
  }, [authUser?.name, data?.application?.business_name, isLoading, isRefetching, status]);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (!profileComplete) {
      Alert.alert(
        "Profil incomplet",
        "Ajoutez votre téléphone et votre ville dans votre profil avant d'envoyer la demande.",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Compléter mon profil", onPress: () => router.push("/edit-profile") },
        ]
      );
      return;
    }

    if (!businessName.trim()) {
      Alert.alert("Champ requis", "Indiquez le nom de votre structure.");
      return;
    }

    const phone = authUser?.phone?.trim() ?? "";
    if (!phone) {
      Alert.alert("Profil incomplet", "Ajoutez un numéro de téléphone dans votre profil.");
      return;
    }

    try {
      setSubmitting(true);
      await submitOrganizerApplication({
        business_name: businessName.trim(),
        phone,
        city: cityLabel,
        bio: bio.trim(),
      });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.organizerApplication] });
      await refetch();
      Alert.alert(
        "Demande envoyée",
        "Notre équipe a été notifiée par email et WhatsApp. Vous recevrez une réponse après validation."
      );
    } catch (e) {
      Alert.alert("Erreur", e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader title="Devenir organisateur" subtitle="Publiez et gérez vos événements sur Invyra" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        {!isAuthenticated ? (
          <View style={[{ backgroundColor: colors.white, borderRadius: 24, padding: 20, marginTop: 8 }, shadows.sm]}>
            <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.md, color: colors.text.primary }}>
              Connexion requise
            </Text>
            <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: 8, lineHeight: 20 }}>
              Connectez-vous pour soumettre une demande organisateur.
            </Text>
            <GradientButton title="Se connecter" onPress={() => router.push("/auth/login")} style={{ marginTop: 16 }} />
          </View>
        ) : isLoading || isRefetching ? (
          <Text style={{ marginTop: 24, textAlign: "center", color: colors.text.secondary }}>Chargement…</Text>
        ) : status === "approved" ? (
          <ApprovedCard name={data?.organizer?.name ?? "Organisateur"} verified={data?.organizer?.verified ?? true} />
        ) : status === "pending" ? (
          <PendingCard businessName={data?.application?.business_name ?? ""} />
        ) : (
          <>
            {status === "rejected" ? (
              <View
                style={{
                  backgroundColor: "#FEF2F2",
                  borderRadius: 20,
                  padding: 16,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: "#FECACA",
                }}
              >
                <Text style={{ fontFamily: typography.fontFamily.semiBold, color: "#B91C1C" }}>
                  Demande précédente refusée
                </Text>
                {data?.application?.rejection_reason ? (
                  <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: "#991B1B", marginTop: 6 }}>
                    {data.application.rejection_reason}
                  </Text>
                ) : null}
                <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: "#991B1B", marginTop: 6 }}>
                  Vous pouvez soumettre une nouvelle demande ci-dessous.
                </Text>
              </View>
            ) : null}

            {!profileComplete ? (
              <View
                style={{
                  backgroundColor: "#FFFBEB",
                  borderRadius: 20,
                  padding: 16,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: "#FDE68A",
                }}
              >
                <Text style={{ fontFamily: typography.fontFamily.semiBold, color: "#B45309" }}>
                  Profil à compléter
                </Text>
                <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: "#92400E", marginTop: 6, lineHeight: 20 }}>
                  Votre téléphone et votre ville seront utilisés pour la demande. Complétez votre profil pour continuer.
                </Text>
                <GradientButton
                  title="Compléter mon profil"
                  onPress={() => router.push("/edit-profile")}
                  style={{ marginTop: 14 }}
                />
              </View>
            ) : null}

            <View style={[{ backgroundColor: colors.white, borderRadius: 24, padding: 20, marginBottom: 16 }, shadows.sm]}>
              <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.lg, color: colors.text.primary }}>
                Vos informations
              </Text>
              <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: 6, marginBottom: 16, lineHeight: 20 }}>
                Reprise depuis votre profil Invyra. Modifiez-les dans « Mon profil » si besoin.
              </Text>

              <Input label="E-mail" value={authUser?.email ?? ""} onChangeText={() => {}} editable={false} />
              <Input label="Téléphone" value={authUser?.phone ?? "—"} onChangeText={() => {}} editable={false} />
              <View style={{ marginBottom: 8 }}>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.medium,
                    fontSize: typography.fontSize.md,
                    color: colors.text.primary,
                    marginBottom: 8,
                  }}
                >
                  Ville
                </Text>
                <LocationSelector />
              </View>
              <TouchableOpacity
                onPress={() => router.push("/edit-profile")}
                style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}
              >
                <Ionicons name="create-outline" size={16} color={colors.primary.DEFAULT} />
                <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.sm, color: colors.primary.DEFAULT }}>
                  Modifier dans mon profil
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[{ backgroundColor: colors.white, borderRadius: 24, padding: 20 }, shadows.sm]}>
              <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.lg, color: colors.text.primary }}>
                Votre demande organisateur
              </Text>
              <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: 6, marginBottom: 16, lineHeight: 20 }}>
                Complétez ces informations spécifiques à votre activité. L&apos;équipe Invyra sera notifiée par email et appel.
              </Text>

              <Input
                label="Nom de la structure"
                value={businessName}
                onChangeText={setBusinessName}
                placeholder="Ex: Live Events Kinshasa"
              />
              <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.xs, color: colors.text.secondary, marginTop: -10, marginBottom: 12 }}>
                Votre nom personnel ou celui de votre entreprise — modifiable.
              </Text>
              <Input
                label="Présentation"
                value={bio}
                onChangeText={setBio}
                placeholder="Type d'événements, expérience, public visé…"
                multiline
                numberOfLines={4}
                style={{ minHeight: 100, textAlignVertical: "top", marginBottom: 0 }}
              />

              <GradientButton
                title={submitting ? "Envoi…" : "Envoyer ma demande"}
                onPress={handleSubmit}
                loading={submitting}
                disabled={!profileComplete}
                style={{ marginTop: 20, opacity: profileComplete ? 1 : 0.5 }}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function PendingCard({ businessName }: { businessName: string }) {
  return (
    <View style={[{ backgroundColor: colors.white, borderRadius: 24, padding: 20, marginTop: 8 }, shadows.sm]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Ionicons name="time-outline" size={24} color="#D97706" />
        <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.lg, color: colors.text.primary }}>
          Demande en cours
        </Text>
      </View>
      <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary, lineHeight: 20 }}>
        Votre demande pour « {businessName} » est en cours d&apos;examen. Vous serez notifié par email dès qu&apos;elle sera traitée.
      </Text>
    </View>
  );
}

function ApprovedCard({ name, verified }: { name: string; verified: boolean }) {
  return (
    <View style={{ gap: 16, marginTop: 8 }}>
      <View style={[{ backgroundColor: colors.white, borderRadius: 24, padding: 20 }, shadows.sm]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Ionicons name="checkmark-circle" size={26} color={colors.success.DEFAULT} />
          <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.lg, color: colors.text.primary }}>
            Compte organisateur actif
          </Text>
        </View>
        {verified ? (
          <View
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#ECFDF5",
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 6,
              marginBottom: 12,
            }}
          >
            <Ionicons name="shield-checkmark" size={16} color="#059669" />
            <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: "#059669" }}>
              Organisateur vérifié
            </Text>
          </View>
        ) : null}
        <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary, lineHeight: 20 }}>
          Bienvenue {name} ! Votre demande a été acceptée. Le formulaire de demande n&apos;est plus nécessaire.
        </Text>
      </View>

      <View style={[{ backgroundColor: "#EEF2FF", borderRadius: 24, padding: 20, borderWidth: 1, borderColor: "#C7D2FE" }, shadows.sm]}>
        <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.md, color: "#3730A3" }}>
          Prochaine étape
        </Text>
        <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: "#4338CA", marginTop: 8, lineHeight: 20 }}>
          L&apos;espace « Mes événements » pour créer et suivre vos événements arrive bientôt. En attendant, l&apos;équipe Invyra peut vous aider à publier.
        </Text>
      </View>
    </View>
  );
}
