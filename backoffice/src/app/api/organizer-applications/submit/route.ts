import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { notifyAdminNewApplication } from "@/lib/notify";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
    if (!token) return json({ error: "Non authentifié." }, 401);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return json({ error: "Configuration Supabase manquante." }, 500);

    const authClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: authData, error: authError } = await authClient.auth.getUser(token);
    if (authError || !authData.user) return json({ error: "Session invalide." }, 401);

    const user = authData.user;
    const body = (await req.json()) as {
      business_name?: string;
      phone?: string;
      city?: string;
      bio?: string;
    };

    const businessName = String(body.business_name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const city = String(body.city ?? "").trim();
    const bio = String(body.bio ?? "").trim();
    const email = user.email ?? "";

    if (!businessName) return json({ error: "Le nom de la structure est obligatoire." }, 400);
    if (!phone) return json({ error: "Le téléphone est obligatoire." }, 400);

    const admin = getSupabaseAdmin();

    const { data: existingOrganizer } = await admin
      .from("organizers")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingOrganizer) {
      return json({ error: "Vous êtes déjà organisateur sur Invyra." }, 409);
    }

    const { data: pending } = await admin
      .from("organizer_applications")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .maybeSingle();

    if (pending) {
      return json({ error: "Une demande est déjà en cours de traitement." }, 409);
    }

    const applicantName =
      (user.user_metadata?.name as string | undefined) ??
      (user.user_metadata?.full_name as string | undefined) ??
      email.split("@")[0] ??
      "Utilisateur";

    const { data: application, error: insertError } = await admin
      .from("organizer_applications")
      .insert({
        user_id: user.id,
        business_name: businessName,
        email,
        phone,
        city: city || null,
        bio: bio || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError) return json({ error: insertError.message }, 400);

    const notifyResult = await notifyAdminNewApplication({
      applicantName,
      businessName,
      email,
      phone,
      city,
      applicationId: application.id,
    });

    return json({ ok: true, id: application.id, notify: notifyResult });
  } catch (e) {
    console.error("[organizer-applications/submit]", e);
    return json({ error: "Erreur serveur." }, 500);
  }
}
