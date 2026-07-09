import { CategoryCardActions } from "@/components/admin/CategoryCardActions";
import { EmptyState } from "@/components/admin/EmptyState";
import { ListFilters, ListMeta } from "@/components/admin/ListFilters";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { getPage, getParam, getRange, getTotalPages, type SearchParams } from "@/lib/pagination";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = getParam(params, "q");
  const sort = getParam(params, "sort") || "events";
  const page = getPage(params);
  const { from, to } = getRange(page);

  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("categories")
    .select("id,name,icon,color,event_count,created_at", { count: "exact" });

  if (q) query = query.or(`name.ilike.%${q}%,id.ilike.%${q}%`);

  const orderColumn = sort === "name" ? "name" : "event_count";
  const ascending = sort === "name";

  const { data: categories, error, count } = await query
    .order(orderColumn, { ascending })
    .range(from, to);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900">
        Erreur Supabase: {error.message}
      </div>
    );
  }

  const total = count ?? 0;
  const totalPages = getTotalPages(total);
  const filterValues = { q, sort };
  const hasFilters = Boolean(q || sort !== "events");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catégories"
        description="Catégories d'événements disponibles dans l'app."
        back={{ href: "/", label: "Retour au tableau de bord" }}
        action={{ label: "Nouvelle catégorie", href: "/categories/new" }}
      />

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <ListFilters
          basePath="/categories"
          values={filterValues}
          fields={[
            { type: "search", name: "q", placeholder: "Nom ou ID de catégorie…" },
            {
              type: "select",
              name: "sort",
              label: "Tri",
              options: [
                { value: "events", label: "Plus d'événements" },
                { value: "name", label: "Nom (A-Z)" },
              ],
            },
          ]}
        />
        <ListMeta total={total} filtered={hasFilters} />

        {categories?.length ? (
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: cat.color }}
                />
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg transition group-hover:scale-105"
                    style={{ backgroundColor: cat.color }}
                  >
                    <span className="text-xs font-bold uppercase">{cat.icon.slice(0, 2)}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                      {cat.event_count} événement{cat.event_count > 1 ? "s" : ""}
                    </span>
                    <CategoryCardActions id={cat.id} name={cat.name} />
                  </div>
                </div>
                <h3 className="mt-4 text-base font-semibold text-zinc-900">{cat.name}</h3>
                <p className="mt-1 font-mono text-xs text-zinc-400">{cat.id}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(8, cat.event_count * 10))}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Aucune catégorie" description="Aucun résultat pour ces filtres." />
        )}

        <Pagination
          basePath="/categories"
          page={page}
          totalPages={totalPages}
          total={total}
          params={filterValues}
        />
      </div>
    </div>
  );
}
