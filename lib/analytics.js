"use client";

import { hasAnalyticsConsent } from "@/lib/cookieConsent";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID;
const SAFE_PARAM_KEYS = new Set([
  "product_id", "product_title", "product_category", "category", "price", "currency", "cta_location",
  "page_path", "partnership_type", "source", "audience_preference", "catalog"
]);

function safeParams(params = {}) {
  return Object.entries(params).reduce((safe, [key, value]) => {
    if (!SAFE_PARAM_KEYS.has(key) || value === undefined || value === null || value === "") return safe;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      safe[key] = typeof value === "string" ? value.slice(0, 200) : value;
    }
    return safe;
  }, {});
}

export function isAnalyticsConfigured() {
  return Boolean(measurementId) && hasAnalyticsConsent();
}

export function trackEvent(name, params = {}) {
  if (typeof window === "undefined" || !isAnalyticsConfigured()) return;

  const payload = {
    page_path: window.location.pathname,
    ...safeParams(params)
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", name, payload);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
}

export function productEventParams(product = {}, ctaLocation = "") {
  return {
    product_id: product.id || product.slug || "",
    product_title: product.title || product.name || "",
    product_category: product.category || product.audience || "",
    price: Number(product.price) || undefined,
    currency: product.currency || "USD",
    cta_location: ctaLocation
  };
}
