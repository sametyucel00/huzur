import type { ISODateString } from "./common";

export type DailyTaskType = "daily_content" | "dua" | "zikr" | "prayer_check" | "mood_check" | "reflection";

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  type: DailyTaskType;
  isPremium: boolean;
  isCompleted: boolean;
  completedAt: ISODateString | null;
  date: ISODateString;
  order: number;
}

export interface DailyPlan {
  id: string;
  date: ISODateString;
  title: string;
  tasks: DailyTask[];
  progressRatio: number;
  isPremiumPlan: boolean;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  date: ISODateString;
  completedAt: ISODateString;
}

export interface WeeklyReflection {
  weekStart: ISODateString;
  weekEnd: ISODateString;
  activeDays: number;
  completedTasks: number;
  zikrCount: number;
  duaReadCount: number;
  strongestRoutine: string;
  summaryText: string;
  isPremiumDetail: boolean;
}

export interface ProgressDay {
  date: ISODateString;
  completedTaskCount: number;
  zikrCount: number;
  duaReadCount: number;
  prayerCheckCount: number;
  moodChecked: boolean;
  isSpecialDay: boolean;
}

export interface RewardBadge {
  id: string;
  badgeId: string;
  name: string;
  isPremium: boolean;
  unlockedAt: ISODateString | null;
}

export type SubscriptionSource = "mock" | "store";

export interface SubscriptionStateSnapshot {
  isPremium: boolean;
  activePlan: "free" | "monthly" | "yearly" | null;
  entitlementId: string | null;
  productId: string | null;
  expiresAt: ISODateString | null;
  source: SubscriptionSource;
  lastCheckedAt: ISODateString | null;
}

export type FeatureKey =
  | "weekly_reflection"
  | "advanced_daily_plan"
  | "mini_progress_calendar_advanced"
  | "quiet_rewards_collection"
  | "premium_plans"
  | "advanced_mood_recommendations"
  | "audio_content"
  | "themes_premium"
  | "ads_free";

export interface FeatureGate {
  key: FeatureKey;
  title: string;
  isPremium: boolean;
}
