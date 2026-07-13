"use client";

import { trackEvent, productEventParams } from "@/lib/analytics";
import { formatPrice, getProductPricing } from "@/lib/pricing";
import styles from "./StickyPurchaseBar.module.css";

export default function StickyPurchaseBar({ product }) {
  const pricing = getProductPricing(product);

  if (pricing.pricingType !== "fixed" || !product.gumroadUrl) return null;

  return (
    <aside className={styles.bar} aria-label={`Purchase ${product.title}`}>
      <div>
        <strong>{formatPrice(product)}</strong>
        <span>Secure Gumroad checkout</span>
      </div>
      <a href={product.gumroadUrl} target="_blank" rel="noopener noreferrer" className="brutalButton" onClick={() => trackEvent(product.isBundle ? "bundle_buy_clicked" : "gumroad_buy_clicked", productEventParams(product, "sticky_purchase_bar"))}>Buy</a>
    </aside>
  );
}
