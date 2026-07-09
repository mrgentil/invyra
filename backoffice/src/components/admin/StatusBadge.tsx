const statusStyles: Record<string, string> = {
  upcoming: "bg-sky-50 text-sky-700 ring-sky-600/20",
  ongoing: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  completed: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  failed: "bg-red-50 text-red-700 ring-red-600/20",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

export function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? "bg-zinc-100 text-zinc-600 ring-zinc-500/20";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}>
      {status}
    </span>
  );
}
