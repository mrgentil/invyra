"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/slug";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function readCategoryFields(formData: FormData, allowIdEdit = false) {
  const name = String(formData.get("name") ?? "").trim();
  const id = allowIdEdit
    ? String(formData.get("id") ?? "").trim() || slugify(name)
    : String(formData.get("original_id") ?? "").trim();
  const icon = String(formData.get("icon") ?? "calendar").trim() || "calendar";
  const color = String(formData.get("color") ?? "#3B82F6").trim() || "#3B82F6";
  const imageUrl = String(formData.get("image_url") ?? "").trim();

  if (!name) throw new Error("Le nom est obligatoire.");
  if (!id) throw new Error("L'identifiant est obligatoire.");

  return { id, name, icon, color, image_url: imageUrl || null };
}

export async function createCategory(formData: FormData) {
  const fields = readCategoryFields(formData, true);
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("categories").insert({
    ...fields,
    event_count: 0,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/categories");
  redirect("/categories");
}

export async function updateCategory(formData: FormData) {
  const originalId = String(formData.get("original_id") ?? "").trim();
  const fields = readCategoryFields(formData);
  const supabase = getSupabaseAdmin();

  if (!originalId) throw new Error("Catégorie introuvable.");

  const { error } = await supabase
    .from("categories")
    .update({
      name: fields.name,
      icon: fields.icon,
      color: fields.color,
      image_url: fields.image_url,
    })
    .eq("id", originalId);

  if (error) throw new Error(error.message);

  revalidatePath("/categories");
  redirect("/categories");
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Catégorie introuvable.");

  const supabase = getSupabaseAdmin();
  const { count } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if ((count ?? 0) > 0) {
    throw new Error("Impossible de supprimer : des événements utilisent cette catégorie.");
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/categories");
  redirect("/categories");
}
