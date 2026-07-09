"use client";

import { useMemo } from "react";

export function AddressMapPreview({
  address,
  city,
}: {
  address?: string;
  city?: string;
}) {
  const query = useMemo(() => {
    const parts = [address, city, "RDC"].filter(Boolean).join(", ");
    return parts.trim();
  }, [address, city]);

  const src = useMemo(() => {
    if (!query) return "";
    const q = encodeURIComponent(query);
    return `https://www.google.com/maps?q=${q}&output=embed`;
  }, [query]);

  if (!src) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
        <p className="text-sm font-medium text-zinc-800">Aperçu carte</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
        >
          Ouvrir →
        </a>
      </div>
      <iframe
        title="Map preview"
        src={src}
        className="h-64 w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

