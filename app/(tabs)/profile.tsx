import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";
import { shadows } from "@/theme/shadows";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { LocationSelector } from "@/components/ui/LocationSelector";
import { useThemeStore, useOnboardingStore, useFavoritesStore } from "@/store";
import { getUserTickets, users } from "@/services/mockData";

const menuItems = [
  { icon: "heart-outline" as const, label: "Favoris", subtitle: "Événements sauvegardés", route: "/favorites", color: "#FF4D4F" },
  { icon: "notifications-outline" as const, label: "Notifications", subtitle: "Rappels et alertes", route: "/notifications", color: "#FF9800" },
  { icon: "card-outline" as const, label: "Paiement", subtitle: "Cartes et reçus", route: "/payment-methods", color: colors.primary.DEFAULT },
  { icon: "settings-outline" as const, label: "Réglages", subtitle: "Préférences du compte", route: "/settings", color: colors.text.secondary },
  { icon: "help-circle-outline" as const, label: "Aide", subtitle: "Support et FAQ", route: "/help", color: colors.success.DEFAULT },
  { icon: "information-circle-outline" as const, label: "À propos", subtitle: "Invyra et conditions", route: "/about", color: "#00B4D8" },
];

const quickActions = [
  { label: "Billets", icon: "ticket-outline" as const, route: "/(tabs)/tickets", color: colors.primary.DEFAULT },
  { label: "Explorer", icon: "compass-outline" as const, route: "/(tabs)/discover", color: colors.secondary.DEFAULT },
  { label: "Accueil", icon: "home-outline" as const, route: "/(tabs)/home", color: "#6366F1" },
  { label: "Modifier", icon: "create-outline" as const, route: "/edit-profile", color: colors.success.DEFAULT },
];

function MenuRow({
  icon,
  label,
  subtitle,
  color,
  onPress,
  isLast,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle: string;
  color: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border.light,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 16,
          backgroundColor: color + "14",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={21} color={color} />
      </View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.md, color: colors.text.primary }}>
          {label}
        </Text>
        <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.xs, color: colors.text.secondary, marginTop: 2 }}>
          {subtitle}
        </Text>
      </View>
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: colors.background.light,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { isDark, toggleTheme } = useThemeStore();
  const resetOnboarding = useOnboardingStore((state) => state.reset);
  const favoritesCount = useFavoritesStore((state) => state.favorites.length);
  const user = users[0];
  const ticketCount = getUserTickets().filter((ticket) => ticket.status === "active").length;

  const handleResetOnboarding = async () => {
    await resetOnboarding();
    router.replace("/onboarding");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <LinearGradient colors={["#EAF2FF", "#F2F4F8"]} style={{ paddingTop: 56, paddingHorizontal: 20, paddingBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <View>
              <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xxxl, color: colors.text.primary }}>
                Profil
              </Text>
              <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: 4 }}>
                Gérez votre compte Invyra
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => router.push("/edit-profile")}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.white,
                alignItems: "center",
                justifyContent: "center",
                ...shadows.sm,
              }}
            >
              <Ionicons name="create-outline" size={21} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View
            style={[
              {
                backgroundColor: colors.white,
                borderRadius: 28,
                padding: 18,
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.04)",
              },
              shadows.lg,
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ position: "relative" }}>
                <Image
                  source={{ uri: user.avatar }}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 38,
                    borderWidth: 3,
                    borderColor: colors.primary[100],
                  }}
                  contentFit="cover"
                />
                <View
                  style={{
                    position: "absolute",
                    right: -2,
                    bottom: -2,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: colors.primary.DEFAULT,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: colors.white,
                  }}
                >
                  <Ionicons name="checkmark" size={13} color={colors.white} />
                </View>
              </View>

              <View style={{ flex: 1, marginLeft: 16 }}>
                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: colors.primary[50],
                    borderRadius: radius.full,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: colors.primary.DEFAULT }}>
                    Membre Invyra
                  </Text>
                </View>
                <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xl, color: colors.text.primary }} numberOfLines={1}>
                  {user.name}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5 }}>
                  <Ionicons name="mail-outline" size={13} color={colors.text.secondary} />
                  <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary, flex: 1 }} numberOfLines={1}>
                    {user.email}
                  </Text>
                </View>
                <LocationSelector variant="compact" />
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 18 }}>
              {[
                { label: "Billets", value: ticketCount, icon: "ticket-outline" as const, tint: colors.primary.DEFAULT },
                { label: "Favoris", value: favoritesCount, icon: "heart-outline" as const, tint: "#FF4D4F" },
                { label: "Envies", value: user.preferences.length, icon: "sparkles-outline" as const, tint: colors.secondary.DEFAULT },
              ].map((stat) => (
                <View
                  key={stat.label}
                  style={{
                    flex: 1,
                    backgroundColor: colors.background.light,
                    borderRadius: 20,
                    paddingVertical: 12,
                    alignItems: "center",
                  }}
                >
                  <Ionicons name={stat.icon} size={17} color={stat.tint} />
                  <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.lg, color: colors.text.primary, marginTop: 6 }}>
                    {stat.value}
                  </Text>
                  <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.xs, color: colors.text.secondary, marginTop: 2 }}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 20, marginTop: 6 }}>
          <SectionTitle title="Accès rapide" subtitle="Naviguez en un tap" accentColor={colors.primary.DEFAULT} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.label}
                activeOpacity={0.82}
                onPress={() => router.push(action.route as any)}
                style={{
                  width: "48%",
                  backgroundColor: colors.white,
                  borderRadius: 22,
                  padding: 16,
                  ...shadows.sm,
                }}
              >
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    backgroundColor: action.color + "16",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name={action.icon} size={20} color={action.color} />
                </View>
                <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {user.preferences.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <SectionTitle title="Vos envies" subtitle="Ce qui vous inspire" accentColor={colors.secondary.DEFAULT} />
            <View
              style={[
                {
                  backgroundColor: colors.white,
                  borderRadius: 24,
                  padding: 16,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                },
                shadows.sm,
              ]}
            >
              {user.preferences.map((preference) => (
                <View
                  key={preference}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: colors.primary[50],
                    borderRadius: radius.full,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <Ionicons name="sparkles-outline" size={14} color={colors.primary.DEFAULT} />
                  <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.sm, color: colors.primary.DEFAULT }}>
                    {preference}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <SectionTitle title="Compte" subtitle="Paramètres et support" accentColor="#6366F1" />
          <View
            style={[
              {
                backgroundColor: colors.white,
                borderRadius: 24,
                paddingHorizontal: 14,
                paddingVertical: 4,
              },
              shadows.sm,
            ]}
          >
            {menuItems.map((item, index) => (
              <MenuRow
                key={item.label}
                icon={item.icon}
                label={item.label}
                subtitle={item.subtitle}
                color={item.color}
                onPress={() => router.push(item.route as any)}
                isLast={index === menuItems.length - 1}
              />
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <View
            style={[
              {
                backgroundColor: colors.white,
                borderRadius: 24,
                padding: 16,
              },
              shadows.sm,
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 16,
                    backgroundColor: "#FFB80018",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={isDark ? "moon-outline" : "sunny-outline"} size={21} color="#FFB800" />
                </View>
                <View>
                  <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.md, color: colors.text.primary }}>
                    Mode sombre
                  </Text>
                  <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.xs, color: colors.text.secondary, marginTop: 2 }}>
                    {isDark ? "Activé" : "Désactivé"}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border.light, true: colors.primary[200] }}
                thumbColor={isDark ? colors.primary.DEFAULT : colors.white}
              />
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <View style={[{ backgroundColor: colors.white, borderRadius: 24, padding: 16 }, shadows.sm]}>
            <TouchableOpacity activeOpacity={0.82} onPress={handleResetOnboarding} style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 16,
                  backgroundColor: colors.primary[50],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="refresh-outline" size={21} color={colors.primary.DEFAULT} />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.md, color: colors.text.primary }}>
                  Revoir l'onboarding
                </Text>
                <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.xs, color: colors.text.secondary, marginTop: 2 }}>
                  Réinitialise l'intro de l'app
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.text.secondary} />
            </TouchableOpacity>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border.light }}>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => router.push("/auth/login")}
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: radius.full,
                  backgroundColor: colors.text.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: colors.white }}>
                  Se connecter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => router.push("/auth/register")}
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: radius.full,
                  backgroundColor: colors.background.light,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: colors.border.light,
                }}
              >
                <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs, color: colors.text.primary }}>
                  S'inscrire
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.82}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 20,
            marginHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: colors.white,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: colors.danger[100],
            ...shadows.sm,
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger.DEFAULT} />
          <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.md, color: colors.danger.DEFAULT }}>
            Déconnexion
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
