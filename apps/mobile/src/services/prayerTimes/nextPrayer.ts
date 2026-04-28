import type { PrayerTime } from "@sukut/shared";

const prayerOrder: PrayerTime["key"][] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

function minutesFromTime(value: string): number {
  const [hour = "0", minute = "0"] = value.split(":");
  return Number(hour) * 60 + Number(minute);
}

function dateForPrayerTime(time: string, now: Date) {
  const [hour = "0", minute = "0"] = time.split(":");
  const date = new Date(now);
  date.setHours(Number(hour), Number(minute), 0, 0);
  return date;
}

export function getNextPrayerKey(times: PrayerTime[], now = new Date()): PrayerTime["key"] | undefined {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const sortedTimes = [...times].sort((first, second) => prayerOrder.indexOf(first.key) - prayerOrder.indexOf(second.key));
  const upcoming = sortedTimes.find((time) => minutesFromTime(time.time) >= currentMinutes);

  return upcoming?.key ?? sortedTimes[0]?.key;
}

export function getPrayerLabel(times: PrayerTime[], key: PrayerTime["key"] | undefined): string | undefined {
  return times.find((time) => time.key === key)?.labelTr;
}

export function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getNextPrayerSummary(times: PrayerTime[], now = new Date()) {
  const sortedTimes = [...times].sort((first, second) => prayerOrder.indexOf(first.key) - prayerOrder.indexOf(second.key));
  const upcoming = sortedTimes.find((time) => dateForPrayerTime(time.time, now).getTime() >= now.getTime()) ?? sortedTimes[0];

  if (!upcoming) {
    return null;
  }

  const upcomingDate = dateForPrayerTime(upcoming.time, now);
  const dayOffset = upcomingDate.getTime() >= now.getTime() ? 0 : 1;

  if (dayOffset === 1) {
    upcomingDate.setDate(upcomingDate.getDate() + 1);
  }

  const totalMinutes = Math.max(0, Math.ceil((upcomingDate.getTime() - now.getTime()) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const remainingLabel = hours > 0 ? `${hours} sa ${minutes} dk` : `${minutes} dk`;

  return {
    key: upcoming.key,
    label: upcoming.labelTr,
    time: upcoming.time,
    dayOffset,
    remainingLabel
  };
}
