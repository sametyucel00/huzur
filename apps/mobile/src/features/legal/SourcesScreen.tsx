import { Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { ContentCard } from "@/components/ContentCard";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useAppTheme } from "@/theme/useAppTheme";

export function SourcesScreen() {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <AppScreen>
      <Stack.Screen options={{ title: "Kaynaklar" }} />
      <SecondaryButton label="Geri" onPress={() => router.back()} />
      <AppHeader title="Kaynaklar hakkında" subtitle="Sükût, dini içerikleri saygılı, sade ve kaynak bilinciyle sunar." />
      <ContentCard>
        <Text style={[theme.typography.section, { color: theme.colors.text }]}>Yaklaşımımız</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          Dua, zikir ve günlük hatırlatmalar kullanıcıya eşlik etmek için hazırlanır. Sükût fetva veren ya da dini konuda kesin hüküm
          bildiren bir uygulama değildir.
        </Text>
      </ContentCard>
      <ContentCard>
        <Text style={[theme.typography.section, { color: theme.colors.text }]}>Dini içerikler</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          İçeriklerde mümkün olduğunda kaynak bilgisi gösterilir. Ayet, dua ve zikir metinlerinde hata fark edersen uygulama sahibiyle
          paylaşman içerik kalitesini korumaya yardımcı olur.
        </Text>
      </ContentCard>
      <ContentCard>
        <Text style={[theme.typography.section, { color: theme.colors.text }]}>Kişisel durumlar</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          Ruh hâline göre öneriler manevi bir eşlik alanıdır; psikolojik, tıbbi veya dini danışmanlık yerine geçmez. İhtiyaç duyduğunda
          güvenilir bir uzmandan veya ehil bir kişiden destek almalısın.
        </Text>
      </ContentCard>
    </AppScreen>
  );
}
