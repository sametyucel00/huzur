import type { DailyPlan, DailyTask, ProgressDay, WeeklyReflection } from "../types/habit";
import { getDayOfYearIndex } from "./dailyRotation";

type TaskDefinition = Omit<DailyTask, "isCompleted" | "completedAt" | "date">;

const dailyPlanVariants: TaskDefinition[][] = [
  [
    { id: "readDailyContent", title: "Günün sükûnetini oku", description: "Bugünün kısa mesajını sakinçe tamamla.", type: "daily_content", isPremium: false, order: 1 },
    { id: "completedZikr", title: "33 zikirle ritmini kur", description: "Bugünün zikrini küçük bir nefes aralığında tamamla.", type: "zikr", isPremium: false, order: 2 },
    { id: "readDua", title: "Bugünün duasını oku", description: "Günlük önerilen duayı acele etmeden oku.", type: "dua", isPremium: false, order: 3 },
    { id: "moodCheck", title: "İç hâlini seç", description: "Ruh hâline göre kısa önerini gör.", type: "mood_check", isPremium: true, order: 4 },
    { id: "eveningReflection", title: "Akşam kısa değerlendirme", description: "Günü bir cümlelik iç muhasebe ile kapat.", type: "reflection", isPremium: true, order: 5 }
  ],
  [
    { id: "readDailyContent", title: "Kısa mesajı içinden geçir", description: "Bugünün içeriğini bir cümleyle özetle.", type: "daily_content", isPremium: false, order: 1 },
    { id: "completedZikr", title: "Zikir hedefini tamamla", description: "Sayaçta bugünün zikrini yavaş bir ritimle ilerlet.", type: "zikr", isPremium: false, order: 2 },
    { id: "readDua", title: "Bir dua seç ve oku", description: "Bugünün duasını veya kütüphaneden sana yakın gelen bir duayı oku.", type: "dua", isPremium: false, order: 3 },
    { id: "moodCheck", title: "Kalbinin hâlini işaretle", description: "Bugünkü iç hâline göre daha derin öneriyi aç.", type: "mood_check", isPremium: true, order: 4 },
    { id: "eveningReflection", title: "Günün niyetini kapat", description: "Bugünden yanında kalan tek sakin cümleyi düşün.", type: "reflection", isPremium: true, order: 5 }
  ],
  [
    { id: "readDailyContent", title: "Günlük huzur notunu oku", description: "Kısa içeriği okurken bir dakika yavaşla.", type: "daily_content", isPremium: false, order: 1 },
    { id: "completedZikr", title: "Bugünün zikrini tamamla", description: "Hedef sayıya ulaşmak için küçük aralıklar yeterli.", type: "zikr", isPremium: false, order: 2 },
    { id: "readDua", title: "Dua ile yönünü toparla", description: "Bugünün duasını anlamıyla birlikte oku.", type: "dua", isPremium: false, order: 3 },
    { id: "moodCheck", title: "Ruh hâli önerini yenile", description: "Bugünün hissine göre kişisel öneriyi gör.", type: "mood_check", isPremium: true, order: 4 },
    { id: "eveningReflection", title: "Akşam sükûneti", description: "Günü küçük bir şükür veya istiğfar cümlesiyle kapat.", type: "reflection", isPremium: true, order: 5 }
  ]
];

function getDailyTaskDefinitions(date: string): TaskDefinition[] {
  const parsedDate = new Date(`${date}T12:00:00`);
  const index = getDayOfYearIndex(Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate) % dailyPlanVariants.length;
  return dailyPlanVariants[index] ?? dailyPlanVariants[0]!;
}

function formatDateTr(dateKey: string) {
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${dateKey}T12:00:00`));
}

export function createDailyPlan(params: {
  date: string;
  completedGoals: Record<string, boolean>;
  isPremium: boolean;
}): DailyPlan {
  const tasks = getDailyTaskDefinitions(params.date)
    .filter((task) => params.isPremium || !task.isPremium)
    .map<DailyTask>((task) => ({
      ...task,
      date: params.date,
      isCompleted: Boolean(params.completedGoals[task.id]),
      completedAt: params.completedGoals[task.id] ? new Date().toISOString() : null
    }));

  return {
    id: `daily-plan-${params.date}`,
    date: params.date,
    title: "Bugünkü Sükût Planın",
    tasks,
    progressRatio: tasks.length ? tasks.filter((task) => task.isCompleted).length / tasks.length : 0,
    isPremiumPlan: params.isPremium
  };
}

export function createProgressDays(params: {
  today: string;
  completedGoals: Record<string, boolean>;
  zikrCount: number;
  duaReadCount: number;
  historyDays?: ProgressDay[];
  days?: number;
  startOnMonday?: boolean;
}): ProgressDay[] {
  const count = params.days ?? 7;
  const todayDate = new Date(`${params.today}T00:00:00.000Z`);
  const mondayDate = new Date(todayDate);
  const dayOfWeek = todayDate.getUTCDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  mondayDate.setUTCDate(todayDate.getUTCDate() - daysSinceMonday);
  const historyMap = new Map((params.historyDays ?? []).map((day) => [day.date, day]));

  return Array.from({ length: count }).map((_, index) => {
    const date = new Date(params.startOnMonday ? mondayDate : todayDate);
    date.setUTCDate((params.startOnMonday ? mondayDate.getUTCDate() : todayDate.getUTCDate()) + (params.startOnMonday ? index : -(count - 1 - index)));
    const dateKey = date.toISOString().slice(0, 10);
    const isToday = dateKey === params.today;
    const isFuture = date.getTime() > todayDate.getTime();
    const historyDay = historyMap.get(dateKey);
    const completedTaskCount = isFuture ? 0 : isToday ? Object.values(params.completedGoals).filter(Boolean).length : historyDay?.completedTaskCount ?? 0;

    return {
      date: dateKey,
      completedTaskCount,
      zikrCount: isToday ? params.zikrCount : historyDay?.zikrCount ?? 0,
      duaReadCount: isToday ? params.duaReadCount : historyDay?.duaReadCount ?? 0,
      prayerCheckCount: isToday ? (params.completedGoals.trackedPrayer ? 1 : 0) : historyDay?.prayerCheckCount ?? 0,
      moodChecked: isToday ? Boolean(params.completedGoals.moodCheck) : historyDay?.moodChecked ?? false,
      isSpecialDay: date.getUTCDay() === 5
    };
  });
}

export function createWeeklyReflection(params: {
  progressDays: ProgressDay[];
  streakCount: number;
  isPremium: boolean;
}): WeeklyReflection {
  const activeDays = params.progressDays.filter((day) => day.completedTaskCount > 0).length;
  const completedTasks = params.progressDays.reduce((sum, day) => sum + day.completedTaskCount, 0);
  const zikrCount = params.progressDays.reduce((sum, day) => sum + day.zikrCount, 0);
  const duaReadCount = params.progressDays.reduce((sum, day) => sum + day.duaReadCount, 0);
  const strongestDay = [...params.progressDays].sort((a, b) => b.completedTaskCount - a.completedTaskCount)[0];

  return {
    weekStart: params.progressDays[0]?.date ?? "",
    weekEnd: params.progressDays[params.progressDays.length - 1]?.date ?? "",
    activeDays,
    completedTasks,
    zikrCount,
    duaReadCount,
    strongestRoutine: strongestDay?.completedTaskCount ? "günlük plan" : "sakin başlangıç",
    summaryText: params.isPremium
      ? `Bu hafta ${activeDays} gün Sükût'a döndün. En güçlü ritmin ${strongestDay?.date ? formatDateTr(strongestDay.date) : "bugün"} tarihinde oluştu.`
      : `Bu hafta ${activeDays} gün Sükût'a döndün. Sükût Ayrıcalık ile daha detaylı haftalık içgörü görebilirsin.`,
    isPremiumDetail: params.isPremium
  };
}
