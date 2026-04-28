import { z } from "zod";
import { MOOD_KEYS } from "../constants/moods";

const isoDate = z.string().min(1);
const contentMetaSchema = z.object({
  id: z.string().min(1),
  isActive: z.boolean(),
  order: z.number().optional(),
  createdAt: isoDate,
  updatedAt: isoDate
});

export const categorySchema = contentMetaSchema.extend({
  name: z.string().min(1),
  type: z.enum(["dua", "zikr", "daily", "event"]),
  iconKey: z.string().min(1)
});

export const duaSchema = contentMetaSchema.extend({
  title: z.string().min(1),
  arabicText: z.string().min(1),
  transliterationTr: z.string().min(1),
  meaningTr: z.string().min(1),
  categoryId: z.string().min(1),
  moodTags: z.array(z.enum(MOOD_KEYS)),
  source: z.string().min(1),
  sourceReferenceIds: z.array(z.string()).optional(),
  isPremium: z.boolean().optional()
});

export const zikrSchema = contentMetaSchema.extend({
  title: z.string().min(1),
  text: z.string().min(1),
  recommendedCount: z.number().int().positive(),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  source: z.string().min(1),
  sourceReferenceIds: z.array(z.string()).optional(),
  isPremium: z.boolean().optional()
});

export const sourceReferenceSchema = contentMetaSchema.extend({
  title: z.string().min(1),
  type: z.enum(["quran", "hadith", "tdv", "diyanet", "book", "other"]),
  citation: z.string().min(1),
  url: z.string().url().optional().or(z.literal("")),
  note: z.string().optional(),
  locale: z.enum(["tr", "ar", "en"]).optional()
});

export const dailyContentSchema = contentMetaSchema.extend({
  date: isoDate,
  title: z.string().min(1),
  shortMessage: z.string().min(1),
  duaId: z.string().optional(),
  zikrId: z.string().optional(),
  verseText: z.string().optional(),
  source: z.string().optional(),
  isPremium: z.boolean().optional()
});

export const moodContentSchema = contentMetaSchema.extend({
  moodKey: z.enum(MOOD_KEYS),
  title: z.string().min(1),
  description: z.string().min(1),
  duaIds: z.array(z.string()),
  zikrIds: z.array(z.string()),
  shortAdvice: z.string().min(1),
  source: z.string().min(1),
  isPremium: z.boolean().optional()
});

export const specialEventContentSchema = contentMetaSchema.extend({
  eventType: z.enum(["friday", "kandil", "ramadan", "eid"]),
  title: z.string().min(1),
  description: z.string().min(1),
  startDate: isoDate,
  endDate: isoDate,
  suggestedDuaIds: z.array(z.string()),
  suggestedZikrIds: z.array(z.string()),
  notificationTitle: z.string().min(1),
  notificationBody: z.string().min(1),
  source: z.string().min(1),
  isPremium: z.boolean().optional()
});

export const badgeDefinitionSchema = contentMetaSchema.extend({
  name: z.string().min(1),
  description: z.string().min(1),
  iconKey: z.string().min(1),
  conditionType: z.enum(["streakDays", "firstZikr", "firstFavorite", "fridayRoutine", "dailyGoals"]),
  targetValue: z.number().int().nonnegative(),
  isPremium: z.boolean().optional()
});

export const notificationTemplateSchema = contentMetaSchema.extend({
  title: z.string().min(1),
  body: z.string().min(1),
  type: z.enum(["daily", "prayer", "event", "streak", "gentleReminder"]),
  scheduledDate: isoDate.optional(),
  isPremium: z.boolean().optional()
});

export const planTemplateSchema = contentMetaSchema.extend({
  title: z.string().min(1),
  description: z.string().min(1),
  durationDays: z.union([z.literal(7), z.literal(14), z.literal(30)]),
  isPremium: z.boolean(),
  taskTitles: z.array(z.string().min(1)),
  suggestedDuaIds: z.array(z.string()),
  suggestedZikrIds: z.array(z.string()),
  source: z.string().optional()
});

export const appConfigSchema = contentMetaSchema.extend({
  minimumAppVersion: z.string().min(1),
  contentVersion: z.number().int().nonnegative(),
  maintenanceMode: z.boolean(),
  defaultLanguage: z.enum(["tr", "en"]).optional(),
  defaultCity: z.string().min(1),
  forceUpdateMessage: z.string().optional(),
  maintenanceMessage: z.string().optional(),
  paywallEnabled: z.boolean().optional(),
  premiumPricing: z
    .object({
      monthlyLabel: z.string().min(1),
      yearlyLabel: z.string().min(1),
      yearlyMonthlyEquivalentLabel: z.string().optional(),
      highlightedPlan: z.enum(["monthly", "yearly"])
    })
    .optional(),
  featureFlags: z.object({
    premiumEnabled: z.boolean(),
    paywallEnabled: z.boolean().optional(),
    weeklyReflectionEnabled: z.boolean().optional(),
    advancedDailyPlanEnabled: z.boolean().optional(),
    premiumThemesEnabled: z.boolean().optional(),
    remoteContentEnabled: z.boolean(),
    localNotificationsEnabled: z.boolean(),
    optionalAuthPlaceholder: z.boolean()
  })
});

export const remoteContentBundleSchema = z.object({
  appConfig: appConfigSchema,
  badges: z.array(badgeDefinitionSchema),
  categories: z.array(categorySchema),
  dailyContents: z.array(dailyContentSchema),
  duas: z.array(duaSchema),
  events: z.array(specialEventContentSchema),
  moodContents: z.array(moodContentSchema),
  notificationTemplates: z.array(notificationTemplateSchema),
  planTemplates: z.array(planTemplateSchema),
  sources: z.array(sourceReferenceSchema),
  zikrs: z.array(zikrSchema)
});
