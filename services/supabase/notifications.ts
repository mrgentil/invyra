import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Notification } from "@/types";

type NotificationRow = {
  id: string;
  type: Notification["type"];
  title: string;
  message: string;
  read: boolean;
  data: Record<string, unknown> | null;
  created_at: string;
};

function mapNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    read: row.read,
    createdAt: row.created_at,
    data: row.data ?? undefined,
  };
}

export async function saveExpoPushToken(userId: string, token: string) {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabase();
  const { error } = await supabase.from("profiles").update({ expo_push_token: token }).eq("id", userId);
  if (error) throw error;
}

export async function fetchUserNotifications(userId: string): Promise<Notification[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("user_notifications")
    .select("id,type,title,message,read,data,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;
  return (data as NotificationRow[]).map(mapNotification);
}

export async function markAllNotificationsRead(userId: string) {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabase();
  const { error } = await supabase
    .from("user_notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) throw error;
}

export async function markNotificationRead(userId: string, notificationId: string) {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabase();
  const { error } = await supabase
    .from("user_notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = getSupabase();
  const { count, error } = await supabase
    .from("user_notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) throw error;
  return count ?? 0;
}
