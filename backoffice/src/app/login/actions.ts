"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, createSessionToken, verifyCredentials } from "@/lib/auth";

export async function loginAction(_prev: { error?: string }, formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Veuillez saisir votre identifiant et mot de passe." };
  }

  if (!verifyCredentials(username, password)) {
    return { error: "Identifiant ou mot de passe incorrect." };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(safeNextPath(String(formData.get("next") ?? "/")));
}

function safeNextPath(path: string) {
  if (path.startsWith("/") && !path.startsWith("//") && path !== "/login") return path;
  return "/";
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}
