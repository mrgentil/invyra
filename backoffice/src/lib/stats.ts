import { getSupabaseAdmin } from "./supabaseAdmin";

export type DashboardStats = {
  totalEvents: number;
  upcomingEvents: number;
  featuredEvents: number;
  totalUsers: number;
  totalBookings: number;
  paidBookings: number;
  totalTickets: number;
  totalFavorites: number;
  totalRevenue: number;
  recentEvents: Array<{
    id: string;
    title: string;
    city: string;
    event_date: string;
    status: string;
  }>;
  recentBookings: Array<{
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
    guest_name: string | null;
    events: { title: string } | { title: string }[] | null;
  }>;
  eventsByStatus: Record<string, number>;
  topCities: Array<{ city: string; count: number }>;
};

export type ChartData = {
  monthlyBookings: Array<{ month: string; bookings: number; revenue: number }>;
  eventsByStatus: Array<{ name: string; value: number; status: string }>;
  topCities: Array<{ city: string; count: number }>;
  userGrowth: Array<{ month: string; users: number }>;
};

function getLast6MonthKeys() {
  const keys: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return keys;
}

function monthKeyFromDate(value: string) {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-");
  return new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(
    new Date(Number(year), Number(month) - 1)
  );
}

const STATUS_LABELS: Record<string, string> = {
  upcoming: "À venir",
  ongoing: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
};

export async function getChartData(): Promise<ChartData> {
  const supabase = getSupabaseAdmin();
  const monthKeys = getLast6MonthKeys();
  const since = new Date();
  since.setMonth(since.getMonth() - 5);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const [bookings, profiles, eventsStatus, eventsCities] = await Promise.all([
    supabase
      .from("bookings")
      .select("created_at,total_amount,status")
      .gte("created_at", since.toISOString()),
    supabase.from("profiles").select("created_at").gte("created_at", since.toISOString()),
    supabase.from("events").select("status"),
    supabase.from("events").select("city"),
  ]);

  const bookingsByMonth = new Map(monthKeys.map((k) => [k, { bookings: 0, revenue: 0 }]));
  for (const row of bookings.data ?? []) {
    const key = monthKeyFromDate(row.created_at);
    const bucket = bookingsByMonth.get(key);
    if (!bucket) continue;
    bucket.bookings += 1;
    if (row.status === "paid") bucket.revenue += Number(row.total_amount ?? 0);
  }

  const usersByMonth = new Map(monthKeys.map((k) => [k, 0]));
  for (const row of profiles.data ?? []) {
    const key = monthKeyFromDate(row.created_at);
    if (usersByMonth.has(key)) usersByMonth.set(key, (usersByMonth.get(key) ?? 0) + 1);
  }

  const statusCounts: Record<string, number> = {};
  for (const row of eventsStatus.data ?? []) {
    statusCounts[row.status] = (statusCounts[row.status] ?? 0) + 1;
  }

  const cityMap = new Map<string, number>();
  for (const row of eventsCities.data ?? []) {
    cityMap.set(row.city, (cityMap.get(row.city) ?? 0) + 1);
  }

  return {
    monthlyBookings: monthKeys.map((key) => ({
      month: monthLabel(key),
      bookings: bookingsByMonth.get(key)?.bookings ?? 0,
      revenue: bookingsByMonth.get(key)?.revenue ?? 0,
    })),
    eventsByStatus: Object.entries(statusCounts).map(([status, value]) => ({
      name: STATUS_LABELS[status] ?? status,
      value,
      status,
    })),
    topCities: [...cityMap.entries()]
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
    userGrowth: monthKeys.map((key) => ({
      month: monthLabel(key),
      users: usersByMonth.get(key) ?? 0,
    })),
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getSupabaseAdmin();

  const [
    eventsCount,
    upcomingCount,
    featuredCount,
    usersCount,
    bookingsCount,
    paidBookingsCount,
    ticketsCount,
    favoritesCount,
    paymentsData,
    recentEvents,
    recentBookings,
    allEventsStatus,
    allEventsCities,
  ] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "upcoming"),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("featured", true),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "paid"),
    supabase.from("tickets").select("*", { count: "exact", head: true }),
    supabase.from("favorites").select("*", { count: "exact", head: true }),
    supabase.from("payments").select("amount").eq("status", "completed"),
    supabase
      .from("events")
      .select("id,title,city,event_date,status")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("bookings")
      .select("id,total_amount,status,created_at,guest_name,events(title)")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("events").select("status"),
    supabase.from("events").select("city"),
  ]);

  const totalRevenue =
    paymentsData.data?.reduce((sum, row) => sum + Number(row.amount ?? 0), 0) ?? 0;

  const eventsByStatus: Record<string, number> = {};
  for (const row of allEventsStatus.data ?? []) {
    eventsByStatus[row.status] = (eventsByStatus[row.status] ?? 0) + 1;
  }

  const cityMap = new Map<string, number>();
  for (const row of allEventsCities.data ?? []) {
    cityMap.set(row.city, (cityMap.get(row.city) ?? 0) + 1);
  }
  const topCities = [...cityMap.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalEvents: eventsCount.count ?? 0,
    upcomingEvents: upcomingCount.count ?? 0,
    featuredEvents: featuredCount.count ?? 0,
    totalUsers: usersCount.count ?? 0,
    totalBookings: bookingsCount.count ?? 0,
    paidBookings: paidBookingsCount.count ?? 0,
    totalTickets: ticketsCount.count ?? 0,
    totalFavorites: favoritesCount.count ?? 0,
    totalRevenue,
    recentEvents: recentEvents.data ?? [],
    recentBookings: recentBookings.data ?? [],
    eventsByStatus,
    topCities,
  };
}

export function getEventTitle(events: { title: string } | { title: string }[] | null | undefined) {
  if (!events) return "—";
  if (Array.isArray(events)) return events[0]?.title ?? "—";
  return events.title;
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
