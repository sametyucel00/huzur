import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useContentStore } from "@/stores/contentStore";
import { initializeLocalNotifications } from "@/services/notifications/localNotifications";
import { useLocalProfileStore } from "@/stores/localProfileStore";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function RootLayout() {
  const theme = useAppTheme();
  const hydrate = useContentStore((state) => state.hydrate);
  const hydrateProfile = useLocalProfileStore((state) => state.hydrate);
  const hydrateProgress = useLocalProgressStore((state) => state.hydrate);
  const hydrateSubscription = useSubscriptionStore((state) => state.hydrate);

  useEffect(() => {
    hydrate().catch(() => undefined);
    hydrateProfile().catch(() => undefined);
    hydrateProgress().catch(() => undefined);
    hydrateSubscription().catch(() => undefined);

    if (Platform.OS !== "web") {
      initializeLocalNotifications().catch(() => undefined);
      import("@/storage/sqlite")
        .then(({ ensureLocalTables }) => ensureLocalTables())
        .catch(() => undefined);
    }
  }, [hydrate, hydrateProfile, hydrateProgress, hydrateSubscription]);

  return (
    <>
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <View style={styles.boundary}>
      <View style={styles.boundaryCard}>
        <Text style={styles.boundaryKicker}>Sükût kısa bir duraklama yaşadı</Text>
        <Text style={styles.boundaryTitle}>Uygulama beklenmeyen bir hata ile karşılaştı.</Text>
        <Text style={styles.boundaryText}>
          Endişelenme, cihazındaki ibadet verileri dışarı gönderilmedi. Tekrar deneyebilir veya uygulamayı yenileyebilirsin.
        </Text>
        {__DEV__ ? <Text style={styles.boundaryDebug}>{error.message}</Text> : null}
        <Pressable accessibilityRole="button" accessibilityLabel="Tekrar dene" onPress={retry} style={styles.boundaryButton}>
          <Text style={styles.boundaryButtonText}>Tekrar dene</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boundary: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#07111E"
  },
  boundaryCard: {
    borderRadius: 30,
    gap: 14,
    padding: 24,
    backgroundColor: "#101C2C",
    borderColor: "rgba(255, 232, 198, 0.18)",
    borderWidth: 1
  },
  boundaryKicker: {
    color: "#F1C98B",
    fontSize: 12,
    fontWeight: "900"
  },
  boundaryTitle: {
    color: "#FFF8ED",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 30
  },
  boundaryText: {
    color: "#D8CBBB",
    fontSize: 15,
    lineHeight: 22
  },
  boundaryDebug: {
    color: "#F1A0A0",
    fontSize: 12,
    lineHeight: 18
  },
  boundaryButton: {
    alignItems: "center",
    borderRadius: 999,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 18,
    backgroundColor: "#F1C98B"
  },
  boundaryButtonText: {
    color: "#07111E",
    fontSize: 15,
    fontWeight: "900"
  }
});
