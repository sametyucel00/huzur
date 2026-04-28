import { mockPurchaseProvider } from "./mockPurchaseProvider";
import { createStorePurchaseProvider } from "./storePurchaseProvider";
import type { PurchaseProvider } from "./types";

export function getPurchaseProvider(): PurchaseProvider {
  const provider = process.env.EXPO_PUBLIC_PURCHASE_PROVIDER;

  if (provider === "store") {
    return createStorePurchaseProvider();
  }

  return mockPurchaseProvider;
}

export const purchaseService = getPurchaseProvider();
