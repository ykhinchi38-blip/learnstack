import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import JsonLd from "@/components/JsonLd";
import { getRegularProductBySlug, getRegularProducts } from "@/lib/gumroad";
import { breadcrumbJsonLd, createMetadata, productJsonLd } from "@/lib/seo";

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
    title: product.metaTitle || product.title,
    description: product.summary || product.limitedDescription,
    path: `/products/${product.slug || params.slug}`,
    image: product.image || product.coverImage,
    type: "product"
  });
}

export default async function ProductDetailPage({ params }) {
  const product = await getRegularProductBySlug(params.slug);
  if (!product) notFound();

  const productPath = `/products/${product.slug || params.slug}`;

  return (
    <>
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
      />
    </>
  );
}
