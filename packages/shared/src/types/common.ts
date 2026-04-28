export type SyncStatus = "local" | "pending" | "synced" | "failed";

export type ISODateString = string;

export interface RemoteMeta {
  id: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface LocalSyncMeta {
  localUserId: string;
  deviceId: string;
  remoteUserId: string | null;
  syncStatus: SyncStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  lastSyncedAt: ISODateString | null;
}

export interface ContentMeta extends RemoteMeta {
  isActive: boolean;
  order?: number;
}

export type ThemeMode = "system" | "light" | "dark";
export type ContentType = "dua" | "zikr" | "daily" | "mood" | "event" | "badge" | "category";
export type CategoryType = "dua" | "zikr" | "daily" | "event";
export type EventType = "friday" | "kandil" | "ramadan" | "eid";
