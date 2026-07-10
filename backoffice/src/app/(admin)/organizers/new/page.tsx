import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { createOrganizer } from "./actions";

export default function NewOrganizerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nouvel organisateur"
        description="Ajouter un organisateur d'événements."
        back={{ href: "/organizers", label: "Retour aux organisateurs" }}
      />

      <div className="max-w-xl rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <form action={createOrganizer} className="space-y-4">
          <Field name="name" label="Nom" placeholder="Live Nation RDC" required />
          <Field name="id" label="Identifiant (auto)" placeholder="auto si vide" hint="Ex: live-nation-rdc" />
          <Field name="email" label="Email" placeholder="contact@example.com" type="email" />
          <Field name="phone" label="Téléphone" placeholder="+243..." />
          <Field name="avatar_url" label="Avatar (URL)" placeholder="https://..." />
          <div>
            <label className="text-sm font-medium text-zinc-800">Bio</label>
            <textarea
              name="bio"
              rows={4}
              placeholder="Présentation courte..."
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="checkbox" name="verified" className="rounded border-zinc-300" />
            Marquer comme vérifié
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/organizers"
              className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            >
              Annuler
            </Link>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  placeholder,
  hint,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  hint?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-800">{label}</label>
      {hint ? <p className="mt-0.5 text-xs text-zinc-500">{hint}</p> : null}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
