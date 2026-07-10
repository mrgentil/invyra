import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import {
  fetchUserNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  countUnreadNotifications,
} from "@/services/supabase/notifications";

export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.notifications, userId],
    queryFn: () => fetchUserNotifications(userId!),
    enabled: Boolean(userId),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useUnreadNotificationCount(userId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.notifications, "unread", userId],
    queryFn: () => countUnreadNotifications(userId!),
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
}

export function useMarkAllNotificationsRead(userId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(userId!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications, userId] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications, "unread", userId] });
    },
  });
}

export function useMarkNotificationRead(userId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => markNotificationRead(userId!, notificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications, userId] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications, "unread", userId] });
    },
  });
}
