import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { getDailyRotatedItem } from "@sukut/shared";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { SecondaryButton } from "@/components/SecondaryButton";
import { ZikrCounter } from "@/components/ZikrCounter";
import { useContentStore } from "@/stores/contentStore";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";
import { confirmAction } from "@/utils/dialog";

export function ZikrScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { dailyContents, zikrs } = useContentStore((state) => state.bundle);
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const daily = getDailyRotatedItem(dailyContents.filter((item) => item.isActive && (isPremium || !item.isPremium)));
  const zikr =
    zikrs.find((item) => item.id === daily?.zikrId && item.isActive !== false && (isPremium || !item.isPremium)) ??
    getDailyRotatedItem(zikrs.filter((item) => item.isActive && (isPremium || !item.isPremium)));
  const { zikrCount, zikrTarget, completedGoals, incrementZikr, resetZikr } = useLocalProgressStore();
  const isCompleted = completedGoals.completedZikr;

  const confirmReset = () => {
    confirmAction({
      title: "Sayaç sıfırlansın mı?",
      message: "Mevcut zikir sayısı sıfırlanır.",
      confirmText: "Sıfırla",
      destructive: true,
      onConfirm: resetZikr
    });
  };

  return (
    <AppScreen>
      <AppHeader title="Zikir alanı" subtitle="Odaklan, ritmini koru, sayacı sakince ilerlet." />
      <View style={[styles.intent, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.intentMeta, { color: theme.colors.accent }]}>{zikr?.title ?? "Günlük zikir"}</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>{zikr?.description}</Text>
        {isCompleted ? <Text style={[styles.completed, { color: theme.colors.calm }]}>Bugünkü hedef tamamlandı</Text> : null}
      </View>
      <ZikrCounter count={zikrCount} target={zikrTarget} onIncrement={incrementZikr} />
      <View style={styles.actions}>
        {zikr ? <SecondaryButton label="Detay" onPress={() => router.push(`/zikr/${zikr.id}`)} /> : null}
        <SecondaryButton label="Sıfırla" onPress={confirmReset} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  intent: {
    borderRadius: 26,
    borderWidth: 1,
    gap: 8,
    padding: 18
  },
  intentMeta: {
    fontSize: 13,
    fontWeight: "900"
  },
  completed: {
    fontSize: 12,
    fontWeight: "900"
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "center"
  }
});
