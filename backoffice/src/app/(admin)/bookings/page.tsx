import { EmptyState } from "@/components/admin/EmptyState";
import { ListFilters, ListMeta } from "@/components/admin/ListFilters";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCurrency, formatDate, getEventTitle } from "@/lib/stats";
import { getPage, getParam, getRange, getTotalPages, type SearchParams } from "@/lib/pagination";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = getParam(params, "q");
  const status = getParam(params, "status");
  const page = getPage(params);
  const { from, to } = getRange(page);

  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("bookings")
    .select("id,guest_name,guest_email,quantity,total_amount,status,created_at,events(title,city)", {
      count: "exact",
    });

  if (q) query = query.or(`guest_name.ilike.%${q}%,guest_email.ilike.%${q}%`);
  if (status) query = query.eq("status", status);

  const { data: bookings, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data: paidBookings } = await supabase
    .from("bookings")
    .select("total_amount")
    .eq("status", "paid");

  const totalRevenue = (paidBookings ?? []).reduce((sum, b) => sum + Number(b.total_amount), 0);

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
  const hasFilters = Boolean(q || status);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Réservations"
        description={`${total} réservation${total > 1 ? "s" : ""} · ${formatCurrency(totalRevenue)} de revenus payés`}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total", value: total, color: "from-indigo-500 to-violet-600" },
          { label: "Payées", value: (paidBookings ?? []).length, color: "from-emerald-500 to-teal-600" },
          {
            label: "En attente",
            value: (bookings ?? []).filter((b) => b.status === "pending").length,
            color: "from-amber-500 to-orange-600",
          },
          { label: "Revenus", value: formatCurrency(totalRevenue), color: "from-rose-500 to-pink-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-zinc-500">{stat.label}</p>
            <p className={`mt-1 text-2xl font-semibold bg-gradient-to-r bg-clip-text text-transparent ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <ListFilters
          basePath="/bookings"
          values={filterValues}
          fields={[
            { type: "search", name: "q", placeholder: "Nom ou email du client…" },
            {
              type: "select",
              name: "status",
              label: "Statut",
              options: [
                { value: "", label: "Tous les statuts" },
                { value: "pending", label: "En attente" },
                { value: "paid", label: "Payée" },
                { value: "cancelled", label: "Annulée" },
                { value: "failed", label: "Échouée" },
              ],
            },
          ]}
        />
        <ListMeta total={total} filtered={hasFilters} />

        {bookings?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-6 py-3">Événement</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Qté</th>
                  <th className="px-6 py-3">Montant</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="transition hover:bg-zinc-50/80">
                    <td className="px-6 py-4">
                      <p className="font-medium text-zinc-900">
                        {getEventTitle(booking.events as { title: string } | { title: string }[] | null)}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {Array.isArray(booking.events)
                          ? (booking.events[0] as { city?: string } | undefined)?.city ?? ""
                          : (booking.events as { city?: string } | null)?.city ?? ""}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-zinc-800">{booking.guest_name ?? "Utilisateur"}</p>
                      <p className="text-xs text-zinc-500">{booking.guest_email ?? ""}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-700">
                        {booking.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-900">
                      {formatCurrency(Number(booking.total_amount))}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{formatDate(booking.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Aucune réservation"
            description={hasFilters ? "Aucun résultat pour ces filtres." : "Les réservations apparaîtront ici."}
          />
        )}

        <Pagination
          basePath="/bookings"
          page={page}
          totalPages={totalPages}
          total={total}
          params={filterValues}
        />
      </div>
    </div>
  );
}
