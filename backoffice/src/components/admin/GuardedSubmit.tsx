"use client";

import { useFormStatus } from "react-dom";
import { useUploadForm } from "./UploadFormContext";

export function GuardedSubmit({
  children,
  className,
  pendingLabel,
}: {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  const { isUploading } = useUploadForm();
  const disabled = pending || isUploading;

  return (
    <button type="submit" disabled={disabled} className={className}>
      {isUploading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Téléversement…
        </span>
      ) : pending ? (
        (pendingLabel ?? "Enregistrement…")
      ) : (
        children
      )}
    </button>
  );
}
