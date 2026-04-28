import type { ISODateString, LocalSyncMeta, ThemeMode } from "./common";
import type { DailyPlan, DailyTask, FeatureGate, ProgressDay, RewardBadge, SubscriptionStateSnapshot, TaskCompletion, WeeklyReflection } from "./habit";

export interface LocalUserProfile extends LocalSyncMeta {
  city: string;
  theme: ThemeMode;
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  prayerTimes: boolean;
  dailyContent: boolean;
  streakReminder: boolean;
  specialDays: boolean;
}

export interface FavoriteItem extends LocalSyncMeta {
  id: string;
  contentId: string;
  contentType: "dua" | "zikr" | "daily";
}

export interface GoalProgress extends LocalSyncMeta {
  id: string;
  date: ISODateString;
  readDailyContent: boolean;
  readDua: boolean;
  completedZikr: boolean;
  trackedPrayer: boolean;
  moodCheck?: boolean;
  eveningReflection?: boolean;
}

export interface StreakState extends LocalSyncMeta {
  id: string;
  currentCount: number;
  bestCount: number;
  lastCompletedDate: ISODateString | null;
}

export interface ZikrHistoryItem extends LocalSyncMeta {
  id: string;
  zikrId: string;
  count: number;
  targetCount: number;
  completedAt: ISODateString | null;
}

export interface UserBadge extends LocalSyncMeta {
  id: string;
  badgeId: string;
  unlockedAt: ISODateString;
}

export interface PrayerCityPreference extends LocalSyncMeta {
  id: string;
  city: string;
  countryCode: string;
  calculationProvider: string;
}

export type {
  DailyPlan,
  DailyTask,
  FeatureGate,
  ProgressDay,
  RewardBadge,
  SubscriptionStateSnapshot,
  TaskCompletion,
  WeeklyReflection
};
