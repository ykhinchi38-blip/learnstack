import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { getRegularProducts } from "@/lib/gumroad";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { slugify } from "@/data/products";
import styles from "./CategoriesPage.module.css";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Learning Categories",
  description: "Explore LearnStack PDF handbooks by category including programming, web development, data science, interview prep, and developer tools.",
  path: "/categories"
});

export default async function CategoriesPage() {
  const products = await getRegularProducts();
  const categories = Array.from(new Set(products.map((product) => product.category))).sort();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Categories", href: "/categories" }])} />
      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Learning paths</span>
          <h1 className="pageTitle">Explore handbooks by category.</h1>
          <p className="pageLead">Find the right LearnStack resource based on what you are learning right now.</p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={`container ${styles.grid}`}>
          {categories.map((category) => {
            const count = products.filter((product) => product.category === category).length;
            return (
              <Link href={`/categories/${slugify(category)}`} key={category} className={styles.card}>
                <span>{String(count).padStart(2, "0")}</span>
                <h2>{category}</h2>
                <p>{count} handbooks and learning resources in this category.</p>
                <strong>Explore →</strong>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
