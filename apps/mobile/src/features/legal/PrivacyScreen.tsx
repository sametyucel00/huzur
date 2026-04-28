import { Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { ContentCard } from "@/components/ContentCard";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useAppTheme } from "@/theme/useAppTheme";

export function PrivacyScreen() {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <AppScreen>
      <Stack.Screen options={{ title: "Gizlilik" }} />
      <SecondaryButton label="Geri" onPress={() => router.back()} />
      <AppHeader title="Gizlilik" subtitle="Sükût, kişisel ibadet ritmini sade ve güvenli tutmak için tasarlandı." />
      <ContentCard>
        <Text style={[theme.typography.section, { color: theme.colors.text }]}>Kısa özet</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          Sükût'u kullanmak için hesap açman gerekmez. Favorilerin, zikir sayacın, günlük hedeflerin, rozetlerin ve uygulama tercihlerin
          cihazında tutulur. Bu bilgiler kişisel alanın olarak kalır.
        </Text>
      </ContentCard>
      <ContentCard>
        <Text style={[theme.typography.section, { color: theme.colors.text }]}>Neleri saklarız?</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          Seçtiğin şehir, tema, bildirim tercihleri ve uygulama içindeki ilerlemen yalnızca deneyimini devam ettirmek için saklanır.
          Bunları Ayarlar ekranından cihazından silebilirsin.
        </Text>
      </ContentCard>
      <ContentCard>
        <Text style={[theme.typography.section, { color: theme.colors.text }]}>İçerik ve bildirimler</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          Uygulama dua, zikir, günlük içerik ve özel gün metinlerini güncel tutmak için internetten içerik alabilir. Bildirimler izin
          verdiğinde çalışır; izin vermezsen Sükût'u kullanmaya devam edebilirsin.
        </Text>
      </ContentCard>
      <ContentCard>
        <Text style={[theme.typography.section, { color: theme.colors.text }]}>Hesap ve paylaşım</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          Bu sürümde kullanıcı hesabı yoktur. Kişisel ibadet takibin, favorilerin ve zikir geçmişin üçüncü kişilerle paylaşılmaz.
        </Text>
      </ContentCard>
    </AppScreen>
  );
}
