import type { CategoryType, ContentMeta, EventType, ISODateString } from "./common";
import type { MoodKey } from "./mood";

export interface Category extends ContentMeta {
  name: string;
  type: CategoryType;
  iconKey: string;
}

export interface Dua extends ContentMeta {
  title: string;
  arabicText: string;
  transliterationTr: string;
  meaningTr: string;
  categoryId: string;
  moodTags: MoodKey[];
  source: string;
  sourceReferenceIds?: string[];
  isPremium?: boolean;
}

export interface Zikr extends ContentMeta {
  title: string;
  text: string;
  recommendedCount: number;
  description: string;
  categoryId: string;
  source: string;
  sourceReferenceIds?: string[];
  isPremium?: boolean;
}

export interface SourceReference extends ContentMeta {
  title: string;
  type: "quran" | "hadith" | "tdv" | "diyanet" | "book" | "other";
  citation: string;
  url?: string;
  note?: string;
  locale?: "tr" | "ar" | "en";
}

export interface DailyContent extends ContentMeta {
  date: ISODateString;
  title: string;
  shortMessage: string;
  duaId?: string;
  zikrId?: string;
  verseText?: string;
  source?: string;
  isPremium?: boolean;
}

export interface MoodContent extends ContentMeta {
  moodKey: MoodKey;
  title: string;
  description: string;
  duaIds: string[];
  zikrIds: string[];
  shortAdvice: string;
  source: string;
  isPremium?: boolean;
}

export interface SpecialEventContent extends ContentMeta {
  eventType: EventType;
  title: string;
  description: string;
  startDate: ISODateString;
  endDate: ISODateString;
  suggestedDuaIds: string[];
  suggestedZikrIds: string[];
  notificationTitle: string;
  notificationBody: string;
  source: string;
  isPremium?: boolean;
}

export interface BadgeDefinition extends ContentMeta {
  name: string;
  description: string;
  iconKey: string;
  conditionType: "streakDays" | "firstZikr" | "firstFavorite" | "fridayRoutine" | "dailyGoals";
  targetValue: number;
  isPremium?: boolean;
}

export interface NotificationTemplate extends ContentMeta {
  title: string;
  body: string;
  type: "daily" | "prayer" | "event" | "streak" | "gentleReminder";
  scheduledDate?: ISODateString;
  isPremium?: boolean;
}

export interface PlanTemplate extends ContentMeta {
  title: string;
  description: string;
  durationDays: 7 | 14 | 30;
  isPremium: boolean;
  taskTitles: string[];
  suggestedDuaIds: string[];
  suggestedZikrIds: string[];
  source?: string;
}

export interface AppConfig extends ContentMeta {
  minimumAppVersion: string;
  contentVersion: number;
  maintenanceMode: boolean;
  defaultLanguage?: "tr" | "en";
  defaultCity: string;
  forceUpdateMessage?: string;
  maintenanceMessage?: string;
  paywallEnabled?: boolean;
  premiumPricing?: {
    monthlyLabel: string;
    yearlyLabel: string;
    yearlyMonthlyEquivalentLabel?: string;
    highlightedPlan: "monthly" | "yearly";
  };
  featureFlags: {
    premiumEnabled: boolean;
    paywallEnabled?: boolean;
    weeklyReflectionEnabled?: boolean;
    advancedDailyPlanEnabled?: boolean;
    premiumThemesEnabled?: boolean;
    remoteContentEnabled: boolean;
    localNotificationsEnabled: boolean;
    optionalAuthPlaceholder: boolean;
  };
}

export interface RemoteContentBundle {
  appConfig: AppConfig;
  badges: BadgeDefinition[];
  categories: Category[];
  dailyContents: DailyContent[];
  duas: Dua[];
  events: SpecialEventContent[];
  moodContents: MoodContent[];
  notificationTemplates: NotificationTemplate[];
  planTemplates: PlanTemplate[];
  sources: SourceReference[];
  zikrs: Zikr[];
}
