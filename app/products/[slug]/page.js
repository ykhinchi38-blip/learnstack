import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { getResourceBySlug } from "@/data/resources";
import { getRegularProductBySlug, getRegularProducts } from "@/lib/gumroad";
import { breadcrumbJsonLd, createMetadata, productJsonLd, productSeoDescription } from "@/lib/seo";
import { getRelatedProducts } from "@/lib/productCatalog";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getRegularProducts();
  return products.map((product) => ({ slug: product.slug || product.id }));
}

export async function generateMetadata({ params }) {
  const product = await getRegularProductBySlug(params.slug);

  if (!product) {
    return createMetadata({
      title: "Handbook Not Found",
      description: "This LearnStack handbook could not be found.",
      path: `/products/${params.slug}`
    });
  }

  return createMetadata({
    title: product.title,
    description: productSeoDescription(product, "regular"),
    path: `/products/${product.slug || params.slug}`,
    image: product.image || product.coverImage || undefined,
    imageAlt: `${product.title} handbook cover by LearnStack`,
    type: "product"
  });
}

export default async function ProductDetailPage({ params }) {
  const [product, products] = await Promise.all([
    getRegularProductBySlug(params.slug),
    getRegularProducts()
  ]);
  if (!product) notFound();

  const productPath = `/products/${product.slug || params.slug}`;
  const relatedProducts = getRelatedProducts(product, products, 3);
  const relatedResources = [
    "best-pdf-handbooks-for-cse-students",
    "best-coding-books-for-beginners-2026",
    "how-to-start-coding-as-a-student"
  ].map(getResourceBySlug).filter(Boolean);

  return (
    <PageEntrance variant="fadeScale">
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", href: "/" },
        { name: "Handbooks", href: "/products" },
        { name: product.title, href: productPath }
      ])} />

      <ProductDetailView
        product={product}
        catalogHref="/products"
        catalogLabel="Handbooks"
        eyebrow="LearnStack Handbook"
        relatedProducts={relatedProducts}
        relatedResources={relatedResources}
      />
    </PageEntrance>
  );
}
