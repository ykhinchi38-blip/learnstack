"use client";

import { useState } from "react";
import { REGIONAL_PRICING_NOTE } from "@/lib/pricing";
import { canShowRegionalPricingNotice } from "@/lib/regionalPricing";
import styles from "./RegionalPricingNotice.module.css";

export default function RegionalPricingNotice({ product, variant = "compact" }) {
  const [expanded, setExpanded] = useState(false);

  if (!canShowRegionalPricingNotice(product)) return null;

  if (variant === "detailed") {
    return (
      <div className={styles.detailed}>
        <p>{REGIONAL_PRICING_NOTE}</p>
        <p>The final regional price is determined by Gumroad using the customer&apos;s location and payment method.</p>
      </div>
    );
  }

  const tooltipId = `regional-pricing-${product.id || product.slug || "product"}`;

  return (
    <div className={styles.compact}>
      <span>Regional pricing available at checkout</span>
      <button
        type="button"
        className={styles.infoButton}
        aria-label="Regional pricing information"
        aria-describedby={tooltipId}
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
        onKeyDown={(event) => { if (event.key === "Escape") setExpanded(false); }}
      >
        i
      </button>
      <span id={tooltipId} role="tooltip" className={`${styles.tooltip} ${expanded ? styles.tooltipOpen : ""}`}>
        Gumroad may automatically adjust the price for eligible countries, including India, based on the customer&apos;s location and payment method.
      </span>
    </div>
  );
}
