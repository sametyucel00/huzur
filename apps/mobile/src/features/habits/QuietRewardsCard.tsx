import { Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ContentCard } from "@/components/ContentCard";
import { useContentStore } from "@/stores/contentStore";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";

export function QuietRewardsCard() {
  const theme = useAppTheme();
  const badges = useContentStore((state) => state.bundle.badges);
  const earnedBadgeIds = useLocalProgressStore((state) => state.earnedBadgeIds);
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const visibleBadges = badges.filter((badge) => isPremium || !badge.isPremium).slice(0, isPremium ? 8 : 6);

  return (
    <ContentCard>
      <Text style={[styles.kicker, { color: theme.colors.textMuted }]}>Sessiz ödüller</Text>
      <View style={styles.grid}>
        {visibleBadges.map((badge) => {
          const earned = earnedBadgeIds.includes(badge.id);
          return (
            <View key={badge.id} style={styles.rewardItem}>
              <View style={[styles.badge, { backgroundColor: earned ? theme.colors.accent : theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
                <Ionicons name={earned ? "ribbon-outline" : "ellipse-outline"} size={18} color={earned ? theme.colors.primary : theme.colors.textMuted} />
              </View>
              <Text numberOfLines={2} style={[styles.badgeName, { color: earned ? theme.colors.text : theme.colors.textMuted }]}>
                {badge.name}
              </Text>
            </View>
          );
        })}
      </View>
      <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
        {isPremium ? "Ayrıcalık koleksiyonunda özel seriler de görünür." : "Temel rozetler ücretsiz; özel seriler Sükût Ayrıcalık ile açılır."}
      </Text>
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  kicker: {
    fontSize: 11,
    fontWeight: "900"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  rewardItem: {
    alignItems: "center",
    gap: 6,
    width: "30.9%"
  },
  badge: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  badgeName: {
    fontSize: 10,
    fontWeight: "900",
    minHeight: 26,
    textAlign: "center"
  }
});
