import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import type { PrayerTimesDay } from "@sukut/shared";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { CityPickerModal } from "@/components/CityPickerModal";
import { ErrorState } from "@/components/ErrorState";
import { PrayerTimeCard } from "@/components/PrayerTimeCard";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useCurrentMinute } from "@/hooks/useCurrentMinute";
import { getNextPrayerSummary } from "@/services/prayerTimes/nextPrayer";
import { getTodayPrayerTimes } from "@/services/prayerTimes/provider";
import { useLocalProfileStore } from "@/stores/localProfileStore";
import { useAppTheme } from "@/theme/useAppTheme";
import { showInfo } from "@/utils/dialog";

export function PrayerTimesScreen() {
  const theme = useAppTheme();
  const [day, setDay] = useState<PrayerTimesDay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const profile = useLocalProfileStore((state) => state.profile);
  const setCity = useLocalProfileStore((state) => state.setCity);
  const city = profile?.city ?? "İstanbul";
  const currentMinute = useCurrentMinute();
  const nextPrayer = day ? getNextPrayerSummary(day.times, currentMinute) : null;

  function loadPrayerTimes() {
    setIsLoading(true);
    setErrorMessage(null);
    getTodayPrayerTimes(city)
      .then((nextDay) => {
        setDay(nextDay);
        setErrorMessage(null);
      })
      .catch(() => {
        setErrorMessage("Vakitler şu anda hazırlanamadı. Şehir seçimini kontrol edip tekrar deneyebilirsin.");
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadPrayerTimes();
  }, [city]);

  return (
    <AppScreen>
      <AppHeader title="Vakit çizgisi" subtitle="Şehrini elle seç; uygulama konumu zorunlu tutmaz." />
      <View style={[styles.hero, theme.shadows.soft, { backgroundColor: theme.colors.primarySoft }]}>
        <Text style={[styles.heroMeta, { color: theme.colors.accent }]}>{city}</Text>
        <Text style={[styles.heroTitle, { color: "#FFF8ED" }]}>
          {nextPrayer
            ? `${nextPrayer.dayOffset ? "Yarın " : ""}${nextPrayer.label} vakti`
            : isLoading
              ? "Bugünün vakitleri hazırlanıyor"
              : "Vakit bilgisi bekleniyor"}
        </Text>
        {nextPrayer ? (
          <View style={styles.remainingBlock}>
            <Text style={[styles.time, { color: "#FFF8ED" }]}>{nextPrayer.time}</Text>
            <Text style={[theme.typography.caption, { color: "#EDE4D7" }]}>Kalan süre: {nextPrayer.remainingLabel}</Text>
          </View>
        ) : null}
        <SecondaryButton label="Şehir değiştir" onPress={() => setPickerVisible(true)} />
      </View>
      {errorMessage ? (
        <ErrorState
          title="Vakitler alınamadı"
          message={errorMessage}
          actionLabel="Tekrar dene"
          onAction={loadPrayerTimes}
        />
      ) : null}
      {day ? <PrayerTimeCard times={day.times} nextKey={nextPrayer?.key} /> : null}
      <CityPickerModal
        visible={pickerVisible}
        selectedCity={city}
        onClose={() => setPickerVisible(false)}
        onSelect={(nextCity) =>
          setCity(nextCity)
            .then(() => setPickerVisible(false))
            .catch(() => showInfo("Şehir kaydedilemedi", "Vakitler mevcut şehir bilgisiyle gösterilmeye devam edecek."))
        }
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 34,
    gap: 12,
    minHeight: 190,
    padding: 24,
    alignSelf: "stretch",
    width: "100%"
  },
  heroMeta: {
    fontSize: 12,
    fontWeight: "900"
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
    maxWidth: "92%"
  },
  remainingBlock: {
    gap: 8,
    marginBottom: 4
  },
  time: {
    fontSize: 18,
    fontWeight: "900"
  }
});
