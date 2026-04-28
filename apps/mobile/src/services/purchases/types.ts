import type { SubscriptionStateSnapshot } from "@sukut/shared";

export interface PurchasePackage {
  id: "monthly" | "yearly";
  productId: string;
  title: string;
  priceLabel: string;
  description: string;
  highlighted?: boolean;
}

export interface PurchaseProvider {
  getOfferings: () => Promise<PurchasePackage[]>;
  purchasePackage: (packageId: PurchasePackage["id"]) => Promise<SubscriptionStateSnapshot>;
  restorePurchases: () => Promise<SubscriptionStateSnapshot>;
  checkEntitlement: () => Promise<SubscriptionStateSnapshot>;
  setMockPremiumForDevelopment?: (enabled: boolean) => Promise<SubscriptionStateSnapshot>;
}
