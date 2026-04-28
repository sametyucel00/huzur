import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createProgressDays, createWeeklyReflection } from "@sukut/shared";
import { ContentCard } from "@/components/ContentCard";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useAppTheme } from "@/theme/useAppTheme";

export function ProgressHubCard({ onPress }: { onPress: () => void }) {
  const theme = useAppTheme();
  const { date, completedGoals, zikrCount, streakCount, earnedBadgeIds, progressDays: historyDays } = useLocalProgressStore();
  const progressDays = createProgressDays({
    today: date,
    completedGoals,
    zikrCount,
    duaReadCount: completedGoals.readDua ? 1 : 0,
    historyDays,
    startOnMonday: true
  });
  const reflection = createWeeklyReflection({ progressDays, streakCount, isPremium: false });
  const activeDays = progressDays.filter((day) => day.completedTaskCount > 0).length;

  return (
    <Pressable accessibilityRole="button" accessibilityLabel="İlerleme merkezini aç" onPress={onPress}>
      <ContentCard>
        <View style={styles.header}>
          <View style={styles.copy}>
            <Text style={[styles.kicker, { color: theme.colors.accent }]}>İlerleme merkezi</Text>
            <Text style={[theme.typography.section, { color: theme.colors.text }]}>Haftanı tek yerden gör</Text>
            <Text numberOfLines={2} style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              Mini ilerleme, haftalık içgörü ve sessiz ödüller burada.
            </Text>
          </View>
          <View style={[styles.icon, { backgroundColor: theme.colors.primarySoft }]}>
            <Ionicons name="analytics-outline" size={23} color={theme.colors.accent} />
          </View>
        </View>
        <View style={styles.metrics}>
          <Metric label="aktif gün" value={activeDays} />
          <Metric label="görev" value={reflection.completedTasks} />
          <Metric label="ödül" value={earnedBadgeIds.length} />
        </View>
      </ContentCard>
    </Pressable>
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
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14
  },
  copy: {
    flex: 1,
    gap: 5
  },
  kicker: {
    fontSize: 11,
    fontWeight: "900"
  },
  icon: {
    alignItems: "center",
    borderRadius: 22,
    height: 50,
    justifyContent: "center",
    width: 50
  },
  metrics: {
    flexDirection: "row",
    gap: 8
  },
  metric: {
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    padding: 10
  },
  metricValue: {
    fontSize: 19,
    fontWeight: "900"
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "900"
  }
});
