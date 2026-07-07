import { AuthError } from "@supabase/supabase-js";
import { getPublicSupabase, resetSupabaseAuth } from "@/lib/supabase";

export function isInvalidSessionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const message = "message" in error ? String(error.message) : "";
  const code = "code" in error ? String(error.code) : "";
  const status = "status" in error ? Number(error.status) : 0;

  return (
    code === "PGRST301" ||
    status === 401 ||
    message.toLowerCase().includes("jwt") ||
    message.toLowerCase().includes("invalid claim") ||
    error instanceof AuthError
  );
}

async function recoverGuestSupabaseAccess(): Promise<void> {
  await resetSupabaseAuth();
}

/** Exécute une requête publique ; en cas de JWT invalide, nettoie la session et réessaie en mode invité. */
export async function runPublicSupabaseQuery<T>(query: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (error) {
    if (!isInvalidSessionError(error)) throw error;

    await recoverGuestSupabaseAccess();
    getPublicSupabase();
    return query();
  }
}
