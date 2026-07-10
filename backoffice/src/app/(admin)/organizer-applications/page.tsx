import Link from "next/link";
import { EmptyState } from "@/components/admin/EmptyState";
import { ListFilters, ListMeta } from "@/components/admin/ListFilters";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { formatDate } from "@/lib/stats";
import { getPage, getParam, getRange, getTotalPages, type SearchParams } from "@/lib/pagination";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { approveOrganizerApplication, rejectOrganizerApplication, resendApplicationNotification } from "./actions";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-600/20",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  approved: "Approuvée",
  rejected: "Refusée",
};

export default async function OrganizerApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = getParam(params, "q");
  const status = getParam(params, "status") || "pending";
  const page = getPage(params);
  const { from, to } = getRange(page);

  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("organizer_applications")
    .select("id,business_name,email,phone,city,bio,status,rejection_reason,organizer_id,created_at,reviewed_at", {
      count: "exact",
    });

  if (q) {
    query = query.or(
      `business_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,city.ilike.%${q}%`
    );
  }
  if (status && status !== "all") query = query.eq("status", status);

  const { data: applications, error, count } = await query
    .order("created_at", { ascending: false })
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
  const filterValues = { q, status };
  const hasFilters = Boolean(q || status !== "pending");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Demandes organisateurs"
        description="Validez les demandes envoyées depuis l'application mobile."
        back={{ href: "/", label: "Retour au tableau de bord" }}
      />

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <ListFilters
          basePath="/organizer-applications"
          values={filterValues}
          fields={[
            { type: "search", name: "q", placeholder: "Structure, email, ville…" },
            {
              type: "select",
              name: "status",
              label: "Statut",
              options: [
                { value: "pending", label: "En attente" },
                { value: "approved", label: "Approuvées" },
                { value: "rejected", label: "Refusées" },
                { value: "all", label: "Toutes" },
              ],
            },
          ]}
        />
        <ListMeta total={total} filtered={hasFilters} />

        {applications?.length ? (
          <div className="divide-y divide-zinc-100">
            {applications.map((app) => (
              <div key={app.id} className="space-y-4 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-zinc-900">{app.business_name}</h3>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[app.status] ?? ""}`}
                      >
                        {statusLabels[app.status] ?? app.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">
                      {app.email ?? "—"} · {app.phone ?? "—"} · {app.city ?? "—"}
                    </p>
                    {app.bio ? <p className="mt-2 text-sm text-zinc-500">{app.bio}</p> : null}
                    <p className="mt-2 text-xs text-zinc-400">
                      Demandé le {formatDate(app.created_at)}
                      {app.reviewed_at ? ` · Traité le ${formatDate(app.reviewed_at)}` : ""}
                    </p>
                    {app.rejection_reason ? (
                      <p className="mt-2 text-sm text-red-700">Motif : {app.rejection_reason}</p>
                    ) : null}
                    {app.organizer_id ? (
                      <p className="mt-2 text-sm">
                        <Link href={`/organizers/${encodeURIComponent(app.organizer_id)}`} className="font-medium text-indigo-600 hover:underline">
                          Voir l&apos;organisateur →
                        </Link>
                      </p>
                    ) : null}
                  </div>

                  {app.status === "pending" ? (
                    <div className="flex flex-col gap-2 sm:min-w-[220px]">
                      <form action={resendApplicationNotification}>
                        <input type="hidden" name="application_id" value={app.id} />
                        <button
                          type="submit"
                          className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                        >
                          Renvoyer email / WhatsApp
                        </button>
                      </form>
                      <form action={approveOrganizerApplication}>
                        <input type="hidden" name="application_id" value={app.id} />
                        <button
                          type="submit"
                          className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
                        >
                          Approuver
                        </button>
                      </form>
                      <form action={rejectOrganizerApplication} className="space-y-2">
                        <input type="hidden" name="application_id" value={app.id} />
                        <input
                          name="rejection_reason"
                          placeholder="Motif du refus (optionnel)"
                          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500/20"
                        />
                        <button
                          type="submit"
                          className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100"
                        >
                          Refuser
                        </button>
                      </form>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucune demande"
            description={hasFilters ? "Modifiez vos filtres." : "Les nouvelles demandes apparaîtront ici."}
          />
        )}

        <Pagination
          basePath="/organizer-applications"
          page={page}
          totalPages={totalPages}
          total={total}
          params={filterValues}
        />
      </div>
    </div>
  );
}
