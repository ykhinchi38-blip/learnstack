"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./ProductDetailView.module.css";

const FULL_DETAILS_NOTICE = "For full description, complete preview, and purchase, visit Gumroad.";

function normalizeImageKey(value) {
  return String(value || "").trim().toLowerCase();
}

function getPreviewImages(product) {
  const cover = product.image || product.coverImage;
  const images = Array.isArray(product.previewImages) ? product.previewImages : [];
  const excluded = new Set([normalizeImageKey(cover)].filter(Boolean));
  const seen = new Set();
  const unique = [];

  images.forEach((image) => {
    const trimmed = String(image || "").trim();
    const key = normalizeImageKey(trimmed);

    if (!key || excluded.has(key) || seen.has(key)) return;

    seen.add(key);
    unique.push(trimmed);
  });

  return unique;
}

function ProductImage({ src, title, className, alt }) {
  if (!src) {
    return (
      <div className={`${styles.imageFallback} ${className || ""}`} role="img" aria-label={alt}>
        <span>{title.slice(0, 3).toUpperCase()}</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} loading="lazy" />;
}

export default function ProductDetailView({ product, catalogHref, catalogLabel, eyebrow }) {
  const coverImage = product.image || product.coverImage;
  const previewImages = useMemo(() => getPreviewImages(product), [product]);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const summary = product.summary || product.tagline || "A LearnStack digital handbook designed for simple and practical learning.";
  const limitedDescription = product.limitedDescription || summary;

  useEffect(() => {
    if (!selectedPreview) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setSelectedPreview(null);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedPreview]);

  return (
    <div className={styles.page}>
      <section className={styles.productSection}>
        <div className={`container ${styles.breadcrumbBar}`}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={catalogHref}>{catalogLabel}</Link>
          <span>/</span>
          <span>{product.title}</span>
        </div>

        <div className={`container ${styles.productGrid}`}>
          <div className={styles.mediaCol}>
            <div className={styles.coverFrame}>
              <ProductImage
                src={coverImage}
                title={product.title}
                alt={`${product.title} cover image`}
                className={styles.coverImage}
              />
            </div>

            <div className={styles.previewBlock}>
              <div className={styles.previewHeader}>
                <span>Gumroad Preview</span>
                <strong>{previewImages.length ? `${previewImages.length} image${previewImages.length === 1 ? "" : "s"}` : "Available on Gumroad"}</strong>
              </div>

              {previewImages.length > 0 ? (
                <div className={styles.previewGrid} aria-label={`${product.title} preview images`}>
                  {previewImages.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      className={styles.previewButton}
                      onClick={() => setSelectedPreview({
                        src: image,
                        alt: `${product.title} preview image ${index + 1}`
                      })}
                      aria-label={`Open ${product.title} preview image ${index + 1} larger`}
                    >
                      <ProductImage
                        src={image}
                        title={product.title}
                        alt={`${product.title} preview image ${index + 1}`}
                        className={styles.previewImage}
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className={styles.previewNote}>Preview images are available on Gumroad.</p>
              )}
            </div>
          </div>

          <div className={styles.infoCol}>
            <span className="tag">{eyebrow}</span>
            <h1>{product.title}</h1>
            <p className={styles.summary}>{summary}</p>

            <div className={styles.pricePanel}>
              <span>Price</span>
              <strong>{product.priceDisplay || "View price"}</strong>
            </div>

            <div className={styles.descriptionBlock}>
              <h2>About this PDF</h2>
              <p>{limitedDescription}</p>
              <p className={styles.fullNotice}>{FULL_DETAILS_NOTICE}</p>
            </div>

            <div className={styles.actions}>
              <a href={product.gumroadUrl} target="_blank" rel="noopener noreferrer" className="brutalButton brutalButtonWhite">
                View Full Details on Gumroad
              </a>
              <a href={product.gumroadUrl} target="_blank" rel="noopener noreferrer" className="brutalButton">
                Buy on Gumroad
              </a>
            </div>
          </div>
        </div>
      </section>

      {selectedPreview && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${product.title} preview image`}
          onClick={() => setSelectedPreview(null)}
        >
          <div className={styles.lightboxPanel} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Close preview image"
              onClick={() => setSelectedPreview(null)}
            >
              X
            </button>
            <img src={selectedPreview.src} alt={selectedPreview.alt} className={styles.lightboxImage} />
          </div>
        </div>
      )}
    </div>
  );
}
