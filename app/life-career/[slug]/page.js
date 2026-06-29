import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { getResourceBySlug } from "@/data/resources";
import { getLifeCareerProductBySlug, getLifeCareerProducts } from "@/lib/gumroad";
import { breadcrumbJsonLd, createMetadata, productJsonLd, productSeoDescription } from "@/lib/seo";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getLifeCareerProducts();
  return products.map((product) => ({ slug: product.slug || product.id }));
}

export async function generateMetadata({ params }) {
  const product = await getLifeCareerProductBySlug(params.slug);

  if (!product) {
    return createMetadata({
      title: "Life & Career Playbook Not Found",
      description: "This LearnStack Life & Career Playbook could not be found.",
      path: `/life-career/${params.slug}`
    });
  }

  return createMetadata({
    title: `${product.title} Life & Career Playbook`,
    description: productSeoDescription(product, "life-career"),
    path: `/life-career/${product.slug || params.slug}`,
    image: product.image || product.coverImage || undefined,
    type: "product"
  });
}

export default async function LifeCareerProductDetailPage({ params }) {
  const [product, products] = await Promise.all([
    getLifeCareerProductBySlug(params.slug),
    getLifeCareerProducts()
  ]);
  if (!product) notFound();

  const productPath = `/life-career/${product.slug || params.slug}`;
  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 3);
  const relatedResources = [
    "how-to-start-coding-as-a-student",
    "learnstack-free-pdf-samples"
  ].map(getResourceBySlug).filter(Boolean);

  return (
    <PageEntrance variant="fadeScale">
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", href: "/" },
        { name: "Life & Career Playbooks", href: "/life-career" },
        { name: product.title, href: productPath }
      ])} />

      <ProductDetailView
        product={product}
        catalogHref="/life-career"
        catalogLabel="Life & Career Playbooks"
        eyebrow="Life & Career Playbook"
        relatedProducts={relatedProducts}
        relatedResources={relatedResources}
      />
    </PageEntrance>
  );
}
