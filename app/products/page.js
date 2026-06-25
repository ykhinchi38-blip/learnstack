import Link from "next/link";
import ProductCatalog from "@/components/ProductCatalog";
import SubscriberDiscount from "@/components/SubscriberDiscount";
import JsonLd from "@/components/JsonLd";
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
    <>
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
            <span className="tag">Free PDF Sample</span>
            <h2>LearnStack Adult Handbook Sample</h2>
            <p>
              Preview our student and developer handbook style, including code examples, revision pages, common
              mistakes, interview notes, and learning structure.
            </p>
          </div>
          <a
            href="/downloads/LearnStack_Free_Sample_PDF_Adult_READY_TO_UPLOAD.pdf"
            className="brutalButton"
            download
          >
            Download Adult Sample PDF
          </a>
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
    </>
  );
}
