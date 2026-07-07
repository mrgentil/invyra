import type { Session } from "@supabase/supabase-js";
import { User } from "@/types";

export function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}

export function userFromAuthSession(session: Session): User {
  const email = session.user.email ?? "";
  const meta = session.user.user_metadata ?? {};

  return {
    id: session.user.id,
    name: String(meta.name ?? meta.full_name ?? email.split("@")[0] ?? "Utilisateur"),
    email,
    phone: String(meta.phone ?? ""),
    avatar: String(meta.avatar_url ?? meta.picture ?? ""),
    preferences: [],
    tickets: [],
    favorites: [],
    notifications: [],
  };
}
