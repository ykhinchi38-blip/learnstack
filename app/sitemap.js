import { getBundleProducts, getKidsProducts, getLifeCareerProducts, getRegularProducts } from "@/lib/gumroad";
import { absoluteUrl, isPublicProduct } from "@/lib/seo";
import localProducts, { slugify } from "@/data/products";
import { resources } from "@/data/resources";

export const revalidate = 300;

export default async function sitemap() {
  const liveProducts = await getRegularProducts();
  const liveKidsProducts = await getKidsProducts();
  const liveLifeCareerProducts = await getLifeCareerProducts();
  const liveBundleProducts = await getBundleProducts();
  const localRegularProducts = localProducts.filter((product) => (product.audience || "regular") === "regular" && isPublicProduct(product));
  const localKidsProducts = localProducts.filter((product) => product.audience === "kids" && isPublicProduct(product));
  const localLifeCareerProducts = localProducts.filter((product) => product.audience === "life-career" && isPublicProduct(product));
  const products = [...liveProducts, ...localRegularProducts].filter(isPublicProduct);
  const kidsProducts = [...liveKidsProducts, ...localKidsProducts].filter(isPublicProduct);
  const lifeCareerProducts = [...liveLifeCareerProducts, ...localLifeCareerProducts].filter(isPublicProduct);
  const bundleProducts = liveBundleProducts.filter(isPublicProduct);
  const now = new Date();

  const staticRoutes = [
    "/",
    "/products",
    "/life-career",
    "/kids",
    "/kids/books",
    "/resources",
    "/free-samples",
    "/for-educators",
    "/partner-with-us",
    "/story",
    "/suggest-a-book",
    "/why-learnstack",
    "/help",
    "/amazon-special",
    "/categories",
    "/bundles",
    "/learning-paths",
    "/coupons",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/licensing-and-usage"
  ];

  const categoryRoutes = Array.from(new Set(products.map((product) => product.category).filter(Boolean))).map(
    (category) => `/categories/${slugify(category)}`
  );

  const uniqueRoutes = new Set();
  const makeRouteEntry = (route, lastModified) => {
    if (uniqueRoutes.has(route)) return null;
    uniqueRoutes.add(route);
    return { route, lastModified };
  };

  const productRoutes = products.map((product) => makeRouteEntry(`/products/${product.slug || product.id}`, product.updatedAt || product.createdAt || now)).filter(Boolean);
  const kidsProductRoutes = kidsProducts.map((product) => makeRouteEntry(`/kids/${product.slug || product.id}`, product.updatedAt || product.createdAt || now)).filter(Boolean);
  const lifeCareerProductRoutes = lifeCareerProducts.map((product) => makeRouteEntry(`/life-career/${product.slug || product.id}`, product.updatedAt || product.createdAt || now)).filter(Boolean);
  const bundleProductRoutes = bundleProducts.map((product) => makeRouteEntry(`/bundles/${product.slug || product.id}`, product.updatedAt || product.createdAt || now)).filter(Boolean);
  const resourceRoutes = resources.map((resource) => makeRouteEntry(`/resources/${resource.slug}`, resource.updatedAt || now)).filter(Boolean);

  const staticEntries = [...staticRoutes, ...categoryRoutes].map((route) => ({
    route,
    lastModified: now
  }));

  return [...staticEntries, ...productRoutes, ...kidsProductRoutes, ...lifeCareerProductRoutes, ...bundleProductRoutes, ...resourceRoutes].map(({ route, lastModified }) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: route.startsWith("/products") || route.startsWith("/kids/") || route.startsWith("/life-career/") ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/products") || route.startsWith("/kids/") || route.startsWith("/life-career/") ? 0.8 : 0.6
  }));
}
