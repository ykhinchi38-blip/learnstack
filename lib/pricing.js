import { getVerifiedUsdPrice, PRICE_VERIFICATION_NOTE } from "@/data/pricing";

export const USD_CURRENCY = "USD";
export const REGIONAL_PRICING_NOTE = "Regional pricing may be applied automatically by Gumroad at checkout for eligible countries.";

function readAmount(product = {}) {
  const directAmount = Number(product.priceAmount ?? product.price ?? 0);
  if (directAmount > 0) return directAmount;

  const cents = Number(product.priceCents ?? product.price_cents ?? 0);
  return cents > 0 ? cents / 100 : 0;
}

export function formatPrice(productOrAmount, currency = USD_CURRENCY, fallback = "View price on Gumroad") {
  const product = typeof productOrAmount === "object" && productOrAmount !== null ? productOrAmount : null;
  const amount = product ? readAmount(product) : Number(productOrAmount || 0);
  const sourceCurrency = String(product?.currency || currency || USD_CURRENCY).toUpperCase();

  if (sourceCurrency !== USD_CURRENCY || !Number.isFinite(amount) || amount <= 0) return fallback;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: USD_CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function getProductPricing(product = {}) {
  const sourceCurrency = String(product.currency || USD_CURRENCY).toUpperCase();
  const sourceAmount = readAmount(product);
  const verifiedAmount = getVerifiedUsdPrice(product);
  const needsVerification = product.pricingType === "verification-required";
  const price = verifiedAmount || (!needsVerification && sourceCurrency === USD_CURRENCY && sourceAmount > 0 ? sourceAmount : null);
  const pricingType = price ? "fixed" : "verification-required";

  return {
    price: price || null,
    priceCents: price ? Math.round(price * 100) : 0,
    currency: USD_CURRENCY,
    pricingType,
    priceDisplay: price ? formatPrice(price) : "View price on Gumroad",
    priceVerification: price ? null : PRICE_VERIFICATION_NOTE
  };
}
