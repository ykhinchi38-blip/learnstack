function normalizeKey(value = "") {
  return String(value || "").trim().toLowerCase();
}

function productKey(product = {}) {
  return normalizeKey(product.slug || product.id || product.gumroadUrl || product.url || product.title);
}

function dedupeProducts(products = []) {
  const seen = new Set();

  return products.filter((product) => {
    const key = productKey(product);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isFeaturedProduct(product = {}) {
  const marker = `${product.featured || ""} ${product.isFeatured || ""} ${product.badge || ""}`.toLowerCase();
  return marker.includes("true") || marker.includes("featured") || marker.includes("popular");
}

function productDateValue(product = {}) {
  const dateValue = product.updatedAt || product.createdAt || product.publishedAt || product.raw?.updated_at || product.raw?.created_at;
  const timestamp = dateValue ? Date.parse(dateValue) : 0;
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function getAllKidsProducts(products = []) {
  return dedupeProducts(products).filter((product) => product?.audience === "kids");
}

export function getFeaturedKidsProducts(products = [], limit = 4) {
  const kidsProducts = getAllKidsProducts(products);
  const featured = kidsProducts.filter(isFeaturedProduct);
  const latest = [...kidsProducts].sort((a, b) => productDateValue(b) - productDateValue(a));

  return dedupeProducts([...featured, ...latest, ...kidsProducts]).slice(0, limit);
}
