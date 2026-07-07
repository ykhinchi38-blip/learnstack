import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { getAmazonPaperbackProducts } from "@/data/amazonPaperbacks";
import { getAllProducts } from "@/lib/gumroad";
import { breadcrumbJsonLd, collectionPageJsonLd, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import styles from "../BrandTrustPage.module.css";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "LearnStack on Amazon | Premium Paperback Books",
  description: "Explore LearnStack paperback books on Amazon. Digital PDFs are available through LearnStack, and selected kids books are available as premium paperback editions.",
  path: "/amazon-special"
});

function AmazonBookCard({ product }) {
  const coverImage = product.image || product.coverImage;
  const isLive = product.status === "live";
  const statusLabel = isLive ? "Live on Amazon" : "Coming Soon on Amazon";

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
          <span>{product.shortTitle || product.logoText || "Paperback"}</span>
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
          {product.price && <span>Price: {product.price}</span>}
          <span>{statusLabel}</span>
        </div>
        {product.description && <p>{product.description}</p>}
        <div className={styles.sampleActions}>
          {isLive ? (
            <a className={styles.miniButton} href={product.amazonUrl} target="_blank" rel="noopener noreferrer">
              View on Amazon
            </a>
          ) : (
            <span className={styles.disabledMiniButton}>Coming Soon on Amazon</span>
          )}
          {product.digitalUrl && (
          <Link className={styles.miniButton} href={product.digitalUrl}>
            View Digital PDF
          </Link>
          )}
        </div>
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
      <JsonLd data={collectionPageJsonLd({
        name: "LearnStack on Amazon",
        description: "Selected LearnStack kids books available as Amazon paperback editions.",
        path: "/amazon-special"
      })} />

      <section className={styles.amazonHero}>
        <div className={`container ${styles.amazonHeroGrid}`}>
          <div>
            <span className="pageEyebrow">Amazon Paperback Editions</span>
            <h1>Digital PDFs on LearnStack. Premium paperbacks on Amazon.</h1>
            <p>
              LearnStack books are available as digital PDFs through LearnStack/Gumroad, and selected titles are also available as paperback editions on Amazon.
            </p>
            <div className={styles.actions}>
              <a className="brutalButton" href={site.amazonAuthorUrl} target="_blank" rel="noopener noreferrer">
                View LearnStack Author Page
              </a>
              <Link className="brutalButton brutalButtonWhite" href="/kids/books">
                Browse Digital PDFs
              </Link>
            </div>
            <aside className={styles.availabilityNote} aria-labelledby="availability-note-title">
              <h2 id="availability-note-title">Availability note</h2>
              <p>
                Paperback availability can vary by country, marketplace, and delivery location. If a paperback is unavailable in your region, you can still explore the digital PDF edition where available.
              </p>
            </aside>
          </div>
          <div className={styles.amazonHeroCards} aria-label="Amazon special summary">
            <article>
              <strong>PDF</strong>
              <span>View digital editions through LearnStack and Gumroad.</span>
            </article>
            <article>
              <strong>Paperback</strong>
              <span>Selected LearnStack Kids titles are available as premium printed editions.</span>
            </article>
            <article>
              <strong>{amazonProducts.filter((product) => product.status === "live").length}</strong>
              <span>live paperback editions currently configured</span>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.gridTwo}`}>
          <article className={styles.card}>
            <h2>Why paperback editions are special</h2>
            <p>Printed books are helpful for offline reading, parent-child learning, classroom use, and long practice sessions.</p>
          </article>
          <article className={styles.card}>
            <h2>How availability works</h2>
            <p>Live books show an Amazon button. Publishing books stay clearly marked as coming soon until they are available.</p>
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
            <p>Amazon availability may vary by region.</p>
          </div>
        </div>
      </section>
    </PageEntrance>
  );
}
