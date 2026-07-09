import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion — Invyra Admin",
  description: "Accédez au panneau d'administration Invyra",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[45%] overflow-hidden bg-[#0c0e14] lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" />
        </div>

        <div className="relative z-10 p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30">
              <span className="text-lg font-bold text-white">I</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Invyra</p>
              <p className="text-sm text-zinc-400">Back-office</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 p-12">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white">
            Gérez vos événements
            <br />
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              en toute simplicité
            </span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-zinc-400">
            Tableau de bord, KPIs, réservations et gestion des événements pour l&apos;application mobile Invyra.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {["Dashboard", "Événements", "Utilisateurs", "Réservations"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 p-12 text-xs text-zinc-600">© {new Date().getFullYear()} Invyra</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-[#f4f5f7] px-6 py-12">
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
            I
          </div>
          <div>
            <p className="font-semibold text-zinc-900">Invyra Admin</p>
            <p className="text-xs text-zinc-500">Connexion sécurisée</p>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-200/50">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Bon retour</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Connectez-vous pour accéder au panneau d&apos;administration.
              </p>
            </div>
            <LoginForm next={next} />
          </div>
          <p className="mt-6 text-center text-xs text-zinc-400">
            Accès réservé aux administrateurs Invyra.
          </p>
        </div>
      </div>
    </div>
  );
}
