import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { getAllProducts } from "@/lib/gumroad";
import { productDetailHref } from "@/lib/productRouting";
import { getPublicSamples } from "@/lib/sampleMatching";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import styles from "../BrandTrustPage.module.css";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Free PDF Samples",
  description: "Preview selected LearnStack books before buying with free PDF samples for handbooks, kids books, and practical learning playbooks.",
  path: "/free-samples"
});

const GROUPS = [
  { key: "handbooks", title: "Student Handbooks" },
  { key: "kids", title: "Kids Books" },
  { key: "life-career", title: "Life & Career Playbooks" },
  { key: "business-mba", title: "Business & MBA" },
  { key: "other", title: "Other" }
];

function categoryLabel(category) {
  if (category === "handbooks") return "Student Handbook";
  if (category === "kids") return "Kids Book";
  if (category === "life-career") return "Life & Career";
  if (category === "business-mba") return "Business & MBA";
  return "Other";
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
  const pageLabel = sample.pageCount === 1 ? "1 preview page" : `${sample.pageCount || "Free"} preview pages`;
  const description = sample.description || "Free preview sample";

  return (
    <article className={styles.sampleCard}>
      <SampleCover sample={sample} />
      <div className={styles.sampleBody}>
        <h3>{sample.title}</h3>
        <p>{description}</p>
        <div className={styles.amazonMeta}>
          <span>{categoryLabel(sample.category)}</span>
          <span>{pageLabel}</span>
        </div>
        <div className={styles.sampleActions}>
          <a className={styles.miniButton} href={sample.sampleUrl} target="_blank" rel="noopener noreferrer">
            View Free Sample
          </a>
          <Link className={styles.miniButton} href={productDetailHref(product)}>
            View Full Book
          </Link>
        </div>
      </div>
    </article>
  );
}

function SampleGroup({ group, samples }) {
  if (!samples.length) return null;

  return (
    <section className={group.key === "kids" || group.key === "business-mba" ? styles.sectionAlt : styles.section}>
      <div className="container">
        <span className="tag">{group.title}</span>
        <p className={styles.lead}>
          Explore free PDF previews.
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
    samples: publicSamples.filter((sample) => sample.category === group.key)
  })).filter((group) => group.samples.length);

  return (
    <PageEntrance variant="staggerCards" stagger>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Free Samples", href: "/free-samples" }])} />

      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Free Samples</span>
          <h1 className="pageTitle">Free PDF Samples</h1>
          <p className="pageLead">
            Preview selected LearnStack books before buying.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.availabilityNote}>
            <h2>Explore before you buy</h2>
            <p>Explore free previews from LearnStack handbooks, kids books, and practical learning playbooks.</p>
            <div className={styles.sampleLinks}>
              <Link href="/products">Student Handbooks</Link>
              <Link href="/kids">Kids Books</Link>
              <Link href="/life-career">Life & Career</Link>
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
              <p>Free samples are being added. Please check again soon.</p>
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
    </PageEntrance>
  );
}
