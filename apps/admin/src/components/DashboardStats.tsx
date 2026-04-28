"use client";

import { useEffect, useState } from "react";
import { collectMojibakeWarnings, FIRESTORE_COLLECTIONS, seedContentBundle } from "@sukut/shared";
import { listDocuments, type AdminDocument } from "@/lib/firebase/firestore";
import { StatCard } from "@/components/StatCard";
import { mapFirebaseError } from "@/lib/firebase/errors";

interface DashboardState {
  source: "seed" | "firestore";
  duas: AdminDocument[];
  zikrs: AdminDocument[];
  dailyContents: AdminDocument[];
  events: AdminDocument[];
  badges: AdminDocument[];
  categories: AdminDocument[];
  planTemplates: AdminDocument[];
  sources: AdminDocument[];
}

const seedState: DashboardState = {
  source: "seed",
  duas: seedContentBundle.duas as unknown as AdminDocument[],
  zikrs: seedContentBundle.zikrs as unknown as AdminDocument[],
  dailyContents: seedContentBundle.dailyContents as unknown as AdminDocument[],
  events: seedContentBundle.events as unknown as AdminDocument[],
  badges: seedContentBundle.badges as unknown as AdminDocument[],
  categories: seedContentBundle.categories as unknown as AdminDocument[],
  planTemplates: seedContentBundle.planTemplates as unknown as AdminDocument[],
  sources: seedContentBundle.sources as unknown as AdminDocument[]
};

export function DashboardStats() {
  const [state, setState] = useState<DashboardState>(seedState);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      listDocuments(FIRESTORE_COLLECTIONS.duas),
      listDocuments(FIRESTORE_COLLECTIONS.zikrs),
      listDocuments(FIRESTORE_COLLECTIONS.dailyContents),
      listDocuments(FIRESTORE_COLLECTIONS.events),
      listDocuments(FIRESTORE_COLLECTIONS.badges),
      listDocuments(FIRESTORE_COLLECTIONS.categories),
      listDocuments(FIRESTORE_COLLECTIONS.planTemplates),
      listDocuments(FIRESTORE_COLLECTIONS.sources)
    ])
      .then(([duas, zikrs, dailyContents, events, badges, categories, planTemplates, sources]) => {
        const hasRemote = [duas, zikrs, dailyContents, events, badges, categories, planTemplates, sources].some((items) => items.length > 0);
        if (hasRemote) {
          setState({ source: "firestore", duas, zikrs, dailyContents, events, badges, categories, planTemplates, sources });
        }
      })
      .catch((error) => {
        setMessage(mapFirebaseError(error, "Dashboard verileri okunamadı; seed özet gösteriliyor."));
        setState(seedState);
      });
  }, []);

  const activeCount = (items: AdminDocument[]) => items.filter((item) => item.isActive !== false).length;
  const allContent = [...state.duas, ...state.zikrs, ...state.dailyContents, ...state.events, ...state.badges, ...state.categories, ...state.planTemplates, ...state.sources];
  const recent = allContent
    .sort((a, b) => String(b.updatedAt ?? "").localeCompare(String(a.updatedAt ?? "")))
    .slice(0, 5);
  const passiveCount = allContent.filter((item) => item.isActive === false).length;
  const missingSourceCount = [...state.duas, ...state.zikrs, ...state.events].filter((item) => !String(item.source ?? "").trim()).length;
  const mojibakeCount = allContent.filter((item) => Object.keys(collectMojibakeWarnings(item)).length > 0).length;
  const premiumCount = allContent.filter((item) => item.isPremium === true).length;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Aktif dua" value={activeCount(state.duas)} helper={state.source === "firestore" ? "Firestore" : "Seed içerik"} />
        <StatCard label="Zikir" value={activeCount(state.zikrs)} helper="Önerilen hedef sayılarıyla" />
        <StatCard label="Günlük içerik" value={activeCount(state.dailyContents)} helper="Tarih bazlı içerikler" />
        <StatCard label="Özel gün" value={activeCount(state.events)} helper="Cuma, Kandil, Ramazan, Bayram" />
      </div>
      {message ? <div className="rounded-panel border border-amber bg-amber/15 px-4 py-3 text-sm font-semibold text-ink">{message}</div> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Pasif içerik" value={passiveCount} helper="Arşiv veya yayın dışı kayıt" />
        <StatCard label="Kaynak eksiği" value={missingSourceCount} helper="Yayın öncesi tamamlanmalı" />
        <StatCard label="Karakter uyarısı" value={mojibakeCount} helper="Mojibake kontrol sonucu" />
        <StatCard label="Plus içerik" value={premiumCount} helper="Premium olarak işaretlenen kayıt" />
        <StatCard label="Plan şablonu" value={activeCount(state.planTemplates)} helper="7/14/30 günlük programlar" />
        <StatCard label="Kaynak" value={activeCount(state.sources)} helper="Ayet, hadis ve kurum referansları" />
      </div>
      <section className="rounded-panel border border-sand/60 bg-white/82 p-5 shadow-soft">
        <h2 className="text-lg font-bold text-night">Son güncellenenler</h2>
        <div className="mt-3 divide-y divide-sand/50">
          {recent.map((item) => (
            <div key={item.id} className="py-3">
              <p className="font-semibold text-ink">{String(item.title ?? item.name ?? item.id)}</p>
              <p className="text-xs text-ink/50">{String(item.updatedAt ?? "Seed içerik")}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
