import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { includesTurkishSearch } from "@sukut/shared";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { BadgePill } from "@/components/BadgePill";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { IconButton } from "@/components/IconButton";
import { useContentStore } from "@/stores/contentStore";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";

const allCategoriesId = "all";

export function DuasScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const [query, setQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(allCategoriesId);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { duas, categories } = useContentStore((state) => state.bundle);
  const favoriteContentIds = useLocalProgressStore((state) => state.favoriteContentIds);
  const toggleFavorite = useLocalProgressStore((state) => state.toggleFavorite);
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const favoriteCount = favoriteContentIds.filter((id) => duas.some((dua) => dua.id === id)).length;
  const duaCategories = categories.filter((category) => category.type === "dua");
  const filtered = useMemo(
    () =>
      duas.filter((dua) => {
        const matchesSearch = includesTurkishSearch(`${dua.title} ${dua.meaningTr} ${dua.transliterationTr}`, query);
        const matchesCategory = selectedCategoryId === allCategoriesId || dua.categoryId === selectedCategoryId;
        const matchesFavorite = !showFavoritesOnly || favoriteContentIds.includes(dua.id);
        return matchesSearch && matchesCategory && matchesFavorite;
      }),
    [duas, favoriteContentIds, query, selectedCategoryId, showFavoritesOnly]
  );

  return (
    <AppScreen>
      <AppHeader title="Dua kütüphanesi" subtitle="Kaynaklı, sakin ve okunabilir bir seçki." />
      <View style={[styles.favoritePanel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.favoriteCopy}>
          <Text style={[styles.favoriteKicker, { color: theme.colors.accent }]}>Favori dualar</Text>
          <Text style={[styles.favoriteText, { color: theme.colors.textMuted }]}>
            {favoriteCount > 0 ? `${favoriteCount} dua kendi seçkinde.` : "Kalbine yakın duaları buraya ekleyebilirsin."}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: showFavoritesOnly }}
          onPress={() => setShowFavoritesOnly((value) => !value)}
          style={[
            styles.favoriteButton,
            {
              backgroundColor: showFavoritesOnly ? theme.colors.primarySoft : theme.colors.surfaceMuted,
              borderColor: showFavoritesOnly ? theme.colors.accent : theme.colors.border
            }
          ]}
        >
          <Text style={[styles.favoriteButtonText, { color: showFavoritesOnly ? "#FFF8ED" : theme.colors.text }]}>
            {showFavoritesOnly ? "Tümünü göster" : "Favorileri gör"}
          </Text>
        </Pressable>
      </View>
      <TextInput
        accessibilityLabel="Dua ara"
        placeholder="Dua, anlam veya okunuş ara"
        placeholderTextColor={theme.colors.textMuted}
        value={query}
        onChangeText={setQuery}
        style={[styles.search, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
      />
      <View style={styles.categoryGrid}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: selectedCategoryId === allCategoriesId }}
          onPress={() => setSelectedCategoryId(allCategoriesId)}
          style={[
            styles.categoryPill,
            {
              backgroundColor: selectedCategoryId === allCategoriesId ? theme.colors.primarySoft : theme.colors.surfaceMuted,
              borderColor: selectedCategoryId === allCategoriesId ? theme.colors.accent : theme.colors.border
            }
          ]}
        >
          <Text numberOfLines={1} style={[styles.categoryText, { color: selectedCategoryId === allCategoriesId ? "#FFF8ED" : theme.colors.text }]}>
            Tümü
          </Text>
        </Pressable>
        {duaCategories.map((category) => {
          const selected = selectedCategoryId === category.id;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={category.id}
              onPress={() => setSelectedCategoryId(category.id)}
              style={[
                styles.categoryPill,
                {
                  backgroundColor: selected ? theme.colors.primarySoft : theme.colors.surfaceMuted,
                  borderColor: selected ? theme.colors.accent : theme.colors.border
                }
              ]}
            >
              <Text numberOfLines={1} style={[styles.categoryText, { color: selected ? "#FFF8ED" : theme.colors.text }]}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {filtered.length === 0 ? <EmptyState message={showFavoritesOnly ? "Henüz favori dua yok." : undefined} /> : null}
      {filtered.map((dua) => {
        const isFavorite = favoriteContentIds.includes(dua.id);
        const locked = Boolean(dua.isPremium && !isPremium);
        const openTarget = locked ? "/paywall" : `/dua/${dua.id}`;

        return (
          <ContentCard key={dua.id}>
            <View style={styles.cardHeader}>
              <Pressable accessibilityRole="button" onPress={() => router.push(openTarget)} style={styles.titleBlock}>
                <Text style={[styles.source, { color: theme.colors.accent }]}>{dua.source}</Text>
                <Text style={[theme.typography.section, { color: theme.colors.text }]}>{dua.title}</Text>
              </Pressable>
              {!locked ? (
                <IconButton
                  icon={isFavorite ? "heart" : "heart-outline"}
                  accessibilityLabel={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
                  onPress={() => toggleFavorite(dua.id)}
                />
              ) : null}
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`${dua.title} detayını aç`} onPress={() => router.push(openTarget)} style={styles.readArea}>
              <Text numberOfLines={2} style={[styles.arabic, { color: theme.colors.primary }]}>
                {locked ? "Sükût Ayrıcalık özel seçki" : dua.arabicText}
              </Text>
              {!locked ? (
                <Text numberOfLines={2} style={[styles.transliteration, { color: theme.colors.text }]}>
                  {dua.transliterationTr}
                </Text>
              ) : null}
              <Text numberOfLines={2} style={[theme.typography.body, { color: theme.colors.textMuted }]}>
                {locked ? "Temel dua koleksiyonu ücretsiz kalır; bu kayıt özel program içeriğidir." : dua.meaningTr}
              </Text>
            </Pressable>
            {isFavorite ? <BadgePill label="Favori" tone="accent" /> : null}
            {locked ? <BadgePill label="Ayrıcalık" tone="calm" /> : null}
          </ContentCard>
        );
      })}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  favoritePanel: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14
  },
  favoriteCopy: {
    flex: 1,
    gap: 3
  },
  favoriteKicker: {
    fontSize: 12,
    fontWeight: "900"
  },
  favoriteText: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17
  },
  favoriteButton: {
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 14
  },
  favoriteButtonText: {
    fontSize: 12,
    fontWeight: "900"
  },
  search: {
    borderRadius: 24,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 56,
    paddingHorizontal: 18
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  categoryPill: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexShrink: 0
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center"
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  titleBlock: {
    flex: 1,
    gap: 4
  },
  source: {
    fontSize: 11,
    fontWeight: "900"
  },
  arabic: {
    fontSize: 25,
    lineHeight: 38,
    textAlign: "right"
  },
  transliteration: {
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20
  },
  readArea: {
    gap: 7
  }
});
