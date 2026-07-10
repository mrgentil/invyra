"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/slug";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function readOrganizerFields(formData: FormData, forCreate = false) {
  const name = String(formData.get("name") ?? "").trim();
  const id = forCreate
    ? String(formData.get("id") ?? "").trim() || slugify(name)
    : String(formData.get("original_id") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const avatarUrl = String(formData.get("avatar_url") ?? "").trim();
  const verified = Boolean(formData.get("verified"));

  if (!name) throw new Error("Le nom est obligatoire.");
  if (!id) throw new Error("L'identifiant est obligatoire.");

  return {
    id,
    name,
    email: email || null,
    phone: phone || null,
    bio: bio || null,
    avatar_url: avatarUrl || null,
    verified,
  };
}

export async function createOrganizer(formData: FormData) {
  const fields = readOrganizerFields(formData, true);
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("organizers").insert({
    ...fields,
    rating: 0,
    event_count: 0,
    followers: 0,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/organizers");
  redirect("/organizers");
}

export async function updateOrganizer(formData: FormData) {
  const originalId = String(formData.get("original_id") ?? "").trim();
  const fields = readOrganizerFields(formData);
  const supabase = getSupabaseAdmin();

  if (!originalId) throw new Error("Organisateur introuvable.");

  const { error } = await supabase
    .from("organizers")
    .update({
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      bio: fields.bio,
      avatar_url: fields.avatar_url,
      verified: fields.verified,
    })
    .eq("id", originalId);

  if (error) throw new Error(error.message);

  revalidatePath("/organizers");
  redirect("/organizers");
}

export async function toggleOrganizerVerified(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const verified = String(formData.get("verified") ?? "") === "true";
  if (!id) throw new Error("Organisateur introuvable.");

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("organizers").update({ verified }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/organizers");
  redirect("/organizers");
}

export async function deleteOrganizer(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Organisateur introuvable.");

  const supabase = getSupabaseAdmin();
  const { count } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("organizer_id", id);

  if ((count ?? 0) > 0) {
    throw new Error("Impossible de supprimer : des événements sont liés à cet organisateur.");
  }

  const { data: organizer } = await supabase
    .from("organizers")
    .select("user_id")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("organizers").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Réinitialise les demandes liées pour que l'app affiche « Devenir organisateur »
  if (organizer?.user_id) {
    await supabase.from("organizer_applications").delete().eq("user_id", organizer.user_id);
  } else {
    await supabase.from("organizer_applications").delete().eq("organizer_id", id);
  }

  revalidatePath("/organizers");
  revalidatePath("/organizer-applications");
  redirect("/organizers");
}
