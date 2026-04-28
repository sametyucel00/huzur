import { findSupportedPrayerCity, type PrayerTime, type PrayerTimesProvider } from "@sukut/shared";

interface AladhanTimingPayload {
  code?: number;
  status?: string;
  data?: {
    timings?: {
      Fajr?: string;
      Sunrise?: string;
      Dhuhr?: string;
      Asr?: string;
      Maghrib?: string;
      Isha?: string;
    };
  };
}

const DEFAULT_BASE_URL = "https://api.aladhan.com/v1";
const DIYANET_TURKEY_METHOD = "13";
const DEFAULT_SCHOOL = "0";

function cleanTime(value?: string): string {
  return value?.replace(/\s*\(.+\)\s*$/, "").trim() ?? "";
}

function buildPrayerTimes(timings: NonNullable<NonNullable<AladhanTimingPayload["data"]>["timings"]>, date: string): PrayerTime[] {
  return [
    { key: "fajr", labelTr: "İmsak", time: cleanTime(timings.Fajr), date },
    { key: "sunrise", labelTr: "Güneş", time: cleanTime(timings.Sunrise), date },
    { key: "dhuhr", labelTr: "Öğle", time: cleanTime(timings.Dhuhr), date },
    { key: "asr", labelTr: "İkindi", time: cleanTime(timings.Asr), date },
    { key: "maghrib", labelTr: "Akşam", time: cleanTime(timings.Maghrib), date },
    { key: "isha", labelTr: "Yatsı", time: cleanTime(timings.Isha), date }
  ];
}

export const aladhanProvider: PrayerTimesProvider = {
  id: "aladhan",
  async getDailyTimes({ city, date }) {
    const supportedCity = findSupportedPrayerCity(city);
    const baseUrl = process.env.EXPO_PUBLIC_ALADHAN_BASE_URL ?? DEFAULT_BASE_URL;
    const method = process.env.EXPO_PUBLIC_ALADHAN_METHOD ?? DIYANET_TURKEY_METHOD;
    const school = process.env.EXPO_PUBLIC_ALADHAN_SCHOOL ?? DEFAULT_SCHOOL;
    const endpointDate = date.split("-").reverse().join("-");
    const url = new URL(`${baseUrl.replace(/\/+$/, "")}/timings/${endpointDate}`);

    url.searchParams.set("latitude", String(supportedCity.latitude));
    url.searchParams.set("longitude", String(supportedCity.longitude));
    url.searchParams.set("method", method);
    url.searchParams.set("school", school);

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Aladhan request failed: ${response.status}`);
    }

    const payload = (await response.json()) as AladhanTimingPayload;
    const timings = payload.data?.timings;

    if (!timings || payload.code !== 200) {
      throw new Error(payload.status ?? "Aladhan returned an empty response.");
    }

    return {
      city: supportedCity.city,
      date,
      provider: "Aladhan API - Diyanet Türkiye yöntemi",
      times: buildPrayerTimes(timings, date)
    };
  }
};
