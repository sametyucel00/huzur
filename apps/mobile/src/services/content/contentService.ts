import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import {
  FIRESTORE_COLLECTIONS,
  remoteContentBundleSchema,
  seedContentBundle,
  type ContentMeta,
  type AppConfig,
  type RemoteContentBundle
} from "@sukut/shared";
import { getFirebaseApp } from "../firebase/config";

function byOrderThenUpdatedAt<T extends Partial<ContentMeta>>(first: T, second: T) {
  const firstOrder = typeof first.order === "number" ? first.order : Number.MAX_SAFE_INTEGER;
  const secondOrder = typeof second.order === "number" ? second.order : Number.MAX_SAFE_INTEGER;

  if (firstOrder !== secondOrder) {
    return firstOrder - secondOrder;
  }

  return String(second.updatedAt ?? "").localeCompare(String(first.updatedAt ?? ""));
}

async function fetchActiveCollection<T extends Partial<ContentMeta>>(collectionName: string): Promise<T[]> {
  const app = getFirebaseApp();
  if (!app) {
    return [];
  }

  const db = getFirestore(app);
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }) as T)
    .filter((item) => item.isActive !== false)
    .sort(byOrderThenUpdatedAt);
}

export async function fetchRemoteContentBundle(): Promise<RemoteContentBundle> {
  const app = getFirebaseApp();

  if (!app) {
    return seedContentBundle;
  }

  const db = getFirestore(app);
  const configDoc = await getDoc(doc(db, FIRESTORE_COLLECTIONS.appConfig, "default"));
  const remoteBadges = await fetchActiveCollection<RemoteContentBundle["badges"][number]>(FIRESTORE_COLLECTIONS.badges);
  const remoteCategories = await fetchActiveCollection<RemoteContentBundle["categories"][number]>(FIRESTORE_COLLECTIONS.categories);
  const remoteDailyContents = await fetchActiveCollection<RemoteContentBundle["dailyContents"][number]>(FIRESTORE_COLLECTIONS.dailyContents);
  const remoteDuas = await fetchActiveCollection<RemoteContentBundle["duas"][number]>(FIRESTORE_COLLECTIONS.duas);
  const remoteEvents = await fetchActiveCollection<RemoteContentBundle["events"][number]>(FIRESTORE_COLLECTIONS.events);
  const remoteMoodContents = await fetchActiveCollection<RemoteContentBundle["moodContents"][number]>(FIRESTORE_COLLECTIONS.moodContents);
  const remoteNotificationTemplates = await fetchActiveCollection<RemoteContentBundle["notificationTemplates"][number]>(
    FIRESTORE_COLLECTIONS.notificationTemplates
  );
  const remotePlanTemplates = await fetchActiveCollection<RemoteContentBundle["planTemplates"][number]>(FIRESTORE_COLLECTIONS.planTemplates);
  const remoteSources = await fetchActiveCollection<RemoteContentBundle["sources"][number]>(FIRESTORE_COLLECTIONS.sources);
  const remoteZikrs = await fetchActiveCollection<RemoteContentBundle["zikrs"][number]>(FIRESTORE_COLLECTIONS.zikrs);

  const bundle: RemoteContentBundle = {
    appConfig: configDoc.exists() ? ({ id: configDoc.id, ...configDoc.data() } as RemoteContentBundle["appConfig"]) : seedContentBundle.appConfig,
    badges: remoteBadges.length > 0 ? remoteBadges : seedContentBundle.badges,
    categories: remoteCategories.length > 0 ? remoteCategories : seedContentBundle.categories,
    dailyContents: remoteDailyContents.length > 0 ? remoteDailyContents : seedContentBundle.dailyContents,
    duas: remoteDuas.length > 0 ? remoteDuas : seedContentBundle.duas,
    events: remoteEvents.length > 0 ? remoteEvents : seedContentBundle.events,
    moodContents: remoteMoodContents.length > 0 ? remoteMoodContents : seedContentBundle.moodContents,
    notificationTemplates:
      remoteNotificationTemplates.length > 0 ? remoteNotificationTemplates : seedContentBundle.notificationTemplates,
    planTemplates: remotePlanTemplates.length > 0 ? remotePlanTemplates : seedContentBundle.planTemplates,
    sources: remoteSources.length > 0 ? remoteSources : seedContentBundle.sources,
    zikrs: remoteZikrs.length > 0 ? remoteZikrs : seedContentBundle.zikrs
  };

  const parsed = remoteContentBundleSchema.safeParse(bundle);
  return parsed.success ? parsed.data : seedContentBundle;
}

export async function fetchRemoteAppConfig(): Promise<AppConfig> {
  const app = getFirebaseApp();

  if (!app) {
    return seedContentBundle.appConfig;
  }

  const db = getFirestore(app);
  const configDoc = await getDoc(doc(db, FIRESTORE_COLLECTIONS.appConfig, "default"));
  return configDoc.exists() ? ({ id: configDoc.id, ...configDoc.data() } as AppConfig) : seedContentBundle.appConfig;
}
