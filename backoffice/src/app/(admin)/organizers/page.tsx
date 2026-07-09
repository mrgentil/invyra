import { EmptyState } from "@/components/admin/EmptyState";
import { ListFilters, ListMeta } from "@/components/admin/ListFilters";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { getPage, getParam, getRange, getTotalPages, type SearchParams } from "@/lib/pagination";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export default async function OrganizersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = getParam(params, "q");
  const verified = getParam(params, "verified");
  const sort = getParam(params, "sort") || "events";
  const page = getPage(params);
  const { from, to } = getRange(page);

  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("organizers")
    .select("id,name,email,phone,rating,event_count,followers,verified,created_at", { count: "exact" });

  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,id.ilike.%${q}%`);
  if (verified === "true") query = query.eq("verified", true);
  if (verified === "false") query = query.eq("verified", false);

  const orderColumn = sort === "followers" ? "followers" : sort === "rating" ? "rating" : "event_count";

  const { data: organizers, error, count } = await query
    .order(orderColumn, { ascending: false })
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
  const filterValues = { q, verified, sort };
  const hasFilters = Boolean(q || verified || sort !== "events");

  return (
    <div className="space-y-6">
      <PageHeader title="Organisateurs" description="Organisateurs d'événements sur la plateforme." />

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <ListFilters
          basePath="/organizers"
          values={filterValues}
          fields={[
            { type: "search", name: "q", placeholder: "Nom, email ou ID…" },
            {
              type: "select",
              name: "verified",
              label: "Vérification",
              options: [
                { value: "", label: "Tous" },
                { value: "true", label: "Vérifiés" },
                { value: "false", label: "Non vérifiés" },
              ],
            },
            {
              type: "select",
              name: "sort",
              label: "Tri",
              options: [
                { value: "events", label: "Plus d'événements" },
                { value: "followers", label: "Plus d'abonnés" },
                { value: "rating", label: "Meilleure note" },
              ],
            },
          ]}
        />
        <ListMeta total={total} filtered={hasFilters} />

        {organizers?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-6 py-3">Organisateur</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Événements</th>
                  <th className="px-6 py-3">Note</th>
                  <th className="px-6 py-3">Abonnés</th>
                  <th className="px-6 py-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {organizers.map((org) => (
                  <tr key={org.id} className="transition hover:bg-zinc-50/80">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                          {org.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">{org.name}</p>
                          <p className="font-mono text-xs text-zinc-400">{org.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-zinc-800">{org.email ?? "—"}</p>
                      <p className="text-xs text-zinc-500">{org.phone ?? ""}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                        {org.event_count}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 font-medium text-amber-600">
                        ★ {org.rating}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{org.followers.toLocaleString("fr-FR")}</td>
                    <td className="px-6 py-4">
                      {org.verified ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Vérifié
                        </span>
                      ) : (
                        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                          Standard
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="Aucun organisateur" description="Aucun résultat pour ces filtres." />
        )}

        <Pagination
          basePath="/organizers"
          page={page}
          totalPages={totalPages}
          total={total}
          params={filterValues}
        />
      </div>
    </div>
  );
}
