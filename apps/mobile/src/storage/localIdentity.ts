import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import { STORAGE_KEYS } from "./keys";

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function getOrCreateLocalUserId(): Promise<string> {
  const existing = await AsyncStorage.getItem(STORAGE_KEYS.localUserId);
  if (existing) {
    return existing;
  }

  const next = createId("local");
  await AsyncStorage.setItem(STORAGE_KEYS.localUserId, next);
  return next;
}

export async function getOrCreateDeviceId(): Promise<string> {
  const existing = await AsyncStorage.getItem(STORAGE_KEYS.deviceId);
  if (existing) {
    return existing;
  }

  const deviceName = Device.deviceName ? Device.deviceName.replace(/\s+/g, "-").toLocaleLowerCase("tr-TR") : "device";
  const next = `${deviceName}_${createId("device")}`;
  await AsyncStorage.setItem(STORAGE_KEYS.deviceId, next);
  return next;
}
