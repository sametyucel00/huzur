import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ImageBackground, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useContentStore } from "@/stores/contentStore";
import { initializeLocalNotifications } from "@/services/notifications/localNotifications";
import { useLocalProfileStore } from "@/stores/localProfileStore";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { STORAGE_KEYS } from "@/storage/keys";
import { useAppTheme } from "@/theme/useAppTheme";
import { AppDialogHost } from "@/utils/dialog";
import * as SplashScreen from "expo-splash-screen";

const splashImage = require("../assets/splash.png");

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const scalableText = Text as unknown as { defaultProps?: Record<string, unknown> };
const scalableTextInput = TextInput as unknown as { defaultProps?: Record<string, unknown> };

scalableText.defaultProps = {
  ...scalableText.defaultProps,
  maxFontSizeMultiplier: 1.12
};

scalableTextInput.defaultProps = {
  ...scalableTextInput.defaultProps,
  maxFontSizeMultiplier: 1.08
};

export default function RootLayout() {
  const theme = useAppTheme();
  const router = useRouter();
  const segments = useSegments();
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);
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

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2600);
    SplashScreen.hideAsync().catch(() => undefined);
    AsyncStorage.getItem(STORAGE_KEYS.onboardingSeen)
      .then((value) => setOnboardingSeen(value === "true"))
      .catch(() => setOnboardingSeen(false));
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showSplash || onboardingSeen === null) {
      return;
    }

    const currentRoute = segments.join("/");
    if (!onboardingSeen && !currentRoute.includes("onboarding")) {
      AsyncStorage.getItem(STORAGE_KEYS.onboardingSeen)
        .then((value) => {
          if (value === "true") {
            setOnboardingSeen(true);
            return;
          }

          router.replace("/onboarding");
        })
        .catch(() => router.replace("/onboarding"));
    }
  }, [onboardingSeen, router, segments, showSplash]);

  return (
    <>
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ animation: "fade", animationDuration: 120, headerShown: false }} />
      <AppDialogHost />
      {showSplash ? (
        <ImageBackground source={splashImage} resizeMode="cover" style={styles.splash} />
      ) : null}
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
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#101C34",
    zIndex: 20
  },
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

