"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productAudienceLabel, productDetailHref } from "@/lib/productRouting";
import styles from "./ProductCard.module.css";

const categoryAccentColors = {
  Programming: "#2d6be4",
  "Data Science": "#4ECDC4",
  "Web Development": "#4a8af4"
};

function getCardAccent(product) {
  return categoryAccentColors[product.category] || product.accentColor || "#2d6be4";
}

function getSpineLabel(product) {
  return (product.logoText || product.title.slice(0, 3)).toUpperCase();
}

function ProductImage({ product, priority = false }) {
  const fallback = "/images/covers/python-handbook.png";
  const [src, setSrc] = useState(product.image || product.coverImage || (product.audience === "kids" ? "" : fallback));

  if (!src) {
    return (
      <div className={styles.imageFallback} role="img" aria-label={`${product.title} PDF cover`}>
        <span>{getSpineLabel(product)}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`${product.title} ${productAudienceLabel(product).toLowerCase()} cover by LearnStack`}
      className={styles.coverImage}
      width={276}
      height={368}
      sizes="(max-width: 390px) 180px, (max-width: 560px) 94px, 138px"
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      unoptimized={String(src).startsWith("http")}
      onError={() => setSrc(product.audience === "kids" ? "" : fallback)}
    />
  );
}

export default function ProductCard({ product, showDetails = true, buyLabel = "Buy on Gumroad", priority = false, showSample = false }) {
  const cardAccent = getCardAccent(product);
  const router = useRouter();
  const [opening, setOpening] = useState(false);
  const prefetched = useRef(false);
  const detailHref = productDetailHref(product);
  const cardSummary = product.summary || product.tagline || product.limitedDescription;

  useEffect(() => {
    setOpening(false);
    prefetched.current = false;
  }, [detailHref]);

  function prefetchDetails() {
    if (prefetched.current) return;
    prefetched.current = true;
    router.prefetch(detailHref);
  }

  function openDetails() {
    if (opening) return;
    setOpening(true);
    router.push(detailHref);
  }

  return (
    <article className={styles.card} style={{ "--accent": cardAccent }}>
      <div className={styles.accent} />
      <div className={styles.coverWrap}>
        <ProductImage product={product} priority={priority} />
      </div>

      <div className={styles.body}>
        <h3>{product.title}</h3>
        {cardSummary && <p className={styles.summary}>{cardSummary}</p>}
        <div className={styles.metaRow}>
          <strong>{product.priceDisplay || "View price"}</strong>
        </div>
        <div className={styles.actions}>
          {showDetails && (
            <button
              type="button"
              className={styles.detailsButton}
              disabled={opening}
              aria-label={opening ? `Opening ${product.title} details` : `Open ${product.title} details`}
              onFocus={prefetchDetails}
              onClick={openDetails}
              onPointerEnter={prefetchDetails}
              onTouchStart={prefetchDetails}
            >
              {opening && <span className={styles.buttonSpinner} aria-hidden="true" />}
              <span>{opening ? "Opening..." : "Details"}</span>
            </button>
          )}
          <Link href={product.gumroadUrl} target="_blank" rel="noopener noreferrer" className="brutalButton">
            {buyLabel}
          </Link>
          {showSample && product.sampleUrl && (
            <Link href={product.sampleUrl} target="_blank" rel="noopener noreferrer" className={styles.sampleButton}>
              View Free Sample
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
