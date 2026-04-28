import { Text, View, StyleSheet, Share } from "react-native";
import { useEffect } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { AppScreen } from "@/components/AppScreen";
import { BadgePill } from "@/components/BadgePill";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useContentStore } from "@/stores/contentStore";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useAppTheme } from "@/theme/useAppTheme";
import { showInfo } from "@/utils/dialog";

export function DailyContentDetailScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dailyContents, duas, zikrs } = useContentStore((state) => state.bundle);
  const markGoalComplete = useLocalProgressStore((state) => state.markGoalComplete);
  const daily = dailyContents.find((item) => item.id === id);
  const dua = duas.find((item) => item.id === daily?.duaId);
  const zikr = zikrs.find((item) => item.id === daily?.zikrId);

  useEffect(() => {
    if (daily) {
      markGoalComplete("readDailyContent");
    }
  }, [daily, markGoalComplete]);

  if (!daily) {
    return (
      <AppScreen>
        <Stack.Screen options={{ title: "Günlük içerik" }} />
        <EmptyState message="Günlük içerik bulunamadı." />
        <SecondaryButton label="Geri dön" onPress={() => router.back()} />
      </AppScreen>
    );
  }

  const shareText = `${daily.title}\n\n${daily.shortMessage}\n\n${daily.source ?? "Huzur"}`;

  return (
    <AppScreen>
      <Stack.Screen options={{ title: daily.title }} />
      <SecondaryButton label="Geri" onPress={() => router.back()} />
      <ContentCard>
        <BadgePill label={daily.date} tone="calm" />
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>{daily.title}</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>{daily.shortMessage}</Text>
        {daily.verseText ? <Text style={[theme.typography.body, { color: theme.colors.text }]}>{daily.verseText}</Text> : null}
        {daily.source ? <Text style={[theme.typography.caption, { color: theme.colors.accent }]}>Kaynak: {daily.source}</Text> : null}
        <View style={styles.actions}>
          {dua ? <SecondaryButton label={`Dua: ${dua.title}`} onPress={() => router.push(`/dua/${dua.id}`)} /> : null}
          {zikr ? <SecondaryButton label={`Zikir: ${zikr.title}`} onPress={() => router.push(`/zikr/${zikr.id}`)} /> : null}
          <SecondaryButton
            label="Kopyala"
            onPress={() => Clipboard.setStringAsync(shareText).then(() => showInfo("Kopyalandı", "Günlük içerik panoya kopyalandı."))}
          />
          <SecondaryButton
            label="Paylaş"
            onPress={() => Share.share({ message: shareText }).catch(() => showInfo("Paylaşım", "Bu platformda paylaşım açılamadı."))}
          />
        </View>
      </ContentCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 10
  }
});
