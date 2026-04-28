import { create } from "zustand";
import { seedContentBundle, type RemoteContentBundle } from "@sukut/shared";
import { fetchRemoteAppConfig, fetchRemoteContentBundle } from "@/services/content/contentService";
import { readContentCache, readContentCacheSnapshot, writeContentCache } from "@/storage/contentCache";

type ContentSource = "seed" | "cache" | "remote";

interface ContentState {
  bundle: RemoteContentBundle;
  isLoading: boolean;
  lastError: string | null;
  lastSyncedAt: string | null;
  source: ContentSource;
  hydrate: () => Promise<void>;
  sync: () => Promise<void>;
}

export const useContentStore = create<ContentState>((set, get) => ({
  bundle: seedContentBundle,
  isLoading: false,
  lastError: null,
  lastSyncedAt: null,
  source: "seed",
  async hydrate() {
    try {
      const cached = await readContentCacheSnapshot();
      set({
        bundle: cached.bundle,
        lastSyncedAt: cached.cachedAt,
        source: cached.contentVersion === seedContentBundle.appConfig.contentVersion ? "seed" : "cache"
      });
    } catch {
      set({
        bundle: seedContentBundle,
        lastSyncedAt: seedContentBundle.appConfig.updatedAt,
        lastError: "Kayıtlı içerik okunamadı; güvenli başlangıç içeriği gösteriliyor.",
        source: "seed"
      });
    }

    await get().sync().catch(() => undefined);
  },
  async sync() {
    set({ isLoading: true, lastError: null });

    try {
      const currentVersion = get().bundle.appConfig.contentVersion;
      const remoteConfig = await fetchRemoteAppConfig();

      if (remoteConfig.contentVersion <= currentVersion) {
        set({ isLoading: false, lastSyncedAt: new Date().toISOString() });
        return;
      }

      const remote = await fetchRemoteContentBundle();
      await writeContentCache(remote);
      set({ bundle: remote, isLoading: false, lastSyncedAt: new Date().toISOString(), source: "remote" });
    } catch {
      const cached = await readContentCache().catch(() => seedContentBundle);
      set({
        bundle: cached,
        isLoading: false,
        lastError: "İçerik güncellenemedi; kayıtlı içerikler gösteriliyor.",
        source: "cache"
      });
    }
  }
}));
