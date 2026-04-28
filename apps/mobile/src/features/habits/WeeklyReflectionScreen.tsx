import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { createProgressDays, createWeeklyReflection } from "@sukut/shared";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { ContentCard } from "@/components/ContentCard";
import { SecondaryButton } from "@/components/SecondaryButton";
import { MiniProgressCalendar } from "@/features/habits/MiniProgressCalendar";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";

function formatDate(dateKey: string) {
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${dateKey}T12:00:00.000Z`));
}

export function WeeklyReflectionScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const { date, completedGoals, zikrCount, streakCount, progressDays: historyDays } = useLocalProgressStore();
  const progressDays = createProgressDays({
    today: date,
    completedGoals,
    zikrCount,
    duaReadCount: completedGoals.readDua ? 1 : 0,
    historyDays,
    days: 7,
    startOnMonday: true
  });
  const reflection = createWeeklyReflection({ progressDays, streakCount, isPremium });
  const range = `${formatDate(reflection.weekStart)} - ${formatDate(reflection.weekEnd)}`;

  return (
    <AppScreen>
      <AppHeader title="Haftalık içgörü" subtitle="Ritmini ölçmek için sakin, suçluluk kurmayan bir alan." />
      <ContentCard>
        <Text style={[styles.kicker, { color: theme.colors.accent }]}>Bu haftanın özeti</Text>
        <Text style={[styles.dateRange, { color: theme.colors.textMuted }]}>{range}</Text>
        <Text style={[styles.hero, { color: theme.colors.text }]}>{reflection.activeDays} aktif gün</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>{reflection.summaryText}</Text>
        <View style={styles.metricGrid}>
          <Metric label="Görev" value={reflection.completedTasks} />
          <Metric label="Zikir" value={reflection.zikrCount} />
          <Metric label="Dua" value={reflection.duaReadCount} />
          <Metric label="Devam" value={streakCount} />
        </View>
      </ContentCard>
      <MiniProgressCalendar onOpenPaywall={() => router.push("/paywall")} showUpgradeAction={false} />
      {!isPremium ? (
        <ContentCard>
          <Text style={[theme.typography.section, { color: theme.colors.text }]}>Ayrıcalık ile derinleşir</Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            Aylık takvim, önceki haftalarla kıyaslama ve kişisel plan önerileri Sükût Ayrıcalık alanında açılır.
          </Text>
          <SecondaryButton label="Sükût Ayrıcalık'ı gör" onPress={() => router.push("/paywall")} />
        </ContentCard>
      ) : (
        <ContentCard>
          <Text style={[theme.typography.section, { color: theme.colors.text }]}>Kişisel öneri</Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            Bu hafta en güçlü ritmin {reflection.strongestRoutine}. Önümüzdeki hafta sabah veya akşam tek bir niyet seçerek
            devamı daha hafif tutabilirsin.
          </Text>
        </ContentCard>
      )}
    </AppScreen>
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
  hero: {
    fontSize: 38,
    fontWeight: "900"
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  metric: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 82,
    padding: 12,
    width: "47%"
  },
  metricValue: {
    fontSize: 28,
    fontWeight: "900"
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "900"
  }
});
