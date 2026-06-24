import { site } from "./site";

export function absoluteUrl(path = "") {
  if (path?.startsWith("http")) return path;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createMetadata({
  title,
  description,
  path = "/",
  image = site.ogImage,
  type = "website"
}) {
  const pageTitle = title.includes("LearnStack") ? title : `${title} | LearnStack`;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const openGraphType = type === "product" ? "website" : type;

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(site.url),
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
    logo: absoluteUrl(site.logo),
    sameAs: [site.socials.gumroad].filter(Boolean),
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

export function productJsonLd(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.subtitle ? `${product.title} ${product.subtitle}` : product.title,
    description: product.summary || product.limitedDescription,
    image: absoluteUrl(product.image || product.coverImage),
    brand: {
      "@type": "Brand",
      name: site.name
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "INR",
      availability: "https://schema.org/InStock",
      url: product.gumroadUrl
    }
  };
}
