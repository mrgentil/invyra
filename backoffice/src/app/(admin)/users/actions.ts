"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function getUserId(formData: FormData) {
  const userId = String(formData.get("user_id") ?? "").trim();
  if (!userId) throw new Error("Utilisateur introuvable.");
  return userId;
}

export async function suspendUser(formData: FormData) {
  const userId = getUserId(formData);
  const supabase = getSupabaseAdmin();

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ status: "suspended" })
    .eq("id", userId);

  if (profileError) throw new Error(profileError.message);

  const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: "876000h",
  });

  if (authError) throw new Error(authError.message);

  revalidatePath("/users");
  redirect("/users");
}

export async function reactivateUser(formData: FormData) {
  const userId = getUserId(formData);
  const supabase = getSupabaseAdmin();

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ status: "active" })
    .eq("id", userId);

  if (profileError) throw new Error(profileError.message);

  const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: "none",
  });

  if (authError) throw new Error(authError.message);

  revalidatePath("/users");
  redirect("/users");
}

export async function deleteUser(formData: FormData) {
  const userId = getUserId(formData);
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);

  revalidatePath("/users");
  redirect("/users");
}
