export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function makeUniqueSlug(base: string, suffix?: string) {
  const s = slugify(base);
  if (!s) return suffix ? slugify(suffix) : "event";
  return suffix ? `${s}-${slugify(suffix)}`.slice(0, 90) : s;
}

