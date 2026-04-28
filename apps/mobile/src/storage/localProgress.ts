import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateNextStreak, type ProgressDay, type TaskCompletion, type WeeklyReflection } from "@sukut/shared";
import { STORAGE_KEYS } from "./keys";
import { getLocalDateString } from "@/services/prayerTimes/nextPrayer";

export interface LocalProgressSnapshot {
  date: string;
  zikrCount: number;
  zikrTarget: number;
  streakCount: number;
  bestStreak: number;
  completedGoals: Record<string, boolean>;
  favoriteContentIds: string[];
  earnedBadgeIds: string[];
  taskCompletions: TaskCompletion[];
  progressDays: ProgressDay[];
  weeklyReflections: WeeklyReflection[];
  lastCompletedDate: string | null;
  updatedAt: string;
}

const today = () => getLocalDateString();

export function createDefaultProgressSnapshot(): LocalProgressSnapshot {
  return {
    date: today(),
    zikrCount: 0,
    zikrTarget: 33,
    streakCount: 0,
    bestStreak: 0,
    completedGoals: {
      readDailyContent: false,
      readDua: false,
      completedZikr: false,
      trackedPrayer: false,
      moodCheck: false,
      eveningReflection: false
    },
    favoriteContentIds: [],
    earnedBadgeIds: [],
    taskCompletions: [],
    progressDays: [],
    weeklyReflections: [],
    lastCompletedDate: null,
    updatedAt: new Date().toISOString()
  };
}

export function upsertTodayProgressDay(snapshot: LocalProgressSnapshot): LocalProgressSnapshot {
  const progressDay: ProgressDay = {
    date: snapshot.date,
    completedTaskCount: Object.values(snapshot.completedGoals).filter(Boolean).length,
    zikrCount: snapshot.zikrCount,
    duaReadCount: snapshot.completedGoals.readDua ? 1 : 0,
    prayerCheckCount: snapshot.completedGoals.trackedPrayer ? 1 : 0,
    moodChecked: Boolean(snapshot.completedGoals.moodCheck),
    isSpecialDay: new Date(`${snapshot.date}T12:00:00.000Z`).getUTCDay() === 5
  };
  const progressDays = [progressDay, ...snapshot.progressDays.filter((day) => day.date !== snapshot.date)]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-90);

  return {
    ...snapshot,
    progressDays
  };
}

export async function readLocalProgress(): Promise<LocalProgressSnapshot> {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.localProgress);

  if (!stored) {
    const snapshot = createDefaultProgressSnapshot();
    await writeLocalProgress(snapshot);
    return snapshot;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<LocalProgressSnapshot>;
    const defaults = createDefaultProgressSnapshot();
    const snapshot: LocalProgressSnapshot = {
      ...defaults,
      ...parsed,
      completedGoals: {
        ...defaults.completedGoals,
        ...(parsed.completedGoals ?? {})
      },
      favoriteContentIds: parsed.favoriteContentIds ?? [],
      earnedBadgeIds: parsed.earnedBadgeIds ?? [],
      taskCompletions: parsed.taskCompletions ?? [],
      progressDays: parsed.progressDays ?? [],
      weeklyReflections: parsed.weeklyReflections ?? []
    };

    if (snapshot.date !== today()) {
      const currentDate = today();
      const lastCompletedDate = snapshot.lastCompletedDate ?? null;
      const archivedSnapshot = upsertTodayProgressDay(snapshot);
      const streakCount = lastCompletedDate
        ? calculateNextStreak({
            lastCompletedDate,
            today: currentDate,
            currentCount: snapshot.streakCount
          })
        : 0;
      const next = {
        ...archivedSnapshot,
        date: currentDate,
        zikrCount: 0,
        streakCount,
        bestStreak: Math.max(snapshot.bestStreak ?? 0, streakCount),
        completedGoals: createDefaultProgressSnapshot().completedGoals,
        lastCompletedDate,
        updatedAt: new Date().toISOString()
      };
      await writeLocalProgress(next);
      return next;
    }

    return snapshot;
  } catch {
    const fallback = createDefaultProgressSnapshot();
    await writeLocalProgress(fallback);
    return fallback;
  }
}

export async function writeLocalProgress(snapshot: LocalProgressSnapshot): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEYS.localProgress,
    JSON.stringify({
      ...snapshot,
      updatedAt: new Date().toISOString()
    })
  );
}
