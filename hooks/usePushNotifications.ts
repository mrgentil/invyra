import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { QUERY_KEYS } from "@/constants";
import { isSupabaseConfigured } from "@/lib/supabase";
import { registerForPushNotificationsAsync } from "@/lib/pushNotifications";
import { saveExpoPushToken } from "@/services/supabase/notifications";

export function usePushNotifications(userId?: string) {
  const queryClient = useQueryClient();
  const registeredRef = useRef<string | null>(null);

  useEffect(() => {
    if (!userId || !isSupabaseConfigured()) return;

    let mounted = true;

    void (async () => {
      const token = await registerForPushNotificationsAsync();
      if (!mounted || !token || registeredRef.current === token) return;
      registeredRef.current = token;
      try {
        await saveExpoPushToken(userId, token);
      } catch (e) {
        console.warn("[push] Enregistrement token échoué:", e);
      }
    })();

    const receivedSub = Notifications.addNotificationReceivedListener(() => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications, userId] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications, "unread", userId] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.organizerApplication, userId] });
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as { type?: string } | undefined;
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.organizerApplication, userId] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications, userId] });

      if (data?.type === "organizer_application") {
        router.push("/become-organizer");
        return;
      }
      router.push("/notifications");
    });

    return () => {
      mounted = false;
      receivedSub.remove();
      responseSub.remove();
    };
  }, [userId, queryClient]);
}
