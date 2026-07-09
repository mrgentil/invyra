import Link from "next/link";
import { EmptyState } from "@/components/admin/EmptyState";
import { ListFilters, ListMeta } from "@/components/admin/ListFilters";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/stats";
import { getPage, getParam, getRange, getTotalPages, type SearchParams } from "@/lib/pagination";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = getParam(params, "q");
  const status = getParam(params, "status");
  const city = getParam(params, "city");
  const featured = getParam(params, "featured");
  const page = getPage(params);
  const { from, to } = getRange(page);

  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("events")
    .select(
      "id,slug,title,images,city,province,event_date,featured,trending,status,price,currency,created_at",
      { count: "exact" }
    );

  if (q) query = query.or(`title.ilike.%${q}%,city.ilike.%${q}%,province.ilike.%${q}%`);
  if (status) query = query.eq("status", status);
  if (city) query = query.ilike("city", `%${city}%`);
  if (featured === "true") query = query.eq("featured", true);
  if (featured === "false") query = query.eq("featured", false);

  const { data: events, error, count } = await query
    .order("event_date", { ascending: true })
    .range(from, to);

  const { data: cities } = await supabase.from("events").select("city");
  const uniqueCities = [...new Set((cities ?? []).map((c) => c.city))].sort();

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900">
        Erreur Supabase: {error.message}
      </div>
    );
  }

  const total = count ?? 0;
  const totalPages = getTotalPages(total);
  const filterValues = { q, status, city, featured };
  const hasFilters = Boolean(q || status || city || featured);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Événements"
        description="Créer et gérer les événements affichés dans l'app mobile."
        back={{ href: "/", label: "Retour au tableau de bord" }}
        action={{ label: "Nouvel événement", href: "/events/new" }}
      />

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <ListFilters
          basePath="/events"
          values={filterValues}
          fields={[
            { type: "search", name: "q", placeholder: "Titre, ville, province…" },
            {
              type: "select",
              name: "status",
              label: "Statut",
              options: [
                { value: "", label: "Tous les statuts" },
                { value: "upcoming", label: "À venir" },
                { value: "ongoing", label: "En cours" },
                { value: "completed", label: "Terminé" },
                { value: "cancelled", label: "Annulé" },
              ],
            },
            {
              type: "select",
              name: "city",
              label: "Ville",
              options: [
                { value: "", label: "Toutes les villes" },
                ...uniqueCities.map((c) => ({ value: c, label: c })),
              ],
            },
            {
              type: "select",
              name: "featured",
              label: "À la une",
              options: [
                { value: "", label: "Tous" },
                { value: "true", label: "À la une" },
                { value: "false", label: "Standard" },
              ],
            },
          ]}
        />
        <ListMeta total={total} filtered={hasFilters} />

        {events?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-6 py-3">Événement</th>
                  <th className="px-6 py-3">Localisation</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Prix</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {events.map((e) => (
                  <tr key={e.id} className="transition hover:bg-zinc-50/80">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {e.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={e.images[0]}
                            alt=""
                            className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-zinc-200"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                            {e.title.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-zinc-900">{e.title}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {e.featured ? (
                              <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-indigo-700">
                                Une
                              </span>
                            ) : null}
                            {e.trending ? (
                              <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
                                Hot
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-zinc-800">{e.city}</p>
                      <p className="text-xs text-zinc-500">{e.province}</p>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{formatDate(e.event_date)}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-zinc-800">
                        {Number(e.price) === 0 ? "Gratuit" : `${e.price} ${e.currency}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/events/${e.slug || e.id}`}
                        className="inline-flex rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-indigo-200 hover:text-indigo-600"
                      >
                        Modifier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Aucun événement trouvé"
            description={hasFilters ? "Essayez de modifier vos filtres." : "Créez votre premier événement."}
          />
        )}

        <Pagination
          basePath="/events"
          page={page}
          totalPages={totalPages}
          total={total}
          params={filterValues}
        />
      </div>
    </div>
  );
}
