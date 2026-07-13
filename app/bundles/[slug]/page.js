import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { getAllProducts, getBundleProductBySlug, getBundleProducts } from "@/lib/gumroad";
import { breadcrumbJsonLd, createMetadata, productJsonLd, productSeoDescription } from "@/lib/seo";
import { getRelatedProducts } from "@/lib/productCatalog";
import { getBundleDetails } from "@/lib/bundleDetails";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const bundles = await getBundleProducts();
  return bundles.map((bundle) => ({ slug: bundle.slug || bundle.id }));
}

export async function generateMetadata({ params }) {
  const bundle = await getBundleProductBySlug(params.slug);

  if (!bundle) {
    return createMetadata({
      title: "Bundle Not Found",
      description: "This LearnStack bundle could not be found.",
      path: `/bundles/${params.slug}`
    });
  }

  return createMetadata({
    title: bundle.title,
    description: productSeoDescription(bundle, "regular"),
    path: `/bundles/${bundle.slug || params.slug}`,
    image: bundle.image || bundle.coverImage || undefined,
    imageAlt: `${bundle.title} bundle cover by LearnStack`,
    type: "product"
  });
}

export default async function BundleDetailPage({ params }) {
  const [bundle, bundles, products] = await Promise.all([
    getBundleProductBySlug(params.slug),
    getBundleProducts(),
    getAllProducts()
  ]);
  if (!bundle) notFound();

  const bundlePath = `/bundles/${bundle.slug || params.slug}`;
  const bundleDetails = getBundleDetails(bundle, products);
  const relatedProducts = getRelatedProducts(bundle, [...bundles, ...products], 6)
    .filter((product) => !bundleDetails.excludedProductIds.includes(product.id));

  return (
    <PageEntrance variant="fadeScale">
      <JsonLd data={productJsonLd(bundle)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", href: "/" },
        { name: "Bundles", href: "/bundles" },
        { name: bundle.title, href: bundlePath }
      ])} />

      <ProductDetailView
        product={bundle}
        catalogHref="/bundles"
        catalogLabel="Bundles"
        eyebrow="LearnStack Bundle"
        relatedProducts={relatedProducts}
        bundleDetails={bundleDetails}
        excludedProductIds={bundleDetails.excludedProductIds}
      />
    </PageEntrance>
  );
}
