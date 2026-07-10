import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteOrganizerForm } from "@/components/admin/DeleteOrganizerForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { updateOrganizer } from "../actions";

export default async function EditOrganizerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data: organizer, error } = await supabase
    .from("organizers")
    .select("id,name,email,phone,bio,avatar_url,rating,event_count,followers,verified")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900">
        Erreur Supabase: {error.message}
      </div>
    );
  }

  if (!organizer) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Modifier l'organisateur"
        description={organizer.name}
        back={{ href: "/organizers", label: "Retour aux organisateurs" }}
      />

      <div className="max-w-xl rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <form action={updateOrganizer} className="space-y-4">
          <input type="hidden" name="original_id" value={organizer.id} />

          <div>
            <label className="text-sm font-medium text-zinc-800">Identifiant</label>
            <input
              value={organizer.id}
              disabled
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500"
            />
          </div>

          <Field name="name" label="Nom" defaultValue={organizer.name} required />
          <Field name="email" label="Email" defaultValue={organizer.email ?? ""} type="email" />
          <Field name="phone" label="Téléphone" defaultValue={organizer.phone ?? ""} />
          <Field name="avatar_url" label="Avatar (URL)" defaultValue={organizer.avatar_url ?? ""} />
          <div>
            <label className="text-sm font-medium text-zinc-800">Bio</label>
            <textarea
              name="bio"
              rows={4}
              defaultValue={organizer.bio ?? ""}
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              name="verified"
              defaultChecked={organizer.verified}
              className="rounded border-zinc-300"
            />
            Organisateur vérifié
          </label>

          <div className="grid grid-cols-3 gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center text-sm">
            <div>
              <p className="text-xs text-zinc-500">Événements</p>
              <p className="font-semibold text-zinc-900">{organizer.event_count}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Note</p>
              <p className="font-semibold text-amber-600">★ {organizer.rating}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Abonnés</p>
              <p className="font-semibold text-zinc-900">{organizer.followers.toLocaleString("fr-FR")}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <DeleteOrganizerForm id={organizer.id} name={organizer.name} />
            <div className="flex gap-3">
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
                Enregistrer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-800">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
