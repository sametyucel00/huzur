import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageBackground, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { AppScreen } from "@/components/AppScreen";
import { BadgePill } from "@/components/BadgePill";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { requestLocalNotificationPermission } from "@/services/notifications/localNotifications";
import { useAppTheme } from "@/theme/useAppTheme";
import { showInfo } from "@/utils/dialog";

const splashImage = require("../../../assets/splash.png");
const ONBOARDING_SEEN_KEY = "sukut:onboardingSeen";

const steps = [
  "Günlük dua, zikir ve Kur'an okuma ritmini sade bir alanda topla.",
  "Namaz vakitleri, kıble ve temel ibadet araçlarını ücretsiz kullan.",
  "İlerlemeni cihazında tut; kişisel ibadet verilerin dışarı gönderilmez."
];

export function OnboardingScreen() {
  const router = useRouter();
  const theme = useAppTheme();

  const finish = async () => {
    await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, "true").catch(() => undefined);
    router.replace("/");
  };

  const requestLocation = async () => {
    if (Platform.OS === "web") {
      showInfo("Konum izni", "Konum izni Android ve iOS uygulamasında istenir. Web önizlemede şehir seçimiyle devam edebilirsin.");
      return;
    }

    const result = await Location.requestForegroundPermissionsAsync().catch(() => null);
    showInfo("Konum izni", result?.granted ? "Konum izni verildi." : "Konum izni verilmedi; manuel şehir seçimiyle devam edebilirsin.");
  };

  const requestNotifications = async () => {
    if (Platform.OS === "web") {
      showInfo("Bildirim izni", "Bildirim izni Android ve iOS uygulamasında istenir.");
      return;
    }

    const result = await requestLocalNotificationPermission().catch(() => ({ granted: false }));
    showInfo("Bildirim izni", result.granted ? "Bildirim izni verildi." : "Bildirim izni verilmedi; ayarlardan tekrar deneyebilirsin.");
  };

  return (
    <AppScreen>
      <ImageBackground source={splashImage} resizeMode="cover" style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.overlay} />
        <View style={styles.heroContent}>
          <BadgePill label="Sükût" tone="accent" />
          <Text style={styles.title}>Sükûta yolculuk, huzura varış</Text>
          <Text style={styles.subtitle}>Az, düzenli ve içten bir manevi alışkanlık alanı.</Text>
        </View>
      </ImageBackground>

      <View style={styles.steps}>
        {steps.map((item, index) => (
          <View key={item} style={[styles.step, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.stepNumber, { color: theme.colors.accent }]}>{index + 1}</Text>
            <Text style={[theme.typography.body, styles.stepText, { color: theme.colors.text }]}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.permissionRow}>
        <SecondaryButton label="Konum izni" onPress={requestLocation} />
        <SecondaryButton label="Bildirim izni" onPress={requestNotifications} />
      </View>

      <PrimaryButton label="Başla" onPress={finish} />
      <View style={styles.secondaryActions}>
        <Pressable accessibilityRole="button" onPress={() => router.push("/privacy")} style={styles.textAction}>
          <Text style={[styles.textActionLabel, { color: theme.colors.textMuted }]}>Gizlilik</Text>
        </Pressable>
        <SecondaryButton label="Kaynaklar" onPress={() => router.push("/sources")} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 30,
    justifyContent: "flex-end",
    minHeight: 360,
    overflow: "hidden"
  },
  heroImage: {
    borderRadius: 30
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7, 17, 30, 0.12)"
  },
  heroContent: {
    gap: 12,
    padding: 22
  },
  title: {
    color: "#FFF8ED",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36
  },
  subtitle: {
    color: "#EDE4D7",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22
  },
  steps: {
    gap: 10
  },
  step: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 68,
    padding: 14
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "900",
    width: 22
  },
  stepText: {
    flex: 1,
    minWidth: 0
  },
  permissionRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center"
  },
  secondaryActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "center"
  },
  textAction: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  textActionLabel: {
    fontSize: 14,
    fontWeight: "900"
  }
});
