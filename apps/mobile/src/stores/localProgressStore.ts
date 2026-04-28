import { create } from "zustand";
import { calculateEarnedBadgeIds, calculateNextStreak, type TaskCompletion } from "@sukut/shared";
import { createDefaultProgressSnapshot, readLocalProgress, upsertTodayProgressDay, writeLocalProgress, type LocalProgressSnapshot } from "@/storage/localProgress";
import { getLocalDateString } from "@/services/prayerTimes/nextPrayer";
import { useContentStore } from "@/stores/contentStore";

interface LocalProgressState extends LocalProgressSnapshot {
  isReady: boolean;
  hydrate: () => Promise<void>;
  incrementZikr: () => void;
  resetZikr: () => void;
  toggleGoal: (key: string) => void;
  markGoalComplete: (key: string) => void;
  toggleFavorite: (contentId: string) => void;
  recomputeEarnedBadges: () => void;
  isFavorite: (contentId: string) => boolean;
}

function persist(snapshot: LocalProgressSnapshot) {
  writeLocalProgress(snapshot).catch(() => undefined);
}

function toSnapshot(state: LocalProgressState): LocalProgressSnapshot {
  return {
    date: state.date,
    zikrCount: state.zikrCount,
    zikrTarget: state.zikrTarget,
    streakCount: state.streakCount,
    bestStreak: state.bestStreak,
    completedGoals: state.completedGoals,
    favoriteContentIds: state.favoriteContentIds,
    earnedBadgeIds: state.earnedBadgeIds,
    taskCompletions: state.taskCompletions,
    progressDays: state.progressDays,
    weeklyReflections: state.weeklyReflections,
    lastCompletedDate: state.lastCompletedDate,
    updatedAt: new Date().toISOString()
  };
}

function withTaskCompletion(snapshot: LocalProgressSnapshot, taskId: string, completed: boolean): LocalProgressSnapshot {
  const filtered = snapshot.taskCompletions.filter((item) => !(item.taskId === taskId && item.date === snapshot.date));

  if (!completed) {
    return { ...snapshot, taskCompletions: filtered };
  }

  const completion: TaskCompletion = {
    id: `${snapshot.date}-${taskId}`,
    taskId,
    date: snapshot.date,
    completedAt: new Date().toISOString()
  };

  return {
    ...snapshot,
    taskCompletions: [...filtered, completion]
  };
}

function getComputedBadgeIds(state: LocalProgressState): string[] {
  const completedGoalsCount = Object.values(state.completedGoals).filter(Boolean).length;
  const badges = useContentStore.getState().bundle.badges;
  return calculateEarnedBadgeIds({
    streakCount: state.streakCount,
    completedGoalsCount,
    favoriteCount: state.favoriteContentIds.length,
    completedZikrCount: state.completedGoals.completedZikr ? 1 : 0,
    fridayRoutineCompleted: false,
    badges
  });
}

function applyDailyCompletion(snapshot: LocalProgressSnapshot): LocalProgressSnapshot {
  const dailyCoreGoals = ["readDailyContent", "readDua", "completedZikr"];
  const allGoalsCompleted = dailyCoreGoals.every((key) => Boolean(snapshot.completedGoals[key]));
  const today = getLocalDateString();

  if (!allGoalsCompleted || snapshot.lastCompletedDate === today) {
    return snapshot;
  }

  const streakCount = calculateNextStreak({
    lastCompletedDate: snapshot.lastCompletedDate,
    today,
    currentCount: snapshot.streakCount
  });

  const next = {
    ...snapshot,
    streakCount,
    bestStreak: Math.max(snapshot.bestStreak, streakCount),
    lastCompletedDate: today
  };

  return {
    ...next,
    earnedBadgeIds: Array.from(new Set([...next.earnedBadgeIds, ...getComputedBadgeIds(next as LocalProgressState)]))
  };
}

function finalizeProgress(snapshot: LocalProgressSnapshot): LocalProgressSnapshot {
  const completedSnapshot = applyDailyCompletion(snapshot);
  const earnedBadgeIds = Array.from(new Set([...completedSnapshot.earnedBadgeIds, ...getComputedBadgeIds(completedSnapshot as LocalProgressState)]));
  return upsertTodayProgressDay({
    ...completedSnapshot,
    earnedBadgeIds
  });
}

export const useLocalProgressStore = create<LocalProgressState>((set, get) => ({
  date: getLocalDateString(),
  zikrCount: 0,
  zikrTarget: 33,
  streakCount: 1,
  bestStreak: 1,
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
  updatedAt: new Date().toISOString(),
  isReady: false,
  async hydrate() {
    try {
      const snapshot = await readLocalProgress();
      set({ ...snapshot, isReady: true });
    } catch {
      set({ ...createDefaultProgressSnapshot(), isReady: true });
    }
  },
  incrementZikr() {
    const state = get();
    const nextCount = state.zikrCount + 1;
    const completedZikr = nextCount >= state.zikrTarget;
    const nextCompletedGoals = {
      ...state.completedGoals,
      completedZikr
    };
    const earnedBadgeIds = completedZikr
      ? Array.from(new Set([...state.earnedBadgeIds, ...getComputedBadgeIds({ ...state, completedGoals: nextCompletedGoals } as LocalProgressState)]))
      : state.earnedBadgeIds;
    const next: LocalProgressSnapshot = {
      date: state.date,
      zikrCount: nextCount,
      zikrTarget: state.zikrTarget,
      streakCount: state.streakCount,
      bestStreak: Math.max(state.bestStreak, state.streakCount),
      completedGoals: nextCompletedGoals,
      favoriteContentIds: state.favoriteContentIds,
      earnedBadgeIds,
      taskCompletions: state.taskCompletions,
      progressDays: state.progressDays,
      weeklyReflections: state.weeklyReflections,
      lastCompletedDate: state.lastCompletedDate,
      updatedAt: new Date().toISOString()
    };

    const completedSnapshot = finalizeProgress(withTaskCompletion(next, "completedZikr", completedZikr));
    set(completedSnapshot);
    persist(completedSnapshot);
  },
  resetZikr() {
    const state = get();
    const next = {
      ...toSnapshot(state),
      zikrCount: 0,
      completedGoals: {
        ...state.completedGoals,
        completedZikr: false
      },
      updatedAt: new Date().toISOString()
    };

    const completedSnapshot = finalizeProgress(withTaskCompletion(next, "completedZikr", false));
    set(completedSnapshot);
    persist(completedSnapshot);
  },
  toggleGoal(key) {
    const state = get();
    const nextCompleted = !state.completedGoals[key];
    const next = finalizeProgress(withTaskCompletion({
      ...toSnapshot(state),
      completedGoals: {
        ...state.completedGoals,
        [key]: nextCompleted
      },
      updatedAt: new Date().toISOString()
    }, key, nextCompleted));

    set(next);
    persist(next);
  },
  markGoalComplete(key) {
    const state = get();

    if (state.completedGoals[key]) {
      return;
    }

    const next = finalizeProgress(withTaskCompletion({
      ...toSnapshot(state),
      completedGoals: {
        ...state.completedGoals,
        [key]: true
      },
      updatedAt: new Date().toISOString()
    }, key, true));

    set(next);
    persist(next);
  },
  toggleFavorite(contentId) {
    const state = get();
    const exists = state.favoriteContentIds.includes(contentId);
    const favoriteContentIds = exists
      ? state.favoriteContentIds.filter((item) => item !== contentId)
      : [...state.favoriteContentIds, contentId];
    const next = {
      ...toSnapshot(state),
      favoriteContentIds,
      earnedBadgeIds: exists ? state.earnedBadgeIds : Array.from(new Set([...state.earnedBadgeIds, ...getComputedBadgeIds({ ...state, favoriteContentIds } as LocalProgressState)])),
      completedGoals: {
        ...state.completedGoals,
        readDua: true
      },
      updatedAt: new Date().toISOString()
    };

    const completedSnapshot = finalizeProgress(withTaskCompletion(next as LocalProgressSnapshot, "readDua", true));
    set(completedSnapshot);
    persist(completedSnapshot);
  },
  recomputeEarnedBadges() {
    const state = get();
    const next = finalizeProgress({
      ...toSnapshot(state),
      earnedBadgeIds: Array.from(new Set([...state.earnedBadgeIds, ...getComputedBadgeIds(state)])),
      updatedAt: new Date().toISOString()
    });
    set(next);
    persist(next);
  },
  isFavorite(contentId) {
    return get().favoriteContentIds.includes(contentId);
  }
}));
