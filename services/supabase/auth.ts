import type { Session } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured, resetSupabaseAuth } from "@/lib/supabase";
import { User } from "@/types";
import { mapProfile } from "./mappers";

export async function signInWithEmail(email: string, password: string): Promise<Session> {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw error;

  const session = data.session;
  if (!session?.user?.email) {
    throw new Error("Session introuvable après connexion. Réessayez.");
  }

  return session;
}

export async function signUpWithEmail(name: string, email: string, password: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { name } },
  });
  if (error) throw error;
  return data;
}

export async function signOutFromSupabase() {
  if (!isSupabaseConfigured()) {
    await resetSupabaseAuth();
    return;
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error) {
      await supabase.auth.signOut({ scope: "local" });
    }
  } catch {
    // ignore — on force le nettoyage local ci-dessous
  } finally {
    await resetSupabaseAuth();
  }
}

export async function getCurrentSession() {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function fetchProfileFromSupabase(userId: string, email: string): Promise<User> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    return {
      id: userId,
      name: email.split("@")[0],
      email,
      phone: "",
      avatar: "",
      preferences: [],
      tickets: [],
      favorites: [],
      notifications: [],
    };
  }

  return mapProfile(data, email);
}

export async function updateProfileInSupabase(
  userId: string,
  updates: { name?: string; phone?: string; cityId?: string; cityLabel?: string }
) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("profiles")
    .update({
      name: updates.name,
      phone: updates.phone,
      city_id: updates.cityId,
      city_label: updates.cityLabel,
    })
    .eq("id", userId);

  if (error) throw error;
}

export function onAuthStateChange(callback: Parameters<ReturnType<typeof getSupabase>["auth"]["onAuthStateChange"]>[0]) {
  return getSupabase().auth.onAuthStateChange(callback);
}
