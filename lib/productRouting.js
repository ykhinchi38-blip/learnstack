export function productBasePath(product = {}) {
  if (product.audience === "kids") return "/kids";
  if (product.audience === "life-career") return "/life-career";
  return "/products";
}

export function productDetailHref(product = {}) {
  if (product.detailPath) return product.detailPath;
  return `${productBasePath(product)}/${product.slug || product.id}`;
}

export function productAudienceLabel(product = {}) {
  if (product.audience === "kids") return "LearnStack Kids";
  if (product.audience === "life-career") return "Life & Career Playbook";
  if (product.audience === "business") return "Business & MBA";
  return "Student Handbook";
}
