"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./ProductDetailView.module.css";

function isExternalImage(src = "") {
  return String(src).startsWith("http");
}

export default function ProductImageGallery({
  images = [],
  title = "LearnStack book",
  onPreviewOpen,
  showGrid = true,
  triggerLabel,
  triggerClassName
}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const isOpen = activeIndex !== null;
  const activeImage = isOpen ? images[activeIndex] : null;
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight" && hasMultipleImages) {
        setActiveIndex((index) => (index + 1) % images.length);
      }

      if (event.key === "ArrowLeft" && hasMultipleImages) {
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasMultipleImages, images.length, isOpen]);

  function showPrevious(event) {
    event.stopPropagation();
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  }

  function showNext(event) {
    event.stopPropagation();
    setActiveIndex((index) => (index + 1) % images.length);
  }

  return (
    <>
      {triggerLabel ? (
        <button
          type="button"
          className={triggerClassName || styles.previewButton}
          onClick={() => {
            onPreviewOpen?.(0);
            setActiveIndex(0);
          }}
        >
          {triggerLabel}
        </button>
      ) : null}

      {showGrid ? (
        <div className={styles.previewGrid} aria-label={`${title} preview images`}>
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              className={styles.previewButton}
              aria-label={`Open ${title} preview image ${index + 1}`}
              onClick={() => {
                onPreviewOpen?.(index);
                setActiveIndex(index);
              }}
            >
              <Image
                src={image}
                alt={`${title} preview image ${index + 1}`}
                className={styles.previewImage}
                width={420}
                height={300}
                sizes="(max-width: 640px) 82vw, 190px"
                unoptimized={isExternalImage(image)}
              />
            </button>
          ))}
        </div>
      ) : null}

      {isOpen && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image preview`}
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            aria-label="Close image preview"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex(null);
            }}
          >
            Close
          </button>

          {hasMultipleImages && (
            <button type="button" className={`${styles.lightboxNav} ${styles.lightboxPrev}`} aria-label="Previous image" onClick={showPrevious}>
              Prev
            </button>
          )}

          <div className={styles.lightboxImageWrap} onClick={(event) => event.stopPropagation()}>
            <Image
              src={activeImage}
              alt={`${title} preview image ${activeIndex + 1}`}
              className={styles.lightboxImage}
              width={1200}
              height={900}
              sizes="96vw"
              unoptimized={isExternalImage(activeImage)}
              priority
            />
            <span className={styles.lightboxCounter}>{activeIndex + 1} / {images.length}</span>
          </div>

          {hasMultipleImages && (
            <button type="button" className={`${styles.lightboxNav} ${styles.lightboxNext}`} aria-label="Next image" onClick={showNext}>
              Next
            </button>
          )}
        </div>
      )}
    </>
  );
}
