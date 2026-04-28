import {
  findSupportedPrayerCity,
  type PrayerTimesDay,
  type PrayerTimesProvider,
  type SupportedPrayerCity
} from "@sukut/shared";
import { aladhanProvider } from "./aladhanProvider";
import { getLocalDateString } from "./nextPrayer";

const cityTimes: Record<string, PrayerTimesDay["times"]> = {
  "İstanbul": [
    { key: "fajr", labelTr: "İmsak", time: "04:42", date: "" },
    { key: "sunrise", labelTr: "Güneş", time: "06:14", date: "" },
    { key: "dhuhr", labelTr: "Öğle", time: "13:05", date: "" },
    { key: "asr", labelTr: "İkindi", time: "16:50", date: "" },
    { key: "maghrib", labelTr: "Akşam", time: "19:47", date: "" },
    { key: "isha", labelTr: "Yatsı", time: "21:13", date: "" }
  ],
  Ankara: [
    { key: "fajr", labelTr: "İmsak", time: "04:30", date: "" },
    { key: "sunrise", labelTr: "Güneş", time: "06:02", date: "" },
    { key: "dhuhr", labelTr: "Öğle", time: "12:50", date: "" },
    { key: "asr", labelTr: "İkindi", time: "16:34", date: "" },
    { key: "maghrib", labelTr: "Akşam", time: "19:31", date: "" },
    { key: "isha", labelTr: "Yatsı", time: "20:55", date: "" }
  ],
  İzmir: [
    { key: "fajr", labelTr: "İmsak", time: "04:55", date: "" },
    { key: "sunrise", labelTr: "Güneş", time: "06:24", date: "" },
    { key: "dhuhr", labelTr: "Öğle", time: "13:14", date: "" },
    { key: "asr", labelTr: "İkindi", time: "16:57", date: "" },
    { key: "maghrib", labelTr: "Akşam", time: "19:53", date: "" },
    { key: "isha", labelTr: "Yatsı", time: "21:16", date: "" }
  ]
};

function getSeedTimesForCity(city: SupportedPrayerCity, date: string): PrayerTimesDay["times"] {
  const baseTimes = cityTimes[city.city] ?? cityTimes["İstanbul"]!;
  return baseTimes.map((time) => ({ ...time, date }));
}

export const seedPrayerTimesProvider: PrayerTimesProvider = {
  id: "seed-city-aware",
  async getDailyTimes({ city, date }) {
    const supportedCity = findSupportedPrayerCity(city);

    return {
      city: supportedCity.city,
      date,
      provider: "Yerel şehir vakitleri",
      times: getSeedTimesForCity(supportedCity, date)
    };
  }
};

export const prayerProviderRegistry: Record<string, PrayerTimesProvider> = {
  [seedPrayerTimesProvider.id]: seedPrayerTimesProvider,
  [aladhanProvider.id]: aladhanProvider
};

export function getPrayerTimesProvider(providerId = aladhanProvider.id): PrayerTimesProvider {
  return prayerProviderRegistry[providerId] ?? seedPrayerTimesProvider;
}

export async function getTodayPrayerTimes(city: string): Promise<PrayerTimesDay> {
  const today = getLocalDateString();
  const providerId = process.env.EXPO_PUBLIC_PRAYER_PROVIDER ?? aladhanProvider.id;
  const provider = getPrayerTimesProvider(providerId);

  try {
    return await provider.getDailyTimes({ city, date: today, countryCode: "TR" });
  } catch {
    return seedPrayerTimesProvider.getDailyTimes({ city, date: today, countryCode: "TR" });
  }
}
