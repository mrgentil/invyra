type AuthErrorLike = {
  message?: string;
  msg?: string;
  error_description?: string;
  code?: string;
  error_code?: string;
  status?: number;
};

const CODE_MESSAGES: Record<string, string> = {
  invalid_credentials: "E-mail ou mot de passe incorrect.",
  email_not_confirmed:
    "E-mail non confirmé. Ouvrez le lien reçu par mail, ou désactivez la confirmation dans Supabase (mode dev).",
  user_already_registered: "Un compte existe déjà avec cet e-mail.",
  weak_password: "Le mot de passe doit contenir au moins 6 caractères.",
  signup_disabled: "Les inscriptions sont désactivées pour le moment.",
  over_request_rate_limit: "Trop de tentatives. Réessayez dans quelques minutes.",
  otp_expired: "Le lien a expiré. Demandez-en un nouveau.",
  session_not_found: "Session expirée. Reconnectez-vous.",
  provider_email_needs_verification: "Vérifiez votre e-mail avant de continuer.",
};

export function formatAuthError(error: unknown): string {
  if (!error) return "Une erreur inattendue s'est produite.";

  if (typeof error === "string") return error;

  if (typeof error === "object") {
    const authError = error as AuthErrorLike;
    const code = authError.code ?? authError.error_code ?? "";
    if (code && CODE_MESSAGES[code]) {
      return CODE_MESSAGES[code];
    }

    const message = authError.message ?? authError.msg ?? authError.error_description;
    if (message) return message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Une erreur inattendue s'est produite.";
}

export function isAuthCancellation(error: unknown): boolean {
  const message = formatAuthError(error).toLowerCase();
  return (
    message.includes("annul") ||
    message.includes("cancel") ||
    message.includes("dismiss") ||
    message.includes("interromp")
  );
}
