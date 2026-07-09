"use client";

import { useState } from "react";
import { IconCheck, IconCopy, IconId, IconPhone } from "./icons";

async function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

const iconButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40";

export function CopyTextButton({
  value,
  label,
  icon = "copy",
  className,
  disabled,
}: {
  value: string;
  label: string;
  icon?: "copy" | "id" | "phone";
  className?: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const Icon = copied ? IconCheck : icon === "id" ? IconId : icon === "phone" ? IconPhone : IconCopy;

  return (
    <button
      type="button"
      disabled={disabled || !value}
      onClick={async () => {
        try {
          await copyToClipboard(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 900);
        } catch {
          // ignore
        }
      }}
      className={className ?? `${iconButtonClass} ${copied ? "border-emerald-200 bg-emerald-50 text-emerald-600" : ""}`}
      aria-label={label}
      title={copied ? "Copié !" : label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
