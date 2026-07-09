const styles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  suspended: "bg-amber-50 text-amber-800 ring-amber-600/20",
};

const labels: Record<string, string> = {
  active: "Actif",
  suspended: "Suspendu",
};

export function UserStatusBadge({ status }: { status: string }) {
  const style = styles[status] ?? "bg-zinc-100 text-zinc-600 ring-zinc-500/20";
  const label = labels[status] ?? status;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}>
      {label}
    </span>
  );
}
