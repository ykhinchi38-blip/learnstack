"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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

function isExternalImage(src = "") {
  return String(src).startsWith("http");
}

function ProductImage({ src, title, className, alt, width = 720, height = 960, priority = false }) {
  if (!src) {
    return (
      <div className={`${styles.imageFallback} ${className || ""}`} role="img" aria-label={alt}>
        <span>{title.slice(0, 3).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      sizes="(max-width: 900px) 92vw, 42vw"
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      unoptimized={isExternalImage(src)}
    />
  );
}

export default function ProductDetailView({ product, catalogHref, catalogLabel, eyebrow, relatedProducts = [] }) {
  const coverImage = product.image || product.coverImage;
  const previewImages = useMemo(() => getPreviewImages(product), [product]);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const summary = product.summary || product.tagline || "A LearnStack digital handbook designed for simple and practical learning.";
  const limitedDescription = product.limitedDescription || summary;
  const topics = Array.isArray(product.topics) ? product.topics.slice(0, 6) : [];
  const isKidsBook = product.audience === "kids";
  const audienceCopy = isKidsBook
    ? "Young learners, parents, and beginners who want friendly digital learning with stories, curiosity prompts, activities, and gentle explanations."
    : "CSE students, coding beginners, developers, and self-learners who want practical notes for projects, exams, interviews, and quick revision.";
  const getItems = isKidsBook
    ? ["Digital PDF access through Gumroad", "Kid-friendly explanations and activities", "Demo previews where available", "Readable pages for phone, tablet, and laptop"]
    : ["Digital PDF access through Gumroad", "Structured explanations and revision notes", "Demo previews where available", "Readable pages for phone, tablet, and laptop"];

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
                alt={`${product.title} ${isKidsBook ? "kids learning book" : "handbook"} cover by LearnStack`}
                className={styles.coverImage}
                priority
              />
            </div>

            <section className={styles.previewBlock} aria-labelledby="demo-preview-heading">
              <div className={styles.previewHeader}>
                <h2 id="demo-preview-heading">Demo preview</h2>
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
                        width={480}
                        height={360}
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className={styles.previewNote}>Preview images are available on Gumroad.</p>
              )}
            </section>
          </div>

          <div className={styles.infoCol}>
            <span className="tag">{eyebrow}</span>
            <h1>{product.title}</h1>
            <p className={styles.summary}>{summary}</p>

            <div className={styles.pricePanel}>
              <span>Price</span>
              <strong>{product.priceDisplay || "View price"}</strong>
            </div>

            <section className={styles.descriptionBlock} aria-labelledby="covers-heading">
              <h2 id="covers-heading">What this handbook covers</h2>
              <p>{limitedDescription}</p>
              {topics.length > 0 && (
                <ul className={styles.topicList}>
                  {topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              )}
              <p className={styles.fullNotice}>{FULL_DETAILS_NOTICE}</p>
            </section>

            <section className={styles.descriptionBlock} aria-labelledby="audience-heading">
              <h2 id="audience-heading">Who this is for</h2>
              <p>{audienceCopy}</p>
            </section>

            <section className={styles.descriptionBlock} aria-labelledby="what-you-get-heading">
              <h2 id="what-you-get-heading">What you get</h2>
              <ul className={styles.checkList}>
                {getItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className={styles.buyBlock} aria-labelledby="buy-heading">
              <h2 id="buy-heading">Buy or download</h2>
              <div className={styles.actions}>
                <a href={product.gumroadUrl} target="_blank" rel="noopener noreferrer" className="brutalButton brutalButtonWhite">
                  View Full Details on Gumroad
                </a>
                <a href={product.gumroadUrl} target="_blank" rel="noopener noreferrer" className="brutalButton">
                  Buy on Gumroad
                </a>
              </div>
            </section>

            <nav className={styles.internalLinks} aria-label="Related LearnStack links">
              <Link href={catalogHref}>Back to {catalogLabel}</Link>
              <Link href="/free-resources">Free resources</Link>
              {!isKidsBook && <Link href="/kids">Kids books</Link>}
              {isKidsBook && <Link href="/products">Student handbooks</Link>}
              {relatedProducts.map((item) => (
                <Link key={item.id} href={item.detailPath || `${item.audience === "kids" ? "/kids" : "/products"}/${item.slug || item.id}`}>
                  {item.title}
                </Link>
              ))}
            </nav>
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
