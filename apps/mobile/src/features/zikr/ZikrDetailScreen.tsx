import { Text, View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { AppScreen } from "@/components/AppScreen";
import { BadgePill } from "@/components/BadgePill";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useContentStore } from "@/stores/contentStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";

export function ZikrDetailScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { zikrs, categories } = useContentStore((state) => state.bundle);
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const zikr = zikrs.find((item) => item.id === id);
  const category = categories.find((item) => item.id === zikr?.categoryId);

  if (!zikr) {
    return (
      <AppScreen>
        <Stack.Screen options={{ title: "Zikir" }} />
        <EmptyState message="Zikir bulunamadı." />
        <SecondaryButton label="Geri dön" onPress={() => router.back()} />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: zikr.title }} />
      <SecondaryButton label="Geri" onPress={() => router.back()} />
      {zikr.isPremium && !isPremium ? (
        <ContentCard>
          <BadgePill label="Sükût Ayrıcalık" tone="accent" />
          <Text style={[theme.typography.section, { color: theme.colors.text }]}>{zikr.title}</Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            Temel zikir sayacı ücretsiz kalır. Bu zikir özel program içeriği olarak Ayrıcalık alanında açılır.
          </Text>
          <SecondaryButton label="Ayrıcalık detayını gör" onPress={() => router.push("/paywall")} />
        </ContentCard>
      ) : (
      <ContentCard>
        <View style={styles.badges}>
          {category ? <BadgePill label={category.name} tone="calm" /> : null}
          {zikr.isPremium ? <BadgePill label="Ayrıcalık" tone="accent" /> : null}
          <BadgePill label={`${zikr.recommendedCount} hedef`} tone="accent" />
        </View>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>{zikr.title}</Text>
        <Text style={[styles.zikrText, { color: theme.colors.primary }]}>{zikr.text}</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>{zikr.description}</Text>
        <Text style={[theme.typography.caption, { color: theme.colors.accent }]}>Kaynak: {zikr.source}</Text>
      </ContentCard>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  zikrText: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 38
  }
});
