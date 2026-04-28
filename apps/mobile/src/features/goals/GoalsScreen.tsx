import { Text, View, StyleSheet } from "react-native";
import { createDailyPlan } from "@sukut/shared";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { BadgePill } from "@/components/BadgePill";
import { ContentCard } from "@/components/ContentCard";
import { DailyActionCard } from "@/components/DailyActionCard";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";

export function GoalsScreen() {
  const theme = useAppTheme();
  const { date, completedGoals, toggleGoal, streakCount, bestStreak } = useLocalProgressStore();
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const plan = createDailyPlan({ date, completedGoals, isPremium });
  const completedCount = plan.tasks.filter((task) => task.isCompleted).length;

  return (
    <AppScreen>
      <AppHeader title="Bugünkü Sükût Planın" subtitle="Ana sayfadaki planın detaylı ve aynı ritimdeki görünümü." />
      <View style={[styles.hero, theme.shadows.soft, { backgroundColor: theme.colors.primarySoft }]}>
        <BadgePill label={`${completedCount}/${plan.tasks.length} tamamlandı`} tone="accent" />
        <Text style={[styles.heroTitle, { color: "#FFF8ED" }]}>Bugünün sakin akışı</Text>
        <View style={[styles.progressTrack, { backgroundColor: "rgba(255,255,255,0.14)" }]}>
          <View style={[styles.progressFill, { backgroundColor: theme.colors.accent, width: `${plan.progressRatio * 100}%` }]} />
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: theme.colors.accent }]}>{streakCount}</Text>
            <Text style={[theme.typography.caption, { color: "#EDE4D7" }]}>gün devam</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: theme.colors.calm }]}>{bestStreak}</Text>
            <Text style={[theme.typography.caption, { color: "#EDE4D7" }]}>en iyi devam</Text>
          </View>
        </View>
      </View>
      {plan.tasks.map((task) => (
        <ContentCard key={task.id}>
          <DailyActionCard title={task.title} completed={task.isCompleted} onPress={() => toggleGoal(task.id)} />
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{task.description}</Text>
        </ContentCard>
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 34,
    gap: 16,
    padding: 24,
    alignSelf: "stretch",
    width: "100%"
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34
  },
  progressTrack: {
    borderRadius: 999,
    height: 10,
    overflow: "hidden"
  },
  progressFill: {
    borderRadius: 999,
    height: "100%"
  },
  statsRow: {
    flexDirection: "row",
    gap: 12
  },
  stat: {
    flex: 1,
    gap: 2
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800"
  }
});
