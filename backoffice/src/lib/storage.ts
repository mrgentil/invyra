import { getSupabaseAdmin } from "./supabaseAdmin";

export const EVENTS_BUCKET = process.env.SUPABASE_EVENTS_BUCKET || "event-images";

function safeExtFromMime(mime: string) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "bin";
}

export async function uploadEventImages(files: File[], folder: string) {
  if (!files.length) return [];

  const supabase = getSupabaseAdmin();
  const uploaded: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;

    const ext = safeExtFromMime(file.type);
    const filenameSafe = (file.name || `image.${ext}`)
      .replace(/[^\w.\-]+/g, "-")
      .slice(0, 80);
    const key = `${folder}/${crypto.randomUUID()}-${filenameSafe}`;

    const { error: upErr } = await supabase.storage
      .from(EVENTS_BUCKET)
      .upload(key, file, {
        upsert: false,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (upErr) {
      throw new Error(`Upload image failed: ${upErr.message}`);
    }

    const { data } = supabase.storage.from(EVENTS_BUCKET).getPublicUrl(key);
    if (!data?.publicUrl) {
      throw new Error("Upload image failed: no public URL");
    }
    uploaded.push(data.publicUrl);
  }

  return uploaded;
}

