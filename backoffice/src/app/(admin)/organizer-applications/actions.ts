"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { notifyAdminNewApplication } from "@/lib/notify";
import { notifyUserOrganizerApplicationResult } from "@/lib/userNotify";
import { slugify } from "@/lib/slug";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

async function uniqueOrganizerId(base: string) {
  const supabase = getSupabaseAdmin();
  let id = slugify(base);
  if (!id) id = "organizer";

  let candidate = id;
  let n = 0;
  while (n < 20) {
    const { data } = await supabase.from("organizers").select("id").eq("id", candidate).maybeSingle();
    if (!data) return candidate;
    n += 1;
    candidate = `${id}-${n}`;
  }
  return `${id}-${Date.now()}`;
}

export async function approveOrganizerApplication(formData: FormData) {
  const applicationId = String(formData.get("application_id") ?? "").trim();
  if (!applicationId) throw new Error("Demande introuvable.");

  const supabase = getSupabaseAdmin();

  const { data: application, error } = await supabase
    .from("organizer_applications")
    .select("id,user_id,business_name,email,phone,city,bio,status")
    .eq("id", applicationId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!application) throw new Error("Demande introuvable.");
  if (application.status !== "pending") throw new Error("Cette demande a déjà été traitée.");

  const { data: existingOrganizer } = await supabase
    .from("organizers")
    .select("id")
    .eq("user_id", application.user_id)
    .maybeSingle();

  if (existingOrganizer) {
    await supabase
      .from("organizer_applications")
      .update({
        status: "approved",
        organizer_id: existingOrganizer.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", applicationId);

    if (application.user_id) {
      await notifyUserOrganizerApplicationResult({
        userId: application.user_id,
        email: application.email ?? "",
        phone: application.phone,
        businessName: application.business_name,
        approved: true,
      });
    }

    revalidatePath("/organizer-applications");
    redirect("/organizer-applications");
  }

  const organizerId = await uniqueOrganizerId(application.business_name);

  const { error: insertError } = await supabase.from("organizers").insert({
    id: organizerId,
    user_id: application.user_id,
    name: application.business_name,
    email: application.email,
    phone: application.phone,
    bio: application.bio,
    verified: true,
    rating: 0,
    event_count: 0,
    followers: 0,
  });

  if (insertError) throw new Error(insertError.message);

  const { error: updateError } = await supabase
    .from("organizer_applications")
    .update({
      status: "approved",
      organizer_id: organizerId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq("id", applicationId);

  if (updateError) throw new Error(updateError.message);

  if (application.user_id) {
    await notifyUserOrganizerApplicationResult({
      userId: application.user_id,
      email: application.email ?? "",
      phone: application.phone,
      businessName: application.business_name,
      approved: true,
    });
  }

  revalidatePath("/organizer-applications");
  revalidatePath("/organizers");
  redirect("/organizer-applications");
}

export async function rejectOrganizerApplication(formData: FormData) {
  const applicationId = String(formData.get("application_id") ?? "").trim();
  const reason = String(formData.get("rejection_reason") ?? "").trim();
  if (!applicationId) throw new Error("Demande introuvable.");

  const supabase = getSupabaseAdmin();

  const { data: application, error: fetchError } = await supabase
    .from("organizer_applications")
    .select("id,user_id,business_name,email,phone,status")
    .eq("id", applicationId)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);
  if (!application) throw new Error("Demande introuvable.");
  if (application.status !== "pending") throw new Error("Cette demande a déjà été traitée.");

  const { error } = await supabase
    .from("organizer_applications")
    .update({
      status: "rejected",
      rejection_reason: reason || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (error) throw new Error(error.message);

  if (application.user_id) {
    await notifyUserOrganizerApplicationResult({
      userId: application.user_id,
      email: application.email ?? "",
      phone: application.phone,
      businessName: application.business_name,
      approved: false,
      rejectionReason: reason || undefined,
    });
  }

  revalidatePath("/organizer-applications");
  redirect("/organizer-applications");
}

export async function resendApplicationNotification(formData: FormData) {
  const applicationId = String(formData.get("application_id") ?? "").trim();
  if (!applicationId) throw new Error("Demande introuvable.");

  const supabase = getSupabaseAdmin();
  const { data: application, error } = await supabase
    .from("organizer_applications")
    .select("id,business_name,email,phone,city,status")
    .eq("id", applicationId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!application) throw new Error("Demande introuvable.");

  const applicantName = application.email?.split("@")[0] ?? "Utilisateur";

  const notify = await notifyAdminNewApplication({
    applicantName,
    businessName: application.business_name,
    email: application.email ?? "",
    phone: application.phone ?? "",
    city: application.city ?? "",
    applicationId: application.id,
  });

  if (!notify.email.sent) {
    throw new Error(`Email non envoyé : ${notify.email.error ?? "erreur inconnue"}`);
  }

  revalidatePath("/organizer-applications");
  redirect("/organizer-applications");
}
