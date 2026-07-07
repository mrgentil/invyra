import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Linking from "expo-linking";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

/**
 * URL de retour OAuth vers l'app.
 * Sur téléphone : évite localhost (inutilisable sur l'appareil).
 * Expo Go → exp://IP:8081/--/auth/callback
 * Build natif → invyra://auth/callback
 */
export function getOAuthRedirectUri() {
  if (Platform.OS === "web") {
    return makeRedirectUri({
      scheme: "invyra",
      path: "auth/callback",
      preferLocalhost: true,
    });
  }

  const linkingUri = Linking.createURL("auth/callback");
  const authSessionUri = makeRedirectUri({
    scheme: "invyra",
    path: "auth/callback",
    preferLocalhost: false,
  });

  if (linkingUri.includes("localhost") || linkingUri.includes("127.0.0.1")) {
    return authSessionUri;
  }

  return linkingUri;
}

export function getOAuthSetupHint(redirectUri = getOAuthRedirectUri()) {
  return `Ajoutez cette URL dans Supabase → Authentication → URL Configuration → Redirect URLs :\n\n${redirectUri}`;
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

export async function signInWithOAuthProvider(provider: "google" | "apple"): Promise<Session> {
  const supabase = getSupabase();
  const redirectTo = getOAuthRedirectUri();

  if (redirectTo.includes("localhost") && Platform.OS !== "web") {
    throw new Error(
      `Redirect localhost détecté (${redirectTo}). Utilisez Expo Go sur le même Wi‑Fi ou un dev build. ${getOAuthSetupHint(redirectTo)}`
    );
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: provider === "apple" ? { scope: "name email" } : undefined,
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error("URL d'authentification indisponible.");

  if (Platform.OS === "android") {
    await WebBrowser.warmUpAsync();
  }

  try {
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo, {
      showInRecents: true,
      createTask: false,
    });

    if (result.type === "cancel" || result.type === "dismiss") {
      throw new Error("Connexion annulée.");
    }

    if (result.type !== "success") {
      throw new Error("Connexion interrompue.");
    }

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
