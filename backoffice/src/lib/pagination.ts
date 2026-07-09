export const PAGE_SIZE = 10;

export type SearchParams = Record<string, string | string[] | undefined>;

export function getPage(searchParams: SearchParams) {
  const raw = Number(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1;
}

export function getParam(searchParams: SearchParams, key: string) {
  const value = searchParams[key];
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export function getRange(page: number, pageSize = PAGE_SIZE) {
  const from = (page - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}

export function getTotalPages(total: number, pageSize = PAGE_SIZE) {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function buildQueryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
