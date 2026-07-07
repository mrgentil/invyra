import { isSupabaseConfigured } from "@/lib/supabase";
import { Category, Event, Ticket } from "@/types";
import * as mock from "@/services/mockData";
import * as supabaseCategories from "@/services/supabase/categories";
import * as supabaseEvents from "@/services/supabase/events";
import * as supabaseTickets from "@/services/supabase/tickets";

export type EventsQueryParams = supabaseEvents.EventsQueryParams;

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    return supabaseCategories.fetchCategoriesFromSupabase();
  }
  return mock.categories;
}

export async function getEvents(params?: EventsQueryParams): Promise<Event[]> {
  if (isSupabaseConfigured()) {
    return withCityFallback(params?.cityId, (cityId) =>
      supabaseEvents.fetchEventsFromSupabase({ ...params, cityId })
    );
  }
  return mock.getEvents(params);
}

export async function getEventById(id: string): Promise<Event | undefined> {
  if (isSupabaseConfigured()) {
    const event = await supabaseEvents.fetchEventByIdFromSupabase(id);
    return event ?? undefined;
  }
  return mock.getEventById(id);
}

async function withCityFallback(
  cityId: string | undefined,
  fetcher: (city?: string) => Promise<Event[]>
): Promise<Event[]> {
  const events = await fetcher(cityId);
  if (events.length > 0 || !cityId || cityId === "all") {
    return events;
  }
  return fetcher(undefined);
}

export async function getFeaturedEvents(cityId?: string): Promise<Event[]> {
  if (isSupabaseConfigured()) {
    return withCityFallback(cityId, supabaseEvents.fetchFeaturedEventsFromSupabase);
  }
  return mock.getFeaturedEvents(cityId);
}

export async function getTrendingEvents(cityId?: string): Promise<Event[]> {
  if (isSupabaseConfigured()) {
    return withCityFallback(cityId, supabaseEvents.fetchTrendingEventsFromSupabase);
  }
  return mock.getTrendingEvents(cityId);
}

export async function getUpcomingEvents(cityId?: string): Promise<Event[]> {
  if (isSupabaseConfigured()) {
    return withCityFallback(cityId, supabaseEvents.fetchUpcomingEventsFromSupabase);
  }
  return mock.getUpcomingEvents(cityId);
}

export async function getNearbyEvents(cityId?: string): Promise<Event[]> {
  if (isSupabaseConfigured()) {
    return withCityFallback(cityId, supabaseEvents.fetchNearbyEventsFromSupabase);
  }
  return mock.getNearbyEvents(cityId);
}

export async function getPopularEvents(cityId?: string): Promise<Event[]> {
  if (isSupabaseConfigured()) {
    return withCityFallback(cityId, supabaseEvents.fetchPopularEventsFromSupabase);
  }
  return mock.getPopularEvents(cityId);
}

export async function getUserTickets(userId?: string): Promise<Ticket[]> {
  if (isSupabaseConfigured()) {
    if (!userId) return [];
    return supabaseTickets.fetchUserTicketsFromSupabase(userId);
  }
  return mock.getUserTickets();
}

export { mock as mockData };
