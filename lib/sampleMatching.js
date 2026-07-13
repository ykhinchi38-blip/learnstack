import sampleManifest from "@/src/data/sampleManifest.json";
import sampleAliases from "@/src/data/sampleAliases.json";

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "for",
  "to",
  "in",
  "on",
  "with",
  "by",
  "learnstack",
  "kids",
  "book",
  "pdf",
  "handbook",
  "handbooks",
  "edition",
  "2026"
]);

const GENERIC_MATCH_WORDS = [
  "learnstackkids",
  "learnstack-kids",
  "learnstack",
  "kids",
  "handbooks",
  "handbook",
  "book",
  "pdf",
  "final",
  "kdp",
  "printready",
  "v1",
  "v2",
  "copy"
];

export function normalizeSampleSlug(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/\.pdf$/i, "")
    .replace(/&/g, " and ")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function makeMatchSlug(value = "") {
  let slug = normalizeSampleSlug(value);

  GENERIC_MATCH_WORDS.forEach((word) => {
    const normalizedWord = normalizeSampleSlug(word);
    slug = slug.replace(new RegExp(`(^|-)${normalizedWord}(?=-|$)`, "g"), "$1");
  });

  return slug.replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function extractUrlSlug(value = "") {
  if (!value || typeof value !== "string") return "";

  try {
    const parsed = new URL(value);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const gumroadIndex = segments.findIndex((segment) => segment === "l");

    return gumroadIndex >= 0 && segments[gumroadIndex + 1]
      ? segments[gumroadIndex + 1]
      : segments.at(-1) || "";
  } catch {
    return "";
  }
}

function normalizeCandidate(value) {
  const raw = String(value || "");
  if (/^https?:\/\//i.test(raw)) return normalizeSampleSlug(extractUrlSlug(raw));
  return normalizeSampleSlug(raw);
}

function productSlugCandidates(product = {}) {
  return [
    product.slug,
    product.id,
    product.title,
    product.name,
    product.permalink,
    product.custom_permalink,
    product.raw?.slug,
    product.raw?.permalink,
    product.gumroadUrl,
    product.url,
    extractUrlSlug(product.gumroadUrl),
    extractUrlSlug(product.url)
  ].map(normalizeCandidate).filter(Boolean);
}

function sampleSlugCandidates(sample = {}) {
  return [
    sample.sourceSlug,
    sample.matchSlug,
    ...(Array.isArray(sample.aliases) ? sample.aliases : [])
  ].map(normalizeSampleSlug).filter(Boolean);
}

export function hasValidSampleUrl(value) {
  const sampleUrl = typeof value === "string" ? value : value?.sampleUrl;
  return /^https:\/\/res\.cloudinary\.com\//i.test(String(sampleUrl || ""))
    && !String(sampleUrl || "").toLowerCase().includes("collection.cloudinary.com");
}

function tokenize(value = "") {
  return normalizeSampleSlug(value)
    .split("-")
    .map((token) => token.trim())
    .filter((token) => token && !STOP_WORDS.has(token));
}

function uniqueTokens(value = "") {
  return Array.from(new Set(tokenize(value)));
}

function tokenScore(productTokens, sampleTokens) {
  const shared = productTokens.filter((token) => sampleTokens.includes(token));
  const uniqueLongShared = shared.filter((token) => token.length >= 7);
  const productCoverage = shared.length / Math.max(productTokens.length, 1);
  const sampleCoverage = shared.length / Math.max(sampleTokens.length, 1);

  return {
    shared,
    score: (productCoverage * 0.45) + (sampleCoverage * 0.45) + (uniqueLongShared.length * 0.08)
  };
}

function isHighConfidenceMatch({ shared, score }) {
  if (shared.length >= 2 && score >= 0.44) return true;
  if (shared.length === 1 && shared[0].length >= 9 && score >= 0.72) return true;
  return false;
}

function getAliasOwnerByCandidate(candidate) {
  const normalizedCandidate = normalizeSampleSlug(candidate);

  for (const [targetSlug, aliases] of Object.entries(sampleAliases || {})) {
    const normalizedTarget = normalizeSampleSlug(targetSlug);
    const normalizedAliases = Array.isArray(aliases) ? aliases.map(normalizeSampleSlug) : [];

    if (normalizedTarget === normalizedCandidate || normalizedAliases.includes(normalizedCandidate)) {
      return normalizedTarget;
    }
  }

  return "";
}

function logNoMatch(product, reason = "not found") {
  if (process.env.NODE_ENV === "production") return;

  const label = product?.title || product?.permalink || product?.slug || product?.id || "unknown product";
  if (reason === "ambiguous") return;

  console.warn(`No sample match found for: ${label}. Consider adding alias to src/data/sampleAliases.json.`);
}

function logAmbiguous(product, samples) {
  if (process.env.NODE_ENV === "production") return;

  const label = product?.title || product?.permalink || product?.slug || product?.id || "unknown product";
  const possible = samples.map((sample) => sample.title || sample.matchSlug || sample.sourceSlug).join(", ");
  console.warn(`Ambiguous sample match for: ${label}. Possible samples: ${possible}. Add manual alias.`);
}

export function findSampleForProduct(product = {}, samples = sampleManifest) {
  const availableSamples = Array.isArray(samples)
    ? samples.filter(hasValidSampleUrl)
    : [];
  const candidates = productSlugCandidates(product);

  for (const candidate of candidates) {
    const match = availableSamples.find((sample) => sampleSlugCandidates(sample).includes(candidate));
    if (match) return { sample: match, level: "exact", ambiguous: false };
  }

  for (const candidate of candidates) {
    const aliasOwner = getAliasOwnerByCandidate(candidate);
    if (!aliasOwner) continue;

    const match = availableSamples.find((sample) => sampleSlugCandidates(sample).includes(aliasOwner));
    if (match) return { sample: match, level: "alias", ambiguous: false };
  }

  const productTokens = uniqueTokens(candidates.join("-"));
  const fuzzyMatches = availableSamples
    .map((sample) => {
      const sampleTokens = uniqueTokens([sample.matchSlug, sample.sourceSlug, sample.title].filter(Boolean).join("-"));
      return { sample, ...tokenScore(productTokens, sampleTokens) };
    })
    .filter(isHighConfidenceMatch)
    .sort((a, b) => b.score - a.score);

  if (!fuzzyMatches.length) {
    logNoMatch(product);
    return { sample: null, level: "none", ambiguous: false };
  }

  const [best, second] = fuzzyMatches;
  if (second && Math.abs(best.score - second.score) < 0.12) {
    logAmbiguous(product, fuzzyMatches.slice(0, 4).map((match) => match.sample));
    return { sample: null, level: "fuzzy", ambiguous: true };
  }

  return { sample: best.sample, level: "fuzzy", ambiguous: false };
}

export function applySampleToProduct(product = {}) {
  if (hasValidSampleUrl(product.sampleUrl)) return product;

  const match = findSampleForProduct(product);
  if (!match.sample) return product;

  return {
    ...product,
    sampleUrl: match.sample.sampleUrl,
    sample: match.sample,
    sampleMatchLevel: match.level
  };
}

export function getSampleManifest() {
  return Array.isArray(sampleManifest) ? sampleManifest : [];
}

function hasProductUrl(product = {}) {
  return Boolean(product.gumroadUrl || product.url || product.permalink || product.raw?.permalink);
}

function isUnavailableProduct(product = {}) {
  const statusValues = [
    product.status,
    product.availability,
    product.raw?.status,
    product.raw?.availability
  ].map((value) => String(value || "").toLowerCase());

  return Boolean(
    product.deleted ||
    product.hidden ||
    product.unavailable ||
    product.isDeleted ||
    product.isHidden ||
    statusValues.some((status) => /(deleted|hidden|unavailable|archived|draft)/.test(status))
  );
}

function isPublicProduct(product = {}) {
  return Boolean(product?.title && hasProductUrl(product) && !isUnavailableProduct(product));
}

function productKey(product = {}) {
  return normalizeSampleSlug(product.slug || product.id || product.gumroadUrl || product.url || product.title);
}

export function getSampleForProduct(product = {}, samples = sampleManifest) {
  const match = findSampleForProduct(product, samples);
  return match.sample ? { ...match, sample: match.sample } : { sample: null, level: match.level, ambiguous: match.ambiguous };
}

function getValidPreviewImages(product = {}) {
  return (Array.isArray(product.previewImages) ? product.previewImages : [])
    .map((image) => (typeof image === "string" ? image : image?.url || image?.src || ""))
    .filter((image) => image && !String(image).toLowerCase().includes("preview-placeholder"));
}

function categoryForProduct(product = {}) {
  if (product.isBundle || product.audience === "bundle") return "business-mba";
  if (product.audience === "kids") return "kids";
  if (product.audience === "life-career") return "life-career";
  return "handbooks";
}

export function getPublicSamples(products = [], samples = sampleManifest) {
  const safeSamples = Array.isArray(samples) ? samples.filter(hasValidSampleUrl) : [];
  const seenProducts = new Set();
  const matchedSampleSlugs = new Set();
  const publicSamples = [];

  (Array.isArray(products) ? products : []).forEach((product) => {
    if (!isPublicProduct(product)) return;

    const key = productKey(product);
    if (key && seenProducts.has(key)) return;

    const match = getSampleForProduct(product, safeSamples);
    const previewImages = getValidPreviewImages(product);
    if (!match.sample && !previewImages.length) return;

    if (key) seenProducts.add(key);
    if (match.sample) matchedSampleSlugs.add(match.sample.sourceSlug);

    publicSamples.push({
      product: {
        ...product,
        sampleUrl: match.sample?.sampleUrl || "",
        sample: match.sample || null,
        sampleMatchLevel: match.level
      },
      sample: match.sample || null,
      sampleUrl: match.sample?.sampleUrl || "",
      category: match.sample?.category || categoryForProduct(product),
      sourceSlug: match.sample?.sourceSlug || product.slug || product.id,
      matchSlug: match.sample?.matchSlug || product.slug || product.id,
      title: product.title || match.sample?.title,
      description: product.summary || product.tagline || product.limitedDescription || product.description || match.sample?.description || "",
      coverImage: product.image || product.coverImage || "",
      previewImages,
      pageCount: match.sample?.samplePageCount,
      matchLevel: match.level
    });
  });

  if (process.env.NODE_ENV !== "production") {
    safeSamples.forEach((sample) => {
      if (!matchedSampleSlugs.has(sample.sourceSlug)) {
        console.warn(`Sample exists but no matching Gumroad product: ${sample.sourceSlug}`);
      }
    });
  }

  return publicSamples;
}
