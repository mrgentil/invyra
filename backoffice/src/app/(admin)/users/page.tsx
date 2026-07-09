import { EmptyState } from "@/components/admin/EmptyState";
import { ListFilters, ListMeta } from "@/components/admin/ListFilters";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { UserRowActions } from "@/components/admin/UserRowActions";
import { UserStatusBadge } from "@/components/admin/UserStatusBadge";
import { formatDate } from "@/lib/stats";
import { getPage, getParam, getRange, getTotalPages, type SearchParams } from "@/lib/pagination";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = getParam(params, "q");
  const city = getParam(params, "city");
  const status = getParam(params, "status");
  const page = getPage(params);
  const { from, to } = getRange(page);

  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("profiles")
    .select("id,name,phone,avatar_url,city_id,city_label,status,created_at", { count: "exact" });

  if (q) query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,city_label.ilike.%${q}%`);
  if (city) query = query.or(`city_id.eq.${city},city_label.ilike.%${city}%`);
  if (status) query = query.eq("status", status);

  const [{ data: users, error, count }, { data: allCities }] = await Promise.all([
    query.order("created_at", { ascending: false }).range(from, to),
    supabase.from("profiles").select("city_label,city_id").not("city_label", "is", null).limit(500),
  ]);

  const cityOptions = [
    ...new Set(
      (allCities ?? [])
        .map((u) => u.city_label || u.city_id)
        .filter((c): c is string => Boolean(c))
    ),
  ].sort();

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900">
        Erreur Supabase: {error.message}
      </div>
    );
  }

  const total = count ?? 0;
  const totalPages = getTotalPages(total);
  const filterValues = { q, city, status };
  const hasFilters = Boolean(q || city || status);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilisateurs"
        description="Profils inscrits sur l'application mobile."
        back={{ href: "/", label: "Retour au tableau de bord" }}
      />

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <ListFilters
          basePath="/users"
          values={filterValues}
          fields={[
            { type: "search", name: "q", placeholder: "Nom, téléphone, ville…" },
            {
              type: "select",
              name: "city",
              label: "Ville",
              options: [
                { value: "", label: "Toutes les villes" },
                ...cityOptions.map((c) => ({ value: c, label: c })),
              ],
            },
            {
              type: "select",
              name: "status",
              label: "Statut",
              options: [
                { value: "", label: "Tous les statuts" },
                { value: "active", label: "Actif" },
                { value: "suspended", label: "Suspendu" },
              ],
            },
          ]}
        />
        <ListMeta total={total} filtered={hasFilters} />

        {users?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-6 py-3">Utilisateur</th>
                  <th className="px-6 py-3">Téléphone</th>
                  <th className="px-6 py-3">Ville</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Inscription</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((user) => (
                  <tr key={user.id} className="transition hover:bg-zinc-50/80">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.avatar_url}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white shadow-sm">
                            {(user.name ?? "?").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-zinc-900">{user.name ?? "Sans nom"}</p>
                          <p className="font-mono text-xs text-zinc-400">{user.id.slice(0, 8)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{user.phone ?? "—"}</td>
                    <td className="px-6 py-4">
                      {user.city_label || user.city_id ? (
                        <span className="inline-flex rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                          {user.city_label ?? user.city_id}
                        </span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <UserStatusBadge status={user.status ?? "active"} />
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4">
                      <UserRowActions
                        userId={user.id}
                        userName={user.name ?? "Sans nom"}
                        phone={user.phone}
                        status={user.status === "suspended" ? "suspended" : "active"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Aucun utilisateur trouvé"
            description={hasFilters ? "Modifiez vos filtres de recherche." : "Les inscriptions apparaîtront ici."}
          />
        )}

        <Pagination
          basePath="/users"
          page={page}
          totalPages={totalPages}
          total={total}
          params={filterValues}
        />
      </div>
    </div>
  );
}
