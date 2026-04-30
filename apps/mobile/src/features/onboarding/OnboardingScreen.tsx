import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppScreen } from "@/components/AppScreen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { STORAGE_KEYS } from "@/storage/keys";
import { useAppTheme } from "@/theme/useAppTheme";

const steps = [
  "Günlük dua, zikir ve Kur'an okuma ritmini sade bir alanda topla.",
  "Namaz vakitleri, kıble ve temel ibadet araçlarını ücretsiz kullan.",
  "İlerlemeni cihazında tut; kişisel ibadet verilerin dışarı gönderilmez."
];

export function OnboardingScreen() {
  const router = useRouter();
  const theme = useAppTheme();

  const finish = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.onboardingSeen, "true").catch(() => undefined);
    router.replace("/");
  };

  return (
    <AppScreen>
      <View style={[styles.hero, { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.border }]}>
        <Text style={[styles.kicker, { color: theme.colors.accent }]}>SÜKÛT</Text>
        <Text style={styles.title}>Sükûta yolculuk, huzura varış</Text>
        <Text style={styles.subtitle}>Az, düzenli ve içten bir manevi alışkanlık alanı.</Text>
      </View>

      <View style={styles.steps}>
        {steps.map((item, index) => (
          <View key={item} style={[styles.step, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.stepNumber, { color: theme.colors.accent }]}>{index + 1}</Text>
            <Text style={[theme.typography.body, styles.stepText, { color: theme.colors.text }]}>{item}</Text>
          </View>
        ))}
      </View>

      <PrimaryButton label="Başla" onPress={finish} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignSelf: "stretch",
    borderRadius: 30,
    borderWidth: 1,
    gap: 12,
    minHeight: 250,
    justifyContent: "flex-end",
    padding: 24,
    width: "100%"
  },
  kicker: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0
  },
  title: {
    color: "#FFF8ED",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40
  },
  subtitle: {
    color: "#EDE4D7",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23
  },
  steps: {
    alignSelf: "stretch",
    gap: 10,
    width: "100%"
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
});
