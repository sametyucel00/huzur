import { create } from "zustand";
import type { LocalUserProfile, NotificationPreferences, ThemeMode } from "@sukut/shared";
import { createDefaultLocalProfile, readLocalProfile, writeLocalProfile } from "@/storage/localProfile";

interface LocalProfileState {
  profile: LocalUserProfile | null;
  isReady: boolean;
  hydrate: () => Promise<void>;
  setCity: (city: string) => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  toggleNotificationPreference: (key: keyof NotificationPreferences) => Promise<void>;
}

export const useLocalProfileStore = create<LocalProfileState>((set, get) => ({
  profile: null,
  isReady: false,
  async hydrate() {
    try {
      const profile = await readLocalProfile();
      set({ profile, isReady: true });
    } catch {
      const fallback = await createDefaultLocalProfile().catch(() => null);
      set({ profile: fallback, isReady: true });
    }
  },
  async setCity(city) {
    const current = get().profile ?? (await readLocalProfile());
    const next = { ...current, city, syncStatus: "pending" as const };
    await writeLocalProfile(next);
    set({ profile: next });
  },
  async setTheme(theme) {
    const current = get().profile ?? (await readLocalProfile());
    const next = { ...current, theme, syncStatus: "pending" as const };
    await writeLocalProfile(next);
    set({ profile: next });
  },
  async toggleNotificationPreference(key) {
    const current = get().profile ?? (await readLocalProfile());
    const next = {
      ...current,
      notificationPreferences: {
        ...current.notificationPreferences,
        [key]: !current.notificationPreferences[key]
      },
      syncStatus: "pending" as const
    };
    await writeLocalProfile(next);
    set({ profile: next });
  }
}));
