import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { getBundleProductsResult } from "@/lib/gumroad";
import { productDetailHref } from "@/lib/productRouting";
import { breadcrumbJsonLd, collectionPageJsonLd, createMetadata } from "@/lib/seo";
import styles from "./BundlesPage.module.css";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "LearnStack Book Bundles | Digital Learning Bundles",
  description: "Explore LearnStack digital book bundles for students, coding beginners, interview preparation, web development, and practical learning.",
  path: "/bundles"
});

function BundleCover({ bundle, priority = false }) {
  const coverImage = bundle.image || bundle.coverImage;

  if (!coverImage) {
    return (
      <div className={styles.coverFallback} role="img" aria-label={`${bundle.title} bundle cover`}>
        <span>Bundle</span>
      </div>
    );
  }

  return (
    <Image
      src={coverImage}
      alt={`${bundle.title} bundle cover by LearnStack`}
      width={360}
      height={480}
      sizes="(max-width: 680px) 100vw, (max-width: 1080px) 45vw, 31vw"
      className={styles.coverImage}
      priority={priority}
      unoptimized={String(coverImage).startsWith("http")}
    />
  );
}

function BundleCard({ bundle, priority = false }) {
  const detailHref = productDetailHref(bundle);

  return (
    <article className={styles.bundleCard}>
      <div className={styles.coverWrap}>
        <BundleCover bundle={bundle} priority={priority} />
        <span className={styles.badge}>Bundle</span>
      </div>
      <div className={styles.cardBody}>
        <h2>{bundle.title}</h2>
        <p>{bundle.summary || bundle.limitedDescription || "A curated LearnStack digital learning bundle."}</p>
        <strong>{bundle.priceDisplay || "View price"}</strong>
        <div className={styles.cardActions}>
          <Link href={detailHref} className={styles.detailsButton}>Details</Link>
          <a href={bundle.gumroadUrl} target="_blank" rel="noopener noreferrer" className={styles.buyButton}>
            Buy on Gumroad
          </a>
          {bundle.sampleUrl && (
            <a href={bundle.sampleUrl} target="_blank" rel="noopener noreferrer" className={styles.sampleButton}>
              Free Sample
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function BundlesPage() {
  const { products: bundles, error } = await getBundleProductsResult();

  return (
    <PageEntrance variant="fadeUp" stagger>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "LearnStack Book Bundles", href: "/bundles" }])} />
      <JsonLd data={collectionPageJsonLd({
        name: "LearnStack Book Bundles",
        description: "Curated LearnStack digital book bundles for coding, interviews, web development, and student learning.",
        path: "/bundles"
      })} />

      <section className={styles.hero}>
        <div className="container">
          <div className="breadcrumbText"><Link href="/">Home</Link><span>-</span><span>Bundles</span></div>
          <span className="pageEyebrow">LearnStack Bundles</span>
          <h1>LearnStack Book Bundles</h1>
          <p>
            Save time with curated LearnStack digital book bundles for coding, interviews, web development, and student learning.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          {error ? (
            <div className={styles.emptyState}>
              <h2>Unable to load bundles right now.</h2>
              <p>Please try again later.</p>
            </div>
          ) : bundles.length > 0 ? (
            <div className={styles.bundleGrid}>
              {bundles.map((bundle, index) => (
                <BundleCard bundle={bundle} key={bundle.id} priority={index < 3} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2>Bundles are being prepared. Please check again soon.</h2>
              <p>Normal handbooks and kids books are still available through LearnStack/Gumroad.</p>
              <Link href="/products" className="brutalButton">Browse Handbooks</Link>
            </div>
          )}
        </div>
      </section>
    </PageEntrance>
  );
}
