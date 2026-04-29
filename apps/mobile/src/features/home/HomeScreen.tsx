import { useEffect, useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { createDailyPlan, getDailyRotatedItem, toLocalDateKey, tr, type PrayerTimesDay, type SpecialEventContent } from "@sukut/shared";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { ContentCard } from "@/components/ContentCard";
import { DailyActionCard } from "@/components/DailyActionCard";
import { HuzurCard } from "@/components/HuzurCard";
import { MoodSelector } from "@/components/MoodSelector";
import { PrayerTimeCard } from "@/components/PrayerTimeCard";
import { DailyPlanCard } from "@/features/habits/DailyPlanCard";
import { ProgressHubCard } from "@/features/habits/ProgressHubCard";
import { useCurrentMinute } from "@/hooks/useCurrentMinute";
import { getNextPrayerSummary } from "@/services/prayerTimes/nextPrayer";
import { getTodayPrayerTimes } from "@/services/prayerTimes/provider";
import { useContentStore } from "@/stores/contentStore";
import { useLocalProfileStore } from "@/stores/localProfileStore";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";

export function HomeScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { bundle } = useContentStore();
  const city = useLocalProfileStore((state) => state.profile?.city ?? "İstanbul");
  const { date, streakCount, completedGoals, toggleGoal } = useLocalProgressStore();
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const [prayerDay, setPrayerDay] = useState<PrayerTimesDay | null>(null);
  const currentMinute = useCurrentMinute();
  const today = new Date();
  const visibleDailyContents = bundle.dailyContents.filter((item) => item.isActive && (isPremium || !item.isPremium));
  const daily = getDailyRotatedItem(visibleDailyContents, today);
  const event = getDailyRotatedItem(getVisibleEvents(bundle.events, today, isPremium), today);
  const dua = bundle.duas.find((item) => item.id === daily?.duaId && (isPremium || !item.isPremium)) ?? bundle.duas.find((item) => !item.isPremium);
  const zikr = bundle.zikrs.find((item) => item.id === daily?.zikrId && (isPremium || !item.isPremium)) ?? bundle.zikrs.find((item) => !item.isPremium);
  const prayerTimes = prayerDay?.times ?? [];
  const nextPrayer = getNextPrayerSummary(prayerTimes, currentMinute);
  const completedCount = createDailyPlan({
    date,
    completedGoals,
    isPremium
  }).tasks.filter((task) => task.isCompleted).length;

  useEffect(() => {
    getTodayPrayerTimes(city).then(setPrayerDay).catch(() => setPrayerDay(null));
  }, [city]);

  return (
    <AppScreen>
      <AppHeader eyebrow="Sükût" title="Bugünün huzur alanı" subtitle="Az, düzenli ve içten bir ritim." />
      <HuzurCard title={daily?.title ?? tr.home.dailyPeace} message={daily?.shortMessage ?? tr.states.offlineSeed} />
      <DailyPlanCard onOpenPaywall={() => router.push("/paywall")} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Namaz vakitleri ekranını aç"
        onPress={() => router.push("/prayer-times")}
        style={[styles.nextPrayer, theme.shadows.soft, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      >
        <View style={styles.nextPrayerCopy}>
          <Text style={[styles.micro, { color: theme.colors.textMuted }]}>
            {city} · {tr.home.todayPrayerSummary}
          </Text>
          <Text style={[theme.typography.section, { color: theme.colors.text }]}>
            {nextPrayer ? `${nextPrayer.dayOffset ? "Yarın " : ""}${nextPrayer.label} ${nextPrayer.time}` : "Vakitler hazırlanıyor"}
          </Text>
        </View>
        {nextPrayer ? <Text style={[styles.remaining, { color: theme.colors.accent }]}>{nextPrayer.remainingLabel}</Text> : null}
      </Pressable>

      <View style={styles.rhythmRow}>
        <View style={[styles.rhythmBlock, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
          <Text style={[styles.rhythmValue, { color: theme.colors.accent }]}>{streakCount}</Text>
          <Text style={[styles.micro, { color: theme.colors.textMuted }]}>gün devam</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Hedefleri aç"
          onPress={() => router.push("/goals")}
          style={[styles.rhythmBlock, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}
        >
          <Text style={[styles.rhythmValue, { color: theme.colors.text }]}>{completedCount}</Text>
          <Text style={[styles.micro, { color: theme.colors.textMuted }]}>niyet tamam</Text>
        </Pressable>
      </View>

      <ProgressHubCard onPress={() => router.push("/progress")} />

      <ContentCard>
        <Text style={[styles.micro, { color: theme.colors.textMuted }]}>Uygulama alanları</Text>
        <View style={styles.areaGrid}>
          <Pressable accessibilityRole="button" onPress={() => router.push("/moods")} style={[styles.areaButton, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
            <Text style={[styles.areaTitle, { color: theme.colors.text }]}>Ruh hali</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push("/goals")} style={[styles.areaButton, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
            <Text style={[styles.areaTitle, { color: theme.colors.text }]}>Hedefler</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push("/badges")} style={[styles.areaButton, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
            <Text style={[styles.areaTitle, { color: theme.colors.text }]}>Rozetler</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push("/qibla")} style={[styles.areaButton, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
            <Text style={[styles.areaTitle, { color: theme.colors.text }]}>Kıble</Text>
          </Pressable>
        </View>
      </ContentCard>

      <ContentCard>
        <Text style={[styles.micro, { color: theme.colors.textMuted }]}>{tr.home.dailySuggestion}</Text>
        <DailyActionCard
          title={dua?.title ? `Bugünün duası: ${dua.title}` : "Bugünün duası"}
          completed={completedGoals.readDailyContent}
          onPress={() => {
            toggleGoal("readDailyContent");
            if (daily?.id) {
              router.push(`/daily/${daily.id}`);
            }
          }}
        />
        {zikr ? (
          <Pressable accessibilityRole="button" onPress={() => router.push(`/zikr/${zikr.id}`)} style={[styles.eventLink, { borderColor: theme.colors.border }]}>
            <Text style={[styles.eventText, { color: theme.colors.text }]}>Bugünün zikri: {zikr.title}</Text>
            <Text style={[styles.micro, { color: theme.colors.textMuted }]}>{zikr.recommendedCount} tekrar önerilir</Text>
          </Pressable>
        ) : null}
        {event ? (
          <Pressable accessibilityRole="button" onPress={() => router.push(`/event/${event.id}`)} style={[styles.eventLink, { borderColor: theme.colors.border }]}>
            <Text style={[styles.eventText, { color: theme.colors.text }]}>{event.title}</Text>
            <Text style={[styles.micro, { color: theme.colors.textMuted }]}>Özel gün içeriği</Text>
          </Pressable>
        ) : null}
      </ContentCard>

      <ContentCard>
        <View style={styles.sectionHead}>
          <Text style={[theme.typography.section, { color: theme.colors.text }]}>{tr.home.moodShortcut}</Text>
          <Pressable accessibilityRole="button" onPress={() => router.push("/moods")}>
            <Text style={[styles.textAction, { color: theme.colors.accent }]}>Aç</Text>
          </Pressable>
        </View>
        <MoodSelector onSelect={() => router.push("/moods")} />
      </ContentCard>

      {prayerTimes.length > 0 ? <PrayerTimeCard times={prayerTimes} nextKey={nextPrayer?.key} /> : null}
    </AppScreen>
  );
}

function getVisibleEvents(events: SpecialEventContent[], date: Date, isPremium: boolean) {
  const dateKey = toLocalDateKey(date);
  const isFriday = date.getDay() === 5;

  return events.filter((event) => {
    if (!event.isActive || (!isPremium && event.isPremium)) {
      return false;
    }

    const inRange = event.startDate <= dateKey && dateKey <= event.endDate;
    if (event.eventType === "friday") {
      return isFriday && inRange;
    }

    return inRange;
  });
}

const styles = StyleSheet.create({
  nextPrayer: {
    alignItems: "flex-start",
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: "column",
    gap: 14,
    minHeight: 86,
    padding: 16,
    width: "100%"
  },
  nextPrayerCopy: {
    gap: 4,
    width: "100%"
  },
  remaining: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "left"
  },
  rhythmRow: {
    flexDirection: "row",
    gap: 10
  },
  rhythmBlock: {
    borderRadius: 22,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    minHeight: 82,
    padding: 14
  },
  areaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  areaButton: {
    borderRadius: 18,
    borderWidth: 1,
    flexGrow: 1,
    flexBasis: "47%",
    minHeight: 54,
    justifyContent: "center",
    minWidth: 0,
    paddingHorizontal: 14
  },
  areaTitle: {
    fontSize: 14,
    fontWeight: "900"
  },
  rhythmValue: {
    fontSize: 30,
    fontWeight: "900"
  },
  micro: {
    fontSize: 11,
    fontWeight: "900"
  },
  sectionHead: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textAction: {
    fontSize: 13,
    fontWeight: "900"
  },
  eventLink: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 3,
    padding: 14
  },
  eventText: {
    fontSize: 15,
    fontWeight: "900"
  }
});
