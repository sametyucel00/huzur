import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { includesTurkishSearch } from "@sukut/shared";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { BadgePill } from "@/components/BadgePill";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { IconButton } from "@/components/IconButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useQuranStore } from "@/stores/quranStore";
import { useAppTheme } from "@/theme/useAppTheme";

type QuranView = "all" | "favorites";

export function QuranScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<QuranView>("all");
  const {
    chapters,
    chapterCache,
    favoriteChapterIds,
    favoriteVerses,
    lastRead,
    isLoading,
    errorMessage,
    hydrate,
    toggleFavoriteChapter
  } = useQuranStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const filtered = useMemo(
    () =>
      chapters.filter((chapter) => {
        const matchesView = view === "all" || favoriteChapterIds.includes(chapter.id);
        const matchesSearch = includesTurkishSearch(`${chapter.id} ${chapter.translation} ${chapter.transliteration} ${chapter.name}`, query);
        return matchesView && matchesSearch;
      }),
    [chapters, favoriteChapterIds, query, view]
  );

  const lastReadChapter = lastRead ? chapters.find((chapter) => chapter.id === lastRead.chapterId) : null;

  return (
    <AppScreen scroll={false}>
      <FlatList
        data={filtered}
        keyExtractor={(chapter) => String(chapter.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={14}
        maxToRenderPerBatch={12}
        windowSize={7}
        removeClippedSubviews
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <AppHeader title="Kur'an" subtitle="Sureleri, ayetleri ve kaldığın yeri düzenli bir okuma alanında takip et." />

            {lastRead && lastReadChapter ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Kaldığın yerden devam et"
                onPress={() => router.push(`/quran/${lastRead.chapterId}?verse=${lastRead.verseId}`)}
              >
                <ContentCard>
                  <Text style={[styles.kicker, { color: theme.colors.accent }]}>Kaldığın yer</Text>
                  <Text style={[theme.typography.section, styles.shrinkText, { color: theme.colors.text }]}>
                    {lastReadChapter.translation} {lastRead.verseId}. ayet
                  </Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Son okuduğun yerden devam et.</Text>
                </ContentCard>
              </Pressable>
            ) : null}

            <TextInput
              accessibilityLabel="Sure ara"
              autoCorrect={false}
              placeholder="Sure adı veya numara ara"
              placeholderTextColor={theme.colors.textMuted}
              value={query}
              onChangeText={setQuery}
              style={[styles.search, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
            />

            <View style={styles.segment}>
              <SegmentButton label="Tüm sureler" selected={view === "all"} onPress={() => setView("all")} />
              <SegmentButton label={`Favoriler (${favoriteChapterIds.length + favoriteVerses.length})`} selected={view === "favorites"} onPress={() => setView("favorites")} />
            </View>

            {errorMessage ? (
              <ErrorState
                title="Kur'an verisi hazırlanamadı"
                message={errorMessage}
                actionLabel="Tekrar dene"
                onAction={() => hydrate().catch(() => undefined)}
              />
            ) : null}
            {isLoading && chapters.length === 0 ? <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>Sureler yükleniyor.</Text> : null}

            {view === "favorites" && favoriteVerses.length > 0 ? (
              <ContentCard>
                <Text style={[styles.kicker, { color: theme.colors.accent }]}>Favori ayetler</Text>
                {favoriteVerses.map((bookmark) => {
                  const chapter = chapters.find((item) => item.id === bookmark.chapterId);
                  const cachedVerse = chapterCache[bookmark.chapterId]?.verses.find((item) => item.id === bookmark.verseId);

                  return (
                    <Pressable
                      key={`${bookmark.chapterId}-${bookmark.verseId}`}
                      accessibilityRole="button"
                      onPress={() => router.push(`/quran/${bookmark.chapterId}?verse=${bookmark.verseId}`)}
                      style={[styles.favoriteVerse, { borderColor: theme.colors.border }]}
                    >
                      <Text style={[styles.favoriteVerseTitle, { color: theme.colors.text }]}>
                        {chapter?.translation ?? `${bookmark.chapterId}. sure`} {bookmark.verseId}. ayet
                      </Text>
                      {cachedVerse ? (
                        <Text numberOfLines={2} style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                          {cachedVerse.translation}
                        </Text>
                      ) : (
                        <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Açmak için dokun.</Text>
                      )}
                    </Pressable>
                  );
                })}
              </ContentCard>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          !isLoading ? <EmptyState message={view === "favorites" ? "Henüz favori sure veya ayet yok." : "Sure bulunamadı."} /> : null
        }
        renderItem={({ item: chapter }) => {
          const favorite = favoriteChapterIds.includes(chapter.id);
          return (
            <ContentCard>
              <View style={styles.chapterRow}>
                <Pressable accessibilityRole="button" onPress={() => router.push(`/quran/${chapter.id}`)} style={styles.chapterCopy}>
                  <View style={styles.badges}>
                    <BadgePill label={`${chapter.id}. sure`} tone="calm" />
                    <BadgePill label={`${chapter.total_verses} ayet`} tone="accent" />
                  </View>
                  <Text style={[theme.typography.section, styles.chapterTitle, { color: theme.colors.text }]}>{chapter.translation}</Text>
                  <Text numberOfLines={2} style={[styles.chapterMeta, { color: theme.colors.textMuted }]}>
                    {chapter.transliteration} · {chapter.name}
                  </Text>
                </Pressable>
                <IconButton
                  icon={favorite ? "heart" : "heart-outline"}
                  accessibilityLabel={favorite ? "Sureyi favorilerden çıkar" : "Sureyi favorilere ekle"}
                  onPress={() => toggleFavoriteChapter(chapter.id)}
                />
              </View>
              <SecondaryButton label="Sureyi oku" onPress={() => router.push(`/quran/${chapter.id}`)} />
            </ContentCard>
          );
        }}
      />
    </AppScreen>
  );
}

function SegmentButton({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.segmentButton,
        {
          backgroundColor: selected ? theme.colors.primarySoft : theme.colors.surfaceMuted,
          borderColor: selected ? theme.colors.accent : theme.colors.border
        }
      ]}
    >
      <Text style={[styles.segmentText, { color: selected ? "#FFF8ED" : theme.colors.text }]}>{label}</Text>
    </Pressable>
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
  shrinkText: {
    flexShrink: 1
  },
  search: {
    borderRadius: 22,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 52,
    paddingHorizontal: 16
  },
  segment: {
    flexDirection: "row",
    gap: 8
  },
  segmentButton: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 0,
    paddingHorizontal: 8
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center"
  },
  chapterRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    width: "100%"
  },
  chapterCopy: {
    flex: 1,
    gap: 7,
    minWidth: 0
  },
  chapterTitle: {
    flexShrink: 1
  },
  chapterMeta: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "800"
  },
  favoriteVerse: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 4,
    padding: 12
  },
  favoriteVerseTitle: {
    fontSize: 14,
    fontWeight: "900"
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  kicker: {
    fontSize: 11,
    fontWeight: "900"
  }
});
