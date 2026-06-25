import { getKidsProducts, getRegularProducts } from "@/lib/gumroad";
import { absoluteUrl } from "@/lib/seo";
import localProducts, { slugify } from "@/data/products";

export const revalidate = 300;

export default async function sitemap() {
  const liveProducts = await getRegularProducts();
  const liveKidsProducts = await getKidsProducts();
  const localRegularProducts = localProducts.filter((product) => (product.audience || "regular") === "regular");
  const localKidsProducts = localProducts.filter((product) => product.audience === "kids");
  const products = [...liveProducts, ...localRegularProducts];
  const kidsProducts = [...liveKidsProducts, ...localKidsProducts];
  const now = new Date();

  const staticRoutes = [
    "/",
    "/products",
    "/kids",
    "/story",
    "/categories",
    "/bundles",
    "/learning-paths",
    "/free-resources",
    "/coupons",
    "/reviews",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/refund-policy"
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

  const staticEntries = [...staticRoutes, ...categoryRoutes].map((route) => ({
    route,
    lastModified: now
  }));

  return [...staticEntries, ...productRoutes, ...kidsProductRoutes].map(({ route, lastModified }) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: route.startsWith("/products") || route.startsWith("/kids/") ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/products") || route.startsWith("/kids/") ? 0.8 : 0.6
  }));
}
