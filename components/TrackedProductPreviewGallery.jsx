"use client";

import ProductImageGallery from "@/components/ProductImageGallery";
import { productEventParams, trackEvent } from "@/lib/analytics";

export default function TrackedProductPreviewGallery({ product, images }) {
  return (
    <ProductImageGallery
      images={images}
      title={product.title}
      onPreviewOpen={() => trackEvent("preview_opened", productEventParams(product, "product_page_gallery"))}
    />
  );
}
