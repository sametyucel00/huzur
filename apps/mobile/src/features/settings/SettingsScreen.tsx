import { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { tr, type LocalUserProfile, type NotificationPreferences, type ThemeMode } from "@sukut/shared";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { CityPickerModal } from "@/components/CityPickerModal";
import { ContentCard } from "@/components/ContentCard";
import { SecondaryButton } from "@/components/SecondaryButton";
import { ToggleRow } from "@/components/ToggleRow";
import { requestLocalNotificationPermission, syncEnabledLocalReminders } from "@/services/notifications/localNotifications";
import { resetLocalUserData } from "@/storage/resetLocalUserData";
import { useContentStore } from "@/stores/contentStore";
import { useLocalProfileStore } from "@/stores/localProfileStore";
import { useLocalProgressStore } from "@/stores/localProgressStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useAppTheme } from "@/theme/useAppTheme";
import { confirmAction, showInfo } from "@/utils/dialog";

const themeOrder: ThemeMode[] = ["system", "light", "dark"];
const notificationLabels: Record<keyof NotificationPreferences, string> = {
  prayerTimes: "Namaz vakti",
  dailyContent: "Günlük içerik",
  streakReminder: "Devam hatırlatma",
  specialDays: "Özel günler"
};

function themeLabel(theme: ThemeMode | undefined) {
  if (theme === "dark") return "Koyu";
  if (theme === "light") return "Açık";
  return "Sistem";
}

export function SettingsScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const [cityPickerVisible, setCityPickerVisible] = useState(false);
  const profile = useLocalProfileStore((state) => state.profile);
  const setTheme = useLocalProfileStore((state) => state.setTheme);
  const setCity = useLocalProfileStore((state) => state.setCity);
  const toggleNotificationPreference = useLocalProfileStore((state) => state.toggleNotificationPreference);
  const hydrateProfile = useLocalProfileStore((state) => state.hydrate);
  const hydrateProgress = useLocalProgressStore((state) => state.hydrate);
  const notificationTemplates = useContentStore((state) => state.bundle.notificationTemplates);
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const setMockPremiumForDevelopment = useSubscriptionStore((state) => state.setMockPremiumForDevelopment);
  const showDevPremiumToggle = process.env.NODE_ENV !== "production";

  const syncNotifications = (nextProfile: LocalUserProfile) => {
    syncEnabledLocalReminders({ profile: nextProfile, templates: notificationTemplates }).catch(() =>
      showInfo("Bildirimler güncellenemedi", "Bildirim tercihlerin kaydedildi, ancak hatırlatmalar şu anda yenilenemedi.")
    );
  };

  const cycleTheme = () => {
    const currentTheme = profile?.theme ?? "system";
    const nextTheme = themeOrder[(themeOrder.indexOf(currentTheme) + 1) % themeOrder.length] ?? "system";
    setTheme(nextTheme).catch(() => showInfo("Tema değiştirilemedi", "Tema tercihi kaydedilemedi. Lütfen tekrar dene."));
  };

  const explainNotifications = async () => {
    if (Platform.OS === "web") {
      showInfo("Bildirim izni", "Web önizlemede lokal bildirim izni kapalıdır. Bu izin Android ve iOS uygulamasında istenir.");
      return;
    }

    confirmAction({
      title: "Bildirim izni",
      message: tr.notifications.permissionIntro,
      confirmText: "İzin iste",
      onConfirm: () => {
        requestLocalNotificationPermission()
          .then((result) => {
            if (result.granted && profile) {
              syncNotifications(profile);
            }
            showInfo("Bildirim izni", result.granted ? "Bildirim izni verildi." : "Bildirim izni verilmedi.");
          })
          .catch(() => showInfo("Bildirim izni", "Bildirim izni alınamadı."));
      }
    });
  };

  const confirmReset = () => {
    confirmAction({
      title: "Veriler sıfırlansın mı?",
      message:
        "Favoriler, hedefler, zikir sayacı, Kur'an okuma ilerlemesi, rozet ilerlemesi ve lokal profil bilgisi bu cihazdan silinir. İndirilen içerik cache'i korunur.",
      confirmText: "Sıfırla",
      destructive: true,
      onConfirm: () => {
        resetLocalUserData()
          .then(() => Promise.all([hydrateProfile(), hydrateProgress()]))
          .then(() => {
            showInfo("Veriler sıfırlandı", "Cihazdaki kişisel ilerleme verileri temizlendi. Başlangıç ekranı tekrar açılacak.");
            router.replace("/onboarding");
          })
          .catch(() => showInfo("Sıfırlama tamamlanamadı", "Lütfen tekrar dene."));
      }
    });
  };

  return (
    <AppScreen>
      <AppHeader title="Ayarlar" subtitle="Uygulamanın ritmini kendi kullanımına göre sadeleştir." />
      <View style={styles.quickRow}>
        <View style={[styles.quickItem, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
          <Text style={[styles.quickLabel, { color: theme.colors.textMuted }]}>Tema</Text>
          <SecondaryButton label={themeLabel(profile?.theme)} onPress={cycleTheme} />
        </View>
        <View style={[styles.quickItem, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
          <Text style={[styles.quickLabel, { color: theme.colors.textMuted }]}>Şehir</Text>
          <SecondaryButton label={profile?.city ?? "İstanbul"} onPress={() => setCityPickerVisible(true)} />
        </View>
      </View>

      <ContentCard style={{ backgroundColor: theme.colors.primarySoft }}>
        <Text style={[styles.plusKicker, { color: theme.colors.accent }]}>Sükût Ayrıcalık</Text>
        <Text style={[theme.typography.section, { color: "#FFF8ED" }]}>
          {isPremium ? "Ayrıcalık etkin" : "Daha derin alışkanlık alanı"}
        </Text>
        <Text style={[theme.typography.caption, { color: "#EDE4D7" }]}>
          Haftalık içgörü, gelişmiş ilerleme ve özel planlar tek bir sakin alanda.
        </Text>
        <SecondaryButton label={isPremium ? "Ayrıcalık detayları" : "Ayrıcalığı incele"} onPress={() => router.push("/paywall")} />
      </ContentCard>

      <ContentCard>
        <Text style={[theme.typography.section, { color: theme.colors.text }]}>Bildirimler</Text>
        <SecondaryButton label="Bildirim izni iste" onPress={explainNotifications} />
        {(Object.keys(notificationLabels) as Array<keyof NotificationPreferences>).map((key) => (
          <ToggleRow
            key={key}
            title={notificationLabels[key]}
            value={Boolean(profile?.notificationPreferences[key])}
            onToggle={() =>
              toggleNotificationPreference(key)
                .then(syncNotifications)
                .catch(() => showInfo("Bildirim tercihi kaydedilemedi", "Tercih cihazına yazılamadı. Lütfen tekrar dene."))
            }
          />
        ))}
      </ContentCard>

      <ContentCard>
        <Text style={[theme.typography.section, { color: theme.colors.text }]}>Bilgi</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoButton}>
            <SecondaryButton label="Gizlilik" onPress={() => router.push("/privacy")} style={styles.equalInfoButton} />
          </View>
          <View style={styles.infoButton}>
            <SecondaryButton label="Kaynaklar" onPress={() => router.push("/sources")} style={styles.equalInfoButton} />
          </View>
        </View>
      </ContentCard>

      {showDevPremiumToggle ? (
        <ContentCard>
          <Text style={[theme.typography.section, { color: theme.colors.text }]}>Ayrıcalık önizleme</Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            Geliştirme ortamında Ayrıcalık deneyimini cihazdan önizleyebilirsin.
          </Text>
          <SecondaryButton
            label={isPremium ? "Önizlemeyi kapat" : "Önizlemeyi aç"}
            onPress={() =>
              setMockPremiumForDevelopment(!isPremium).catch(() =>
                showInfo("Önizleme değiştirilemedi", "Sükût Ayrıcalık önizlemesi şu anda güncellenemedi.")
              )
            }
          />
        </ContentCard>
      ) : null}

      <SecondaryButton label={tr.settings.dataReset} onPress={confirmReset} />
      <CityPickerModal
        visible={cityPickerVisible}
        selectedCity={profile?.city ?? "İstanbul"}
        onClose={() => setCityPickerVisible(false)}
        onSelect={(nextCity) =>
          setCity(nextCity)
            .then(() => setCityPickerVisible(false))
            .catch(() => showInfo("Şehir kaydedilemedi", "Şehir tercihi cihazına yazılamadı. Lütfen tekrar dene."))
        }
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  quickRow: {
    alignSelf: "stretch",
    flexDirection: "row",
    gap: 10,
    width: "100%"
  },
  quickItem: {
    borderRadius: 22,
    borderWidth: 1,
    flex: 1,
    gap: 10,
    minWidth: 0,
    padding: 12
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: "900"
  },
  plusKicker: {
    fontSize: 11,
    fontWeight: "900"
  },
  infoRow: {
    alignSelf: "stretch",
    flexDirection: "row",
    gap: 10,
    width: "100%"
  },
  infoButton: {
    flex: 1,
    minWidth: 0
  },
  equalInfoButton: {
    width: "100%"
  }
});
