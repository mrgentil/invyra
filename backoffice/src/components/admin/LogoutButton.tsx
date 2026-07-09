"use client";

import { logoutAction } from "@/app/login/actions";
import { IconLogout } from "./icons";

export function LogoutButton({ variant = "sidebar" }: { variant?: "sidebar" | "header" }) {
  if (variant === "header") {
    return (
      <form action={logoutAction}>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <IconLogout className="h-4 w-4" />
          Déconnexion
        </button>
      </form>
    );
  }

  return (
    <form action={logoutAction} className="mt-3">
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
      >
        <IconLogout className="h-4 w-4" />
        Déconnexion
      </button>
    </form>
  );
}
