import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import FreeSampleActions from "@/components/FreeSampleActions";
import NewsletterForm from "@/components/NewsletterForm";
import PageEntrance from "@/components/PageEntrance";
import { getAllProducts } from "@/lib/gumroad";
import { formatPrice } from "@/lib/pricing";
import { getPublicSamples } from "@/lib/sampleMatching";
import { breadcrumbJsonLd, collectionPageJsonLd, createMetadata } from "@/lib/seo";
import styles from "../BrandTrustPage.module.css";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Free PDF Samples",
  description: "Preview selected LearnStack handbooks, educational children's books, and practical playbooks with free PDF samples before buying.",
  path: "/free-samples",
  keywords: ["free PDF book samples", "React handbook PDF sample", "educational children's book samples", "coding learning resources"]
});

const GROUPS = [
  { key: "technical", title: "Technical Handbooks" },
  { key: "kids", title: "Children's Books" },
  { key: "life-career", title: "Life and Career" },
  { key: "collections", title: "Bundles and Collections" }
];

function groupKey(sample) {
  if (sample.product?.isBundle || sample.category === "business-mba") return "collections";
  if (sample.category === "kids") return "kids";
  if (sample.category === "life-career") return "life-career";
  return "technical";
}

function categoryLabel(sample) {
  const labels = {
    technical: "Technical handbook",
    kids: "Children's book",
    "life-career": "Life and career",
    collections: "Bundle or collection"
  };

  return labels[groupKey(sample)];
}

function SampleCover({ sample }) {
  const image = sample.coverImage;

  if (!image) {
    return (
      <div className={styles.sampleCover} role="img" aria-label={`${sample.title} free PDF sample`}>
        <span>PDF</span>
      </div>
    );
  }

  return (
    <div className={styles.sampleCover}>
      <Image
        src={image}
        alt={`${sample.title} cover by LearnStack`}
        className={styles.sampleCoverImage}
        width={248}
        height={330}
        sizes="(max-width: 560px) 120px, 124px"
        unoptimized={String(image).startsWith("http")}
      />
    </div>
  );
}

function SampleCard({ sample }) {
  const product = sample.product;
  const pageLabel = sample.pageCount === 1 ? "1 sample page" : sample.pageCount ? `${sample.pageCount} sample pages` : "Sample PDF";
  const description = sample.description || "Free preview sample";

  return (
    <article className={styles.sampleCard}>
      <SampleCover sample={sample} />
      <div className={styles.sampleBody}>
        <h3>{sample.title}</h3>
        <p>{description}</p>
        <div className={styles.amazonMeta}>
          <span>{categoryLabel(sample)}</span>
          <span>{pageLabel}</span>
          {product.price ? <span>{formatPrice(product)}</span> : null}
        </div>
        <FreeSampleActions product={product} sampleUrl={sample.sampleUrl} previewImages={sample.previewImages} />
      </div>
    </article>
  );
}

function SampleGroup({ group, samples }) {
  if (!samples.length) return null;

  return (
    <section id={group.key} className={group.key === "kids" || group.key === "collections" ? styles.sectionAlt : styles.section}>
      <div className="container">
        <span className="tag">{group.title}</span>
        <p className={styles.lead}>
          Open a real sample PDF, then continue to the complete digital book when you are ready.
        </p>
        <div className={styles.sampleGrid}>
          {samples.map((sample) => (
            <SampleCard sample={sample} key={`${sample.sourceSlug}-${sample.product.id}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function FreeSamplesPage() {
  const products = await getAllProducts();
  const publicSamples = getPublicSamples(products);
  const groups = GROUPS.map((group) => ({
    ...group,
    samples: publicSamples.filter((sample) => groupKey(sample) === group.key)
  })).filter((group) => group.samples.length);

  return (
    <PageEntrance variant="staggerCards" stagger>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Free Samples", href: "/free-samples" }])} />
      <JsonLd data={collectionPageJsonLd({ name: "Free LearnStack PDF Samples", description: metadata.description, path: "/free-samples" })} />

      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Free Samples</span>
          <h1 className="pageTitle">Free PDF Samples</h1>
          <p className="pageLead">
            Preview selected pages before choosing the complete digital book.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.availabilityNote}>
            <h2>Explore before you buy</h2>
            <p>Every sample below is a real preview. Open it freely, then continue to the complete digital book when it is right for you.</p>
            <div className={styles.sampleLinks}>
              <a href="#technical">Technical Handbooks</a>
              <a href="#kids">Children&apos;s Books</a>
              <a href="#life-career">Life and Career</a>
              <a href="#collections">Bundles and Collections</a>
            </div>
          </div>
        </div>
      </section>

      {groups.length ? groups.map((group) => (
        <SampleGroup group={group} samples={group.samples} key={group.key} />
      )) : (
        <section className={styles.section}>
          <div className="container">
            <div className={styles.bottomNote}>
              <p>Samples are shown here only when a preview is ready. Browse the catalog to explore the currently available books.</p>
              <div className={styles.sampleLinks}><Link href="/products">Browse Handbooks</Link><Link href="/kids">Browse Kids Books</Link></div>
            </div>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className="container">
          <div className={styles.bottomNote}>
            <p>Full books are delivered after purchase through our official checkout.</p>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-label="Free LearnStack resource signup">
        <div className="container">
          <NewsletterForm source="free-samples" compact />
        </div>
      </section>
    </PageEntrance>
  );
}
