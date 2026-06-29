import { site } from "./site";
import { productDetailHref } from "./productRouting";

export const defaultTitle = "LearnStack | Premium PDF Handbooks for Students & Kids";
export const titleTemplate = "%s | LearnStack";
export const defaultDescription =
  "LearnStack creates visual, practical, easy-to-follow digital learning books, Life & Career Playbooks, and kids books for students, developers, parents, and teachers.";
export const seoKeywords = [
  "LearnStack",
  "PDF handbooks",
  "CSE students",
  "coding books",
  "programming books",
  "computer science handbooks",
  "kids books",
  "Life and Career Playbooks",
  "communication books",
  "career skills",
  "student life",
  "digital learning",
  "study resources",
  "exam preparation",
  "developer resources",
  "Indian students",
  "USA students",
  "LearnStack kids"
];

export function absoluteUrl(path = "") {
  if (path?.startsWith("http")) return path;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function normalizeSeoTitle(title = "") {
  return String(title || defaultTitle)
    .replace(/\s*\|\s*LearnStack\s*$/i, "")
    .trim();
}

export function cleanText(value = "") {
  return String(value || "")
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

export function limitText(value = "", maxLength = 158) {
  const clean = cleanText(value);

  if (clean.length <= maxLength) return clean;

  const trimmed = clean.slice(0, maxLength + 1);
  const lastSpace = trimmed.lastIndexOf(" ");
  const safeTrim = lastSpace > 90 ? trimmed.slice(0, lastSpace) : trimmed.slice(0, maxLength);

  return `${safeTrim.trim()}...`;
}

export function productSeoDescription(product, audience = product?.audience) {
  const base = cleanText(product?.summary || product?.description || product?.limitedDescription);
  const audiencePhrase = audience === "kids"
    ? "kids learning book with Gumroad PDF delivery"
    : audience === "life-career"
      ? "Life and Career Playbook with Gumroad PDF delivery"
      : "student and developer handbook with Gumroad PDF delivery";
  const parts = [
    base,
    product?.priceDisplay || (product?.price ? `Price ${product.price} ${product.currency || "INR"}` : ""),
    product?.category ? `${product.category} PDF` : "",
    audiencePhrase
  ].filter(Boolean);

  return limitText(parts.join(". "), 158);
}

export function createMetadata({
  title,
  description,
  path = "/",
  image = site.ogImage,
  type = "website"
}) {
  const pageTitle = normalizeSeoTitle(title);
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const openGraphType = type === "product" ? "website" : type;

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(site.url),
    keywords: seoKeywords,
    alternates: {
      canonical: url
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: site.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${site.name} preview`
        }
      ],
      locale: "en_IN",
      type: openGraphType
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [imageUrl]
    }
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href)
    }))
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/icon-512x512.png"),
    description: "Premium PDF handbooks and kids learning books for students, developers, and young learners.",
    sameAs: [site.socials.gumroad, site.socials.pinterest].filter((url) => url && url !== "#"),
    slogan: site.tagline
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function collectionPageJsonLd({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: site.name,
      url: site.url
    }
  };
}

export function productJsonLd(product) {
  const productUrl = absoluteUrl(productDetailHref(product));
  const productImage = product.image || product.coverImage;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.subtitle ? `${product.title} ${product.subtitle}` : product.title,
    description: productSeoDescription(product),
    url: productUrl,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: site.name
    }
  };

  if (productImage) {
    data.image = absoluteUrl(productImage);
  }

  if (Number(product.price) > 0) {
    data.offers = {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "INR",
      availability: "https://schema.org/InStock",
      url: product.gumroadUrl || productUrl
    };
  }

  return data;
}

export function faqJsonLd(faqs = []) {
  const visibleFaqs = faqs.filter((faq) => faq?.q && faq?.a);

  if (!visibleFaqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: visibleFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a
      }
    }))
  };
}

export function articleJsonLd(resource) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: resource.title,
    description: resource.description,
    dateModified: resource.updatedAt,
    datePublished: resource.updatedAt,
    author: {
      "@type": "Person",
      name: "Yogesh Khinchi"
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon-512x512.png")
      }
    },
    mainEntityOfPage: absoluteUrl(`/resources/${resource.slug}`)
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Yogesh Khinchi",
    jobTitle: "Founder of LearnStack",
    worksFor: {
      "@type": "Organization",
      name: site.name,
      url: site.url
    },
    url: absoluteUrl("/story")
  };
}
