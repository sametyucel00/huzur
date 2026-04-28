import * as SQLite from "expo-sqlite";

export async function openSukutDatabase() {
  return SQLite.openDatabaseAsync("sukut.db");
}

export async function ensureLocalTables() {
  const db = await openSukutDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS local_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS user_events (
      id TEXT PRIMARY KEY NOT NULL,
      localUserId TEXT NOT NULL,
      deviceId TEXT NOT NULL,
      remoteUserId TEXT,
      type TEXT NOT NULL,
      payload TEXT NOT NULL,
      syncStatus TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      lastSyncedAt TEXT
    );
    CREATE TABLE IF NOT EXISTS content_cache (
      collectionName TEXT NOT NULL,
      documentId TEXT NOT NULL,
      payload TEXT NOT NULL,
      contentVersion INTEGER NOT NULL,
      updatedAt TEXT NOT NULL,
      PRIMARY KEY (collectionName, documentId)
    );
  `);
}
