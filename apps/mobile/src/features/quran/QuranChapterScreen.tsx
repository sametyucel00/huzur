import { useEffect, useMemo } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { AppScreen } from "@/components/AppScreen";
import { BadgePill } from "@/components/BadgePill";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { IconButton } from "@/components/IconButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useQuranStore } from "@/stores/quranStore";
import { useAppTheme } from "@/theme/useAppTheme";

export function QuranChapterScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { chapterNumber, verse } = useLocalSearchParams<{ chapterNumber: string; verse?: string }>();
  const chapterId = Number(chapterNumber);
  const focusVerseId = verse ? Number(verse) : null;
  const {
    chapterCache,
    favoriteChapterIds,
    errorMessage,
    isLoading,
    loadChapter,
    setLastRead,
    toggleFavoriteChapter,
    toggleFavoriteVerse,
    isFavoriteVerse
  } = useQuranStore();
  const chapter = chapterCache[chapterId];
  const favoriteChapter = favoriteChapterIds.includes(chapterId);

  useEffect(() => {
    if (Number.isFinite(chapterId)) {
      loadChapter(chapterId);
    }
  }, [chapterId, loadChapter]);

  const verses = useMemo(() => chapter?.verses ?? [], [chapter]);

  if (!Number.isFinite(chapterId)) {
    return (
      <AppScreen>
        <EmptyState message="Sure bulunamadı." />
        <SecondaryButton label="Geri dön" onPress={() => router.back()} />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: chapter?.translation ?? "Kur'an" }} />
      <View style={styles.topActions}>
        <SecondaryButton label="Geri" onPress={() => router.back()} />
        <IconButton
          icon={favoriteChapter ? "heart" : "heart-outline"}
          accessibilityLabel={favoriteChapter ? "Sureyi favorilerden çıkar" : "Sureyi favorilere ekle"}
          onPress={() => toggleFavoriteChapter(chapterId)}
        />
      </View>

      {chapter ? (
        <View style={[styles.hero, theme.shadows.soft, { backgroundColor: theme.colors.primarySoft }]}>
          <View style={styles.badges}>
            <BadgePill label={`${chapter.id}. sure`} tone="accent" />
            <BadgePill label={`${chapter.total_verses} ayet`} tone="calm" />
          </View>
          <Text style={[theme.typography.title, { color: "#FFF8ED" }]}>{chapter.translation}</Text>
          <Text style={[styles.chapterArabic, { color: "#FFF8ED" }]}>{chapter.name}</Text>
          <Text style={[theme.typography.caption, { color: "#EDE4D7" }]}>{chapter.transliteration}</Text>
        </View>
      ) : null}

      {isLoading && !chapter ? <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>Sure yükleniyor.</Text> : null}
      {errorMessage ? (
        <ErrorState
          title="Sure yüklenemedi"
          message={errorMessage}
          actionLabel="Tekrar dene"
          onAction={() => loadChapter(chapterId).catch(() => undefined)}
        />
      ) : null}
      {!isLoading && !chapter ? <EmptyState message="Bu sure için veri bulunamadı." /> : null}

      {verses.map((item) => {
        const favorite = isFavoriteVerse(chapterId, item.id);
        const focused = focusVerseId === item.id;

        return (
          <ContentCard key={item.id}>
            <View style={styles.verseHead}>
              <BadgePill label={`${chapterId}:${item.id}`} tone={focused ? "accent" : "calm"} />
              <View style={styles.verseActions}>
                <IconButton
                  icon={favorite ? "heart" : "heart-outline"}
                  accessibilityLabel={favorite ? "Ayeti favorilerden çıkar" : "Ayeti favorilere ekle"}
                  onPress={() => toggleFavoriteVerse({ chapterId, verseId: item.id })}
                />
              </View>
            </View>
            <Pressable accessibilityRole="button" onPress={() => setLastRead({ chapterId, verseId: item.id })} style={styles.verseReadArea}>
              <Text style={[styles.arabic, { color: theme.colors.primary }]}>{item.text}</Text>
              <Text style={[styles.transliteration, { color: theme.colors.text }]}>{item.transliteration}</Text>
              <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>{item.translation}</Text>
              <Text style={[styles.saveHint, { color: theme.colors.accent }]}>Kaldığım yer olarak işaretle</Text>
            </Pressable>
          </ContentCard>
        );
      })}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  topActions: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  hero: {
    borderRadius: 34,
    gap: 12,
    padding: 24
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chapterArabic: {
    fontSize: 34,
    lineHeight: 44,
    textAlign: "right"
  },
  verseHead: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  verseActions: {
    flexDirection: "row",
    gap: 8
  },
  verseReadArea: {
    gap: 10
  },
  arabic: {
    fontSize: 31,
    lineHeight: 52,
    textAlign: "right"
  },
  transliteration: {
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 21
  },
  saveHint: {
    fontSize: 11,
    fontWeight: "900"
  }
});
