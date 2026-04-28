import { Text, View, StyleSheet } from "react-native";
import { useEffect } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { AppScreen } from "@/components/AppScreen";
import { BadgePill } from "@/components/BadgePill";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { IconButton } from "@/components/IconButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useContentStore } from "@/stores/contentStore";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";

export function DuaDetailScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { duas, categories } = useContentStore((state) => state.bundle);
  const favoriteContentIds = useLocalProgressStore((state) => state.favoriteContentIds);
  const toggleFavorite = useLocalProgressStore((state) => state.toggleFavorite);
  const markGoalComplete = useLocalProgressStore((state) => state.markGoalComplete);
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const dua = duas.find((item) => item.id === id);
  const category = categories.find((item) => item.id === dua?.categoryId);
  const locked = Boolean(dua?.isPremium && !isPremium);

  useEffect(() => {
    if (dua && !locked) {
      markGoalComplete("readDua");
    }
  }, [dua, locked, markGoalComplete]);

  if (!dua) {
    return (
      <AppScreen>
        <Stack.Screen options={{ title: "Dua" }} />
        <EmptyState message="Dua bulunamadı." />
        <SecondaryButton label="Geri dön" onPress={() => router.back()} />
      </AppScreen>
    );
  }

  const isFavorite = favoriteContentIds.includes(dua.id);

  if (locked) {
    return (
      <AppScreen>
        <Stack.Screen options={{ title: dua.title }} />
        <SecondaryButton label="Geri" onPress={() => router.back()} />
        <ContentCard>
          <BadgePill label="Sükût Ayrıcalık" tone="accent" />
          <Text style={[theme.typography.section, { color: theme.colors.text }]}>{dua.title}</Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            Temel dua koleksiyonu ücretsiz kalır. Bu içerik özel planlar ve derinleştirilmiş programlar için ayrılmıştır.
          </Text>
          <SecondaryButton label="Ayrıcalık detayını gör" onPress={() => router.push("/paywall")} />
        </ContentCard>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: dua.title }} />
      <View style={styles.headerRow}>
        <SecondaryButton label="Geri" onPress={() => router.back()} />
        <IconButton
          icon={isFavorite ? "heart" : "heart-outline"}
          accessibilityLabel={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
          onPress={() => toggleFavorite(dua.id)}
        />
      </View>
      <View style={[styles.hero, theme.shadows.soft, { backgroundColor: theme.colors.primarySoft }]}>
        <View style={styles.badges}>
          {category ? <BadgePill label={category.name} tone="calm" /> : null}
          {dua.isPremium ? <BadgePill label="Özel içerik" tone="accent" /> : null}
          {isFavorite ? <BadgePill label="Favori" tone="accent" /> : null}
        </View>
        <Text style={[theme.typography.title, { color: "#FFF8ED" }]}>{dua.title}</Text>
        <Text style={[styles.arabic, { color: "#FFF8ED" }]}>{dua.arabicText}</Text>
      </View>
      <ContentCard>
        <Text style={[styles.label, { color: theme.colors.accent }]}>Okunuş</Text>
        <Text style={[theme.typography.body, { color: theme.colors.text }]}>{dua.transliterationTr}</Text>
      </ContentCard>
      <ContentCard>
        <Text style={[styles.label, { color: theme.colors.accent }]}>Anlam</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>{dua.meaningTr}</Text>
        <Text style={[theme.typography.caption, { color: theme.colors.accent }]}>Kaynak: {dua.source}</Text>
      </ContentCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  hero: {
    borderRadius: 34,
    gap: 18,
    padding: 24
  },
  arabic: {
    fontSize: 34,
    lineHeight: 52,
    textAlign: "right"
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  label: {
    fontSize: 12,
    fontWeight: "900"
  }
});
