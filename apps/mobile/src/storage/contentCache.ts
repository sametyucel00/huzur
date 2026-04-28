import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { remoteContentBundleSchema, seedContentBundle, type RemoteContentBundle } from "@sukut/shared";
import { STORAGE_KEYS } from "./keys";

export interface ContentCacheSnapshot {
  bundle: RemoteContentBundle;
  cachedAt: string;
  contentVersion: number;
}

function seedSnapshot(): ContentCacheSnapshot {
  return {
    bundle: seedContentBundle,
    cachedAt: seedContentBundle.appConfig.updatedAt,
    contentVersion: seedContentBundle.appConfig.contentVersion
  };
}

function normalizeBundle(bundle: Partial<RemoteContentBundle> | null | undefined): RemoteContentBundle {
  const mergeById = <T extends { id: string }>(seedItems: T[], cachedItems: T[] | undefined) => {
    const merged = new Map(seedItems.map((item) => [item.id, item]));
    (cachedItems ?? []).forEach((item) => merged.set(item.id, item));
    return Array.from(merged.values());
  };

  const candidate = {
    ...seedContentBundle,
    ...(bundle ?? {}),
    appConfig: {
      ...seedContentBundle.appConfig,
      ...(bundle?.appConfig ?? {}),
      featureFlags: {
        ...seedContentBundle.appConfig.featureFlags,
        ...(bundle?.appConfig?.featureFlags ?? {})
      },
      premiumPricing: {
        ...seedContentBundle.appConfig.premiumPricing,
        ...(bundle?.appConfig?.premiumPricing ?? {})
      }
    },
    badges: mergeById(seedContentBundle.badges, bundle?.badges),
    categories: bundle?.categories ?? seedContentBundle.categories,
    dailyContents: bundle?.dailyContents ?? seedContentBundle.dailyContents,
    duas: bundle?.duas ?? seedContentBundle.duas,
    events: bundle?.events ?? seedContentBundle.events,
    moodContents: bundle?.moodContents ?? seedContentBundle.moodContents,
    notificationTemplates: bundle?.notificationTemplates ?? seedContentBundle.notificationTemplates,
    planTemplates: bundle?.planTemplates ?? seedContentBundle.planTemplates,
    sources: mergeById(seedContentBundle.sources, bundle?.sources),
    zikrs: bundle?.zikrs ?? seedContentBundle.zikrs
  };

  const parsed = remoteContentBundleSchema.safeParse(candidate);
  return parsed.success ? parsed.data : seedContentBundle;
}

export async function readContentCacheSnapshot(): Promise<ContentCacheSnapshot> {
  const snapshot = await AsyncStorage.getItem(STORAGE_KEYS.contentCacheSnapshot);

  if (snapshot) {
    try {
      const parsed = JSON.parse(snapshot) as ContentCacheSnapshot;
      const bundle = normalizeBundle(parsed.bundle);
      return {
        bundle,
        cachedAt: parsed.cachedAt ?? bundle.appConfig.updatedAt,
        contentVersion: bundle.appConfig.contentVersion
      };
    } catch {
      return seedSnapshot();
    }
  }

  const legacyBundle = await AsyncStorage.getItem(STORAGE_KEYS.contentBundle);
  if (!legacyBundle) {
    return seedSnapshot();
  }

  try {
    const bundle = normalizeBundle(JSON.parse(legacyBundle) as Partial<RemoteContentBundle>);
    return {
      bundle,
      cachedAt: bundle.appConfig.updatedAt,
      contentVersion: bundle.appConfig.contentVersion
    };
  } catch {
    return seedSnapshot();
  }
}

export async function readContentCache(): Promise<RemoteContentBundle> {
  const snapshot = await readContentCacheSnapshot();
  return snapshot.bundle;
}

export async function writeContentCache(bundle: RemoteContentBundle): Promise<void> {
  const snapshot: ContentCacheSnapshot = {
    bundle,
    cachedAt: new Date().toISOString(),
    contentVersion: bundle.appConfig.contentVersion
  };

  await AsyncStorage.multiSet([
    [STORAGE_KEYS.contentBundle, JSON.stringify(bundle)],
    [STORAGE_KEYS.contentCacheSnapshot, JSON.stringify(snapshot)]
  ]);

  if (Platform.OS !== "web") {
    const { writeBundleToSQLiteCache } = await import("./sqliteContentCache");
    await writeBundleToSQLiteCache(bundle).catch(() => undefined);
  }
}
