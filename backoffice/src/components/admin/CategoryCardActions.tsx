"use client";

import Link from "next/link";
import { deleteCategory } from "@/app/(admin)/categories/actions";
import { CopyTextButton } from "./CopyTextButton";
import { IconPencil, IconTrash } from "./icons";

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition hover:opacity-90";

export function CategoryCardActions({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <CopyTextButton value={id} label="Copier ID" icon="id" />
      <Link
        href={`/categories/${encodeURIComponent(id)}`}
        title="Modifier"
        aria-label="Modifier"
        className={`${iconBtn} border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100`}
      >
        <IconPencil className="h-4 w-4" />
      </Link>
      <form
        action={deleteCategory}
        onSubmit={(e) => {
          const ok = window.confirm(`Supprimer la catégorie « ${name} » ?`);
          if (!ok) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          title="Supprimer"
          aria-label="Supprimer"
          className={`${iconBtn} border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
        >
          <IconTrash className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
