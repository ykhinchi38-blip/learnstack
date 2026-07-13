function isPublished(product = {}) {
  return (product.status || "published") === "published";
}

export function getPublishedProducts(products = []) {
  return products.filter(isPublished);
}

export function getFeaturedProducts(products = [], limit = 4) {
  const published = getPublishedProducts(products);
  const explicitlyFeatured = published.filter((product) => product.featured);

  return (explicitlyFeatured.length ? explicitlyFeatured : published).slice(0, limit);
}

export function getRelatedProducts(product, products = [], limit = 4) {
  if (!product) return [];

  const published = getPublishedProducts(products).filter((item) => item.id !== product.id);
  const relatedIds = new Set(product.relatedProductIds || product.relatedProducts || []);
  const explicitlyRelated = published.filter((item) => relatedIds.has(item.id) || relatedIds.has(item.slug));
  const sameCategory = published.filter((item) => item.category && item.category === product.category);
  const sameAudience = published.filter((item) => item.audience && item.audience === product.audience);
  const ordered = [...explicitlyRelated, ...sameCategory, ...sameAudience, ...published];
  const seen = new Set();

  return ordered.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  }).slice(0, limit);
}

export function hasValidPreview(product = {}) {
  if (typeof product.sampleUrl === "string" && product.sampleUrl.trim()) return true;

  return (product.previewImages || []).some((image) => {
    const source = typeof image === "string" ? image : image?.url || image?.src || "";
    return Boolean(source) && !String(source).toLowerCase().includes("preview-placeholder");
  });
}
