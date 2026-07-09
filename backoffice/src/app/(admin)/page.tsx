import Link from "next/link";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  IconBookings,
  IconEvents,
  IconTrendUp,
  IconUsers,
} from "@/components/admin/icons";
import { formatCurrency, formatDate, getChartData, getDashboardStats, getEventTitle } from "@/lib/stats";

export default async function DashboardPage() {
  const [stats, charts] = await Promise.all([getDashboardStats(), getChartData()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Vue d&apos;ensemble de la plateforme Invyra en temps réel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Événements"
          value={stats.totalEvents}
          hint={`${stats.upcomingEvents} à venir · ${stats.featuredEvents} à la une`}
          accent="indigo"
          icon={<IconEvents className="h-5 w-5" />}
        />
        <KpiCard
          label="Utilisateurs"
          value={stats.totalUsers}
          hint={`${stats.totalFavorites} favoris enregistrés`}
          accent="violet"
          icon={<IconUsers className="h-5 w-5" />}
        />
        <KpiCard
          label="Réservations"
          value={stats.totalBookings}
          hint={`${stats.paidBookings} payées · ${stats.totalTickets} billets`}
          accent="emerald"
          icon={<IconBookings className="h-5 w-5" />}
        />
        <KpiCard
          label="Revenus"
          value={formatCurrency(stats.totalRevenue)}
          hint="Paiements complétés"
          accent="amber"
          icon={<IconTrendUp className="h-5 w-5" />}
        />
      </div>

      <DashboardCharts data={charts} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Événements récents</h2>
              <p className="text-xs text-zinc-500">Derniers ajouts sur la plateforme</p>
            </div>
            <Link href="/events" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
              Voir tout →
            </Link>
          </div>
          <div className="divide-y divide-zinc-100">
            {stats.recentEvents.length ? (
              stats.recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-zinc-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-900">{event.title}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {event.city} · {formatDate(event.event_date)}
                    </p>
                  </div>
                  <StatusBadge status={event.status} />
                </Link>
              ))
            ) : (
              <p className="px-6 py-10 text-center text-sm text-zinc-500">Aucun événement pour le moment.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Répartition par statut</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(stats.eventsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between gap-3">
                <StatusBadge status={status} />
                <span className="text-sm font-semibold text-zinc-700">{count}</span>
              </div>
            ))}
            {!Object.keys(stats.eventsByStatus).length ? (
              <p className="text-sm text-zinc-500">Aucune donnée</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Réservations récentes</h2>
            <p className="text-xs text-zinc-500">Dernières transactions</p>
          </div>
          <Link href="/bookings" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
            Voir tout →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-6 py-3">Événement</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Montant</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {stats.recentBookings.length ? (
                stats.recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      {getEventTitle(booking.events)}
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{booking.guest_name ?? "Utilisateur"}</td>
                    <td className="px-6 py-4 font-medium text-zinc-800">
                      {formatCurrency(Number(booking.total_amount))}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{formatDate(booking.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-zinc-500">
                    Aucune réservation pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
