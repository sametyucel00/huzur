"use client";

import { useEffect, useMemo, useState } from "react";
import { includesTurkishSearch } from "@sukut/shared";
import { ContentForm } from "@/components/ContentForm";
import { StorageUploadPanel } from "@/components/StorageUploadPanel";
import {
  listDocuments,
  removeDocument,
  saveDocument,
  setDocumentActiveState,
  type AdminDocument
} from "@/lib/firebase/firestore";
import type { AdminModuleConfig } from "@/utils/adminSchemas";
import {
  getReferencedCollectionNames,
  getSeedReferenceDocuments,
  type ReferenceDocuments
} from "@/utils/referenceOptions";
import { validateAdminDocument } from "@/utils/adminValidation";
import { mapFirebaseError } from "@/lib/firebase/errors";

export function ContentManager({ module }: { module: AdminModuleConfig }) {
  const [items, setItems] = useState<AdminDocument[]>([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "passive">("all");
  const [sortMode, setSortMode] = useState<"updatedAt" | "order" | "title">("updatedAt");
  const [referenceDocuments, setReferenceDocuments] = useState<ReferenceDocuments>({});
  const [editingItem, setEditingItem] = useState<AdminDocument | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function refresh() {
    setIsLoading(true);
    try {
      const docs = await listDocuments(module.collectionName);
      setItems(docs);
    } catch (error) {
      setMessage(mapFirebaseError(error, "İçerikler yüklenemedi."));
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshReferences() {
    const collectionNames = getReferencedCollectionNames(module.fields);
    const entries = await Promise.all(
      collectionNames.map(async (collectionName) => {
        const remoteDocs = await listDocuments(collectionName);
        return [collectionName, remoteDocs.length > 0 ? remoteDocs : getSeedReferenceDocuments(collectionName)] as const;
      })
    );

    setReferenceDocuments(Object.fromEntries(entries));
  }

  useEffect(() => {
    setEditingItem(null);
    Promise.all([refresh(), refreshReferences()]).catch(() => {
      const seedReferences = Object.fromEntries(
        getReferencedCollectionNames(module.fields).map((collectionName) => [collectionName, getSeedReferenceDocuments(collectionName)])
      );
      setReferenceDocuments(seedReferences);
      setMessage("Firebase config girilmediği için liste boş gösteriliyor; referans seçeneklerinde seed içerik kullanılıyor.");
    });
  }, [module.collectionName]);

  async function handleSave(doc: AdminDocument) {
    try {
      const validation = validateAdminDocument(module.collectionName, doc);
      if (!validation.ok) {
        setMessage(`Şema doğrulaması başarısız: ${validation.message}`);
        return;
      }

      await saveDocument(module.collectionName, doc);
      setMessage(editingItem ? "İçerik güncellendi." : "İçerik kaydedildi.");
      setEditingItem(null);
      await refresh();
    } catch (error) {
      setMessage(mapFirebaseError(error, "İçerik kaydedilemedi."));
    }
  }

  async function handleToggleActive(item: AdminDocument) {
    try {
      await setDocumentActiveState(module.collectionName, item.id, !Boolean(item.isActive));
      setMessage(Boolean(item.isActive) ? "İçerik pasife alındı." : "İçerik aktife alındı.");
      await refresh();
    } catch (error) {
      setMessage(mapFirebaseError(error, "Durum güncellenemedi."));
    }
  }

  async function handleDelete(item: AdminDocument) {
    const confirmed = window.confirm(`"${String(item.title ?? item.name ?? item.id)}" arşivlensin mi? Kayıt silinmez, pasife alınır.`);
    if (!confirmed) {
      return;
    }

    try {
      await removeDocument(module.collectionName, item.id);
      if (editingItem?.id === item.id) {
        setEditingItem(null);
      }
      setMessage("İçerik arşivlendi ve pasife alındı.");
      await refresh();
    } catch (error) {
      setMessage(mapFirebaseError(error, "İçerik arşivlenemedi."));
    }
  }

  const filteredItems = useMemo(
    () =>
      items
        .filter((item) => {
          const text = `${String(item.title ?? "")} ${String(item.name ?? "")} ${String(item.source ?? "")} ${String(item.citation ?? "")} ${String(item.note ?? "")} ${item.id}`;
          const matchesQuery = includesTurkishSearch(text, query);
          const active = Boolean(item.isActive);
          const matchesActive =
            activeFilter === "all" || (activeFilter === "active" && active) || (activeFilter === "passive" && !active);
          return matchesQuery && matchesActive;
        })
        .sort((a, b) => {
          if (sortMode === "order") {
            return Number(a.order ?? 0) - Number(b.order ?? 0);
          }

          if (sortMode === "title") {
            return String(a.title ?? a.name ?? a.id).localeCompare(String(b.title ?? b.name ?? b.id), "tr-TR");
          }

          return String(b.updatedAt ?? "").localeCompare(String(a.updatedAt ?? ""));
        }),
    [activeFilter, items, query, sortMode]
  );

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-bold text-amber">İçerik yönetimi</p>
        <h2 className="mt-1 text-3xl font-bold text-night">{module.title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink/65">{module.description}</p>
      </header>
      {message ? <div className="rounded-panel border border-mint bg-mint/20 px-4 py-3 text-sm font-semibold text-ink">{message}</div> : null}
      <ContentForm
        module={module}
        editingItem={editingItem}
        referenceDocuments={referenceDocuments}
        onCancelEdit={() => setEditingItem(null)}
        onSave={handleSave}
      />
      <StorageUploadPanel folder={module.collectionName} />
      <section className="rounded-panel border border-sand/60 bg-white/82 p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-night">Son içerikler</h3>
          <span className="rounded-full bg-sand/30 px-3 py-1 text-xs font-bold text-ink">{items.length} kayıt</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Başlık, ad veya ID ara"
            className="rounded-panel border border-sand bg-pearl px-3 py-2 text-sm outline-none focus:border-amber"
          />
          <select
            value={activeFilter}
            onChange={(event) => setActiveFilter(event.target.value as "all" | "active" | "passive")}
            className="rounded-panel border border-sand bg-pearl px-3 py-2 text-sm outline-none focus:border-amber"
          >
            <option value="all">Tüm durumlar</option>
            <option value="active">Aktif</option>
            <option value="passive">Pasif</option>
          </select>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as "updatedAt" | "order" | "title")}
            className="rounded-panel border border-sand bg-pearl px-3 py-2 text-sm outline-none focus:border-amber"
          >
            <option value="updatedAt">Son güncellenen</option>
            <option value="order">Sıra alanı</option>
            <option value="title">Başlık A-Z</option>
          </select>
        </div>
        <div className="mt-4 divide-y divide-sand/50">
          {isLoading ? <p className="py-5 text-sm font-semibold text-ink/55">İçerikler yükleniyor.</p> : null}
          {!isLoading && items.length === 0 ? <p className="py-5 text-sm text-ink/55">Henüz kayıt yok veya Firebase config girilmedi.</p> : null}
          {!isLoading && items.length > 0 && filteredItems.length === 0 ? (
            <p className="py-5 text-sm text-ink/55">Bu filtrelerle eşleşen içerik yok.</p>
          ) : null}
          {filteredItems.map((item) => {
            const active = Boolean(item.isActive);

            return (
              <div key={item.id} className="grid gap-3 py-3 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="font-semibold text-ink">{String(item.title ?? item.name ?? item.id)}</p>
                  <p className="text-xs text-ink/50">{String(item.updatedAt ?? "")}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={active ? "rounded-full bg-mint/35 px-3 py-1 text-xs font-bold text-ink" : "rounded-full bg-sand/30 px-3 py-1 text-xs font-bold text-ink/65"}>
                    {active ? "aktif" : "pasif"}
                  </span>
                  <button onClick={() => setEditingItem(item)} className="rounded-full bg-night px-3 py-1.5 text-xs font-bold text-pearl">
                    Düzenle
                  </button>
                  <button onClick={() => handleToggleActive(item)} className="rounded-full bg-sand/40 px-3 py-1.5 text-xs font-bold text-ink">
                    {active ? "Pasife al" : "Aktife al"}
                  </button>
                  <button onClick={() => handleDelete(item)} className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
                    Arşivle
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
