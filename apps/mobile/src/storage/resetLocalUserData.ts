import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./keys";

export async function resetLocalUserData(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.localProfile,
    STORAGE_KEYS.localProgress,
    STORAGE_KEYS.subscriptionState,
    STORAGE_KEYS.quranProgress,
    STORAGE_KEYS.localUserId,
    STORAGE_KEYS.deviceId,
    STORAGE_KEYS.syncState,
    STORAGE_KEYS.onboardingSeen
  ]);
}
