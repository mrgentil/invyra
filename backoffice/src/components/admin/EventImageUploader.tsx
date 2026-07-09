"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useUploadForm } from "./UploadFormContext";

type UploadResponse = { urls?: string[]; error?: string };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function uploadWithProgress({
  files,
  folder,
  onProgress,
}: {
  files: File[];
  folder: string;
  onProgress: (pct: number) => void;
}) {
  return new Promise<string[]>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/uploads/events");
    xhr.responseType = "json";

    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable) return;
      const pct = Math.round((evt.loaded / evt.total) * 100);
      onProgress(Math.max(0, Math.min(100, pct)));
    };

    xhr.onload = () => {
      const res = xhr.response as UploadResponse;
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(res.urls ?? []);
      } else {
        reject(new Error(res.error ?? `Échec upload (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("Erreur réseau"));

    const fd = new FormData();
    fd.set("folder", folder);
    for (const f of files) fd.append("files", f);
    xhr.send(fd);
  });
}

function FileQueue({
  files,
  uploading,
  progress,
}: {
  files: File[];
  uploading?: boolean;
  progress?: number;
}) {
  if (!files.length) return null;

  const total = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <ul className="mt-3 space-y-2 rounded-xl border border-zinc-200 bg-white p-3">
      {files.map((f) => (
        <li key={`${f.name}-${f.size}`} className="flex items-center justify-between gap-2 text-xs">
          <span className="truncate text-zinc-700">{f.name}</span>
          <span className="shrink-0 font-medium text-zinc-500">{formatBytes(f.size)}</span>
        </li>
      ))}
      <li className="flex items-center justify-between border-t border-zinc-100 pt-2 text-xs font-medium text-zinc-600">
        <span>{files.length} fichier{files.length > 1 ? "s" : ""}</span>
        <span>{formatBytes(total)}</span>
      </li>
      {uploading ? (
        <li className="pt-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${progress ?? 0}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-indigo-600">{progress ?? 0}% — envoi en cours…</p>
        </li>
      ) : null}
    </ul>
  );
}

export function EventImageUploader({
  slugOrId,
  defaultCoverUrl,
  defaultGalleryUrls,
}: {
  slugOrId: string;
  defaultCoverUrl?: string;
  defaultGalleryUrls?: string[];
}) {
  const { setIsUploading } = useUploadForm();
  const [coverUrl, setCoverUrl] = useState(defaultCoverUrl ?? "");
  const [galleryUrls, setGalleryUrls] = useState<string[]>(defaultGalleryUrls ?? []);

  const [coverPending, setCoverPending] = useState<File | null>(null);
  const [galleryPending, setGalleryPending] = useState<File[]>([]);

  const [coverPct, setCoverPct] = useState(0);
  const [galleryPct, setGalleryPct] = useState(0);
  const [busy, setBusy] = useState<"cover" | "gallery" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const folderBase = useMemo(() => `events/${slugOrId}`, [slugOrId]);
  const isBusy = busy !== null;

  useEffect(() => {
    setIsUploading(isBusy);
  }, [isBusy, setIsUploading]);

  async function onUploadCover() {
    setError(null);
    const f = coverPending ?? coverInputRef.current?.files?.[0];
    if (!f) return;
    setBusy("cover");
    setCoverPct(0);
    try {
      const [url] = await uploadWithProgress({
        files: [f],
        folder: `${folderBase}/cover`,
        onProgress: setCoverPct,
      });
      if (url) setCoverUrl(url);
      setCoverPending(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec upload cover");
    } finally {
      setBusy(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  }

  async function onUploadGallery() {
    setError(null);
    const files =
      galleryPending.length > 0
        ? galleryPending
        : galleryInputRef.current?.files
          ? Array.from(galleryInputRef.current.files)
          : [];
    if (!files.length) return;
    setBusy("gallery");
    setGalleryPct(0);
    try {
      const urls = await uploadWithProgress({
        files,
        folder: `${folderBase}/gallery`,
        onProgress: setGalleryPct,
      });
      setGalleryUrls((prev) => [...prev, ...urls]);
      setGalleryPending([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec upload galerie");
    } finally {
      setBusy(null);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  }

  function removeGalleryUrl(url: string) {
    setGalleryUrls((prev) => prev.filter((u) => u !== url));
  }

  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-zinc-200/70 bg-zinc-50/40 p-5 md:grid-cols-2">
      <input type="hidden" name="cover_url" value={coverUrl} />
      <input type="hidden" name="gallery_urls" value={galleryUrls.join("\n")} />

      <div>
        <label className="text-sm font-medium text-zinc-800">Image cover</label>
        <p className="mt-1 text-xs text-zinc-500">Couverture affichée dans la liste</p>

        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          disabled={isBusy}
          onChange={(e) => setCoverPending(e.target.files?.[0] ?? null)}
          className="mt-3 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500 disabled:opacity-60"
        />

        <FileQueue
          files={coverPending ? [coverPending] : []}
          uploading={busy === "cover"}
          progress={coverPct}
        />

        <button
          type="button"
          onClick={onUploadCover}
          disabled={isBusy || !coverPending}
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Uploader cover
        </button>

        {coverUrl ? (
          <div className="mt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl} alt="" className="h-28 w-full rounded-xl object-cover ring-1 ring-zinc-200" />
            <p className="mt-1 truncate text-[11px] text-emerald-600">Cover prête</p>
          </div>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-800">Galerie</label>
        <p className="mt-1 text-xs text-zinc-500">Plusieurs photos, upload une par une ou en lot</p>

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={isBusy}
          onChange={(e) => setGalleryPending(e.target.files ? Array.from(e.target.files) : [])}
          className="mt-3 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500 disabled:opacity-60"
        />

        <FileQueue
          files={galleryPending}
          uploading={busy === "gallery"}
          progress={galleryPct}
        />

        <button
          type="button"
          onClick={onUploadGallery}
          disabled={isBusy || galleryPending.length === 0}
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Uploader galerie
        </button>

        {galleryUrls.length ? (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {galleryUrls.map((url) => (
              <div key={url} className="group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-20 w-full rounded-xl object-cover ring-1 ring-zinc-200" />
                <button
                  type="button"
                  onClick={() => removeGalleryUrl(url)}
                  disabled={isBusy}
                  className="absolute right-1 top-1 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-40"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {isBusy ? (
        <div className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Téléversement en cours — le bouton Enregistrer est désactivé jusqu&apos;à la fin.
        </div>
      ) : null}

      {error ? (
        <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}
    </div>
  );
}
