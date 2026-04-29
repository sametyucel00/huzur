import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { findSupportedPrayerCity, TURKEY_PRAYER_CITIES } from "@sukut/shared";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { CityPickerModal } from "@/components/CityPickerModal";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { calculateQiblaBearing } from "@/services/qibla/qiblaService";
import { useLocalProfileStore } from "@/stores/localProfileStore";
import { useAppTheme } from "@/theme/useAppTheme";
import { confirmAction, showInfo } from "@/utils/dialog";

function normalizeDegree(value: number) {
  return ((value % 360) + 360) % 360;
}

function headingFromMagnetometer(data: { x: number; y: number }) {
  const angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
  return normalizeDegree(angle);
}

export function QiblaScreen() {
  const theme = useAppTheme();
  const [cityPickerVisible, setCityPickerVisible] = useState(false);
  const [gpsBearing, setGpsBearing] = useState<number | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [sensorAvailable, setSensorAvailable] = useState(Platform.OS !== "web");
  const city = useLocalProfileStore((state) => state.profile?.city ?? "İstanbul");
  const setCity = useLocalProfileStore((state) => state.setCity);
  const cityMeta = findSupportedPrayerCity(city);
  const activeBearing = Math.round(gpsBearing ?? calculateQiblaBearing(cityMeta));
  const arrowRotation = useMemo(() => {
    if (heading === null) {
      return activeBearing;
    }

    return normalizeDegree(activeBearing - heading);
  }, [activeBearing, heading]);

  useEffect(() => {
    if (Platform.OS === "web") {
      setSensorAvailable(false);
      return undefined;
    }

    let mounted = true;
    let subscription: { remove: () => void } | null = null;

    Magnetometer.isAvailableAsync()
      .then((available) => {
        if (!mounted) return;
        setSensorAvailable(available);
        if (!available) return;

        Magnetometer.setUpdateInterval(250);
        subscription = Magnetometer.addListener((data) => {
          setHeading(headingFromMagnetometer(data));
        });
      })
      .catch(() => {
        if (mounted) {
          setSensorAvailable(false);
        }
      });

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  const requestLocation = () => {
    if (Platform.OS === "web") {
      showInfo("Konum izni", "Web önizlemede şehir bilgisine göre yaklaşık yön gösteriliyor. Konum ve pusula mobil uygulamada çalışır.");
      return;
    }

    confirmAction({
      title: "Konum izni",
      message: "Konum yalnızca kıble yönünü daha doğru hesaplamak için kullanılır. İzin vermezsen şehir bilgisiyle devam edilir.",
      confirmText: "İzin iste",
      onConfirm: () => {
        Location.requestForegroundPermissionsAsync()
          .then(async (result) => {
            if (!result.granted) {
              showInfo("Konum izni", "Konum izni verilmedi; şehir bilgisiyle devam ediliyor.");
              return;
            }

            const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            const nearestCity = findNearestCity(coords);
            setGpsBearing(calculateQiblaBearing(coords));
            setLocationLabel(`${nearestCity.city} yakınındaki GPS konumu`);
            await setCity(nearestCity.city).catch(() => undefined);
            showInfo("Konum güncellendi", `${nearestCity.city} yakınındaki konuma göre kıble yönü güncellendi.`);
          })
          .catch(() => showInfo("Konum izni", "Konum alınamadı; şehir bilgisiyle devam ediliyor."));
      }
    });
  };

  const sensorText =
    Platform.OS === "web"
      ? "Canlı pusula mobil cihazda çalışır."
      : sensorAvailable
        ? heading === null
          ? "Telefonu düz tut; pusula sensörü bekleniyor."
          : `Telefon yönü: ${Math.round(heading)}°`
        : "Bu cihazda pusula sensörü kullanılamıyor.";

  return (
    <AppScreen>
      <AppHeader title="Kıble yönü" subtitle="Konum izni olmadan şehir bilgisiyle yaklaşık yön gösterilir." />
      <View style={[styles.compass, theme.shadows.deep, { backgroundColor: theme.colors.primarySoft }]}>
        <View style={[styles.ring, { borderColor: theme.colors.calm }]}>
          <Ionicons name="navigate" size={72} color={theme.colors.accent} style={{ transform: [{ rotate: `${arrowRotation}deg` }] }} />
        </View>
        <Text style={[styles.degree, { color: "#F8F5EE" }]}>{activeBearing}°</Text>
        <Text style={[theme.typography.caption, styles.locationText, { color: "#DCC9A6" }]}>
          {locationLabel ?? `${city} için yaklaşık yön`}
        </Text>
        <Text style={[theme.typography.caption, styles.locationText, { color: "#BEB3A6" }]}>{sensorText}</Text>
      </View>
      <PrimaryButton label="Konumla daha doğru hesapla" onPress={requestLocation} />
      <SecondaryButton label="Manuel şehir seç" onPress={() => setCityPickerVisible(true)} />
      <CityPickerModal
        visible={cityPickerVisible}
        selectedCity={city}
        onClose={() => setCityPickerVisible(false)}
        onSelect={(nextCity) => {
          setGpsBearing(null);
          setLocationLabel(null);
          setCity(nextCity)
            .then(() => setCityPickerVisible(false))
            .catch(() => showInfo("Şehir kaydedilemedi", "Kıble yönü mevcut şehir bilgisiyle gösterilmeye devam edecek."));
        }}
      />
    </AppScreen>
  );
}

function findNearestCity(coords: { latitude: number; longitude: number }) {
  return TURKEY_PRAYER_CITIES.reduce((nearest, city) => {
    const nearestDistance = distanceSquared(coords, nearest);
    const cityDistance = distanceSquared(coords, city);
    return cityDistance < nearestDistance ? city : nearest;
  }, TURKEY_PRAYER_CITIES[0]!);
}

function distanceSquared(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const lat = a.latitude - b.latitude;
  const lon = a.longitude - b.longitude;
  return lat * lat + lon * lon;
}

const styles = StyleSheet.create({
  compass: {
    alignItems: "center",
    borderRadius: 34,
    gap: 14,
    justifyContent: "center",
    minHeight: 300,
    padding: 22
  },
  ring: {
    alignItems: "center",
    borderRadius: 96,
    borderWidth: 1,
    height: 176,
    justifyContent: "center",
    width: 176
  },
  degree: {
    fontSize: 44,
    fontWeight: "800"
  },
  locationText: {
    maxWidth: 270,
    textAlign: "center"
  }
});
