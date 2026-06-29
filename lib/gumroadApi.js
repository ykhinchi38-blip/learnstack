import { classifyProductAudience, getAudienceStats } from "./gumroadProductClassification";

const TEN_MINUTES = 600;
const PRODUCTS_PER_PAGE = 100;
const MAX_PRODUCT_PAGES = 50;

let productsCache = null;
let couponsCache = null;

function getAccessToken() {
  return process.env.GUMROAD_ACCESS_TOKEN;
}

function stripHtml(value = "") {
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

function limitText(value = "", maxLength = 160) {
  const clean = stripHtml(value);

  if (clean.length <= maxLength) return clean;

  const trimmed = clean.slice(0, maxLength + 1);
  const lastSpace = trimmed.lastIndexOf(" ");
  const safeTrim = lastSpace > 80 ? trimmed.slice(0, lastSpace) : trimmed.slice(0, maxLength);

  return `${safeTrim.trim()}...`;
}

function slugifyProductValue(value = "") {
  const slug = String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return slug || "product";
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

function getProductSlug(product = {}, name = "") {
  const candidates = [
    product.custom_permalink,
    product.permalink,
    product.slug,
    product.product_permalink,
    product.product_slug,
    readUrlSlug(product.product_url),
    readUrlSlug(product.short_url),
    readUrlSlug(product.url),
    readUrlSlug(product.link),
    product.id,
    name
  ];

  const match = candidates.find((candidate) => String(candidate || "").trim());
  return slugifyProductValue(match || name);
}

function formatPrice(cents = 0, currency = "inr", fallback = "") {
  const numericCents = Number(cents || 0);

  if (!numericCents) {
    return fallback || "View price";
  }

  const amount = numericCents / 100;
  const normalizedCurrency = String(currency || "inr").toUpperCase();

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2
    }).format(amount);
  } catch {
    return `${normalizedCurrency} ${amount}`;
  }
}

function isImageUrl(value) {
  if (!value || typeof value !== "string") return false;

  const lower = value.trim().toLowerCase();
  return (
    lower.startsWith("http") &&
    (
      lower.includes("public-files.gumroad.com") ||
      lower.includes("static-2.gumroad.com") ||
      /\.(png|jpe?g|webp|gif)(\?|$)/i.test(lower)
    )
  );
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

    if (!key || excluded.has(key) || seen.has(key) || !isImageUrl(trimmed)) return;

    seen.add(key);
    unique.push(trimmed);
  });

  return unique;
}

function readNestedValue(source, path) {
  return path.split(".").reduce((current, key) => {
    if (Array.isArray(current)) return current[0]?.[key];
    return current?.[key];
  }, source);
}

function collectImageUrls(value, images = [], seen = new Set()) {
  if (!value) return images;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (isImageUrl(trimmed)) images.push(trimmed);
    return images;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectImageUrls(item, images, seen));
    return images;
  }

  if (typeof value === "object") {
    if (seen.has(value)) return images;
    seen.add(value);
    Object.values(value).forEach((item) => collectImageUrls(item, images, seen));
  }

  return images;
}

function gumroadUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path, "https://api.gumroad.com").toString();
}

function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

function gumroadDebugLog(label, details) {
  if (!isDevelopment()) return;
  console.log(`[Gumroad debug] ${label}`, details);
}

async function gumroadFetch(path) {
  const token = getAccessToken();

  if (!token) {
    throw new Error("GUMROAD_ACCESS_TOKEN is missing.");
  }

  const response = await fetch(gumroadUrl(path), {
    ...(isDevelopment() ? { cache: "no-store" } : { next: { revalidate: TEN_MINUTES } }),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  const rawBody = await response.text();
  let data = null;

  try {
    data = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    data = { raw: rawBody };
  }

  if (!response.ok) {
    const detail = data?.message || data?.error || rawBody || "No response body.";
    throw new Error(`Gumroad API returned ${response.status}: ${detail}`);
  }

  if (data?.success === false) {
    throw new Error(data.message || "Gumroad API request failed.");
  }

  return data;
}

function buildProductsPath(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `/v2/products?${query}` : "/v2/products";
}

function readFirstValue(source, keys) {
  for (const key of keys) {
    const value = key.split(".").reduce((current, part) => current?.[part], source);

    if (value !== null && value !== undefined && value !== "") {
      return value;
    }
  }

  return null;
}

function extractProducts(data = {}) {
  if (Array.isArray(data.products)) return data.products;
  if (Array.isArray(data.data?.products)) return data.data.products;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

function productDedupeKey(product = {}) {
  const candidates = [
    product.id,
    product.custom_permalink,
    product.permalink,
    product.slug,
    product.product_permalink,
    product.product_slug,
    product.short_url,
    product.url,
    product.product_url,
    product.link,
    product.name,
    product.title
  ];

  return String(candidates.find((candidate) => String(candidate || "").trim()) || JSON.stringify(product));
}

function productSample(product = {}) {
  return {
    name: product.name || product.title || null,
    permalink:
      product.custom_permalink ||
      product.permalink ||
      product.raw?.permalink ||
      product.raw?.slug ||
      product.slug ||
      readUrlSlug(product.short_url) ||
      readUrlSlug(product.url) ||
      readUrlSlug(product.gumroadUrl) ||
      null
  };
}

function responseShape(data = {}) {
  return {
    topLevelKeys: Object.keys(data).sort(),
    productsIsArray: Array.isArray(data.products),
    productsCount: extractProducts(data).length,
    total:
      readFirstValue(data, [
        "total",
        "total_count",
        "totalCount",
        "pagination.total",
        "meta.total",
        "meta.total_count"
      ]) ?? null,
    hasNext:
      readFirstValue(data, [
        "has_more",
        "hasMore",
        "has_next_page",
        "hasNextPage",
        "pagination.has_more",
        "pagination.hasMore",
        "pagination.has_next_page",
        "meta.has_more",
        "meta.has_next_page"
      ]) ?? null,
    nextPage:
      readFirstValue(data, [
        "next_page",
        "nextPage",
        "pagination.next_page",
        "pagination.nextPage",
        "meta.next_page",
        "meta.nextPage"
      ]) ?? null,
    nextCursor:
      readFirstValue(data, [
        "next_cursor",
        "nextCursor",
        "pagination.next_cursor",
        "pagination.nextCursor",
        "meta.next_cursor",
        "meta.nextCursor",
        "cursors.next",
        "cursor.next"
      ]) ?? null,
    nextPageKey:
      readFirstValue(data, [
        "next_page_key",
        "nextPageKey",
        "pagination.next_page_key",
        "pagination.nextPageKey",
        "meta.next_page_key",
        "meta.nextPageKey"
      ]) ?? null,
    nextOffset:
      readFirstValue(data, [
        "next_offset",
        "nextOffset",
        "pagination.next_offset",
        "pagination.nextOffset",
        "meta.next_offset",
        "meta.nextOffset"
      ]) ?? null,
    nextUrl: Boolean(
      readFirstValue(data, [
        "next",
        "next_url",
        "nextUrl",
        "next_page_url",
        "nextPageUrl",
        "links.next",
        "pagination.next_url",
        "pagination.nextUrl",
        "meta.next_url"
      ])
    )
  };
}

function nextUrlPath(value) {
  if (!value || typeof value !== "string") return null;

  try {
    const parsed = new URL(value, "https://api.gumroad.com");
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return value.startsWith("/") ? value : null;
  }
}

function getPaginationInfo(data = {}, page, perPage) {
  const nextUrl = readFirstValue(data, [
    "next",
    "next_url",
    "nextUrl",
    "next_page_url",
    "nextPageUrl",
    "links.next",
    "pagination.next_url",
    "pagination.nextUrl",
    "meta.next_url"
  ]);
  const nextPage = readFirstValue(data, [
    "next_page",
    "nextPage",
    "pagination.next_page",
    "pagination.nextPage",
    "meta.next_page",
    "meta.nextPage"
  ]);
  const nextCursor = readFirstValue(data, [
    "next_cursor",
    "nextCursor",
    "pagination.next_cursor",
    "pagination.nextCursor",
    "meta.next_cursor",
    "meta.nextCursor",
    "cursors.next",
    "cursor.next"
  ]);
  const nextPageKey = readFirstValue(data, [
    "next_page_key",
    "nextPageKey",
    "pagination.next_page_key",
    "pagination.nextPageKey",
    "meta.next_page_key",
    "meta.nextPageKey"
  ]);
  const nextOffset = readFirstValue(data, [
    "next_offset",
    "nextOffset",
    "pagination.next_offset",
    "pagination.nextOffset",
    "meta.next_offset",
    "meta.nextOffset"
  ]);
  const hasMore = readFirstValue(data, [
    "has_more",
    "hasMore",
    "has_next_page",
    "hasNextPage",
    "pagination.has_more",
    "pagination.hasMore",
    "pagination.has_next_page",
    "meta.has_more",
    "meta.has_next_page"
  ]);
  const total = Number(
    readFirstValue(data, [
      "total",
      "total_count",
      "totalCount",
      "pagination.total",
      "meta.total",
      "meta.total_count"
    ]) || 0
  );

  return {
    nextPath: nextUrlPath(nextUrl),
    nextPage,
    nextCursor,
    nextPageKey,
    nextOffset,
    hasMore: hasMore === true || hasMore === "true",
    total,
    totalImpliesNext: total > page * perPage
  };
}

function debugProductSamples(label, products) {
  gumroadDebugLog(label, products.slice(0, 5).map(productSample));
}

export async function fetchAllGumroadProducts() {
  const productsByKey = new Map();
  const fetchedPaths = new Set();
  let page = 1;
  let nextPath = null;
  let nextCursor = null;
  let nextOffset = null;
  let firstShape = null;

  while (page <= MAX_PRODUCT_PAGES) {
    const path = nextPath || buildProductsPath({
      page,
      per_page: PRODUCTS_PER_PAGE,
      cursor: nextCursor,
      offset: nextOffset
    });

    if (fetchedPaths.has(path)) {
      gumroadDebugLog("Stopping product pagination because the next path repeated.", { path });
      break;
    }

    fetchedPaths.add(path);

    const data = await gumroadFetch(path);
    const pageProducts = extractProducts(data);
    const beforeCount = productsByKey.size;

    pageProducts.forEach((product) => {
      productsByKey.set(productDedupeKey(product), product);
    });

    const addedCount = productsByKey.size - beforeCount;
    const pagination = getPaginationInfo(data, page, PRODUCTS_PER_PAGE);

    if (page === 1) {
      firstShape = responseShape(data);
      gumroadDebugLog("First products response shape", firstShape);
      gumroadDebugLog("First products request count", {
        rawProductCount: pageProducts.length,
        hasPagination:
          Boolean(pagination.nextPath) ||
          Boolean(pagination.nextPage) ||
          Boolean(pagination.nextCursor) ||
          Boolean(pagination.nextPageKey) ||
          Boolean(pagination.nextOffset) ||
          pagination.hasMore ||
          pagination.totalImpliesNext
      });
      debugProductSamples("First products response sample", pageProducts);
    }

    if (!pageProducts.length) break;

    if (pagination.nextPath) {
      nextPath = pagination.nextPath;
      nextCursor = null;
      nextOffset = null;
      page += 1;
      continue;
    }

    nextPath = null;

    if (pagination.nextPageKey) {
      nextPath = buildProductsPath({
        per_page: PRODUCTS_PER_PAGE,
        page_key: pagination.nextPageKey
      });
      nextCursor = null;
      nextOffset = null;
      page += 1;
      continue;
    }

    if (pagination.nextCursor) {
      nextCursor = pagination.nextCursor;
      nextOffset = null;
      page += 1;
      continue;
    }

    if (pagination.nextOffset !== null) {
      nextCursor = null;
      nextOffset = pagination.nextOffset;
      page += 1;
      continue;
    }

    nextCursor = null;
    nextOffset = null;

    if (pagination.nextPage) {
      page = Number(pagination.nextPage);
      continue;
    }

    if (pagination.hasMore || pagination.totalImpliesNext || (addedCount > 0 && pageProducts.length >= 10)) {
      page += 1;
      continue;
    }

    if (addedCount === 0) {
      gumroadDebugLog("Stopping product pagination because no new products were returned.", { page, path });
    }

    break;
  }

  if (page > MAX_PRODUCT_PAGES) {
    gumroadDebugLog("Stopped product pagination at the safety page limit.", { maxPages: MAX_PRODUCT_PAGES });
  }

  const products = Array.from(productsByKey.values());

  gumroadDebugLog("Final raw Gumroad products fetched", {
    totalFetched: products.length,
    firstResponseShape: firstShape
  });
  debugProductSamples("Final raw Gumroad product sample", products);

  return products;
}

function firstImage(product) {
  const candidates = [
    ["thumbnail_url", product.thumbnail_url],
    ["cover_url", product.cover_url],
    ["image_url", product.image_url],
    ["custom_thumbnail_url", product.custom_thumbnail_url],
    ["image", product.image],
    ["images", product.images],
    ["covers.0.url", readNestedValue(product, "covers.0.url")],
    ["preview.url", product.preview?.url],
    ["preview_url", product.preview_url]
  ];

  for (const [sourceField, value] of candidates) {
    const image = collectImageUrls(value, [])[0];

    if (image) {
      return {
        url: image,
        sourceField
      };
    }
  }

  return {
    url: "",
    sourceField: null
  };
}

function previewImageResult(product, coverImage) {
  const sources = [
    ["product_previews", product.product_previews],
    ["productPreviews", product.productPreviews],
    ["previews", product.previews],
    ["preview", product.preview],
    ["preview_images", product.preview_images],
    ["previewImages", product.previewImages],
    ["file_info", product.file_info],
    ["fileInfo", product.fileInfo],
    ["images", product.images],
    ["covers", product.covers]
  ];

  const sourceFields = [];
  const images = [];

  sources.forEach(([sourceField, source]) => {
    const sourceImages = collectImageUrls(source, []);

    if (sourceImages.length) {
      sourceFields.push(sourceField);
      images.push(...sourceImages);
    }
  });

  return {
    urls: getUniqueImages(images, [coverImage]).slice(0, 8),
    sourceFields: Array.from(new Set(sourceFields))
  };
}

export function normalizeGumroadProduct(product = {}) {
  const name = product.name || product.title || "Untitled LearnStack handbook";
  const cleanDescription = stripHtml(product.description || product.summary || "");
  const fallbackSummary = "A LearnStack digital handbook designed for simple and practical learning.";
  const summarySource = product.short_description || product.shortDescription || product.summary || cleanDescription || fallbackSummary;
  const summary = limitText(summarySource, 170);
  const limitedDescription = limitText(cleanDescription || summarySource || fallbackSummary, 540);
  const currency = product.currency || product.currency_type || "inr";
  const priceCents = Number(product.price_cents ?? product.price ?? product.price_in_cents ?? 0);
  const priceAmount = priceCents ? priceCents / 100 : 0;
  const permalink = product.custom_permalink || product.permalink || product.slug || readUrlSlug(product.short_url) || readUrlSlug(product.url);
  const slug = getProductSlug(product, name);
  const classification = classifyProductAudience(product);
  const url =
    product.short_url ||
    product.url ||
    product.product_url ||
    product.link ||
    product.product_link ||
    (permalink ? `https://learnstacks.gumroad.com/l/${permalink}` : null);
  const gumroadUrl = url || "https://learnstacks.gumroad.com/";
  const imageResult = firstImage(product);
  const image = imageResult.url;
  const previews = previewImageResult(product, image);
  const createdAt = product.created_at || product.createdAt || product.published_at || product.publishedAt || null;
  const updatedAt = product.updated_at || product.updatedAt || product.modified_at || product.modifiedAt || createdAt;
  const salesCount = Number(
    product.sales_count ??
    product.salesCount ??
    product.purchase_count ??
    product.purchaseCount ??
    product.num_sales ??
    product.numSales ??
    0
  );

  return {
    id: String(product.id || permalink || slug || name),
    slug,
    title: name,
    name,
    summary,
    description: cleanDescription,
    limitedDescription,
    price: priceAmount,
    priceCents,
    priceAmount,
    priceDisplay: product.formatted_price || formatPrice(priceCents, currency),
    currency: String(currency).toUpperCase(),
    image,
    coverImage: image,
    imageSourceField: imageResult.sourceField,
    previewImages: previews.urls,
    previewImageSourceFields: previews.sourceFields,
    gumroadUrl,
    url: gumroadUrl,
    audience: classification.audience,
    classificationStatus: classification.status,
    classificationSourceField: classification.sourceField,
    createdAt,
    updatedAt,
    salesCount,
    published: Boolean(product.published ?? !product.draft),
    raw: {
      permalink: permalink || null,
      slug
    }
  };
}

function filterProductsByAudience(products, audience) {
  if (!audience || audience === "all") return products;
  return products.filter((product) => (product.audience || "regular") === audience);
}

function createProductResult({ products, audience, cached, stale, fetchedAt, message }) {
  const filteredProducts = filterProductsByAudience(products, audience);
  const stats = getAudienceStats(products);

  return {
    success: true,
    cached,
    stale,
    message,
    products: filteredProducts,
    fetchedAt,
    stats: {
      ...stats,
      displayed: filteredProducts.length,
      audience: audience || "all"
    }
  };
}

export async function fetchGumroadProducts({ allowStale = true, audience = null } = {}) {
  try {
    const rawProducts = await fetchAllGumroadProducts();
    const products = rawProducts
      .filter((product) => !product.deleted && !product.draft)
      .map(normalizeGumroadProduct);
    const stats = getAudienceStats(products);

    gumroadDebugLog("Classified Gumroad products", {
      finalTotalFetched: rawProducts.length,
      publishedTotal: products.length,
      kids: stats.kids,
      lifeCareer: stats.lifeCareer,
      business: stats.business,
      regular: stats.regular,
      uncategorized: stats.uncategorized,
      unclassified: stats.unclassified
    });
    debugProductSamples("First classified products", products);
    debugProductSamples("First regular products", products.filter((product) => product.audience === "regular"));
    debugProductSamples("First kids products", products.filter((product) => product.audience === "kids"));
    debugProductSamples("First life career products", products.filter((product) => product.audience === "life-career"));

    productsCache = {
      products,
      fetchedAt: new Date().toISOString()
    };

    return createProductResult({ ...productsCache, audience, cached: false, stale: false });
  } catch (error) {
    if (allowStale && productsCache) {
      return createProductResult({
        ...productsCache,
        audience,
        cached: true,
        stale: true,
        message: "Showing the last saved Gumroad products because the live API is unavailable.",
      });
    }

    throw error;
  }
}

function isActiveOfferCode(offer = {}) {
  if (offer.deleted || offer.archived || offer.expired) return false;
  if (offer.active === false || offer.valid === false) return false;

  const maxUses = Number(offer.max_purchase_count || offer.max_uses || 0);
  const uses = Number(offer.times_used || offer.uses || 0);
  if (maxUses > 0 && uses >= maxUses) return false;

  const expiresAt = offer.expires_at || offer.expiration_date;
  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) return false;

  return true;
}

function getCouponCode(offer = {}) {
  return offer.code || offer.name || offer.offer_code || offer.id || "OFFER";
}

function getDiscount(offer = {}, product = {}) {
  const percent = Number(offer.percent_off || offer.percentage || offer.discount_percent || 0);
  const amountCents = Number(offer.amount_cents || offer.amount_off || offer.discount_cents || 0);
  const productPriceCents = Number(product.priceCents ?? product.price ?? 0);

  if (percent > 0) {
    return {
      discountPercentage: Math.round(percent),
      discountAmount: `${Math.round(percent)}% off`
    };
  }

  if (amountCents > 0 && productPriceCents > 0) {
    const computedPercent = Math.round((amountCents / productPriceCents) * 100);
    return {
      discountPercentage: computedPercent,
      discountAmount: `${formatPrice(amountCents, product.currency)} off`
    };
  }

  if (amountCents > 0) {
    return {
      discountPercentage: null,
      discountAmount: `${formatPrice(amountCents, product.currency)} off`
    };
  }

  return {
    discountPercentage: null,
    discountAmount: "Discount available"
  };
}

function normalizeOfferCode(offer, product) {
  const discount = getDiscount(offer, product);

  return {
    id: String(offer.id || `${product.id}-${getCouponCode(offer)}`),
    productId: product.id,
    productName: product.name,
    couponCode: getCouponCode(offer),
    ...discount
  };
}

export async function fetchGumroadCoupons({ allowStale = true } = {}) {
  try {
    const productResult = await fetchGumroadProducts({ allowStale: false });
    const coupons = [];

    for (const product of productResult.products) {
      const data = await gumroadFetch(`/v2/products/${encodeURIComponent(product.id)}/offer_codes`);
      const offers = data.offer_codes || data.offerCodes || [];

      for (const offer of offers) {
        if (isActiveOfferCode(offer)) {
          coupons.push(normalizeOfferCode(offer, product));
        }
      }
    }

    couponsCache = {
      coupons,
      fetchedAt: new Date().toISOString()
    };

    return {
      success: true,
      cached: false,
      stale: false,
      ...couponsCache
    };
  } catch (error) {
    if (allowStale && couponsCache) {
      return {
        success: true,
        cached: true,
        stale: true,
        message: "Showing the last saved coupon list because the live API is unavailable.",
        ...couponsCache
      };
    }

    throw error;
  }
}
