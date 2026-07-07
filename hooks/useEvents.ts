import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import {
  getCategories,
  getEventById,
  getEvents,
  getFeaturedEvents,
  getNearbyEvents,
  getPopularEvents,
  getTrendingEvents,
  getUpcomingEvents,
  getUserTickets,
  EventsQueryParams,
} from "@/services";

export function useCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.categories],
    queryFn: getCategories,
  });
}

export function useEvents(params?: EventsQueryParams) {
  return useQuery({
    queryKey: [QUERY_KEYS.events, params],
    queryFn: () => getEvents(params),
  });
}

export function useEvent(id?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.event, id],
    queryFn: () => getEventById(id!),
    enabled: Boolean(id),
  });
}

export function useFeaturedEvents(cityId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.events, "featured", cityId],
    queryFn: () => getFeaturedEvents(cityId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useTrendingEvents(cityId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.events, "trending", cityId],
    queryFn: () => getTrendingEvents(cityId),
  });
}

export function useUpcomingEvents(cityId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.events, "upcoming", cityId],
    queryFn: () => getUpcomingEvents(cityId),
  });
}

export function useNearbyEvents(cityId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.events, "nearby", cityId],
    queryFn: () => getNearbyEvents(cityId),
  });
}

export function usePopularEvents(cityId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.events, "popular", cityId],
    queryFn: () => getPopularEvents(cityId),
  });
}

export function useUserTickets(userId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.tickets, userId],
    queryFn: () => getUserTickets(userId),
  });
}
