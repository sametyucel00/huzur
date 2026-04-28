import { Text, View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { AppScreen } from "@/components/AppScreen";
import { BadgePill } from "@/components/BadgePill";
import { ContentCard } from "@/components/ContentCard";
import { EmptyState } from "@/components/EmptyState";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useContentStore } from "@/stores/contentStore";
import { useAppTheme } from "@/theme/useAppTheme";

const eventTypeLabels = {
  friday: "Cuma",
  kandil: "Kandil",
  ramadan: "Ramazan",
  eid: "Bayram"
} as const;

export function EventDetailScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, duas, zikrs } = useContentStore((state) => state.bundle);
  const event = events.find((item) => item.id === id);

  if (!event) {
    return (
      <AppScreen>
        <Stack.Screen options={{ title: "Özel gün" }} />
        <EmptyState message="Özel gün içeriği bulunamadı." />
        <SecondaryButton label="Geri dön" onPress={() => router.back()} />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: event.title }} />
      <SecondaryButton label="Geri" onPress={() => router.back()} />
      <ContentCard>
        <View style={styles.badges}>
          <BadgePill label={eventTypeLabels[event.eventType]} tone="accent" />
          <BadgePill label={`${event.startDate} - ${event.endDate}`} tone="calm" />
        </View>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>{event.title}</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>{event.description}</Text>
        <Text style={[theme.typography.caption, { color: theme.colors.accent }]}>Kaynak: {event.source}</Text>
        <View style={styles.actions}>
          {event.suggestedDuaIds.map((duaId) => {
            const dua = duas.find((item) => item.id === duaId);
            return dua ? <SecondaryButton key={dua.id} label={`Dua: ${dua.title}`} onPress={() => router.push(`/dua/${dua.id}`)} /> : null;
          })}
          {event.suggestedZikrIds.map((zikrId) => {
            const zikr = zikrs.find((item) => item.id === zikrId);
            return zikr ? <SecondaryButton key={zikr.id} label={`Zikir: ${zikr.title}`} onPress={() => router.push(`/zikr/${zikr.id}`)} /> : null;
          })}
        </View>
      </ContentCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  actions: {
    gap: 10
  }
});
