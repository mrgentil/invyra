import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { getCurrentSession } from "@/services/supabase/auth";

export type OrganizerApplicationStatus = "none" | "pending" | "approved" | "rejected";

export type OrganizerApplication = {
  id: string;
  business_name: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  organizer_id: string | null;
  created_at: string;
};

export type OrganizerMembership = {
  id: string;
  name: string;
  verified: boolean;
};

const BACKOFFICE_URL = (process.env.EXPO_PUBLIC_BACKOFFICE_URL ?? "").replace(/\/$/, "");

export async function submitOrganizerApplication(input: {
  business_name: string;
  phone: string;
  city: string;
  bio: string;
}) {
  if (!BACKOFFICE_URL) {
    throw new Error("Back-office non configuré (EXPO_PUBLIC_BACKOFFICE_URL).");
  }

  const session = await getCurrentSession();
  const token = session?.access_token;
  if (!token) throw new Error("Connectez-vous pour envoyer une demande.");

  const res = await fetch(`${BACKOFFICE_URL}/api/organizer-applications/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const data = (await res.json()) as { ok?: boolean; error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "Impossible d'envoyer la demande.");
  }

  return data;
}

export async function fetchOrganizerStatus(userId: string): Promise<{
  application: OrganizerApplication | null;
  organizer: OrganizerMembership | null;
  status: OrganizerApplicationStatus;
}> {
  if (!isSupabaseConfigured()) {
    return { application: null, organizer: null, status: "none" };
  }

  const supabase = getSupabase();

  const [{ data: organizerByUser }, { data: application }] = await Promise.all([
    supabase.from("organizers").select("id,name,verified").eq("user_id", userId).maybeSingle(),
    supabase
      .from("organizer_applications")
      .select("id,business_name,status,rejection_reason,organizer_id,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const app = application as OrganizerApplication | null;

  let organizer: OrganizerMembership | null = organizerByUser as OrganizerMembership | null;

  // Fallback : organisateur lié via organizer_id si user_id pas encore renseigné
  if (!organizer && app?.status === "approved" && app.organizer_id) {
    const { data: organizerById } = await supabase
      .from("organizers")
      .select("id,name,verified")
      .eq("id", app.organizer_id)
      .maybeSingle();
    organizer = (organizerById as OrganizerMembership | null) ?? null;
  }

  if (organizer) {
    return {
      application: app?.status === "pending" ? null : app,
      organizer,
      status: "approved",
    };
  }

  if (app?.status === "pending") {
    return { application: app, organizer: null, status: "pending" };
  }

  // Demande approuvée mais fiche organisateur supprimée → utilisateur simple
  if (app?.status === "approved") {
    return { application: null, organizer: null, status: "none" };
  }

  if (app?.status === "rejected") {
    return { application: app, organizer: null, status: "rejected" };
  }

  return { application: null, organizer: null, status: "none" };
}
