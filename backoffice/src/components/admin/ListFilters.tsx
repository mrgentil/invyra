import Link from "next/link";
import { buildQueryString } from "@/lib/pagination";

export type FilterField =
  | { type: "search"; name: string; placeholder: string }
  | { type: "select"; name: string; label: string; options: { value: string; label: string }[] };

export function ListFilters({
  basePath,
  fields,
  values,
}: {
  basePath: string;
  fields: FilterField[];
  values: Record<string, string>;
}) {
  const hasFilters = Object.values(values).some(Boolean);

  return (
    <form
      method="get"
      action={basePath}
      className="flex flex-col gap-3 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 lg:flex-row lg:flex-wrap lg:items-end"
    >
      {fields.map((field) =>
        field.type === "search" ? (
          <div key={field.name} className="min-w-[200px] flex-1">
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">Recherche</label>
            <input
              name={field.name}
              defaultValue={values[field.name] ?? ""}
              placeholder={field.placeholder}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        ) : (
          <div key={field.name} className="min-w-[160px]">
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">{field.label}</label>
            <select
              name={field.name}
              defaultValue={values[field.name] ?? ""}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )
      )}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
        >
          Filtrer
        </button>
        {hasFilters ? (
          <Link
            href={basePath}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
          >
            Réinitialiser
          </Link>
        ) : null}
      </div>
    </form>
  );
}

export function ListMeta({ total, filtered }: { total: number; filtered?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-3">
      <p className="text-sm text-zinc-500">
        {filtered ? "Résultats filtrés" : "Tous les résultats"}
        <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
          {total}
        </span>
      </p>
    </div>
  );
}
