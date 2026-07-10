import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { fetchOrganizerStatus } from "@/services/supabase/organizerApplications";

export function useOrganizerStatus(userId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.organizerApplication, userId],
    queryFn: () => fetchOrganizerStatus(userId!),
    enabled: Boolean(userId),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}
