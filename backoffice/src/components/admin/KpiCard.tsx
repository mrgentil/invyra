import type { ReactNode } from "react";

export function KpiCard({
  label,
  value,
  hint,
  icon,
  accent = "indigo",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: ReactNode;
  accent?: "indigo" | "emerald" | "amber" | "violet" | "rose" | "sky";
}) {
  const accents = {
    indigo: "from-indigo-500 to-violet-600 shadow-indigo-500/20",
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/20",
    amber: "from-amber-500 to-orange-600 shadow-amber-500/20",
    violet: "from-violet-500 to-purple-600 shadow-violet-500/20",
    rose: "from-rose-500 to-pink-600 shadow-rose-500/20",
    sky: "from-sky-500 to-blue-600 shadow-sky-500/20",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">{value}</p>
          {hint ? <p className="mt-1 text-xs text-zinc-400">{hint}</p> : null}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${accents[accent]}`}
        >
          {icon}
        </div>
      </div>
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-zinc-50 to-transparent opacity-0 transition group-hover:opacity-100" />
    </div>
  );
}
