import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  insertUserInAppNotification,
  sendExpoPushToUser,
  sendUserApplicationEmail,
  sendWhatsAppToRecipient,
} from "@/lib/notify";

export type UserNotifyResult = {
  email: { sent: boolean; error?: string };
  whatsapp: { sent: boolean; error?: string };
  push: { sent: boolean; error?: string };
  inApp: { sent: boolean; error?: string };
};

export async function notifyUserOrganizerApplicationResult(data: {
  userId: string;
  email: string;
  phone?: string | null;
  businessName: string;
  approved: boolean;
  rejectionReason?: string;
}): Promise<UserNotifyResult> {
  const title = data.approved
    ? "Demande organisateur approuvée"
    : "Demande organisateur refusée";

  const message = data.approved
    ? `Votre demande pour « ${data.businessName} » a été approuvée. Ouvrez Invyra pour accéder à votre espace organisateur.`
    : `Votre demande pour « ${data.businessName} » n'a pas été retenue.${data.rejectionReason ? ` Motif : ${data.rejectionReason}` : ""}`;

  const payload = {
    type: "organizer_application" as const,
    approved: data.approved,
    businessName: data.businessName,
  };

  const admin = getSupabaseAdmin();
  let pushToken: string | null = null;
  const { data: profile } = await admin
    .from("profiles")
    .select("expo_push_token")
    .eq("id", data.userId)
    .maybeSingle();
  pushToken = profile?.expo_push_token ?? null;

  const [email, whatsapp, push, inApp] = await Promise.all([
    data.email
      ? sendUserApplicationEmail({
          email: data.email,
          businessName: data.businessName,
          approved: data.approved,
          rejectionReason: data.rejectionReason,
        })
      : Promise.resolve({ sent: false, error: "no_email" }),
    data.phone
      ? sendWhatsAppToRecipient({ phone: data.phone, message: `${title}. ${message}` })
      : Promise.resolve({ sent: false, error: "no_phone" }),
    pushToken
      ? sendExpoPushToUser({ token: pushToken, title, body: message, data: payload })
      : Promise.resolve({ sent: false, error: "no_push_token" }),
    insertUserInAppNotification({
      userId: data.userId,
      title,
      message,
      data: payload,
    }),
  ]);

  return { email, whatsapp, push, inApp };
}
