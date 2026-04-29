import { Platform } from "react-native";
import type { ActiveSubscription, ProductOrSubscription, Purchase } from "expo-iap";
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

const productIds = [monthlyProductId, yearlyProductId];

let connectionPromise: Promise<boolean> | null = null;

function planFromProductId(productId: string): "monthly" | "yearly" {
  return productId === yearlyProductId ? "yearly" : "monthly";
}

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

function snapshotFromSubscription(subscription: ActiveSubscription): SubscriptionStateSnapshot {
  const productId = subscription.productId;

  return {
    isPremium: subscription.isActive,
    activePlan: subscription.isActive ? planFromProductId(productId) : "free",
    entitlementId: subscription.transactionId ?? productId,
    productId,
    expiresAt: subscription.expirationDateIOS ? new Date(subscription.expirationDateIOS).toISOString() : null,
    source: "store",
    lastCheckedAt: new Date().toISOString()
  };
}

function snapshotFromPurchase(purchase: Purchase): SubscriptionStateSnapshot {
  const productId = purchase.productId;
  const isPurchased = purchase.purchaseState === "purchased";

  return {
    isPremium: isPurchased,
    activePlan: isPurchased ? planFromProductId(productId) : "free",
    entitlementId: purchase.transactionId ?? purchase.id ?? productId,
    productId: isPurchased ? productId : null,
    expiresAt: "expirationDateIOS" in purchase && purchase.expirationDateIOS ? new Date(purchase.expirationDateIOS).toISOString() : null,
    source: "store",
    lastCheckedAt: new Date().toISOString()
  };
}

function normalizePurchase(result: Purchase | Purchase[] | null | undefined): Purchase | null {
  if (!result) return null;
  return Array.isArray(result) ? (result[0] ?? null) : result;
}

function packageFromProduct(product: ProductOrSubscription): PurchasePackage {
  const id = planFromProductId(product.id);

  return {
    id,
    productId: product.id,
    title: product.displayName || product.title || (id === "yearly" ? "Yıllık Sükût Ayrıcalık" : "Aylık Sükût Ayrıcalık"),
    priceLabel: product.displayPrice || fallbackPackages().find((item) => item.id === id)?.priceLabel || "",
    description: id === "yearly" ? "Yıllık plan uzun vadeli ritim için öne çıkar." : "Aylık kullanım için esnek başlangıç.",
    highlighted: id === "yearly"
  };
}

async function getIap() {
  if (Platform.OS === "web") {
    throw new Error("Satın alma web önizlemede kullanılamaz.");
  }

  return import("expo-iap");
}

async function ensureConnection() {
  const iap = await getIap();

  if (!connectionPromise) {
    connectionPromise = iap.initConnection().catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  await connectionPromise;
  return iap;
}

async function getActiveStoreSubscription(): Promise<SubscriptionStateSnapshot> {
  const iap = await ensureConnection();
  const activeSubscriptions = await iap.getActiveSubscriptions(productIds);
  const active = activeSubscriptions.find((subscription) => subscription.isActive && productIds.includes(subscription.productId));

  return active ? snapshotFromSubscription(active) : freeStoreSnapshot();
}

async function finishIfNeeded(purchase: Purchase | null) {
  if (!purchase || purchase.purchaseState !== "purchased") {
    return;
  }

  const iap = await ensureConnection();
  await iap.finishTransaction({ purchase, isConsumable: false }).catch(() => undefined);
}

export function createStorePurchaseProvider(): PurchaseProvider {
  return {
    async getOfferings() {
      try {
        const iap = await ensureConnection();
        const products = await iap.fetchProducts({ skus: productIds, type: "subs" });
        const packages = (products ?? [])
          .filter((product): product is ProductOrSubscription => Boolean(product?.id && productIds.includes(product.id)))
          .map(packageFromProduct)
          .sort((a, b) => (a.id === "yearly" ? -1 : 1) - (b.id === "yearly" ? -1 : 1));

        return packages.length > 0 ? packages : fallbackPackages();
      } catch {
        return fallbackPackages();
      }
    },
    async purchasePackage(packageId) {
      const productId = packageId === "yearly" ? yearlyProductId : monthlyProductId;
      const iap = await ensureConnection();
      const result = await iap.requestPurchase({
        request: {
          apple: { sku: productId },
          google: { skus: [productId] }
        },
        type: "subs"
      });
      const purchase = normalizePurchase(result);

      await finishIfNeeded(purchase);

      const entitlement = await getActiveStoreSubscription().catch(() => null);
      return entitlement?.isPremium ? entitlement : snapshotFromPurchase(purchase ?? ({ productId, purchaseState: "purchased" } as Purchase));
    },
    async restorePurchases() {
      const iap = await ensureConnection();
      await iap.restorePurchases().catch(() => undefined);
      return getActiveStoreSubscription();
    },
    async checkEntitlement() {
      return getActiveStoreSubscription();
    }
  };
}
