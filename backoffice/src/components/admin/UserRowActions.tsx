"use client";

import { deleteUser, reactivateUser, suspendUser } from "@/app/(admin)/users/actions";
import { CopyTextButton } from "./CopyTextButton";
import { IconBan, IconReactivate, IconTrash } from "./icons";

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-40";

export function UserRowActions({
  userId,
  userName,
  phone,
  status,
}: {
  userId: string;
  userName: string;
  phone: string | null;
  status: "active" | "suspended";
}) {
  const label = userName || "cet utilisateur";

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <CopyTextButton value={userId} label="Copier ID" icon="id" />
      <CopyTextButton value={phone ?? ""} label="Copier téléphone" icon="phone" disabled={!phone} />

      {status === "active" ? (
        <form action={suspendUser}>
          <input type="hidden" name="user_id" value={userId} />
          <button
            type="submit"
            title="Suspendre"
            aria-label="Suspendre"
            className={`${iconBtn} border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100`}
          >
            <IconBan className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <form action={reactivateUser}>
          <input type="hidden" name="user_id" value={userId} />
          <button
            type="submit"
            title="Réactiver"
            aria-label="Réactiver"
            className={`${iconBtn} border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
          >
            <IconReactivate className="h-4 w-4" />
          </button>
        </form>
      )}

      <form
        action={deleteUser}
        onSubmit={(e) => {
          const ok = window.confirm(
            `Supprimer définitivement ${label} ?\n\nCette action est irréversible (compte Auth + profil).`
          );
          if (!ok) e.preventDefault();
        }}
      >
        <input type="hidden" name="user_id" value={userId} />
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
