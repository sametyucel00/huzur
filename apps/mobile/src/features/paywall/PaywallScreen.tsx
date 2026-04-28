import { Text, View, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { AppScreen } from "@/components/AppScreen";
import { BadgePill } from "@/components/BadgePill";
import { ContentCard } from "@/components/ContentCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useContentStore } from "@/stores/contentStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";
import { showInfo } from "@/utils/dialog";

const benefits = [
  "Haftalık içgörü ve daha net ilerleme takibi",
  "Gelişmiş günlük plan ve özel huzur programları",
  "Aylık mini takvim ve sessiz ödül serileri",
  "Reklamsız, daha sakin bir kullanım deneyimi",
  "Sesli içerik altyapısına hazırlık"
];

export function PaywallScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { offerings, purchasePackage, restorePurchases, isLoading, lastError } = useSubscriptionStore();
  const pricing = useContentStore((state) => state.bundle.appConfig.premiumPricing);
  const yearly = offerings.find((item) => item.id === "yearly");
  const monthly = offerings.find((item) => item.id === "monthly");
  const yearlyLabel = pricing?.yearlyLabel ?? yearly?.priceLabel ?? "799 TL / yıl";
  const monthlyLabel = pricing?.monthlyLabel ?? monthly?.priceLabel ?? "99 TL / ay";
  const yearlyEquivalent = pricing?.yearlyMonthlyEquivalentLabel ?? yearly?.description;
  const purchaseProvider = process.env.EXPO_PUBLIC_PURCHASE_PROVIDER ?? "mock";

  async function purchase(plan: "monthly" | "yearly") {
    if (process.env.NODE_ENV === "production" && purchaseProvider !== "store") {
      showInfo("Sükût Ayrıcalık", "Canlı satın alma henüz aktif değil. Store ürün bilgileri eklendiğinde açılacak.");
      return;
    }

    try {
      await purchasePackage(plan);
      showInfo("Sükût Ayrıcalık", purchaseProvider === "store" ? "Satın alma tamamlandı." : "Geliştirme modunda Sükût Ayrıcalık etkinleştirildi.");
      router.back();
    } catch {
      showInfo("Satın alma tamamlanamadı", "Bağlantını kontrol edip tekrar deneyebilirsin. Temel özellikler ücretsiz olarak kullanılmaya devam eder.");
    }
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: "Sükût Ayrıcalık" }} />
      <View style={[styles.hero, theme.shadows.deep, { backgroundColor: theme.colors.primarySoft }]}>
        <BadgePill label="Sükût Ayrıcalık" tone="accent" />
        <Text style={styles.title}>Alışkanlığını daha düzenli ve derin yaşa</Text>
        <Text style={styles.subtitle}>
          Temel ibadet araçları ücretsiz kalır. Ayrıcalık; kişisel planlar, gelişmiş ilerleme ve daha sakin bir deneyim sunar.
        </Text>
      </View>

      <ContentCard>
        <View style={styles.benefits}>
          {benefits.map((benefit) => (
            <Text key={benefit} style={[styles.benefit, { color: theme.colors.text }]}>• {benefit}</Text>
          ))}
        </View>
      </ContentCard>

      <PlanCard
        badge="Önerilen"
        title={yearly?.title?.replace("Plus", "Ayrıcalık") ?? "Yıllık Sükût Ayrıcalık"}
        price={yearlyLabel}
        description={yearlyEquivalent ?? "Yıllık plan uzun vadeli ritim için öne çıkar."}
        buttonLabel={isLoading ? "Hazırlanıyor" : "Yıllık planı seç"}
        onPress={() => purchase("yearly")}
      />

      <PlanCard
        badge="Esnek"
        title={monthly?.title?.replace("Plus", "Ayrıcalık") ?? "Aylık Sükût Ayrıcalık"}
        price={monthlyLabel}
        description={monthly?.description ?? "Aylık kullanım için esnek başlangıç."}
        buttonLabel={isLoading ? "Hazırlanıyor" : "Aylık planı seç"}
        onPress={() => purchase("monthly")}
      />

      <ContentCard>
        <Text style={[styles.infoTitle, { color: theme.colors.text }]}>Sosyal fayda notu</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          Aylık ve yıllık abonelik gelirlerinin %15'inin LÖSEV, İnsani Yardım Vakfı ve İyilik Derneği'ne bağış olarak
          ayrılması planlanır. Bu bağışların makbuzları aylık olarak sosyal medya hesaplarında şeffaf şekilde paylaşılacaktır.
        </Text>
      </ContentCard>

      {lastError ? (
        <ContentCard>
          <Text style={[theme.typography.caption, { color: theme.colors.danger }]}>{lastError}</Text>
        </ContentCard>
      ) : null}

      <SecondaryButton
        label="Satın alımları geri yükle"
        onPress={() =>
          restorePurchases()
            .then(() => showInfo("Geri yükleme", "Satın alımlar kontrol edildi."))
            .catch(() => showInfo("Geri yükleme tamamlanamadı", "Satın alımlar şu anda kontrol edilemedi. Biraz sonra tekrar dene."))
        }
      />
      <SecondaryButton label="Daha sonra" onPress={() => router.back()} />
    </AppScreen>
  );
}

function PlanCard({
  badge,
  title,
  price,
  description,
  buttonLabel,
  onPress
}: {
  badge: string;
  title: string;
  price: string;
  description?: string;
  buttonLabel: string;
  onPress: () => void;
}) {
  const theme = useAppTheme();

  return (
    <ContentCard>
      <BadgePill label={badge} tone="accent" />
      <Text style={[theme.typography.section, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.price, { color: theme.colors.accent }]}>{price}</Text>
      {description ? <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{description}</Text> : null}
      <PrimaryButton label={buttonLabel} onPress={onPress} />
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 34,
    gap: 14,
    padding: 24
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
    lineHeight: 23
  },
  benefits: {
    gap: 10
  },
  benefit: {
    fontSize: 15,
    fontWeight: "800"
  },
  price: {
    fontSize: 26,
    fontWeight: "900"
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: "900"
  }
});
