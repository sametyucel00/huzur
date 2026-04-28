import type { SubscriptionStateSnapshot } from "@sukut/shared";
import type { PurchasePackage, PurchaseProvider } from "./types";

const monthlyProductId =
  process.env.EXPO_PUBLIC_SUKUT_PRIVILEGE_MONTHLY_PRODUCT_ID ||
  process.env.EXPO_PUBLIC_SUKUT_PLUS_MONTHLY_PRODUCT_ID ||
  "sukut_privilege_monthly_placeholder";
const yearlyProductId =
  process.env.EXPO_PUBLIC_SUKUT_PRIVILEGE_YEARLY_PRODUCT_ID ||
  process.env.EXPO_PUBLIC_SUKUT_PLUS_YEARLY_PRODUCT_ID ||
  "sukut_privilege_yearly_placeholder";

let mockState: SubscriptionStateSnapshot = {
  isPremium: false,
  activePlan: "free",
  entitlementId: null,
  productId: null,
  expiresAt: null,
  source: "mock",
  lastCheckedAt: null
};

const offerings: PurchasePackage[] = [
  {
    id: "yearly",
    productId: yearlyProductId,
    title: "Yıllık Sükût Ayrıcalık",
    priceLabel: "Remote config fiyatı",
    description: "Yıllık plan ana önerilen seçenek olarak gösterilir.",
    highlighted: true
  },
  {
    id: "monthly",
    productId: monthlyProductId,
    title: "Aylık Sükût Ayrıcalık",
    priceLabel: "Remote config fiyatı",
    description: "Esnek aylık kullanım.",
    highlighted: false
  }
];

function premiumState(plan: "monthly" | "yearly"): SubscriptionStateSnapshot {
  const expires = new Date();
  expires.setMonth(expires.getMonth() + (plan === "yearly" ? 12 : 1));

  return {
    isPremium: true,
    activePlan: plan,
    entitlementId: "sukut_privilege",
    productId: plan === "yearly" ? yearlyProductId : monthlyProductId,
    expiresAt: expires.toISOString(),
    source: "mock",
    lastCheckedAt: new Date().toISOString()
  };
}

export const mockPurchaseProvider: PurchaseProvider = {
  async getOfferings() {
    return offerings;
  },
  async purchasePackage(packageId) {
    mockState = premiumState(packageId);
    return mockState;
  },
  async restorePurchases() {
    return {
      ...mockState,
      lastCheckedAt: new Date().toISOString()
    };
  },
  async checkEntitlement() {
    return {
      ...mockState,
      lastCheckedAt: new Date().toISOString()
    };
  },
  async setMockPremiumForDevelopment(enabled) {
    mockState = enabled
      ? premiumState("yearly")
      : {
          isPremium: false,
          activePlan: "free",
          entitlementId: null,
          productId: null,
          expiresAt: null,
          source: "mock",
          lastCheckedAt: new Date().toISOString()
        };
    return mockState;
  }
};
