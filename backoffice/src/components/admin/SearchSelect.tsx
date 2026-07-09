"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type SearchSelectOption = { value: string; label: string };

export function SearchSelect({
  name,
  label,
  placeholder,
  options,
  defaultValue,
  required,
  allowCustomValue,
}: {
  name: string;
  label: string;
  placeholder?: string;
  options: SearchSelectOption[];
  defaultValue?: string;
  required?: boolean;
  allowCustomValue?: boolean;
}) {
  const initial = useMemo(() => {
    const fromValue = options.find((o) => o.value === defaultValue)?.label;
    const fromLabel = options.find((o) => o.label === defaultValue)?.label;
    return fromValue ?? fromLabel ?? defaultValue ?? "";
  }, [defaultValue, options]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(initial);
  const [value, setValue] = useState(defaultValue ?? "");
  const rootRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 40);
    return options
      .filter((o) => o.label.toLowerCase().includes(q))
      .slice(0, 40);
  }, [options, query]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!allowCustomValue) return;
    // Custom values: store raw query as value when not matching.
    const exact = options.find((o) => o.label.toLowerCase() === query.trim().toLowerCase());
    setValue(exact?.value ?? query.trim());
  }, [allowCustomValue, options, query]);

  return (
    <div ref={rootRef} className="relative">
      <label className="text-sm font-medium text-zinc-800">{label}</label>
      <input type="hidden" name={name} value={value} />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        required={required && !value}
        className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {open ? (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-zinc-200 bg-white p-1 shadow-lg">
          {filtered.length ? (
            filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setValue(opt.value);
                  setQuery(opt.label);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
              >
                <span className="truncate">{opt.label}</span>
                <span className="ml-3 shrink-0 font-mono text-[11px] text-zinc-400">{opt.value}</span>
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-zinc-500">Aucun résultat</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

