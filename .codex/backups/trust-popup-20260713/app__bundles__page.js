import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import AnalyticsPageView from "@/components/AnalyticsPageView";
import PageEntrance from "@/components/PageEntrance";
import { TrackedExternalLink } from "@/components/TrackedLinks";
import { getAllProducts, getBundleProductsResult } from "@/lib/gumroad";
import { getBundleDetails } from "@/lib/bundleDetails";
import { productDetailHref } from "@/lib/productRouting";
import { formatPrice } from "@/lib/pricing";
import { breadcrumbJsonLd, collectionPageJsonLd, createMetadata } from "@/lib/seo";
import styles from "./BundlesPage.module.css";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "LearnStack Book Bundles | Digital Learning Bundles",
  description: "Explore LearnStack digital book bundles for students, coding beginners, interview preparation, web development, and practical learning.",
  path: "/bundles"
});

function bundleEventParams(bundle, ctaLocation) {
  return {
    product_id: bundle.id || bundle.slug || "",
    product_title: bundle.title || "",
    product_category: bundle.category || "bundles",
    price: Number(bundle.price) || undefined,
    currency: bundle.currency || "USD",
    cta_location: ctaLocation
  };
}

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

function BundleCard({ bundle, details, priority = false }) {
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
        {details.includedProducts.length > 0 && <span className={styles.includedCount}>{details.includedProducts.length} included {details.includedProducts.length === 1 ? "book" : "books"}</span>}
        <strong>{formatPrice(bundle)}</strong>
        {details.savings !== null && (
          <span className={styles.savings}>Save {formatPrice(details.savings)} ({details.savingsPercentage.toFixed(1)}%)</span>
        )}
        <div className={styles.cardActions}>
          <Link href={detailHref} className={styles.detailsButton}>Details</Link>
          <TrackedExternalLink href={bundle.gumroadUrl} target="_blank" rel="noopener noreferrer" className={styles.buyButton} eventName="bundle_buy_clicked" eventParams={bundleEventParams(bundle, "bundle_catalog")}>
            Buy on Gumroad
          </TrackedExternalLink>
          {bundle.sampleUrl && (
            <TrackedExternalLink href={bundle.sampleUrl} target="_blank" rel="noopener noreferrer" className={styles.sampleButton} eventName="preview_opened" eventParams={bundleEventParams(bundle, "bundle_catalog")}>
              Free Sample
            </TrackedExternalLink>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function BundlesPage() {
  const [{ products: bundleProducts, error }, products] = await Promise.all([
    getBundleProductsResult(),
    getAllProducts()
  ]);
  const bundles = bundleProducts.filter((bundle) => (
    !bundle.deleted &&
    !bundle.hidden &&
    !bundle.unavailable &&
    !/(draft|archived|deleted|hidden|unavailable)/i.test(String(bundle.status || "published"))
  ));

  return (
    <PageEntrance variant="fadeUp" stagger>
      <AnalyticsPageView eventName="catalog_viewed" eventParams={{ catalog: "bundles" }} />
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
                <BundleCard bundle={bundle} details={getBundleDetails(bundle, products)} key={bundle.id} priority={index < 3} />
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
