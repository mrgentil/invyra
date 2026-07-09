import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { createCategory } from "./actions";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nouvelle catégorie"
        description="Créer une catégorie d'événements."
        back={{ href: "/categories", label: "Retour aux catégories" }}
      />

      <div className="max-w-xl rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <form action={createCategory} className="space-y-4">
          <Field name="name" label="Nom" placeholder="Musique" required />
          <Field name="id" label="Identifiant (auto)" placeholder="auto si vide" hint="Ex: musique, sport, culture" />
          <Field name="icon" label="Icône" placeholder="calendar" defaultValue="calendar" hint="Nom d'icône utilisé dans l'app" />
          <div>
            <label className="text-sm font-medium text-zinc-800">Couleur</label>
            <input
              name="color"
              type="color"
              defaultValue="#3B82F6"
              className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-zinc-200 bg-white"
            />
          </div>
          <Field name="image_url" label="Image (URL)" placeholder="https://..." />

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/categories"
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
  defaultValue,
  hint,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-800">{label}</label>
      {hint ? <p className="mt-0.5 text-xs text-zinc-500">{hint}</p> : null}
      <input
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
