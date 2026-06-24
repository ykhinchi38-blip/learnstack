import { getKidsProducts, getRegularProducts } from "@/lib/gumroad";
import { site } from "@/lib/site";
import { slugify } from "@/data/products";

export const revalidate = 300;

export default async function sitemap() {
  const products = await getRegularProducts();
  const kidsProducts = await getKidsProducts();
  const now = new Date();

  const staticRoutes = [
    "",
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

  const categoryRoutes = Array.from(new Set(products.map((product) => product.category))).map(
    (category) => `/categories/${slugify(category)}`
  );

  const productRoutes = products.map((product) => `/products/${product.slug || product.id}`);
  const kidsProductRoutes = kidsProducts.map((product) => `/kids/${product.slug || product.id}`);

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...kidsProductRoutes].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: now,
    changeFrequency: route.startsWith("/products") || route.startsWith("/kids/") ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/products") || route.startsWith("/kids/") ? 0.8 : 0.6
  }));
}
