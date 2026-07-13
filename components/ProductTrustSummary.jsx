import { hasValidSampleUrl } from "@/lib/sampleMatching";
import { canShowRegionalPricingNotice } from "@/lib/regionalPricing";
import RegionalPricingNotice from "./RegionalPricingNotice";
import styles from "./ProductTrustSummary.module.css";

function factValue(product) {
  const facts = [];
  const pageCount = product.pageCount || product.pages;
  const audience = product.ageRange || product.skillLevel || product.level;

  if (pageCount && pageCount !== "PDF") facts.push(`${pageCount} pages`);
  if (product.format) facts.push(product.format);
  if (audience) facts.push(audience);
  if (product.edition && product.edition !== "Latest Edition") facts.push(product.edition);

  return facts;
}

function hasAvailablePreview(product) {
  if (hasValidSampleUrl(product)) return true;

  return (product.previewImages || []).some((image) => {
    const source = typeof image === "string" ? image : image?.url || image?.src || "";
    return Boolean(source) && !String(source).toLowerCase().includes("preview-placeholder");
  });
}

export default function ProductTrustSummary({ product }) {
  const hasPreview = hasAvailablePreview(product);
  const facts = factValue(product);
  const showRegionalPricing = canShowRegionalPricingNotice(product);

  return (
    <aside className={styles.summary} aria-label="Product purchase information">
      <p className={styles.digitalNotice}>This is a digital product. No physical item will be shipped.</p>
      <ul className={styles.signals}>
        <li>Digital PDF product</li>
        <li>Secure checkout through Gumroad</li>
        <li>Instant digital delivery</li>
        {hasPreview && <li>Preview available</li>}
        {showRegionalPricing && <li>Regional pricing where eligible</li>}
        <li>Support for genuine download or delivery issues</li>
      </ul>
      {facts.length > 0 && <div className={styles.facts}>{facts.map((fact) => <span key={fact}>{fact}</span>)}</div>}
      {showRegionalPricing && <RegionalPricingNotice product={product} variant="detailed" />}
    </aside>
  );
}
