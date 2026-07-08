import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Linking from "expo-linking";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

function isExpoGo(): boolean {
  return (
    Constants.appOwnership === "expo" ||
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient
  );
}

function getExpoDevHost(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri && !hostUri.includes("localhost") && !hostUri.includes("127.0.0.1")) {
    return hostUri;
  }

  const debuggerHost =
    Constants.expoGoConfig?.debuggerHost ??
    (Constants.manifest as { debuggerHost?: string } | null)?.debuggerHost;

  if (debuggerHost && !debuggerHost.includes("localhost") && !debuggerHost.includes("127.0.0.1")) {
    return debuggerHost.includes(":") ? debuggerHost : `${debuggerHost}:8081`;
  }

  return null;
}

function buildExpoGoRedirectUri(host: string): string {
  return `exp://${host}/--/auth/callback`;
}

/**
 * URL de retour OAuth — doit correspondre EXACTEMENT à une Redirect URL Supabase.
 */
export function getOAuthRedirectUri(): string {
  const envOverride = process.env.EXPO_PUBLIC_OAUTH_REDIRECT_URI?.trim();
  if (envOverride) return envOverride;

  if (Platform.OS === "web") {
    return makeRedirectUri({
      scheme: "invyra",
      path: "auth/callback",
      preferLocalhost: true,
    });
  }

  if (isExpoGo()) {
    const expoHost = getExpoDevHost();
    if (!expoHost) {
      throw new Error(
        "IP Expo introuvable. Lancez `npx expo start` en mode LAN (pas tunnel), ouvrez via QR code Expo Go."
      );
    }
    return buildExpoGoRedirectUri(expoHost);
  }

  const nativeUri = makeRedirectUri({
    scheme: "invyra",
    path: "auth/callback",
    preferLocalhost: false,
  });

  if (!nativeUri.includes("localhost") && !nativeUri.includes("127.0.0.1")) {
    return nativeUri;
  }

  return "invyra://auth/callback";
}

/** URLs à ajouter dans Supabase Redirect URLs (selon l'environnement actuel). */
export function getOAuthRedirectCandidates(): string[] {
  const primary = getOAuthRedirectUri();
  const host = getExpoDevHost();
  const candidates = new Set<string>([primary, "exp://**", "invyra://auth/callback"]);

  if (host) {
    candidates.add(`exp://${host}`);
    candidates.add(buildExpoGoRedirectUri(host));
  }

  return [...candidates];
}

export function getOAuthSetupHint(redirectUri = getOAuthRedirectUri()) {
  const redirectLines = getOAuthRedirectCandidates().map((url) => `  ${url}`).join("\n");

  return [
    "Supabase → Authentication → URL Configuration",
    "",
    "Site URL :",
    "  exp://" + (getExpoDevHost() ?? "VOTRE_IP:8081"),
    "  (pas http://localhost:8081 sur téléphone)",
    "",
    "Redirect URLs (une par ligne) :",
    redirectLines,
    "",
    `URL utilisée par l'app : ${redirectUri}`,
  ].join("\n");
}

export async function createSessionFromUrl(url: string): Promise<Session> {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) {
    throw new Error(params.error_description ?? params.error ?? errorCode);
  }

  const supabase = getSupabase();

  if (params.code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (error) throw error;
    if (!data.session) throw new Error("Session introuvable après authentification.");
    return data.session;
  }

  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;

  if (!accessToken) {
    throw new Error("Réponse d'authentification invalide.");
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken ?? "",
  });

  if (error) throw error;
  if (!data.session) throw new Error("Session introuvable après authentification.");
  return data.session;
}

function throwIfLocalhostRedirect(url: string, redirectTo: string): void {
  if (!url.includes("localhost") && !url.includes("127.0.0.1")) return;

  throw new Error(
    [
      "Supabase a renvoyé vers localhost au lieu de l'app.",
      "",
      "L'app envoie cette URL à Supabase :",
      redirectTo,
      "",
      "Ajoutez-la EXACTEMENT dans Redirect URLs.",
      "Changez aussi Site URL vers exp://VOTRE_IP:8081 (pas localhost).",
    ].join("\n")
  );
}

export async function signInWithOAuthProvider(provider: "google" | "apple"): Promise<Session> {
  const supabase = getSupabase();
  const redirectTo = getOAuthRedirectUri();

  if (redirectTo.includes("localhost") && Platform.OS !== "web") {
    throw new Error(
      `Redirect localhost détecté (${redirectTo}). ${getOAuthSetupHint(redirectTo)}`
    );
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams:
        provider === "google"
          ? {
              prompt: "select_account",
            }
          : provider === "apple"
            ? { scope: "name email" }
            : undefined,
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error("URL d'authentification indisponible.");

  // iOS matche l'URL de retour en préfixe — le ? final capture les query params.
  const returnUrl = redirectTo.endsWith("?") ? redirectTo : `${redirectTo}?`;

  if (Platform.OS === "android") {
    await WebBrowser.warmUpAsync();
  }

  try {
    const result = await WebBrowser.openAuthSessionAsync(data.url, returnUrl, {
      showInRecents: true,
      createTask: false,
    });

    if (result.type === "cancel" || result.type === "dismiss") {
      throw new Error("Connexion annulée.");
    }

    if (result.type !== "success") {
      throw new Error("Connexion interrompue.");
    }

    throwIfLocalhostRedirect(result.url, redirectTo);
    return createSessionFromUrl(result.url);
  } finally {
    if (Platform.OS === "android") {
      await WebBrowser.coolDownAsync();
    }
  }
}

export async function signInWithAppleNative(): Promise<Session> {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error("Jeton Apple introuvable.");
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "apple",
    token: credential.identityToken,
  });

  if (error) throw error;
  if (!data.session) throw new Error("Session Apple introuvable.");

  const fullName = [credential.fullName?.givenName, credential.fullName?.familyName]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) {
    await supabase.auth.updateUser({
      data: {
        name: fullName,
        full_name: fullName,
      },
    });

    await supabase
      .from("profiles")
      .update({ name: fullName })
      .eq("id", data.session.user.id);
  }

  return data.session;
}

export async function signInWithGoogle(): Promise<Session> {
  return signInWithOAuthProvider("google");
}

export async function signInWithApple(): Promise<Session> {
  if (Platform.OS === "ios") {
    try {
      const available = await AppleAuthentication.isAvailableAsync();
      if (available) {
        return signInWithAppleNative();
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("annul")) {
        throw error;
      }
    }
  }

  return signInWithOAuthProvider("apple");
}
