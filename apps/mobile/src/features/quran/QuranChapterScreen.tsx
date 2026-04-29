import { useEffect, useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
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
    <AppScreen scroll={false}>
      <Stack.Screen options={{ title: chapter?.translation ?? "Kur'an" }} />
      <FlatList
        data={verses}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={6}
        ListHeaderComponent={
          <View style={styles.headerContent}>
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
          </View>
        }
        renderItem={({ item }) => {
          const favorite = isFavoriteVerse(chapterId, item.id);
          const focused = focusVerseId === item.id;

          return (
            <ContentCard>
              <View style={styles.verseHead}>
                <BadgePill label={`${chapterId}:${item.id}`} tone={focused ? "accent" : "calm"} />
                <IconButton
                  icon={favorite ? "heart" : "heart-outline"}
                  accessibilityLabel={favorite ? "Ayeti favorilerden çıkar" : "Ayeti favorilere ekle"}
                  onPress={() => toggleFavoriteVerse({ chapterId, verseId: item.id })}
                />
              </View>
              <Pressable accessibilityRole="button" onPress={() => setLastRead({ chapterId, verseId: item.id })} style={styles.verseReadArea}>
                <Text style={[styles.arabic, { color: theme.colors.primary }]}>{item.text}</Text>
                <Text style={[styles.transliteration, { color: theme.colors.text }]}>{item.transliteration}</Text>
                <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>{item.translation}</Text>
                <Text style={[styles.saveHint, { color: theme.colors.accent }]}>Kaldığım yer olarak işaretle</Text>
              </Pressable>
            </ContentCard>
          );
        }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: 12,
    paddingBottom: 12
  },
  headerContent: {
    gap: 14
  },
  topActions: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  hero: {
    borderRadius: 30,
    gap: 12,
    padding: 22
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chapterArabic: {
    fontSize: 32,
    lineHeight: 44,
    textAlign: "right"
  },
  verseHead: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  verseReadArea: {
    gap: 10
  },
  arabic: {
    fontSize: 29,
    lineHeight: 50,
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
