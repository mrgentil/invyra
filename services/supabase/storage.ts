import { getSupabase } from "@/lib/supabase";

export type UploadAvatarResult = {
  publicUrl: string;
  path: string;
};

export type AvatarUploadInput = {
  uri: string;
  base64?: string;
  mimeType?: string;
};

const AVATAR_BUCKET = "avatars";

function guessAvatarExt(uri: string): string {
  const cleaned = uri.split("?")[0] ?? uri;
  const ext = cleaned.split(".").pop()?.toLowerCase();
  if (!ext) return "jpg";
  if (ext === "jpeg") return "jpg";
  if (["jpg", "png", "webp", "heic"].includes(ext)) return ext;
  return "jpg";
}

function base64ToUint8Array(base64: string): Uint8Array {
  const atobFn = globalThis.atob;
  if (!atobFn) {
    throw new Error("Base64 non supporté dans cet environnement.");
  }

  const binary = atobFn(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function uploadAvatar(userId: string, input: AvatarUploadInput): Promise<UploadAvatarResult> {
  const supabase = getSupabase();
  const ext = guessAvatarExt(input.uri);
  const path = `${userId}/${Date.now()}.${ext}`;

  const bytes = input.base64 ? base64ToUint8Array(input.base64) : null;
  if (!bytes || bytes.byteLength === 0) {
    throw new Error("Image vide. Réessayez la sélection (base64 manquant).");
  }

  const contentType =
    input.mimeType ||
    (ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "heic" ? "image/heic" : "image/jpeg");

  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(path, bytes, {
    upsert: true,
    contentType,
  });
  if (uploadError) {
    throw new Error(uploadError.message || "Upload avatar impossible.");
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  const publicUrl = data.publicUrl;
  if (!publicUrl) {
    throw new Error("URL de l'avatar introuvable après upload.");
  }

  // cache-bust: force refresh when user uploads a new one
  return { publicUrl: `${publicUrl}?v=${Date.now()}`, path };
}

