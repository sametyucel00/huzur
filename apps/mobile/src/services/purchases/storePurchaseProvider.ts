import { Platform } from "react-native";
import type { SubscriptionStateSnapshot } from "@sukut/shared";
import type { PurchasePackage, PurchaseProvider } from "./types";

type ExpoIapModule = typeof import("expo-iap");
type StorePurchase = import("expo-iap").Purchase;
type StoreSubscription = import("expo-iap").ProductSubscription;

const monthlyProductId =
  process.env.EXPO_PUBLIC_SUKUT_PRIVILEGE_MONTHLY_PRODUCT_ID ||
  process.env.EXPO_PUBLIC_SUKUT_PLUS_MONTHLY_PRODUCT_ID ||
  "sukut_privilege_monthly";
const yearlyProductId =
  process.env.EXPO_PUBLIC_SUKUT_PRIVILEGE_YEARLY_PRODUCT_ID ||
  process.env.EXPO_PUBLIC_SUKUT_PLUS_YEARLY_PRODUCT_ID ||
  "sukut_privilege_yearly";
const productIds = [monthlyProductId, yearlyProductId];

let connectionPromise: Promise<ExpoIapModule> | null = null;
let cachedSubscriptions: StoreSubscription[] = [];

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

async function getIap(): Promise<ExpoIapModule> {
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    throw new Error("store_iap_unsupported_platform");
  }

  if (!connectionPromise) {
    connectionPromise = import("expo-iap").then(async (iap) => {
      await iap.initConnection();
      return iap;
    });
  }

  return connectionPromise;
}

function planForProduct(productId: string): "monthly" | "yearly" {
  return productId === yearlyProductId ? "yearly" : "monthly";
}

function productIdForPackage(packageId: PurchasePackage["id"]) {
  return packageId === "yearly" ? yearlyProductId : monthlyProductId;
}

function getAndroidOffer(productId: string) {
  const subscription = cachedSubscriptions.find((item) => item.id === productId);
  return subscription?.subscriptionOffers?.[0];
}

function packageFromSubscription(subscription: StoreSubscription): PurchasePackage {
  const plan = planForProduct(subscription.id);

  return {
    id: plan,
    productId: subscription.id,
    title: plan === "yearly" ? "Yıllık Sükût Ayrıcalık" : "Aylık Sükût Ayrıcalık",
    priceLabel: subscription.displayPrice,
    description: subscription.description || (plan === "yearly" ? "Yıllık plan uzun vadeli ritim için öne çıkar." : "Aylık kullanım için esnek başlangıç."),
    highlighted: plan === "yearly"
  };
}

function normalizePurchaseResult(result: StorePurchase | StorePurchase[] | null | undefined): StorePurchase | null {
  if (!result) {
    return null;
  }

  return Array.isArray(result) ? result[0] ?? null : result;
}

function snapshotFromPurchase(purchase: StorePurchase): SubscriptionStateSnapshot {
  const plan = planForProduct(purchase.productId);
  const expiresAt = "expirationDateIOS" in purchase && purchase.expirationDateIOS ? new Date(purchase.expirationDateIOS).toISOString() : null;

  return {
    isPremium: true,
    activePlan: plan,
    entitlementId: "sukut_privilege",
    productId: purchase.productId,
    expiresAt,
    source: "store",
    lastCheckedAt: new Date().toISOString()
  };
}

function freeSnapshot(): SubscriptionStateSnapshot {
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

async function resolveActiveSubscription(): Promise<SubscriptionStateSnapshot> {
  const iap = await getIap();
  const activeSubscriptions = await iap.getActiveSubscriptions(productIds);
  const active = activeSubscriptions.find((item) => item.isActive && productIds.includes(item.productId));

  if (active) {
    return {
      isPremium: true,
      activePlan: planForProduct(active.productId),
      entitlementId: "sukut_privilege",
      productId: active.productId,
      expiresAt: active.expirationDateIOS ? new Date(active.expirationDateIOS).toISOString() : null,
      source: "store",
      lastCheckedAt: new Date().toISOString()
    };
  }

  const purchases = await iap.getAvailablePurchases({ onlyIncludeActiveItemsIOS: true, includeSuspendedAndroid: false });
  const purchase = purchases.find((item) => productIds.includes(item.productId));
  return purchase ? snapshotFromPurchase(purchase) : freeSnapshot();
}

export function createStorePurchaseProvider(): PurchaseProvider {
  return {
    async getOfferings() {
      if (Platform.OS !== "ios" && Platform.OS !== "android") {
        return fallbackPackages();
      }

      try {
        const iap = await getIap();
        const products = await iap.fetchProducts({ skus: productIds, type: "subs" });
        cachedSubscriptions = (products ?? []).filter((item): item is StoreSubscription => item.type === "subs");
        const packages = cachedSubscriptions.map(packageFromSubscription).sort((a) => (a.id === "yearly" ? -1 : 1));
        return packages.length > 0 ? packages : fallbackPackages();
      } catch {
        return fallbackPackages();
      }
    },
    async purchasePackage(packageId) {
      if (Platform.OS !== "ios" && Platform.OS !== "android") {
        throw new Error("Satın alma yalnızca iOS ve Android uygulamasında kullanılabilir.");
      }

      const iap = await getIap();
      if (cachedSubscriptions.length === 0) {
        const products = await iap.fetchProducts({ skus: productIds, type: "subs" });
        cachedSubscriptions = (products ?? []).filter((item): item is StoreSubscription => item.type === "subs");
      }

      const productId = productIdForPackage(packageId);
      const androidOffer = Platform.OS === "android" ? getAndroidOffer(productId) : null;
      const result = await iap.requestPurchase({
        type: "subs",
        request: {
          apple: { sku: productId },
          google: {
            skus: [productId],
            subscriptionOffers: androidOffer?.offerTokenAndroid ? [{ sku: productId, offerToken: androidOffer.offerTokenAndroid }] : undefined
          }
        }
      });
      const purchase = normalizePurchaseResult(result);

      if (!purchase) {
        throw new Error("Satın alma sonucu alınamadı.");
      }

      await iap.finishTransaction({ purchase, isConsumable: false });
      return snapshotFromPurchase(purchase);
    },
    async restorePurchases() {
      if (Platform.OS !== "ios" && Platform.OS !== "android") {
        return freeSnapshot();
      }

      const iap = await getIap();
      await iap.restorePurchases();
      return resolveActiveSubscription();
    },
    async checkEntitlement() {
      if (Platform.OS !== "ios" && Platform.OS !== "android") {
        return freeSnapshot();
      }

      return resolveActiveSubscription();
    }
  };
}
