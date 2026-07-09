"use client";

import { deleteCategory } from "@/app/(admin)/categories/actions";

export function DeleteCategoryForm({ id, name }: { id: string; name: string }) {
  return (
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
        className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Supprimer
      </button>
    </form>
  );
}
