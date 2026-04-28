import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { AppScreen } from "@/components/AppScreen";
import { BadgePill } from "@/components/BadgePill";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useAppTheme } from "@/theme/useAppTheme";

const splashImage = require("../../../assets/splash.png");

const steps = [
  "Günlük dua, zikir ve Kur'an okuma ritmini sade bir alanda topla.",
  "Namaz vakitleri, kıble ve temel ibadet araçlarını ücretsiz kullan.",
  "İlerlemeni cihazında tut; kişisel ibadet verilerin hesabına bağlanmadan saklanır."
];

export function OnboardingScreen() {
  const router = useRouter();
  const theme = useAppTheme();

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
            <Text style={[theme.typography.body, { color: theme.colors.text }]}>{item}</Text>
          </View>
        ))}
      </View>

      <PrimaryButton label="Başla" onPress={() => router.replace("/")} />
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
    borderRadius: 34,
    minHeight: 430,
    justifyContent: "flex-end",
    overflow: "hidden"
  },
  heroImage: {
    borderRadius: 34
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7, 17, 30, 0.12)"
  },
  heroContent: {
    gap: 12,
    padding: 24
  },
  title: {
    color: "#FFF8ED",
    fontSize: 36,
    fontWeight: "900",
    lineHeight: 42
  },
  subtitle: {
    color: "#EDE4D7",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24
  },
  steps: {
    gap: 10
  },
  step: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    minHeight: 72,
    padding: 16
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "900",
    width: 22
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
