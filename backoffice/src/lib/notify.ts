type NotifyPayload = {
  subject: string;
  text: string;
  html?: string;
};

export type NotifyResult = {
  email: { sent: boolean; error?: string };
  whatsapp: { sent: boolean; url?: string; error?: string };
  phone: { sent: boolean; error?: string };
};

function getAdminEmail() {
  return process.env.ADMIN_NOTIFICATION_EMAIL ?? process.env.ADMIN_EMAIL ?? "";
}

function getAdminWhatsApp() {
  return (process.env.ADMIN_WHATSAPP_PHONE ?? "").replace(/\D/g, "");
}

function getResendFrom() {
  const raw = process.env.RESEND_FROM?.trim();
  if (!raw) return "onboarding@resend.dev";
  // .env sans guillemets peut tronquer "Invyra <email>" → on extrait l'email si besoin
  const match = raw.match(/<([^>]+)>/);
  if (match?.[1]) return match[1].trim();
  if (raw.includes("@")) return raw;
  return "onboarding@resend.dev";
}

export function buildWhatsAppUrl(message: string) {
  const phone = getAdminWhatsApp();
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

async function sendPhoneCallCallMeBot(message: string) {
  const apiKey =
    process.env.CALLMEBOT_PHONE_API_KEY?.trim() ??
    process.env.CALLMEBOT_API_KEY?.trim();
  const phone = getAdminWhatsApp();
  if (!apiKey || !phone) {
    return { sent: false, error: "CALLMEBOT_PHONE_API_KEY ou ADMIN_WHATSAPP_PHONE manquant" };
  }

  const shortText = message.replace(/\s+/g, " ").trim().slice(0, 180);
  const url = `https://api.callmebot.com/call.php?phone=${phone}&text=${encodeURIComponent(shortText)}&apikey=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  const body = await res.text();

  if (!res.ok || /error|invalid/i.test(body)) {
    console.error("[notify] CallMeBot call error:", res.status, body);
    return { sent: false, error: body.slice(0, 200) || `HTTP ${res.status}` };
  }

  console.info("[notify] Appel CallMeBot déclenché →", phone);
  return { sent: true };
}

async function sendWhatsAppCallMeBot(message: string) {
  const apiKey = process.env.CALLMEBOT_WHATSAPP_API_KEY?.trim();
  const phone = getAdminWhatsApp();
  if (!apiKey || !phone) {
    return { sent: false, error: "CALLMEBOT_WHATSAPP_API_KEY ou ADMIN_WHATSAPP_PHONE manquant" };
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  const body = await res.text();

  if (!res.ok || /error/i.test(body)) {
    console.error("[notify] CallMeBot error:", res.status, body);
    return { sent: false, error: body.slice(0, 200) || `HTTP ${res.status}` };
  }

  return { sent: true };
}

export async function sendEmail({ to, subject, text, html }: NotifyPayload & { to: string }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = getResendFrom();

  if (!apiKey) {
    console.info("[notify] RESEND_API_KEY manquant — email non envoyé:", { to, subject });
    return { sent: false, error: "RESEND_API_KEY manquant" };
  }

  if (!to.includes("@")) {
    return { sent: false, error: `Email admin invalide: ${to}` };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html: html ?? `<pre style="font-family:sans-serif">${text}</pre>`,
    }),
  });

  const body = await res.text();

  if (!res.ok) {
    console.error("[notify] Resend error:", res.status, body);
    let error = body;
    try {
      const parsed = JSON.parse(body) as { message?: string };
      error = parsed.message ?? body;
    } catch {
      // keep raw body
    }
    return { sent: false, error };
  }

  console.info("[notify] Email envoyé →", to, subject);
  return { sent: true };
}

export async function notifyAdminNewApplication(data: {
  applicantName: string;
  businessName: string;
  email: string;
  phone: string;
  city: string;
  applicationId: string;
}): Promise<NotifyResult> {
  const adminEmail = getAdminEmail();
  const lines = [
    "Nouvelle demande organisateur Invyra",
    "",
    `Structure : ${data.businessName}`,
    `Contact : ${data.applicantName}`,
    `Email : ${data.email || "—"}`,
    `Telephone : ${data.phone || "—"}`,
    `Ville : ${data.city || "—"}`,
    `ID : ${data.applicationId}`,
  ];
  const text = lines.join("\n");
  const whatsappUrl = buildWhatsAppUrl(text);

  let emailResult: NotifyResult["email"] = { sent: false, error: "ADMIN_NOTIFICATION_EMAIL manquant" };
  if (adminEmail) {
    const result = await sendEmail({
      to: adminEmail,
      subject: `[Invyra] Nouvelle demande organisateur — ${data.businessName}`,
      text: whatsappUrl ? `${text}\n\nWhatsApp : ${whatsappUrl}` : text,
      html: `<p><strong>Nouvelle demande organisateur</strong></p>
        <ul>
          <li><strong>Structure :</strong> ${data.businessName}</li>
          <li><strong>Contact :</strong> ${data.applicantName}</li>
          <li><strong>Email :</strong> ${data.email || "—"}</li>
          <li><strong>Téléphone :</strong> ${data.phone || "—"}</li>
          <li><strong>Ville :</strong> ${data.city || "—"}</li>
        </ul>
        ${whatsappUrl ? `<p><a href="${whatsappUrl}">Ouvrir WhatsApp</a></p>` : ""}
        <p>Back-office → Demandes organisateurs</p>`,
    });
    emailResult = result.sent ? { sent: true } : { sent: false, error: result.error };
  } else {
    console.info("[notify] ADMIN_NOTIFICATION_EMAIL manquant");
  }

  let whatsappResult: NotifyResult["whatsapp"] = { sent: false };
  const bot = await sendWhatsAppCallMeBot(text);
  if (bot.sent) {
    whatsappResult = { sent: true, url: whatsappUrl ?? undefined };
    console.info("[notify] WhatsApp CallMeBot envoyé");
  } else if (whatsappUrl) {
    whatsappResult = {
      sent: false,
      url: whatsappUrl,
      error: bot.error ?? "Activez WhatsApp sur CallMeBot (clé séparée)",
    };
    console.info("[notify] WhatsApp (lien manuel):", whatsappUrl);
    if (bot.error) console.info("[notify] WhatsApp auto:", bot.error);
  }

  const callText = `Nouvelle demande organisateur Invyra. ${data.businessName}. Par ${data.applicantName}.`;
  const phoneResult = await sendPhoneCallCallMeBot(callText);

  return { email: emailResult, whatsapp: whatsappResult, phone: phoneResult };
}

export async function sendUserApplicationEmail(data: {
  email: string;
  businessName: string;
  approved: boolean;
  rejectionReason?: string;
}) {
  if (!data.email) return { sent: false, error: "no_email" };

  const subject = data.approved
    ? "[Invyra] Votre demande organisateur est approuvée"
    : "[Invyra] Votre demande organisateur a été refusée";

  const text = data.approved
    ? `Bonjour,\n\nVotre demande pour « ${data.businessName} » a été approuvée.\n\nOuvrez l'application Invyra : votre badge Organisateur vérifié est actif.\n\n— L'équipe Invyra`
    : `Bonjour,\n\nVotre demande pour « ${data.businessName} » n'a pas été retenue.${data.rejectionReason ? `\n\nMotif : ${data.rejectionReason}` : ""}\n\n— L'équipe Invyra`;

  return sendEmail({ to: data.email, subject, text });
}

function normalizePhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

/** WhatsApp CallMeBot vers un numéro client (doit avoir activé CallMeBot). */
export async function sendWhatsAppToRecipient(data: { phone: string; message: string }) {
  const apiKey = process.env.CALLMEBOT_WHATSAPP_API_KEY?.trim();
  const phone = normalizePhoneDigits(data.phone);
  if (!apiKey) {
    return { sent: false, error: "CALLMEBOT_WHATSAPP_API_KEY manquant" };
  }
  if (!phone) {
    return { sent: false, error: "Téléphone invalide" };
  }

  const shortText = data.message.replace(/\s+/g, " ").trim().slice(0, 900);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(shortText)}&apikey=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  const body = await res.text();

  if (!res.ok || /error|invalid/i.test(body)) {
    console.error("[notify] WhatsApp client error:", res.status, body);
    return { sent: false, error: body.slice(0, 200) || `HTTP ${res.status}` };
  }

  console.info("[notify] WhatsApp client envoyé →", phone);
  return { sent: true };
}

export async function sendExpoPushToUser(data: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}) {
  const accessToken = process.env.EXPO_ACCESS_TOKEN?.trim();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers,
    body: JSON.stringify({
      to: data.token,
      title: data.title,
      body: data.body,
      data: data.data ?? {},
      sound: "default",
      priority: "high",
    }),
  });

  const body = (await res.json()) as { data?: { status?: string; message?: string }[] };
  const ticket = body.data?.[0];
  if (!res.ok || ticket?.status === "error") {
    const error = ticket?.message ?? `HTTP ${res.status}`;
    console.error("[notify] Expo push error:", error);
    return { sent: false, error };
  }

  console.info("[notify] Expo push envoyé");
  return { sent: true };
}

export async function insertUserInAppNotification(data: {
  userId: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}) {
  const { getSupabaseAdmin } = await import("@/lib/supabaseAdmin");
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("user_notifications").insert({
    user_id: data.userId,
    type: "system",
    title: data.title,
    message: data.message,
    data: data.data ?? {},
    read: false,
  });

  if (error) {
    console.error("[notify] in-app insert error:", error.message);
    return { sent: false, error: error.message };
  }

  return { sent: true };
}

/** @deprecated Utiliser notifyUserOrganizerApplicationResult */
export async function notifyUserApplicationResult(data: {
  email: string;
  businessName: string;
  approved: boolean;
  rejectionReason?: string;
}) {
  return sendUserApplicationEmail(data);
}
