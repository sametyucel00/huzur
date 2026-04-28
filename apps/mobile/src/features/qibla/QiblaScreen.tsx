import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { findSupportedPrayerCity } from "@sukut/shared";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { CityPickerModal } from "@/components/CityPickerModal";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { calculateQiblaBearing } from "@/services/qibla/qiblaService";
import { useLocalProfileStore } from "@/stores/localProfileStore";
import { useAppTheme } from "@/theme/useAppTheme";
import { confirmAction, showInfo } from "@/utils/dialog";

export function QiblaScreen() {
  const theme = useAppTheme();
  const [cityPickerVisible, setCityPickerVisible] = useState(false);
  const city = useLocalProfileStore((state) => state.profile?.city ?? "İstanbul");
  const setCity = useLocalProfileStore((state) => state.setCity);
  const cityMeta = findSupportedPrayerCity(city);
  const cityBearing = Math.round(calculateQiblaBearing(cityMeta));

  const requestLocation = () => {
    if (Platform.OS === "web") {
      showInfo("Konum izni", "Web önizlemede şehir bilgisine göre yaklaşık yön gösteriliyor. Konum izni mobil uygulamada istenir.");
      return;
    }

    confirmAction({
      title: "Konum izni",
      message: "Konum yalnızca kıble yönünü daha doğru hesaplamak için kullanılır. İzin vermezsen şehir bilgisiyle devam edilir.",
      confirmText: "İzin iste",
      onConfirm: () => {
        Location.requestForegroundPermissionsAsync()
          .then((result) => {
            showInfo("Konum izni", result.granted ? "Konum izni verildi." : "Konum izni verilmedi; şehir bilgisiyle devam ediliyor.");
          })
          .catch(() => showInfo("Konum izni", "Konum izni alınamadı; şehir bilgisiyle devam ediliyor."));
      }
    });
  };

  return (
    <AppScreen>
      <AppHeader title="Kıble yönü" subtitle="Konum izni olmadan şehir bilgisiyle yaklaşık yön gösterilir." />
      <View style={[styles.compass, theme.shadows.deep, { backgroundColor: theme.colors.primarySoft }]}>
        <View style={[styles.ring, { borderColor: theme.colors.calm }]}>
          <Ionicons name="navigate" size={72} color={theme.colors.accent} style={{ transform: [{ rotate: `${cityBearing}deg` }] }} />
        </View>
        <Text style={[styles.degree, { color: "#F8F5EE" }]}>{cityBearing}°</Text>
        <Text style={[theme.typography.caption, { color: "#DCC9A6" }]}>{city} için yaklaşık yön</Text>
      </View>
      <PrimaryButton label="Konumla daha doğru hesapla" onPress={requestLocation} />
      <SecondaryButton label="Manuel şehir seç" onPress={() => setCityPickerVisible(true)} />
      <CityPickerModal
        visible={cityPickerVisible}
        selectedCity={city}
        onClose={() => setCityPickerVisible(false)}
        onSelect={(nextCity) =>
          setCity(nextCity)
            .then(() => setCityPickerVisible(false))
            .catch(() => showInfo("Şehir kaydedilemedi", "Kıble yönü mevcut şehir bilgisiyle gösterilmeye devam edecek."))
        }
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  compass: {
    alignItems: "center",
    borderRadius: 34,
    gap: 14,
    minHeight: 330,
    justifyContent: "center"
  },
  ring: {
    alignItems: "center",
    borderRadius: 96,
    borderWidth: 1,
    height: 188,
    justifyContent: "center",
    width: 188
  },
  degree: {
    fontSize: 48,
    fontWeight: "800"
  }
});
