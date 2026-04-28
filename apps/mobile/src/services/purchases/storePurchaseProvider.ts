import type { SubscriptionStateSnapshot } from "@sukut/shared";
import type { PurchasePackage, PurchaseProvider } from "./types";

const monthlyProductId =
  process.env.EXPO_PUBLIC_SUKUT_PRIVILEGE_MONTHLY_PRODUCT_ID ||
  process.env.EXPO_PUBLIC_SUKUT_PLUS_MONTHLY_PRODUCT_ID ||
  "sukut_privilege_monthly";

const yearlyProductId =
  process.env.EXPO_PUBLIC_SUKUT_PRIVILEGE_YEARLY_PRODUCT_ID ||
  process.env.EXPO_PUBLIC_SUKUT_PLUS_YEARLY_PRODUCT_ID ||
  "sukut_privilege_yearly";

function fallbackPackages(): PurchasePackage[] {
  return [
    {
      id: "yearly",
      productId: yearlyProductId,
      title: "Yıllık Sükût Ayrıcalık",
      priceLabel: "799 TL / yıl",
      description: "Yıllık plan uzun vadeli ritim için öne çıkar.",
      highlighted: true
    },
    {
      id: "monthly",
      productId: monthlyProductId,
      title: "Aylık Sükût Ayrıcalık",
      priceLabel: "99 TL / ay",
      description: "Aylık kullanım için esnek başlangıç.",
      highlighted: false
    }
  ];
}

function freeStoreSnapshot(): SubscriptionStateSnapshot {
  return {
    isPremium: false,
    activePlan: "free",
    entitlementId: null,
    productId: null,
    expiresAt: null,
    source: "store",
    lastCheckedAt: new Date().toISOString()
  };
}

function unavailableMessage() {
  return "Mağaza satın alma modülü bu buildde devre dışı. Ürün kimlikleri ve Sükût Ayrıcalık mimarisi hazır; canlı satın alma için uyumlu native IAP modülü yeniden etkinleştirilmeli.";
}

export function createStorePurchaseProvider(): PurchaseProvider {
  return {
    async getOfferings() {
      return fallbackPackages();
    },
    async purchasePackage() {
      throw new Error(unavailableMessage());
    },
    async restorePurchases() {
      return freeStoreSnapshot();
    },
    async checkEntitlement() {
      return freeStoreSnapshot();
    }
  };
}
