import localProducts, { slugify } from "@/data/products";
import { fetchGumroadProducts } from "./gumroadApi";
import { cache } from "react";

const EMPTY_STATS = {
  total: 0,
  kids: 0,
  regular: 0,
  unclassified: 0,
  displayed: 0,
  audience: "all"
};

function isProductionBuild() {
  return process.env.NEXT_PHASE === "phase-production-build" || process.env.npm_lifecycle_event === "build";
}

function localCatalogResult() {
  const products = localProducts.map(mapGumroadProduct);
  const kids = products.filter((product) => product.audience === "kids").length;
  const regular = products.filter((product) => (product.audience || "regular") === "regular").length;

  return {
    products,
    error: false,
    message: "",
    stats: {
      total: products.length,
      kids,
      regular,
      unclassified: 0,
      displayed: products.length,
      audience: "all"
    }
  };
}

function plainErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function shortTitle(title = "") {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part.slice(0, 1))
    .join("")
    .toUpperCase() || "PDF";
}

function stripHtmlText(value = "") {
  return String(value)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function limitText(value = "", maxLength = 170) {
  const clean = stripHtmlText(value);

  if (clean.length <= maxLength) return clean;

  const trimmed = clean.slice(0, maxLength + 1);
  const lastSpace = trimmed.lastIndexOf(" ");
  const safeTrim = lastSpace > 80 ? trimmed.slice(0, lastSpace) : trimmed.slice(0, maxLength);

  return `${safeTrim.trim()}...`;
}

function normalizeImageKey(value) {
  return String(value || "").trim().toLowerCase();
}

function getUniqueImages(images = [], excludeImages = []) {
  const excluded = new Set(excludeImages.map(normalizeImageKey).filter(Boolean));
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

function readUrlSlug(value) {
  if (!value || typeof value !== "string") return "";

  try {
    const parsed = new URL(value);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const gumroadProductIndex = segments.findIndex((segment) => segment === "l");

    if (gumroadProductIndex >= 0 && segments[gumroadProductIndex + 1]) {
      return segments[gumroadProductIndex + 1];
    }

    return segments.at(-1) || "";
  } catch {
    return "";
  }
}

function productSlug(product = {}, title = "") {
  return slugify(
    product.slug ||
    product.raw?.slug ||
    product.raw?.permalink ||
    product.permalink ||
    product.custom_permalink ||
    readUrlSlug(product.gumroadUrl) ||
    readUrlSlug(product.url) ||
    product.id ||
    title
  );
}

function productDetailPath(product) {
  const basePath = product.audience === "kids" ? "/kids" : "/products";
  return `${basePath}/${product.slug || product.id}`;
}

function mapGumroadProduct(product) {
  const title = product.title || product.name || "Untitled Handbook";
  const slug = productSlug(product, title);
  const id = String(product.id || slug);
  const audience = product.audience || "regular";
  const fallbackSummary = "A LearnStack digital handbook designed for simple and practical learning.";
  const description = stripHtmlText(product.description || product.tagline || fallbackSummary);
  const summary = product.summary || product.tagline || limitText(description || fallbackSummary, 170);
  const limitedDescription = product.limitedDescription || limitText(description || summary || fallbackSummary, 540);
  const coverImage = product.image || product.coverImage || (audience === "kids" ? "" : "/images/covers/python-handbook.png");
  const gumroadUrl = product.gumroadUrl || product.url || "https://learnstacks.gumroad.com/";

  const mappedProduct = {
    id,
    slug,
    title,
    name: title,
    subtitle: product.subtitle || (audience === "kids" ? "Kids PDF Book" : "PDF Handbook"),
    summary,
    tagline: summary,
    edition: product.edition || "Latest Edition",
    category: product.category || (audience === "kids" ? "Kids Books" : "New Releases"),
    audience,
    classificationStatus: product.classificationStatus,
    classificationSourceField: product.classificationSourceField,
    price: Number(product.priceAmount ?? product.price ?? 0),
    priceCents: Number(product.priceCents ?? 0),
    currency: product.currency || "INR",
    priceDisplay: product.priceDisplay || "View price",
    image: coverImage,
    coverImage,
    imageSourceField: product.imageSourceField || null,
    previewImageSourceFields: product.previewImageSourceFields || [],
    gumroadUrl,
    url: gumroadUrl,
    accentColor: product.accentColor || (audience === "kids" ? "#FF8FAB" : "#2563EB"),
    logoText: product.logoText || (audience === "kids" ? "KID" : shortTitle(title)),
    topics: product.topics || (audience === "kids"
      ? ["Kids", "PDF", "Activities", "Instant Download"]
      : ["PDF", "Handbook", "Instant Download"]),
    description,
    limitedDescription,
    pages: product.pages || "PDF",
    badge: product.badge || (audience === "kids" ? "Kids" : "New"),
    chapters: product.chapters || [{ title: "Digital PDF handbook", topics: 1 }],
    faqs: product.faqs || [
      { q: "Is this delivered through Gumroad?", a: "Yes. Gumroad handles secure checkout and instant delivery." }
    ],
    previewImages: getUniqueImages(product.previewImages || [], [coverImage]),
    createdAt: product.createdAt || null,
    updatedAt: product.updatedAt || null,
    salesCount: Number(product.salesCount || 0),
    metaTitle: `${title} | LearnStack`,
    metaDescription: `Download ${title}, a LearnStack PDF resource with secure checkout and instant delivery via Gumroad.`
  };

  return {
    ...mappedProduct,
    detailPath: product.detailPath || productDetailPath(mappedProduct)
  };
}

const loadGumroadCatalog = cache(async function loadGumroadCatalog() {
  if (isProductionBuild()) {
    return localCatalogResult();
  }

  try {
    const result = await fetchGumroadProducts({ audience: "all", allowStale: true });
    const products = (result.products || []).map(mapGumroadProduct);

    return {
      products,
      error: false,
      message: "",
      stats: {
        ...EMPTY_STATS,
        ...(result.stats || {}),
        total: result.stats?.total ?? products.length,
        displayed: products.length,
        audience: "all"
      }
    };
  } catch (error) {
    console.error("Gumroad sync failed:", plainErrorMessage(error));

    return {
      ...localCatalogResult(),
      cached: true,
      stale: true,
      message: "Showing the local LearnStack catalog because Gumroad is unavailable right now."
    };
  }
});

export async function getAllProductsResult() {
  return loadGumroadCatalog();
}

export async function getProductsByAudienceResult(audience) {
  const result = await loadGumroadCatalog();
  const products = result.products.filter((product) => (product.audience || "regular") === audience);

  return {
    ...result,
    products,
    stats: {
      ...result.stats,
      displayed: products.length,
      audience
    }
  };
}

export async function getRegularProductsResult() {
  return getProductsByAudienceResult("regular");
}

export async function getKidsProductsResult() {
  return getProductsByAudienceResult("kids");
}

export async function getGumroadProducts() {
  const result = await getAllProductsResult();
  return result.products;
}

export async function getAllProducts() {
  const result = await getAllProductsResult();
  return result.error || !result.products.length ? localProducts.map(mapGumroadProduct) : result.products;
}

export async function getProductsByAudience(audience) {
  const products = await getAllProducts();
  return products.filter((product) => (product.audience || "regular") === audience);
}

export async function getRegularProducts() {
  return getProductsByAudience("regular");
}

export async function getKidsProducts() {
  return getProductsByAudience("kids");
}

function routeKey(value = "") {
  return slugify(decodeURIComponent(String(value || "")));
}

function productMatchesRouteKey(product, value) {
  const key = routeKey(value);
  const candidates = [
    product.slug,
    product.id,
    product.raw?.permalink,
    product.permalink,
    product.custom_permalink,
    readUrlSlug(product.gumroadUrl),
    readUrlSlug(product.url),
    product.title,
    product.name
  ];

  return candidates.some((candidate) => candidate && slugify(candidate) === key);
}

export async function getProductBySlug(slug) {
  const products = await getAllProducts();
  return products.find((product) => productMatchesRouteKey(product, slug));
}

export async function getRegularProductBySlug(slug) {
  const products = await getRegularProducts();
  return products.find((product) => productMatchesRouteKey(product, slug));
}

export async function getKidsProductBySlug(slug) {
  const products = await getKidsProducts();
  return products.find((product) => productMatchesRouteKey(product, slug));
}

export async function getProductById(id) {
  return getProductBySlug(id);
}

export async function getRegularProductById(id) {
  return getRegularProductBySlug(id);
}

export async function getCategories(audience = "regular") {
  const products = audience ? await getProductsByAudience(audience) : await getAllProducts();
  return Array.from(new Set(products.map((product) => product.category))).sort();
}
