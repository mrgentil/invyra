import { PAGE_SIZE } from "@/constants";
import { getPublicSupabase } from "@/lib/supabase";
import { Event } from "@/types";
import { EventWithRelations } from "@/types/database";
import { mapEvent } from "./mappers";
import { runPublicSupabaseQuery } from "./query";

const EVENT_SELECT = `
  *,
  categories (*),
  organizers (*)
`;

export interface EventsQueryParams {
  category?: string;
  search?: string;
  page?: number;
  cityId?: string;
  featured?: boolean;
  trending?: boolean;
  limit?: number;
  sortBy?: "date" | "price" | "rating" | "popularity";
}

function withCityFilter<T extends { eq: (column: string, value: string) => T }>(query: T, cityId?: string) {
  if (cityId && cityId !== "all") {
    return query.eq("city_id", cityId);
  }
  return query;
}

export async function fetchEventsFromSupabase(params?: EventsQueryParams): Promise<Event[]> {
  return runPublicSupabaseQuery(async () => {
    const supabase = getPublicSupabase();
    const page = params?.page ?? 1;
    const limit = params?.limit ?? PAGE_SIZE;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("events")
      .select(EVENT_SELECT)
      .order("event_date", { ascending: true });

    query = withCityFilter(query, params?.cityId);

    if (params?.category) {
      query = query.eq("category_id", params.category);
    }
    if (params?.featured) {
      query = query.eq("featured", true);
    }
    if (params?.trending) {
      query = query.eq("trending", true);
    }
    if (params?.search) {
      const term = `%${params.search}%`;
      query = query.or(`title.ilike.${term},description.ilike.${term},city.ilike.${term},province.ilike.${term}`);
    }

    if (params?.sortBy === "price") {
      query = query.order("price", { ascending: true });
    } else if (params?.sortBy === "rating") {
      query = query.order("rating", { ascending: false });
    } else if (params?.sortBy === "popularity") {
      query = query.order("attendees", { ascending: false });
    }

    const { data, error } = await query.range(from, to);

    if (error) throw error;
    return (data as EventWithRelations[]).map(mapEvent);
  });
}

export async function fetchEventByIdFromSupabase(id: string): Promise<Event | null> {
  return runPublicSupabaseQuery(async () => {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
      .from("events")
      .select(EVENT_SELECT)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return mapEvent(data as EventWithRelations);
  });
}

export async function fetchFeaturedEventsFromSupabase(cityId?: string): Promise<Event[]> {
  return fetchEventsFromSupabase({ cityId, featured: true, limit: 5 });
}

export async function fetchTrendingEventsFromSupabase(cityId?: string): Promise<Event[]> {
  return fetchEventsFromSupabase({ cityId, trending: true, limit: 10 });
}

export async function fetchUpcomingEventsFromSupabase(cityId?: string): Promise<Event[]> {
  return fetchEventsFromSupabase({ cityId, limit: 10, sortBy: "date" });
}

export async function fetchNearbyEventsFromSupabase(cityId?: string): Promise<Event[]> {
  return runPublicSupabaseQuery(async () => {
    const supabase = getPublicSupabase();
    let query = supabase
      .from("events")
      .select(EVENT_SELECT)
      .order("distance_km", { ascending: true })
      .limit(8);

    query = withCityFilter(query, cityId);

    const { data, error } = await query;
    if (error) throw error;
    return (data as EventWithRelations[]).map(mapEvent);
  });
}

export async function fetchPopularEventsFromSupabase(cityId?: string): Promise<Event[]> {
  return fetchEventsFromSupabase({ cityId, limit: 10, sortBy: "popularity" });
}
