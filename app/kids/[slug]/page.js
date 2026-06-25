import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import JsonLd from "@/components/JsonLd";
import { getKidsProductBySlug, getKidsProducts } from "@/lib/gumroad";
import { breadcrumbJsonLd, createMetadata, productJsonLd, productSeoDescription } from "@/lib/seo";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getKidsProducts();
  return products.map((product) => ({ slug: product.slug || product.id }));
}

export async function generateMetadata({ params }) {
  const product = await getKidsProductBySlug(params.slug);

  if (!product) {
    return createMetadata({
      title: "Kids Book Not Found",
      description: "This LearnStack Kids book could not be found.",
      path: `/kids/${params.slug}`
    });
  }

  return createMetadata({
    title: `${product.title} Kids Learning Book`,
    description: productSeoDescription(product, "kids"),
    path: `/kids/${product.slug || params.slug}`,
    image: product.image || product.coverImage || undefined,
    type: "product"
  });
}

export default async function KidsProductDetailPage({ params }) {
  const [product, products] = await Promise.all([
    getKidsProductBySlug(params.slug),
    getKidsProducts()
  ]);
  if (!product) notFound();

  const productPath = `/kids/${product.slug || params.slug}`;
  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", href: "/" },
        { name: "Kids Books", href: "/kids" },
        { name: product.title, href: productPath }
      ])} />

      <ProductDetailView
        product={product}
        catalogHref="/kids"
        catalogLabel="Kids Books"
        eyebrow="LearnStack Kids Book"
        relatedProducts={relatedProducts}
      />
    </>
  );
}
