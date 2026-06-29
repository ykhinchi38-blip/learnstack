const IDENTIFIER_FIELDS = [
  "name",
  "title",
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

const KIDS_TERMS = [
  "learnstackkids",
  "learnstack_kids",
  "learnstack kids",
  "kids",
  "children",
  "child",
  "zara",
  "rohan",
  "dadi",
  "feelings",
  "shape",
  "storybook"
];
const LIFE_CAREER_STRONG_TERMS = ["learnstacklife"];
const LIFE_CAREER_TERMS = [
  "life",
  "career",
  "communication",
  "conflict",
  "homesickness",
  "independence",
  "personal brand",
  "friends",
  "family",
  "etiquette",
  "side hustle",
  "presentation",
  "clarity",
  "relationship",
  "professional manners"
];
const BUSINESS_TERMS = ["mba", "business", "strategy", "marketing", "branding", "entrepreneur"];
const HANDBOOK_TERMS = [
  "coding",
  "docker",
  "linux",
  "python",
  "javascript",
  "sql",
  "dsa",
  "system design",
  "prompts",
  "developer",
  "student handbook",
  "tech",
  "programming",
  "learnstack_",
  "learnstack"
];
const LEARNSTACK_ACCOUNT_TERMS = [
  "learnstacks.gumroad.com",
  "learnstack.gumroad.com",
  "learnstack.co.in"
];

function normalizeValue(value) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(normalizeValue).filter(Boolean).join(" ");
  if (typeof value === "object") return "";
  return String(value).trim();
}

function normalizedVariants(value = "") {
  const lower = value.toLowerCase();

  return [
    lower,
    lower.replace(/[\s-]+/g, "_"),
    lower.replace(/[^a-z0-9]/g, "")
  ];
}

function collectCandidates(product, fields) {
  return fields
    .map((field) => {
      const raw = normalizeValue(product[field]);
      return raw ? { field, raw, value: raw.toLowerCase(), variants: normalizedVariants(raw) } : null;
    })
    .filter(Boolean);
}

function candidateMatches(candidate, terms) {
  return terms.find((term) => {
    const termVariants = normalizedVariants(term);
    return termVariants.some((termVariant) => candidate.variants.some((variant) => variant.includes(termVariant)));
  });
}

function findCandidateMatch(candidates, terms) {
  for (const candidate of candidates) {
    const matchedTerm = candidateMatches(candidate, terms);

    if (matchedTerm) {
      return {
        candidate,
        matchedTerm
      };
    }
  }

  return null;
}

export function classifyProductAudience(product = {}) {
  const candidates = collectCandidates(product, IDENTIFIER_FIELDS);
  const kidsMatch = findCandidateMatch(candidates, KIDS_TERMS);

  if (kidsMatch) {
    return {
      audience: "kids",
      status: "classified",
      sourceField: kidsMatch.candidate.field,
      matchedTerm: kidsMatch.matchedTerm
    };
  }

  const lifeCareerMatch =
    findCandidateMatch(candidates, LIFE_CAREER_STRONG_TERMS) ||
    findCandidateMatch(candidates, LIFE_CAREER_TERMS);

  if (lifeCareerMatch) {
    return {
      audience: "life-career",
      status: "classified",
      sourceField: lifeCareerMatch.candidate.field,
      matchedTerm: lifeCareerMatch.matchedTerm
    };
  }

  const businessMatch = findCandidateMatch(candidates, BUSINESS_TERMS);

  if (businessMatch) {
    return {
      audience: "business",
      status: "classified",
      sourceField: businessMatch.candidate.field,
      matchedTerm: businessMatch.matchedTerm
    };
  }

  const regularMatch =
    findCandidateMatch(candidates, HANDBOOK_TERMS) ||
    findCandidateMatch(candidates, LEARNSTACK_ACCOUNT_TERMS);

  if (regularMatch) {
    return {
      audience: "regular",
      status: "classified",
      sourceField: regularMatch.candidate.field,
      matchedTerm: regularMatch.matchedTerm
    };
  }

  return {
    audience: "uncategorized",
    status: "unclassified",
    sourceField: candidates[0]?.field || null,
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
      } else if (audience === "life-career") {
        stats.lifeCareer += 1;
      } else if (audience === "business") {
        stats.business += 1;
      } else if (audience === "uncategorized") {
        stats.uncategorized += 1;
      } else {
        stats.regular += 1;
      }

      if (product.classificationStatus === "unclassified") {
        stats.unclassified += 1;
      }

      return stats;
    },
    { total: products.length, kids: 0, lifeCareer: 0, business: 0, regular: 0, uncategorized: 0, unclassified: 0 }
  );
}
