"use client";

import Link from "next/link";
import { deleteOrganizer, toggleOrganizerVerified } from "@/app/(admin)/organizers/actions";
import { CopyTextButton } from "./CopyTextButton";
import { IconBadgeCheck, IconPencil, IconTrash } from "./icons";

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-40";

export function OrganizerRowActions({
  id,
  name,
  email,
  phone,
  verified,
}: {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  verified: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <CopyTextButton value={id} label="Copier ID" icon="id" />
      <CopyTextButton value={email ?? ""} label="Copier email" icon="mail" disabled={!email} />
      <CopyTextButton value={phone ?? ""} label="Copier téléphone" icon="phone" disabled={!phone} />

      <form action={toggleOrganizerVerified}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="verified" value={verified ? "false" : "true"} />
        <button
          type="submit"
          title={verified ? "Retirer vérification" : "Marquer vérifié"}
          aria-label={verified ? "Retirer vérification" : "Marquer vérifié"}
          className={`${iconBtn} ${
            verified
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "border-zinc-200 bg-white text-zinc-500 hover:border-emerald-200 hover:text-emerald-600"
          }`}
        >
          <IconBadgeCheck className="h-4 w-4" />
        </button>
      </form>

      <Link
        href={`/organizers/${encodeURIComponent(id)}`}
        title="Modifier"
        aria-label="Modifier"
        className={`${iconBtn} border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100`}
      >
        <IconPencil className="h-4 w-4" />
      </Link>

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
