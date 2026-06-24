const IDENTIFIER_FIELDS = [
  "custom_permalink",
  "permalink",
  "slug",
  "product_permalink",
  "product_slug",
  "product_path",
  "product_url",
  "url",
  "short_url",
  "long_url",
  "link",
  "product_link",
  "purchase_url",
  "preview_url",
  "gumroadUrl"
];

const TITLE_FIELDS = ["name", "title"];

function normalizeValue(value) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(normalizeValue).filter(Boolean).join(" ");
  if (typeof value === "object") return "";
  return String(value).trim();
}

function collectCandidates(product, fields) {
  return fields
    .map((field) => {
      const raw = normalizeValue(product[field]);
      return raw ? { field, raw, value: raw.toLowerCase() } : null;
    })
    .filter(Boolean);
}

export function classifyProductAudience(product = {}) {
  const identifierCandidates = collectCandidates(product, IDENTIFIER_FIELDS);
  const titleCandidates = collectCandidates(product, TITLE_FIELDS);

  const kidsMatch = identifierCandidates.find((candidate) => candidate.value.includes("learnstackkids"));

  if (kidsMatch) {
    return {
      audience: "kids",
      status: "classified",
      sourceField: kidsMatch.field,
      matchedTerm: "learnstackkids"
    };
  }

  const regularMatch = identifierCandidates.find((candidate) => candidate.value.includes("learnstack"));

  if (regularMatch) {
    return {
      audience: "regular",
      status: "classified",
      sourceField: regularMatch.field,
      matchedTerm: "learnstack"
    };
  }

  const fallbackKidsMatch = titleCandidates.find((candidate) => candidate.value.includes("learnstackkids"));

  if (fallbackKidsMatch) {
    return {
      audience: "kids",
      status: "classified",
      sourceField: fallbackKidsMatch.field,
      matchedTerm: "learnstackkids"
    };
  }

  const fallbackRegularMatch = titleCandidates.find((candidate) => candidate.value.includes("learnstack"));

  if (fallbackRegularMatch) {
    return {
      audience: "regular",
      status: "classified",
      sourceField: fallbackRegularMatch.field,
      matchedTerm: "learnstack"
    };
  }

  return {
    audience: "regular",
    status: "unclassified",
    sourceField: identifierCandidates[0]?.field || titleCandidates[0]?.field || null,
    matchedTerm: null
  };
}

export function classifyGumroadProduct(product = {}) {
  return classifyProductAudience(product);
}

export function getAudienceStats(products = []) {
  return products.reduce(
    (stats, product) => {
      const audience = product.audience || "regular";

      if (audience === "kids") {
        stats.kids += 1;
      } else {
        stats.regular += 1;
      }

      if (product.classificationStatus === "unclassified") {
        stats.unclassified += 1;
      }

      return stats;
    },
    { total: products.length, kids: 0, regular: 0, unclassified: 0 }
  );
}
