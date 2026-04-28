import { Text, View, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { createDailyPlan } from "@sukut/shared";
import { ContentCard } from "@/components/ContentCard";
import { DailyActionCard } from "@/components/DailyActionCard";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";

export function DailyPlanCard({ onOpenPaywall, showUpgradeAction = false }: { onOpenPaywall?: () => void; showUpgradeAction?: boolean }) {
  const theme = useAppTheme();
  const { date, completedGoals, toggleGoal } = useLocalProgressStore();
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const plan = createDailyPlan({ date, completedGoals, isPremium });
  const completedCount = plan.tasks.filter((task) => task.isCompleted).length;

  return (
    <ContentCard>
      <View style={styles.header}>
        <View>
          <Text style={[styles.kicker, { color: theme.colors.accent }]}>Bugünkü Sükût Planın</Text>
          <Text style={[theme.typography.section, { color: theme.colors.text }]}>{completedCount}/{plan.tasks.length} adım tamamlandı</Text>
        </View>
        {!isPremium && showUpgradeAction && onOpenPaywall ? <SecondaryButton label="Ayrıcalık plan" onPress={onOpenPaywall} /> : null}
      </View>
      <View style={[styles.track, { backgroundColor: theme.colors.surfaceMuted }]}>
        <View style={[styles.fill, { width: `${plan.progressRatio * 100}%`, backgroundColor: theme.colors.accent }]} />
      </View>
      {plan.tasks.slice(0, 5).map((task) => (
        <DailyActionCard
          key={task.id}
          title={task.title}
          completed={task.isCompleted}
          onPress={() => {
            Haptics.selectionAsync().catch(() => undefined);
            toggleGoal(task.id);
          }}
        />
      ))}
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  kicker: {
    fontSize: 11,
    fontWeight: "900"
  },
  track: {
    borderRadius: 999,
    height: 8,
    overflow: "hidden"
  },
  fill: {
    borderRadius: 999,
    height: "100%"
  }
});
