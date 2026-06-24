import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import { getRegularProducts } from "@/lib/gumroad";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { slugify } from "@/data/products";
import styles from "./CategoryDetailPage.module.css";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getRegularProducts();
  const categories = Array.from(new Set(products.map((product) => product.category)));
  return categories.map((category) => ({ slug: slugify(category) }));
}

export async function generateMetadata({ params }) {
  const products = await getRegularProducts();
  const category = Array.from(new Set(products.map((product) => product.category))).find((item) => slugify(item) === params.slug);
  if (!category) return createMetadata({ title: "Category Not Found", description: "This LearnStack category could not be found.", path: `/categories/${params.slug}` });

  return createMetadata({
    title: `${category} Handbooks`,
    description: `Explore LearnStack ${category} PDF handbooks for students and developers with practical examples, revision notes, and instant Gumroad delivery.`,
    path: `/categories/${params.slug}`
  });
}

export default async function CategoryDetailPage({ params }) {
  const products = await getRegularProducts();
  const category = Array.from(new Set(products.map((product) => product.category))).find((item) => slugify(item) === params.slug);
  if (!category) notFound();

  const filtered = products.filter((product) => product.category === category);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", href: "/" },
        { name: "Categories", href: "/categories" },
        { name: category, href: `/categories/${params.slug}` }
      ])} />
      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Category</span>
          <h1 className="pageTitle">{category} Handbooks</h1>
          <p className="pageLead">A focused collection of LearnStack PDFs for {category.toLowerCase()} learners.</p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={`container ${styles.grid}`}>
          {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </>
  );
}
