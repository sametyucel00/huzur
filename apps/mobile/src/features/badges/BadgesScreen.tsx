import { Ionicons } from "@expo/vector-icons";
import { Text, View, StyleSheet } from "react-native";
import type { BadgeDefinition } from "@sukut/shared";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { BadgePill } from "@/components/BadgePill";
import { ContentCard } from "@/components/ContentCard";
import { useContentStore } from "@/stores/contentStore";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";

const badgeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  breath: "radio-button-on-outline",
  path: "trail-sign-outline",
  bookmark: "bookmark-outline",
  intention: "checkmark-done-circle-outline",
  friday: "calendar-clear-outline",
  horizon: "sunny-outline",
  sparkle: "sparkles-outline",
  moon: "moon-outline",
  heart: "heart-outline"
};

function progressText(badge: BadgeDefinition) {
  if (badge.conditionType === "streakDays") return `${badge.targetValue} gün hedefi`;
  if (badge.conditionType === "firstZikr") return "İlk zikir tamamlandığında";
  if (badge.conditionType === "firstFavorite") return "İlk favori eklendiğinde";
  if (badge.conditionType === "fridayRoutine") return "Cuma rutini tamamlandığında";
  return "Günlük ritimle açılır";
}

export function BadgesScreen() {
  const theme = useAppTheme();
  const badges = useContentStore((state) => state.bundle.badges);
  const earnedBadgeIds = useLocalProgressStore((state) => state.earnedBadgeIds);
  const isPremium = useSubscriptionStore((state) => state.isPremium);

  return (
    <AppScreen>
      <AppHeader title="Rozetler" subtitle="Kullanıcıyı yormayan sade ilerleme işaretleri." />
      {badges.filter((badge) => isPremium || !badge.isPremium).map((badge) => {
        const earned = earnedBadgeIds.includes(badge.id);

        return (
          <ContentCard key={badge.id}>
            <View style={styles.row}>
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: earned ? theme.colors.accent : theme.colors.surfaceMuted,
                    borderColor: earned ? theme.colors.accent : theme.colors.border
                  }
                ]}
              >
                <Ionicons
                  name={badgeIcons[badge.iconKey] ?? "ribbon-outline"}
                  size={24}
                  color={earned ? "#101C34" : theme.colors.textMuted}
                />
              </View>
              <View style={styles.content}>
                <View style={styles.pills}>
                  <BadgePill label={earned ? "Kazanıldı" : "Devam ediyor"} tone={earned ? "accent" : "neutral"} />
                  {badge.isPremium ? <BadgePill label="Ayrıcalık" tone="calm" /> : null}
                </View>
                <Text style={[theme.typography.section, { color: theme.colors.text }]}>{badge.name}</Text>
                <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>{badge.description}</Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{progressText(badge)}</Text>
              </View>
            </View>
          </ContentCard>
        );
      })}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 14
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    height: 54,
    justifyContent: "center",
    width: 54
  },
  content: {
    flex: 1,
    gap: 8
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  }
});
