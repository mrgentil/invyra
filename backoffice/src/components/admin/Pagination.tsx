import Link from "next/link";
import { buildQueryString } from "@/lib/pagination";

export function Pagination({
  page,
  totalPages,
  total,
  basePath,
  params,
}: {
  page: number;
  totalPages: number;
  total: number;
  basePath: string;
  params: Record<string, string | number | undefined>;
}) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-zinc-500">
        <span className="font-medium text-zinc-700">{total}</span> résultat{total > 1 ? "s" : ""} · page{" "}
        <span className="font-medium text-zinc-700">{page}</span> sur{" "}
        <span className="font-medium text-zinc-700">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <PageLink basePath={basePath} page={page - 1} disabled={page <= 1} params={params} label="←" />
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-zinc-400">
              …
            </span>
          ) : (
            <PageLink
              key={p}
              basePath={basePath}
              page={p as number}
              active={p === page}
              params={params}
              label={String(p)}
            />
          )
        )}
        <PageLink basePath={basePath} page={page + 1} disabled={page >= totalPages} params={params} label="→" />
      </div>
    </div>
  );
}

function PageLink({
  basePath,
  page,
  disabled,
  active,
  params,
  label,
}: {
  basePath: string;
  page: number;
  disabled?: boolean;
  active?: boolean;
  params: Record<string, string | number | undefined>;
  label: string;
}) {
  if (disabled || page < 1) {
    return (
      <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg text-sm text-zinc-300">
        {label}
      </span>
    );
  }

  const href = `${basePath}${buildQueryString({ ...params, page: page === 1 ? undefined : page })}`;

  return (
    <Link
      href={href}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-zinc-600 hover:bg-zinc-100"
      }`}
    >
      {label}
    </Link>
  );
}

function getPageNumbers(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}
