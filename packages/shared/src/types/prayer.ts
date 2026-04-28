export interface PrayerTime {
  key: "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
  labelTr: string;
  time: string;
  date: string;
}

export interface PrayerTimesDay {
  city: string;
  date: string;
  provider: string;
  times: PrayerTime[];
}

export interface PrayerTimesProvider {
  id: string;
  getDailyTimes(params: { city: string; date: string; countryCode?: string }): Promise<PrayerTimesDay>;
}
