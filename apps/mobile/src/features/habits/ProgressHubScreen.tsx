import { Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { ContentCard } from "@/components/ContentCard";
import { SecondaryButton } from "@/components/SecondaryButton";
import { MiniProgressCalendar } from "@/features/habits/MiniProgressCalendar";
import { QuietRewardsCard } from "@/features/habits/QuietRewardsCard";
import { WeeklyReflectionCard } from "@/features/habits/WeeklyReflectionCard";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";

export function ProgressHubScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const isPremium = useSubscriptionStore((state) => state.isPremium);

  return (
    <AppScreen>
      <AppHeader title="İlerleme merkezi" subtitle="Mini takvim, haftalık içgörü ve sessiz ödüller tek yerde." />
      <MiniProgressCalendar onOpenPaywall={() => router.push("/paywall")} showUpgradeAction={false} />
      <WeeklyReflectionCard
        onOpenPaywall={() => router.push("/paywall")}
        onOpenDetail={() => router.push("/weekly-reflection")}
        showUpgradeAction={false}
      />
      <QuietRewardsCard />
      {!isPremium ? (
        <ContentCard>
          <Text style={[theme.typography.section, { color: theme.colors.text }]}>Sükût Ayrıcalık</Text>
          <Text style={[styles.text, { color: theme.colors.textMuted }]}>
            Aylık takvim, detaylı haftalık içgörü ve özel ödül serileri burada açılır. Temel ilerleme görünümü ücretsiz kalır.
          </Text>
          <SecondaryButton label="Ayrıcalık detayını gör" onPress={() => router.push("/paywall")} />
        </ContentCard>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21
  }
});
