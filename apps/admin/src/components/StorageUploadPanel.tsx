"use client";

import { useState } from "react";
import { uploadAdminAsset } from "@/lib/firebase/storage";

export function StorageUploadPanel({ folder }: { folder: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setMessage("Yükleniyor.");
    try {
      const downloadUrl = await uploadAdminAsset({ file, folder });
      setUrl(downloadUrl);
      setMessage("Dosya yüklendi. URL alanını ilgili içerikte kullanabilirsin.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Dosya yüklenemedi.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="rounded-panel border border-sand/60 bg-white/82 p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-night">Storage dosyası</h3>
          <p className="text-sm text-ink/55">Ses veya görsel dosyalarını Firebase Storage'a yüklemek için hazırlık alanı.</p>
        </div>
        <input
          type="file"
          accept="image/*,audio/*"
          disabled={isUploading}
          onChange={(event) => handleFile(event.target.files?.[0])}
          className="max-w-xs rounded-panel border border-sand bg-pearl px-3 py-2 text-sm"
        />
      </div>
      {message ? <p className="mt-3 rounded-panel bg-sand/30 px-3 py-2 text-sm font-semibold text-ink">{message}</p> : null}
      {url ? (
        <div className="mt-3 space-y-2">
          <input readOnly value={url} className="w-full rounded-panel border border-sand bg-pearl px-3 py-2 text-xs text-ink" />
          {url.match(/\.(png|jpg|jpeg|webp|gif)(\?|$)/i) ? <img src={url} alt="Yüklenen medya önizlemesi" className="max-h-48 rounded-panel border border-sand object-contain" /> : null}
        </div>
      ) : null}
    </section>
  );
}
