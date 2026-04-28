import { Pressable, Text, View, StyleSheet } from "react-native";
import { createProgressDays, createWeeklyReflection } from "@sukut/shared";
import { ContentCard } from "@/components/ContentCard";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";

function formatDate(dateKey: string) {
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${dateKey}T12:00:00.000Z`));
}

export function WeeklyReflectionCard({
  onOpenPaywall,
  onOpenDetail,
  showUpgradeAction = true
}: {
  onOpenPaywall: () => void;
  onOpenDetail?: () => void;
  showUpgradeAction?: boolean;
}) {
  const theme = useAppTheme();
  const { date, completedGoals, zikrCount, streakCount, progressDays: historyDays } = useLocalProgressStore();
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const progressDays = createProgressDays({
    today: date,
    completedGoals,
    zikrCount,
    duaReadCount: completedGoals.readDua ? 1 : 0,
    historyDays,
    startOnMonday: true
  });
  const reflection = createWeeklyReflection({ progressDays, streakCount, isPremium });
  const range = `${formatDate(reflection.weekStart)} - ${formatDate(reflection.weekEnd)}`;

  return (
    <ContentCard>
      <Text style={[styles.kicker, { color: theme.colors.accent }]}>Haftalık içgörü</Text>
      <Text style={[styles.dateRange, { color: theme.colors.textMuted }]}>{range}</Text>
      <Text style={[theme.typography.section, { color: theme.colors.text }]}>{reflection.activeDays} gün geri döndün</Text>
      <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>{reflection.summaryText}</Text>
      <View style={styles.stats}>
        <Metric label="Görev" value={reflection.completedTasks} />
        <Metric label="Zikir" value={reflection.zikrCount} />
        <Metric label="Devam" value={streakCount} />
      </View>
      {(isPremium || showUpgradeAction) ? (
        <Pressable accessibilityRole="button" onPress={isPremium ? onOpenDetail : onOpenPaywall}>
          <Text style={[styles.ayricalik, { color: theme.colors.accent }]}>
            {isPremium ? "Haftalık detayı aç" : "Detaylı içgörü Sükût Ayrıcalık ile açılır"}
          </Text>
        </Pressable>
      ) : null}
      {!isPremium && showUpgradeAction ? (
        <Text style={[styles.note, { color: theme.colors.textMuted }]}>Ücretsiz özet açık kalır; Ayrıcalık yalnızca derin analiz ekler.</Text>
      ) : null}
    </ContentCard>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  const theme = useAppTheme();

  return (
    <View style={[styles.metric, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
      <Text style={[styles.metricValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kicker: {
    fontSize: 11,
    fontWeight: "900"
  },
  dateRange: {
    fontSize: 12,
    fontWeight: "900"
  },
  stats: {
    flexDirection: "row",
    gap: 8
  },
  metric: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    minHeight: 72,
    justifyContent: "center",
    padding: 10
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "900"
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "900"
  },
  ayricalik: {
    fontSize: 12,
    fontWeight: "900"
  },
  note: {
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16
  }
});
