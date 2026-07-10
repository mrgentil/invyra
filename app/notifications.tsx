import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { router, Stack, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { NotificationCard } from "@/components/cards/NotificationCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SubScreenHeader } from "@/components/ui/SubScreenHeader";
import { useAuthStore } from "@/store";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/useNotifications";

export default function NotificationsScreen() {
  const userId = useAuthStore((s) => s.user?.id);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: notifications = [], isLoading, refetch, isRefetching } = useNotifications(userId);
  const markAllRead = useMarkAllNotificationsRead(userId);
  const markRead = useMarkNotificationRead(userId);

  useFocusEffect(
    useCallback(() => {
      if (userId) void refetch();
    }, [userId, refetch])
  );

  const handleMarkAllRead = () => {
    if (!userId || notifications.every((n) => n.read)) return;
    markAllRead.mutate();
  };

  const handlePress = (id: string, read: boolean) => {
    if (!read) markRead.mutate(id);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader
        title="Notifications"
        subtitle="Rappels et confirmations"
        right={
          isAuthenticated && notifications.some((n) => !n.read) ? (
            <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.75} disabled={markAllRead.isPending}>
              <Text style={{ fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.sm, color: colors.primary.DEFAULT }}>
                Tout lu
              </Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {!isAuthenticated ? (
        <EmptyState
          variant="notifications"
          title="Connectez-vous"
          message="Vos notifications apparaîtront ici une fois connecté."
          actionLabel="Se connecter"
          onAction={() => router.push("/auth/login")}
        />
      ) : isLoading || isRefetching ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary.DEFAULT} />
      ) : notifications.length === 0 ? (
        <EmptyState
          variant="notifications"
          title="Aucune notification"
          message="Vous serez notifié ici lors de l'approbation de votre demande organisateur, de vos billets, etc."
          actionLabel="Explorer les événements"
          onAction={() => router.push("/(tabs)/discover")}
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 20 }}>
              <NotificationCard notification={item} onPress={() => handlePress(item.id, item.read)} />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
        />
      )}
    </View>
  );
}
