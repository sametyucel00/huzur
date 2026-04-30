import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import type { FeatureKey, SubscriptionStateSnapshot } from "@sukut/shared";
import { purchaseService } from "@/services/purchases/purchaseService";
import type { PurchasePackage } from "@/services/purchases/types";
import { STORAGE_KEYS } from "@/storage/keys";

const defaultSubscription: SubscriptionStateSnapshot = {
  isPremium: false,
  activePlan: "free",
  entitlementId: null,
  productId: null,
  expiresAt: null,
  source: "mock",
  lastCheckedAt: null
};

interface SubscriptionState extends SubscriptionStateSnapshot {
  offerings: PurchasePackage[];
  isLoading: boolean;
  lastError: string | null;
  hydrate: () => Promise<void>;
  refreshOfferings: () => Promise<void>;
  purchasePackage: (packageId: PurchasePackage["id"]) => Promise<void>;
  restorePurchases: () => Promise<void>;
  checkEntitlement: () => Promise<void>;
  setMockPremiumForDevelopment: (enabled: boolean) => Promise<void>;
  canAccessFeature: (featureKey: FeatureKey) => boolean;
}

async function persist(snapshot: SubscriptionStateSnapshot) {
  await AsyncStorage.setItem(STORAGE_KEYS.subscriptionState, JSON.stringify(snapshot));
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  ...defaultSubscription,
  offerings: [],
  isLoading: false,
  lastError: null,
  async hydrate() {
    let parsed: SubscriptionStateSnapshot | null = null;

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.subscriptionState);
      parsed = stored ? (JSON.parse(stored) as SubscriptionStateSnapshot) : null;
    } catch {
      parsed = null;
      await AsyncStorage.removeItem(STORAGE_KEYS.subscriptionState).catch(() => undefined);
      set({ ...defaultSubscription, lastError: "Abonelik bilgisi okunamadı; ücretsiz modla devam ediliyor." });
    }

    if (parsed) {
      set({ ...parsed, lastError: null });
    }
    await get().refreshOfferings().catch(() => undefined);
    if (parsed?.source === "mock") {
      return;
    }
    await get().checkEntitlement().catch(() => undefined);
  },
  async refreshOfferings() {
    try {
      const offerings = await purchaseService.getOfferings();
      set({ offerings, lastError: null });
    } catch {
      set({ offerings: [], lastError: "Sükût Ayrıcalık paketleri şu anda alınamadı." });
    }
  },
  async purchasePackage(packageId) {
    set({ isLoading: true, lastError: null });
    try {
      const snapshot = await purchaseService.purchasePackage(packageId);
      await persist(snapshot);
      set({ ...snapshot, isLoading: false, lastError: null });
    } catch {
      set({ isLoading: false, lastError: "Satın alma tamamlanamadı. Lütfen bağlantını kontrol edip tekrar dene." });
      throw new Error("purchase_failed");
    }
  },
  async restorePurchases() {
    set({ isLoading: true, lastError: null });
    try {
      const snapshot = await purchaseService.restorePurchases();
      await persist(snapshot);
      set({ ...snapshot, isLoading: false, lastError: null });
    } catch {
      set({ isLoading: false, lastError: "Satın alımlar geri yüklenemedi. Biraz sonra tekrar dene." });
      throw new Error("restore_failed");
    }
  },
  async checkEntitlement() {
    try {
      const snapshot = await purchaseService.checkEntitlement();
      await persist(snapshot);
      set({ ...snapshot, lastError: null });
    } catch {
      set({ lastError: "Abonelik durumu kontrol edilemedi; mevcut mod korunuyor." });
    }
  },
  async setMockPremiumForDevelopment(enabled) {
    if (!purchaseService.setMockPremiumForDevelopment) {
      return;
    }
    try {
      const snapshot = await purchaseService.setMockPremiumForDevelopment(enabled);
      await persist(snapshot);
      set({ ...snapshot, lastError: null });
    } catch {
      set({ lastError: "Geliştirme aboneliği değiştirilemedi." });
    }
  },
  canAccessFeature(featureKey) {
    const premiumFeatures: FeatureKey[] = [
      "weekly_reflection",
      "advanced_daily_plan",
      "mini_progress_calendar_advanced",
      "quiet_rewards_collection",
      "premium_plans",
      "advanced_mood_recommendations",
      "audio_content",
      "themes_premium"
    ];

    return !premiumFeatures.includes(featureKey) || get().isPremium;
  }
}));
