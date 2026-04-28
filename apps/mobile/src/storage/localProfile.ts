import AsyncStorage from "@react-native-async-storage/async-storage";
import { seedContentBundle, type LocalUserProfile } from "@sukut/shared";
import { getOrCreateDeviceId, getOrCreateLocalUserId } from "./localIdentity";
import { STORAGE_KEYS } from "./keys";

export async function createDefaultLocalProfile(): Promise<LocalUserProfile> {
  const now = new Date().toISOString();
  const localUserId = await getOrCreateLocalUserId();
  const deviceId = await getOrCreateDeviceId();

  return {
    localUserId,
    deviceId,
    remoteUserId: null,
    syncStatus: "local",
    createdAt: now,
    updatedAt: now,
    lastSyncedAt: null,
    city: seedContentBundle.appConfig.defaultCity,
    theme: "system",
    notificationPreferences: {
      prayerTimes: false,
      dailyContent: true,
      streakReminder: true,
      specialDays: true
    }
  };
}

export async function readLocalProfile(): Promise<LocalUserProfile> {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.localProfile);

  if (!stored) {
    const profile = await createDefaultLocalProfile();
    await writeLocalProfile(profile);
    return profile;
  }

  try {
    return JSON.parse(stored) as LocalUserProfile;
  } catch {
    const fallback = await createDefaultLocalProfile();
    await writeLocalProfile(fallback);
    return fallback;
  }
}

export async function writeLocalProfile(profile: LocalUserProfile): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEYS.localProfile,
    JSON.stringify({
      ...profile,
      updatedAt: new Date().toISOString()
    })
  );
}
