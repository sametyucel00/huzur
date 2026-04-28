import { Pressable, Text, View, StyleSheet } from "react-native";
import { createProgressDays, type ProgressDay } from "@sukut/shared";
import { ContentCard } from "@/components/ContentCard";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";

const weekLabels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

interface CalendarCell extends ProgressDay {
  isCurrentMonth: boolean;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateKey: string) {
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${dateKey}T12:00:00`));
}

function getTodayLabel(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);
  const dayName = new Intl.DateTimeFormat("tr-TR", { weekday: "long" }).format(date);
  return `${dayName}, ${formatDate(dateKey)}`;
}

function buildMonthlyCells(params: {
  today: string;
  completedGoals: Record<string, boolean>;
  zikrCount: number;
  progressDays: ProgressDay[];
}): CalendarCell[] {
  const todayDate = new Date(`${params.today}T12:00:00`);
  const firstOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1, 12);
  const monthIndex = firstOfMonth.getMonth();
  const dayOfWeek = firstOfMonth.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - daysSinceMonday);
  const historyMap = new Map(params.progressDays.map((day) => [day.date, day]));

  return Array.from({ length: 42 }).map((_, index) => {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + index);
    const dateKey = toDateKey(cellDate);
    const history = historyMap.get(dateKey);
    const isToday = dateKey === params.today;
    const completedTaskCount = isToday ? Object.values(params.completedGoals).filter(Boolean).length : history?.completedTaskCount ?? 0;

    return {
      date: dateKey,
      completedTaskCount,
      zikrCount: isToday ? params.zikrCount : history?.zikrCount ?? 0,
      duaReadCount: isToday ? (params.completedGoals.readDua ? 1 : 0) : history?.duaReadCount ?? 0,
      prayerCheckCount: isToday ? (params.completedGoals.trackedPrayer ? 1 : 0) : history?.prayerCheckCount ?? 0,
      moodChecked: isToday ? Boolean(params.completedGoals.moodCheck) : history?.moodChecked ?? false,
      isSpecialDay: false,
      isCurrentMonth: cellDate.getMonth() === monthIndex
    };
  });
}

export function MiniProgressCalendar({ onOpenPaywall, showUpgradeAction = true }: { onOpenPaywall: () => void; showUpgradeAction?: boolean }) {
  const theme = useAppTheme();
  const { date, completedGoals, zikrCount, progressDays } = useLocalProgressStore();
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const days = isPremium
    ? buildMonthlyCells({ today: date, completedGoals, zikrCount, progressDays })
    : createProgressDays({
        today: date,
        completedGoals,
        zikrCount,
        duaReadCount: completedGoals.readDua ? 1 : 0,
        historyDays: progressDays,
        days: 7,
        startOnMonday: true
      }).map((day) => ({ ...day, isCurrentMonth: true }));
  const todayLabel = getTodayLabel(date);

  return (
    <ContentCard>
      <View style={styles.header}>
        <View>
          <Text style={[styles.kicker, { color: theme.colors.textMuted }]}>Mini ilerleme</Text>
          <Text style={[theme.typography.section, { color: theme.colors.text }]}>{isPremium ? "Aylık görünüm" : "Bu hafta"}</Text>
          <Text style={[styles.todayText, { color: theme.colors.accent }]}>Bugün: {todayLabel}</Text>
        </View>
        {!isPremium && showUpgradeAction ? (
          <Pressable accessibilityRole="button" onPress={onOpenPaywall}>
            <Text style={[styles.plus, { color: theme.colors.accent }]}>Aylık görünüm</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.weekHeader}>
        {weekLabels.map((label) => (
          <Text key={label} style={[styles.weekLabel, { color: theme.colors.textMuted }]}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {days.map((day) => {
          const active = day.completedTaskCount > 0;
          const isToday = day.date === date;
          const dimmed = isPremium && !day.isCurrentMonth;

          return (
            <View key={day.date} style={styles.calendarCell}>
              <View
                style={[
                  styles.dayDot,
                  isToday ? styles.todayDot : null,
                  {
                    backgroundColor: active ? theme.colors.primarySoft : theme.colors.surfaceMuted,
                    borderColor: isToday ? theme.colors.accent : theme.colors.border,
                    opacity: dimmed ? 0.28 : 1
                  }
                ]}
              />
              <Text style={[styles.dayNumber, { color: isToday ? theme.colors.accent : theme.colors.textMuted, opacity: dimmed ? 0.36 : 1 }]}>
                {Number(day.date.slice(-2))}
              </Text>
            </View>
          );
        })}
      </View>
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  kicker: {
    fontSize: 11,
    fontWeight: "900"
  },
  plus: {
    fontSize: 12,
    fontWeight: "900"
  },
  todayText: {
    fontSize: 11,
    fontWeight: "900",
    marginTop: 2,
    textTransform: "capitalize"
  },
  weekHeader: {
    flexDirection: "row"
  },
  weekLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center"
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 10
  },
  calendarCell: {
    alignItems: "center",
    gap: 4,
    minHeight: 35,
    width: "14.2857%"
  },
  dayDot: {
    borderRadius: 999,
    borderWidth: 1,
    height: 16,
    width: 16
  },
  dayNumber: {
    fontSize: 9,
    fontWeight: "900"
  },
  todayDot: {
    borderWidth: 2,
    transform: [{ scale: 1.16 }]
  }
});
