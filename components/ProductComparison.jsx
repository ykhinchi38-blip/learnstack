"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, getProductPricing } from "@/lib/pricing";
import { productDetailHref } from "@/lib/productRouting";
import { hasValidSampleUrl } from "@/lib/sampleMatching";
import styles from "./ProductComparison.module.css";

function listValues(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string" || typeof item === "number") return String(item).trim();
        return String(item?.title || item?.name || item?.label || "").trim();
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function textValue(value) {
  if (typeof value === "string" || typeof value === "number") return String(value).trim();
  return "";
}

function pageCount(product) {
  const pages = product.pageCount || product.pages;
  if (typeof pages === "number") return `${pages} pages`;
  if (typeof pages === "string" && /\d/.test(pages)) return pages;
  return "";
}

function priceValue(product) {
  const pricing = getProductPricing(product);
  return pricing.pricingType === "fixed" && typeof pricing.price === "number" ? formatPrice(product) : "";
}

function productImage(product) {
  return product.image || product.coverImage || "";
}

function ComparisonValue({ value }) {
  if (Array.isArray(value)) {
    return value.length > 0 ? <ul>{value.map((item) => <li key={item}>{item}</li>)}</ul> : null;
  }

  return value ? <span>{value}</span> : null;
}

export default function ProductComparison({ products, onRemove, onClear }) {
  if (products.length === 0) return null;

  const canCompare = products.length >= 2;
  const rows = [
    { label: "USD price", value: priceValue },
    { label: "Skill level", value: (product) => textValue(product.skillLevel || product.level) },
    { label: "Page count", value: pageCount },
    { label: "Main topics", value: (product) => listValues(product.topics) },
    { label: "Projects", value: (product) => listValues(product.projects) },
    { label: "Exercises", value: (product) => listValues(product.exercises) },
    { label: "Cheat sheets", value: (product) => listValues(product.cheatSheets) },
    { label: "Prerequisites", value: (product) => listValues(product.prerequisites) },
    { label: "Best suited for", value: (product) => listValues(product.whoFor || product.bestSuitedFor) },
    { label: "Preview availability", value: (product) => hasValidSampleUrl(product) ? "Available" : "Not currently available" }
  ].filter((row) => row.label === "Preview availability" || products.some((product) => {
    const value = row.value(product);
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  }));

  return (
    <section className={styles.comparison} aria-labelledby="comparison-heading">
      <div className={styles.summaryBar}>
        <div>
          <span className="tag">Compare Handbooks</span>
          <h2 id="comparison-heading">{products.length} of 3 selected</h2>
          {!canCompare && <p>Select one more handbook to open the comparison.</p>}
        </div>
        <button type="button" className={styles.clearButton} onClick={onClear}>Clear comparison</button>
      </div>

      {canCompare && (
        <div className={styles.tableWrap} tabIndex="0" role="region" aria-label="Technical handbook comparison. Swipe or use horizontal scrolling to see every selected handbook.">
          <table className={styles.table}>
            <caption className={styles.srOnly}>Compare selected LearnStack technical handbooks.</caption>
            <thead>
              <tr>
                <th scope="col">Compare</th>
                {products.map((product) => {
                  const image = productImage(product);
                  return (
                    <th key={product.id} scope="col" className={styles.productHeader}>
                      {image ? (
                        <Image
                          src={image}
                          alt={`${product.title} cover`}
                          width={110}
                          height={147}
                          className={styles.cover}
                          unoptimized={String(image).startsWith("http")}
                        />
                      ) : (
                        <div className={styles.coverFallback} role="img" aria-label={`${product.title} cover unavailable`}>PDF</div>
                      )}
                      <strong>{product.title}</strong>
                      <button type="button" className={styles.removeButton} onClick={() => onRemove(product)} aria-label={`Remove ${product.title} from comparison`}>
                        Remove
                      </button>
                      <div className={styles.productActions}>
                        <Link href={productDetailHref(product)} className={styles.detailsLink}>View Details</Link>
                        {product.gumroadUrl && <Link href={product.gumroadUrl} target="_blank" rel="noopener noreferrer" className="brutalButton">Buy Through Gumroad</Link>}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {products.map((product) => (
                    <td key={product.id}><ComparisonValue value={row.value(product)} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
