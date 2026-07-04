import { View, Text, FlatList } from "react-native";
import { router, Stack } from "expo-router";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { NotificationCard } from "@/components/cards/NotificationCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SubScreenHeader } from "@/components/ui/SubScreenHeader";
import { Notification } from "@/types";

const notifications: Notification[] = [
  {
    id: "notif-1",
    type: "booking",
    title: "Billet confirmé",
    message: "Votre billet est prêt. Retrouvez votre QR code dans l'onglet Billets.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "notif-2",
    type: "reminder",
    title: "Événement bientôt",
    message: "Votre sortie commence demain à 20h00. Pensez à vérifier l'adresse.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "notif-3",
    type: "promo",
    title: "Nouvelle sélection",
    message: "Des événements populaires viennent d'être ajoutés près de vous.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
];

export default function NotificationsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader
        title="Notifications"
        subtitle="Rappels et confirmations"
        right={
          <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.sm, color: colors.primary.DEFAULT }}>
            Tout lu
          </Text>
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          variant="notifications"
          actionLabel="Explorer les événements"
          onAction={() => router.push("/(tabs)/discover")}
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 20 }}>
              <NotificationCard notification={item} />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}
