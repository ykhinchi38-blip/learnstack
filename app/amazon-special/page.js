import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { getAmazonPaperbackProducts } from "@/data/amazonPaperbacks";
import { getAllProducts } from "@/lib/gumroad";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import styles from "../BrandTrustPage.module.css";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Amazon Paperback Editions",
  description: "Digital PDF on LearnStack, paperback on Amazon. View LearnStack books with Amazon paperback links where available.",
  path: "/amazon-special"
});

function AmazonBookCard({ product }) {
  const coverImage = product.image || product.coverImage;

  return (
    <article className={styles.sampleCard}>
      <div className={styles.sampleCover}>
        {coverImage ? (
          <Image
            src={coverImage}
            alt={`${product.title} cover`}
            width={180}
            height={240}
            sizes="(max-width: 560px) 120px, 124px"
            className={styles.sampleCoverImage}
            unoptimized={coverImage.startsWith("http")}
          />
        ) : (
          <span>{product.logoText || "PDF"}</span>
        )}
      </div>
      <div className={styles.sampleBody}>
        <h3>{product.shortTitle || product.title}</h3>
        {product.title !== product.shortTitle && <p className={styles.fullTitle}>{product.title}</p>}
        <div className={styles.amazonMeta} aria-label={`${product.shortTitle || product.title} paperback details`}>
          {product.author && <span>Author: {product.author}</span>}
          {product.category && <span>Category: {product.category}</span>}
          {product.format && <span>Format: {product.format}</span>}
          {product.asin && <span>ASIN: {product.asin}</span>}
        </div>
        <p>Paperback edition on Amazon. Availability may vary by country.</p>
        <a className={styles.miniButton} href={product.amazonUrl} target="_blank" rel="noopener noreferrer">
          View on Amazon
        </a>
        {product.learnstackUrl && (
          <Link className={styles.miniButton} href={product.learnstackUrl}>
            View Digital PDF
          </Link>
        )}
      </div>
    </article>
  );
}

export default async function AmazonSpecialPage() {
  const products = await getAllProducts();
  const amazonProducts = getAmazonPaperbackProducts(products);

  return (
    <PageEntrance variant="slideSoft" stagger>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Amazon Paperback Editions", href: "/amazon-special" }])} />

      <section className={styles.amazonHero}>
        <div className={`container ${styles.amazonHeroGrid}`}>
          <div>
            <span className="pageEyebrow">Amazon Paperback Editions</span>
            <h1>Digital PDF on LearnStack, paperback on Amazon.</h1>
            <p>
              LearnStack keeps digital PDF editions available through Gumroad, and shows Amazon paperback links only where a real paperback edition is published.
            </p>
            <aside className={styles.availabilityNote} aria-labelledby="availability-note-title">
              <h2 id="availability-note-title">Availability note</h2>
              <p>
                Some Amazon paperback editions may not be deliverable in every country or region. Availability can vary by marketplace, delivery location, printing availability, and Amazon&apos;s regional stock status. If a paperback shows as unavailable in your country, you can still check the digital PDF edition on LearnStack/Gumroad where available.
              </p>
              <small>Digital PDF on LearnStack, paperback on Amazon.</small>
              <small>Paperback availability may vary by country, marketplace, and delivery location.</small>
            </aside>
          </div>
          <div className={styles.amazonHeroCards} aria-label="Amazon special summary">
            <article>
              <strong>PDF</strong>
              <span>View digital editions through LearnStack and Gumroad.</span>
            </article>
            <article>
              <strong>Paperback</strong>
              <span>Amazon paperback availability may vary by delivery location.</span>
            </article>
            <article>
              <strong>{amazonProducts.length || "Soon"}</strong>
              <span>{amazonProducts.length === 1 ? "paperback link configured" : "paperback links configured"}</span>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.gridTwo}`}>
          <article className={styles.card}>
            <h2>Why paperback editions are special</h2>
            <p>Some readers prefer printed books for offline study, parent-child reading, classroom use, or long practice sessions.</p>
          </article>
          <article className={styles.card}>
            <h2>How availability works</h2>
            <p>Paperback links appear here only when an Amazon edition is published and a real product link is available.</p>
          </article>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className="container">
          <span className="tag">Paperback books</span>
          {amazonProducts.length > 0 ? (
            <div className={styles.sampleGrid}>
              {amazonProducts.map((product) => (
                <AmazonBookCard product={product} key={product.id} />
              ))}
            </div>
          ) : (
            <div className={styles.highlight}>
              <h2>Amazon paperback editions will be added here as they become available.</h2>
              <p>No Amazon paperback links are configured yet. You can still browse digital PDF editions through LearnStack and Gumroad.</p>
              <div className={styles.actions}>
                <Link className="brutalButton" href="/products">Browse Handbooks</Link>
                <Link className="brutalButton brutalButtonWhite" href="/kids">Browse Kids Books</Link>
              </div>
            </div>
          )}
          <div className={styles.bottomNote}>
            <p>Having trouble with Amazon availability? Check the digital PDF edition on LearnStack/Gumroad where available.</p>
          </div>
        </div>
      </section>
    </PageEntrance>
  );
}
