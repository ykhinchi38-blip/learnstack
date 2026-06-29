import Link from "next/link";
import ProductCatalog from "@/components/ProductCatalog";
import SubscriberDiscount from "@/components/SubscriberDiscount";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { getRegularProductsResult } from "@/lib/gumroad";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import styles from "./ProductsPage.module.css";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "PDF Handbooks for CSE Students & Developers",
  description: "Browse LearnStack PDF handbooks for programming, Docker, Linux, SQL, API development, GitHub, ChatGPT prompts, and more. Practical digital books for students and developers.",
  path: "/products"
});

export default async function ProductsPage() {
  const { products, error } = await getRegularProductsResult();

  return (
    <PageEntrance variant="fadeUp" stagger>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Handbooks", href: "/products" }])} />

      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <div className="breadcrumbText"><Link href="/">Home</Link><span>-</span><span>Handbooks</span></div>
            <span className="pageEyebrow">LearnStack Catalog</span>
            <h1>LearnStack Handbooks</h1>
            <p>
              Premium PDF handbooks for students, developers, and self-learners.
            </p>
          </div>
          <aside className={styles.catalogStats} aria-label="Catalog stats">
            <div><strong>Live</strong><span>Gumroad catalog</span></div>
            <div><strong>PDF</strong><span>Digital handbooks</span></div>
            <div><strong>Instant</strong><span>Delivery on Gumroad</span></div>
          </aside>
        </div>
      </section>

      <section className={styles.sampleSection}>
        <div className={`container ${styles.sampleCard}`}>
          <div>
            <span className="tag">Sample Preview</span>
            <h2>Student handbook samples are coming soon.</h2>
            <p>
              Existing handbook PDFs will be converted into clean preview samples before download links are added.
            </p>
          </div>
          <Link href="/free-samples" className="brutalButton">
            Check Sample Preview Status
          </Link>
        </div>
      </section>

      <section className={styles.suggestSection} aria-labelledby="suggest-handbook-heading">
        <div className={`container ${styles.suggestCard}`}>
          <div>
            <span className="tag">Suggest a Topic</span>
            <h2 id="suggest-handbook-heading">Want a handbook on a topic we have not covered yet?</h2>
            <p>
              Students and self-learners can suggest new LearnStack handbooks, tools, coding topics, placement topics, or practical PDF ideas.
            </p>
          </div>
          <Link href="/suggest-a-book" className="brutalButton brutalButtonWhite">
            Suggest a Handbook
          </Link>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className="container">
          {error ? (
            <div className={styles.emptyState}>
              <h2>Unable to load products right now.</h2>
              <p>Please try again later.</p>
            </div>
          ) : products.length > 0 ? (
            <ProductCatalog products={products} />
          ) : (
            <div className={styles.emptyState}>
              <h2>No handbooks found yet.</h2>
              <p>Please check that Gumroad product URLs contain learnstack.</p>
            </div>
          )}
        </div>
      </section>

      <section className={styles.discountWrap}>
        <div className="container">
          <SubscriberDiscount />
        </div>
      </section>
    </PageEntrance>
  );
}
