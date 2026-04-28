import { useMemo, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { getDailyRotatedItem, type MoodKey } from "@sukut/shared";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { ContentCard } from "@/components/ContentCard";
import { MoodSelector } from "@/components/MoodSelector";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useContentStore } from "@/stores/contentStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";

export function MoodsScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const [selectedMood, setSelectedMood] = useState<MoodKey>("seekingPeace");
  const { moodContents, duas, zikrs } = useContentStore((state) => state.bundle);
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const content = useMemo(
    () => moodContents.find((item) => item.moodKey === selectedMood && (isPremium || !item.isPremium)) ?? moodContents.find((item) => !item.isPremium) ?? moodContents[0],
    [isPremium, moodContents, selectedMood]
  );
  const hasPremiumSuggestion = moodContents.some((item) => item.moodKey === selectedMood && item.isPremium);
  const dailyMoodDua = getDailyRotatedItem(content?.duaIds.map((duaId) => duas.find((item) => item.id === duaId)).filter(Boolean) ?? []);
  const dailyMoodZikr = getDailyRotatedItem(content?.zikrIds.map((zikrId) => zikrs.find((item) => item.id === zikrId)).filter(Boolean) ?? []);

  return (
    <AppScreen>
      <AppHeader title="İç hâline göre" subtitle="Bir tavsiye değil, sakin bir eşlik alanı." />
      <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />
      {content ? (
        <View style={[styles.hero, theme.shadows.soft, { backgroundColor: theme.colors.primarySoft }]}>
          <Text style={[styles.meta, { color: theme.colors.accent }]}>{content.title}</Text>
          <Text style={[styles.heroText, { color: "#FFF8ED" }]}>{content.shortAdvice}</Text>
        </View>
      ) : null}
      {content ? (
        <ContentCard>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>{content.description}</Text>
          <View style={styles.actions}>
            {dailyMoodDua ? <SecondaryButton label={`Bugünün duası: ${dailyMoodDua.title}`} onPress={() => router.push(`/dua/${dailyMoodDua.id}`)} /> : null}
            {dailyMoodZikr ? <SecondaryButton label={`Bugünün zikri: ${dailyMoodZikr.title}`} onPress={() => router.push(`/zikr/${dailyMoodZikr.id}`)} /> : null}
          </View>
          {!isPremium && hasPremiumSuggestion ? (
            <SecondaryButton label="Ayrıcalık ile gelişmiş öneriyi gör" onPress={() => router.push("/paywall")} />
          ) : null}
        </ContentCard>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 34,
    gap: 14,
    padding: 24
  },
  meta: {
    fontSize: 12,
    fontWeight: "900"
  },
  heroText: {
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 36
  },
  actions: {
    alignItems: "stretch",
    gap: 10
  }
});
