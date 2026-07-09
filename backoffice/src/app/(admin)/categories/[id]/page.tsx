import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteCategoryForm } from "@/components/admin/DeleteCategoryForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { updateCategory } from "../actions";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data: category, error } = await supabase
    .from("categories")
    .select("id,name,icon,color,image_url,event_count")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900">
        Erreur Supabase: {error.message}
      </div>
    );
  }

  if (!category) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Modifier la catégorie"
        description={category.name}
        back={{ href: "/categories", label: "Retour aux catégories" }}
      />

      <div className="max-w-xl rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <form action={updateCategory} className="space-y-4">
          <input type="hidden" name="original_id" value={category.id} />

          <div>
            <label className="text-sm font-medium text-zinc-800">Identifiant</label>
            <input
              value={category.id}
              disabled
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500"
            />
          </div>

          <Field name="name" label="Nom" defaultValue={category.name} required />
          <Field name="icon" label="Icône" defaultValue={category.icon} />
          <div>
            <label className="text-sm font-medium text-zinc-800">Couleur</label>
            <input
              name="color"
              type="color"
              defaultValue={category.color}
              className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-zinc-200 bg-white"
            />
          </div>
          <Field name="image_url" label="Image (URL)" defaultValue={category.image_url ?? ""} />

          <p className="text-sm text-zinc-500">
            {category.event_count} événement{category.event_count > 1 ? "s" : ""} lié{category.event_count > 1 ? "s" : ""}
          </p>

          <div className="flex items-center justify-between gap-3 pt-2">
            <DeleteCategoryForm id={category.id} name={category.name} />
            <div className="flex gap-3">
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
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-800">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
