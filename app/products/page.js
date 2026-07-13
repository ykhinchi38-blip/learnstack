import Link from "next/link";
import { Suspense } from "react";
import ProductCatalog from "@/components/ProductCatalog";
import SubscriberDiscount from "@/components/SubscriberDiscount";
import AnalyticsPageView from "@/components/AnalyticsPageView";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { getRegularProductsResult } from "@/lib/gumroad";
import { createMetadata, breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/seo";
import styles from "./ProductsPage.module.css";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Programming Handbooks for Beginners & Developers",
  description: "Browse LearnStack programming handbooks for beginners, including coding learning resources, React handbook PDFs, SQL, APIs, Git, Docker, and revision guides.",
  path: "/products",
  keywords: ["programming handbooks for beginners", "React handbook PDF", "coding learning resources", "PDF handbooks for developers"]
});

export default async function ProductsPage() {
  const { products, error } = await getRegularProductsResult();

  return (
    <PageEntrance variant="fadeUp" stagger>
      <AnalyticsPageView eventName="catalog_viewed" eventParams={{ catalog: "handbooks" }} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Handbooks", href: "/products" }])} />
      <JsonLd data={collectionPageJsonLd({ name: "Programming Handbooks for Beginners", description: metadata.description, path: "/products" })} />

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
            <h2>Preview selected handbooks before you buy.</h2>
            <p>
              Open the available sample PDFs to inspect the layout and learning style before choosing a full digital book.
            </p>
          </div>
          <Link href="/free-samples" className="brutalButton">
            Browse Free Samples
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
            <Suspense fallback={<div className={styles.emptyState}>Loading catalog filters...</div>}>
              <ProductCatalog products={products} enableComparison />
            </Suspense>
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
