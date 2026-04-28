import type { BadgeDefinition } from "../types/content";

export interface ProgressEngineInput {
  streakCount: number;
  completedGoalsCount: number;
  favoriteCount: number;
  completedZikrCount: number;
  fridayRoutineCompleted: boolean;
  badges: BadgeDefinition[];
}

export function calculateEarnedBadgeIds(input: ProgressEngineInput): string[] {
  return input.badges
    .filter((badge) => {
      switch (badge.conditionType) {
        case "streakDays":
          return input.streakCount >= badge.targetValue;
        case "firstZikr":
          return input.completedZikrCount >= badge.targetValue;
        case "firstFavorite":
          return input.favoriteCount >= badge.targetValue;
        case "fridayRoutine":
          return input.fridayRoutineCompleted;
        case "dailyGoals":
          return input.completedGoalsCount >= badge.targetValue;
        default:
          return false;
      }
    })
    .map((badge) => badge.id);
}

export function calculateNextStreak(params: { lastCompletedDate: string | null; today: string; currentCount: number }) {
  if (!params.lastCompletedDate) {
    return 1;
  }

  const last = new Date(`${params.lastCompletedDate}T00:00:00.000Z`);
  const today = new Date(`${params.today}T00:00:00.000Z`);
  const diffDays = Math.round((today.getTime() - last.getTime()) / 86400000);

  if (diffDays === 0) {
    return params.currentCount;
  }

  if (diffDays === 1) {
    return params.currentCount + 1;
  }

  return 1;
}
