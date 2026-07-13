import { getBundleDefinition } from "@/data/bundles";
import { getProductPricing } from "@/lib/pricing";

function normalize(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isAvailableProduct(product = {}) {
  const status = String(product.status || "published").toLowerCase();
  return !product.isBundle && !product.deleted && !product.hidden && !product.unavailable && !/(draft|archived|deleted|hidden|unavailable)/.test(status);
}

function productAliases(product = {}) {
  return [
    product.id,
    product.slug,
    product.title,
    product.name,
    product.permalink,
    product.customPermalink,
    product.custom_permalink
  ].map(normalize).filter(Boolean);
}

function matchesAlias(product, aliases = []) {
  const values = productAliases(product);
  return aliases.map(normalize).some((alias) => alias && values.includes(alias));
}

function explicitReferences(bundle = {}) {
  const values = [
    bundle.includedProductIds,
    bundle.includedProducts,
    bundle.products,
    bundle.raw?.includedProductIds,
    bundle.raw?.included_products,
    bundle.raw?.products
  ];

  return values.flatMap((value) => Array.isArray(value) ? value : []).flatMap((item) => {
    if (typeof item === "string" || typeof item === "number") return [String(item)];
    return [item?.id, item?.slug, item?.title, item?.name].filter(Boolean);
  });
}

function resolveIncludedProducts(bundle, products, definition) {
  const availableProducts = (Array.isArray(products) ? products : []).filter(isAvailableProduct);
  const references = explicitReferences(bundle).map(normalize).filter(Boolean);
  const used = new Set();
  const included = [];

  const addProduct = (product) => {
    if (!product || used.has(product.id)) return;
    used.add(product.id);
    included.push(product);
  };

  references.forEach((reference) => {
    addProduct(availableProducts.find((product) => productAliases(product).includes(reference)));
  });

  (definition?.includedProductAliases || []).forEach((aliases) => {
    addProduct(availableProducts.find((product) => matchesAlias(product, aliases)));
  });

  return included;
}

function priceSummary(bundle, includedProducts) {
  const bundlePricing = getProductPricing(bundle);
  const individualPricing = includedProducts.map((product) => getProductPricing(product));
  const hasIndividualPrices = includedProducts.length > 0 && individualPricing.every((pricing) => pricing.pricingType === "fixed");
  const individualValue = hasIndividualPrices
    ? individualPricing.reduce((total, pricing) => total + pricing.price, 0)
    : null;
  const bundlePrice = bundlePricing.pricingType === "fixed" ? bundlePricing.price : null;
  const savings = individualValue !== null && bundlePrice !== null && individualValue > bundlePrice
    ? Math.round((individualValue - bundlePrice) * 100) / 100
    : null;

  return {
    bundlePrice,
    individualValue,
    savings,
    savingsPercentage: savings !== null ? (savings / individualValue) * 100 : null
  };
}

export function getBundleDetails(bundle = {}, products = []) {
  const definition = getBundleDefinition(bundle);
  const includedProducts = resolveIncludedProducts(bundle, products, definition);
  const pricing = priceSummary(bundle, includedProducts);

  return {
    definition,
    includedProducts,
    excludedProductIds: includedProducts.map((product) => product.id),
    learningOrder: includedProducts.map((product) => product.title),
    ...pricing
  };
}
