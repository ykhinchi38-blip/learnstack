const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const PRODUCTS_PATH = path.join(PROJECT_ROOT, "data", "products.js");
const PRICING_PATH = path.join(PROJECT_ROOT, "data", "pricing.js");
const PUBLIC_ROOT = path.join(PROJECT_ROOT, "public");
const PRICE_TEXT_FIELDS = ["priceDisplay", "displayPrice", "priceLabel", "priceText", "formattedPrice"];
const INR_PATTERN = /(?:\u20b9|\bINR\b|\bRs\.?\s*\d)/i;

function transformEsmSource(source) {
  return source
    .replace(/^import\s+.*?;\r?\n/gm, "")
    .replace(/^export\s+(const|function)\s+/gm, "$1 ")
    .replace(/^export\s+default\s+products;?\r?\n?/gm, "");
}

function loadCatalog() {
  const pricingSource = transformEsmSource(fs.readFileSync(PRICING_PATH, "utf8"));
  const pricing = new Function(`${pricingSource}\nreturn { getVerifiedUsdPrice, PRICE_VERIFICATION_NOTE };`)();
  const productsSource = transformEsmSource(fs.readFileSync(PRODUCTS_PATH, "utf8"));
  const loadProducts = new Function(
    "getVerifiedUsdPrice",
    "PRICE_VERIFICATION_NOTE",
    `${productsSource}\nreturn { rawProducts, products, slugify };`
  );

  return loadProducts(pricing.getVerifiedUsdPrice, pricing.PRICE_VERIFICATION_NOTE);
}

function asText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isPublished(product) {
  return String(product.status || "published").toLowerCase() === "published";
}

function productSlug(product, slugify) {
  return slugify(asText(product.slug) || asText(product.id) || asText(product.title));
}

function productRoute(product, slug) {
  const audience = String(product.audience || "regular").toLowerCase();
  const base = audience === "kids"
    ? "/kids"
    : audience === "life-career"
      ? "/life-career"
      : audience === "bundle" || product.isBundle
        ? "/bundles"
        : "/products";

  return slug ? `${base}/${slug}` : "";
}

function isValidGumroadUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "gumroad.com" || url.hostname.endsWith(".gumroad.com"));
  } catch {
    return false;
  }
}

function isValidCoverImage(value) {
  const source = asText(value);
  if (!source) return false;

  if (/^https:\/\//i.test(source)) {
    try {
      return Boolean(new URL(source).hostname);
    } catch {
      return false;
    }
  }

  if (!source.startsWith("/") || source.includes("..")) return false;
  return fs.existsSync(path.join(PUBLIC_ROOT, source));
}

function sampleStatus(product) {
  const sampleUrl = asText(product.sampleUrl);
  const previewImages = Array.isArray(product.previewImages) ? product.previewImages : [];
  const usablePreviewImage = previewImages.some((image) => {
    const source = typeof image === "string" ? image : image?.url || image?.src || "";
    return asText(source) && !/preview-placeholder/i.test(source);
  });

  return {
    available: Boolean(sampleUrl || usablePreviewImage),
    malformedUrl: Boolean(sampleUrl) && !/^https:\/\//i.test(sampleUrl)
  };
}

function printIssues(label, issues) {
  if (!issues.length) return;

  console.log(`\n${label}:`);
  issues.forEach((issue) => console.log(`- [${issue.code}] ${issue.product}: ${issue.message}`));
}

function main() {
  const { products, slugify } = loadCatalog();
  const errors = [];
  const warnings = [];
  const previewCounts = { available: 0, unavailable: 0 };
  const ids = new Map();
  const slugs = new Map();

  function issue(collection, code, product, message) {
    collection.push({ code, product: product.title || product.id || "Unnamed product", message });
  }

  products.forEach((product) => {
    const title = asText(product.title);
    const id = asText(product.id);
    const slug = productSlug(product, slugify);
    const published = isPublished(product);
    const status = asText(product.status).toLowerCase();
    const route = productRoute(product, slug);
    const price = product.price;
    const priceText = PRICE_TEXT_FIELDS.map((field) => asText(product[field])).filter(Boolean).join(" ");
    const preview = sampleStatus(product);

    if (!id) {
      issue(errors, "MISSING_ID", product, "A route-critical product ID is required.");
    } else if (ids.has(id)) {
      issue(errors, "DUPLICATE_ID", product, `ID \"${id}\" is also used by ${ids.get(id)}.`);
    } else {
      ids.set(id, product.title || id);
    }

    if (!slug) {
      issue(errors, "MISSING_SLUG", product, "A slug could not be derived from the product ID or title.");
    } else if (slugs.has(slug)) {
      issue(errors, "DUPLICATE_SLUG", product, `Slug \"${slug}\" is also used by ${slugs.get(slug)}.`);
    } else {
      slugs.set(slug, product.title || slug);
    }

    if (!title) issue(warnings, "MISSING_TITLE", product, "Title is missing.");
    if (!asText(product.category)) issue(warnings, "MISSING_CATEGORY", product, "Category is missing.");
    if (!status) issue(warnings, "MISSING_STATUS", product, "Status is missing and defaults to published.");
    if (status && !["published", "draft", "archived"].includes(status)) {
      issue(warnings, "UNKNOWN_STATUS", product, `Status \"${product.status}\" is not one of published, draft, or archived.`);
    }

    if (!route) issue(errors, "MISSING_ROUTE", product, "A product page route could not be generated.");
    if (!isValidCoverImage(product.coverImage || product.image)) {
      issue(warnings, "INVALID_COVER", product, "Cover image is missing, invalid, or not present under public/.");
    }
    if (!asText(product.description)) issue(warnings, "MISSING_DESCRIPTION", product, "Product description is missing.");
    if (!asText(product.metaTitle)) issue(warnings, "MISSING_SEO_TITLE", product, "SEO title is missing.");
    if (!asText(product.metaDescription)) issue(warnings, "MISSING_SEO_DESCRIPTION", product, "SEO description is missing.");

    if (published && !isValidGumroadUrl(product.gumroadUrl)) {
      issue(errors, "INVALID_GUMROAD_URL", product, "Published products require a valid HTTPS Gumroad URL.");
    } else if (!published && asText(product.gumroadUrl) && !isValidGumroadUrl(product.gumroadUrl)) {
      issue(warnings, "INVALID_GUMROAD_URL", product, "Non-published product has an invalid Gumroad URL.");
    }

    if (published && (!Number.isFinite(price) || price <= 0)) {
      issue(errors, "INVALID_PRICE", product, "Published products require a positive numeric USD price.");
    }
    if (String(product.currency || "").toUpperCase() !== "USD") {
      issue(errors, "INVALID_CURRENCY", product, "Currency must be USD.");
    }
    if (INR_PATTERN.test(priceText)) {
      issue(errors, "INR_PRICE_TEXT", product, "INR-formatted public price text is not allowed.");
    }
    if (product.pricingType === "fixed" && /\+/.test(priceText)) {
      issue(errors, "PLUS_PRICE", product, "Fixed-price display text must not include '+'.");
    }

    if (preview.available) {
      previewCounts.available += 1;
    } else {
      previewCounts.unavailable += 1;
    }
    if (preview.malformedUrl) {
      issue(warnings, "INVALID_SAMPLE_URL", product, "Sample URL is present but is not a valid HTTPS URL.");
    }

    if (!published && product.featured) {
      issue(errors, "NONPUBLIC_FEATURED", product, "Draft and archived products cannot be featured publicly.");
    }
  });

  const publishedCount = products.filter(isPublished).length;
  console.log("LearnStack product data validation");
  console.log(`Source: ${path.relative(PROJECT_ROOT, PRODUCTS_PATH)}`);
  console.log(`Products scanned: ${products.length} (${publishedCount} published)`);
  console.log(`Preview status: ${previewCounts.available} available, ${previewCounts.unavailable} unavailable`);
  console.log(`Critical errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  printIssues("Critical errors", errors);
  printIssues("Warnings", warnings);

  if (errors.length) {
    console.error("\nProduct validation failed. Resolve critical errors before publishing catalog changes.");
    process.exitCode = 1;
  } else {
    console.log("\nProduct validation passed.");
  }
}

try {
  main();
} catch (error) {
  console.error("Product validation could not run:", error);
  process.exitCode = 1;
}
