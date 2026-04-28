import type { RemoteContentBundle } from "@sukut/shared";
import { openSukutDatabase } from "./sqlite";

type BundleCollectionKey = Exclude<keyof RemoteContentBundle, "appConfig">;

const collectionKeys: BundleCollectionKey[] = [
  "badges",
  "categories",
  "dailyContents",
  "duas",
  "events",
  "moodContents",
  "notificationTemplates",
  "zikrs"
];

async function ensureContentCacheTable() {
  const db = await openSukutDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS content_cache (
      collectionName TEXT NOT NULL,
      documentId TEXT NOT NULL,
      payload TEXT NOT NULL,
      contentVersion INTEGER NOT NULL,
      updatedAt TEXT NOT NULL,
      PRIMARY KEY (collectionName, documentId)
    );
  `);
  return db;
}

export async function writeBundleToSQLiteCache(bundle: RemoteContentBundle): Promise<void> {
  const db = await ensureContentCacheTable();
  const contentVersion = bundle.appConfig.contentVersion;
  const updatedAt = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    for (const collectionName of collectionKeys) {
      for (const item of bundle[collectionName]) {
        await db.runAsync(
          `INSERT OR REPLACE INTO content_cache (collectionName, documentId, payload, contentVersion, updatedAt)
           VALUES (?, ?, ?, ?, ?)`,
          collectionName,
          item.id,
          JSON.stringify(item),
          contentVersion,
          updatedAt
        );
      }
    }
  });
}

export async function readSQLiteCachedCollection<T>(collectionName: BundleCollectionKey): Promise<T[]> {
  const db = await ensureContentCacheTable();
  const rows = await db.getAllAsync<{ payload: string }>(
    "SELECT payload FROM content_cache WHERE collectionName = ? ORDER BY updatedAt DESC",
    collectionName
  );

  return rows.map((row) => JSON.parse(row.payload) as T);
}
