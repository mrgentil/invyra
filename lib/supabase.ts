import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/constants";
import type { Database } from "@/types/database";
import { SupabaseAuthStorage, clearSupabaseAuthKeys } from "@/lib/supabaseStorage";

let client: SupabaseClient<Database> | null = null;
let publicClient: SupabaseClient<Database> | null = null;

export function getSupabaseStorageKey(): string {
  try {
    const projectRef = new URL(SUPABASE_URL).hostname.split(".")[0];
    return `sb-${projectRef}-auth-token`;
  } catch {
    return "sb-auth-token";
  }
}

/** Supprime la session auth (AsyncStorage + ancien SecureStore). */
export async function clearSupabaseAuthStorage(): Promise<void> {
  const baseKey = getSupabaseStorageKey();
  const keys = [baseKey, `${baseKey}-user`, `${baseKey}-code-verifier`];
  await clearSupabaseAuthKeys(keys);
}

export function resetSupabaseClient() {
  client = null;
  publicClient = null;
}

export async function resetSupabaseAuth(): Promise<void> {
  if (client) {
    try {
      await client.auth.signOut({ scope: "local" });
    } catch {
      // ignore — le JWT peut déjà être invalide
    }
  }

  await clearSupabaseAuthStorage();
  resetSupabaseClient();
}

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function createSupabaseClient(persistSession: boolean): SupabaseClient<Database> {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: persistSession ? SupabaseAuthStorage : undefined,
      autoRefreshToken: persistSession,
      persistSession,
      detectSessionInUrl: false,
    },
  });
}

/** Client auth (login, profil, billets) — persiste la session. */
export function getSupabase(): SupabaseClient<Database> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.");
  }

  if (!client) {
    client = createSupabaseClient(true);
  }

  return client;
}

/**
 * Client lecture publique (events, categories) — sans session persistée.
 * Évite les 401 causés par un JWT expiré après déconnexion.
 */
export function getPublicSupabase(): SupabaseClient<Database> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.");
  }

  if (!publicClient) {
    publicClient = createSupabaseClient(false);
  }

  return publicClient;
}
