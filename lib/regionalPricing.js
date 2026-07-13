import { getProductPricing } from "@/lib/pricing";

function hasValidGumroadUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "gumroad.com" || url.hostname.endsWith(".gumroad.com"));
  } catch {
    return false;
  }
}

export function canShowRegionalPricingNotice(product = {}) {
  const status = String(product.status || "published").toLowerCase();
  const pricing = getProductPricing(product);

  return status === "published" &&
    !product.unavailable &&
    !product.deleted &&
    !product.hidden &&
    pricing.pricingType === "fixed" &&
    pricing.currency === "USD" &&
    hasValidGumroadUrl(product.gumroadUrl || product.url);
}
