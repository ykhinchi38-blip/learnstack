"use client";

import Link from "next/link";
import ProductImageGallery from "@/components/ProductImageGallery";
import { productEventParams, trackEvent } from "@/lib/analytics";
import { productDetailHref } from "@/lib/productRouting";
import styles from "@/app/BrandTrustPage.module.css";

export default function FreeSampleActions({ product, sampleUrl, previewImages = [] }) {
  const eventParams = productEventParams(product, "free_samples");

  function trackSample() {
    trackEvent("preview_opened", eventParams);
    trackEvent("sample_downloaded", eventParams);
  }

  return (
    <>
      <div className={styles.sampleActions}>
        {sampleUrl ? (
          <a
            className={styles.miniButton}
            href={sampleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackSample}
          >
            View Sample
          </a>
        ) : (
          <ProductImageGallery
            images={previewImages}
            title={product.title || product.name}
            showGrid={false}
            triggerLabel="View Sample"
            triggerClassName={styles.miniButton}
            onPreviewOpen={() => trackEvent("preview_opened", eventParams)}
          />
        )}
        <Link
          className={styles.miniButton}
          href={productDetailHref(product)}
          onClick={() => trackEvent("full_product_clicked_from_sample", eventParams)}
        >
          View the Complete Book
        </Link>
      </div>

      {sampleUrl && previewImages.length > 0 ? (
        <ProductImageGallery
          images={previewImages}
          title={product.title || product.name}
          onPreviewOpen={() => trackEvent("preview_opened", eventParams)}
        />
      ) : null}
    </>
  );
}
