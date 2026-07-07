import { getPublicSupabase } from "@/lib/supabase";
import { Category } from "@/types";
import { mapCategory } from "./mappers";
import { runPublicSupabaseQuery } from "./query";

export async function fetchCategoriesFromSupabase(): Promise<Category[]> {
  return runPublicSupabaseQuery(async () => {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data.map(mapCategory);
  });
}
