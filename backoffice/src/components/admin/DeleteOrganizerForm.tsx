"use client";

import { deleteOrganizer } from "@/app/(admin)/organizers/actions";

export function DeleteOrganizerForm({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteOrganizer}
      onSubmit={(e) => {
        const ok = window.confirm(`Supprimer l'organisateur « ${name} » ?`);
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
