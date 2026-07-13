import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import ProductCatalog from "@/components/ProductCatalog";
import AnalyticsPageView from "@/components/AnalyticsPageView";
import { getLifeCareerProductsResult } from "@/lib/gumroad";
import { breadcrumbJsonLd, collectionPageJsonLd, createMetadata } from "@/lib/seo";
import styles from "./LifeCareerPage.module.css";

export const revalidate = 300;

const pageDescription =
  "Practical LearnStack books for communication, confidence, college life, personal growth, side hustles, presentation skills, independence, and professional manners.";

export const metadata = createMetadata({
  title: "Life & Career Playbooks",
  description:
    "Explore LearnStack Life & Career Playbooks for communication, confidence, student life, personal growth, side hustles, presentation skills, independence, and professional manners.",
  path: "/life-career"
});

const focusAreas = [
  "Communication",
  "Confidence",
  "College life",
  "Personal branding",
  "Presentation skills",
  "Side hustles",
  "Independence",
  "Professional manners"
];

export default async function LifeCareerPage() {
  const { products, error } = await getLifeCareerProductsResult();

  return (
    <PageEntrance variant="fadeUp" stagger>
      <AnalyticsPageView eventName="catalog_viewed" eventParams={{ catalog: "life-career" }} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Life & Career Playbooks", href: "/life-career" }])} />
      <JsonLd data={collectionPageJsonLd({
        name: "Life & Career Playbooks",
        description: metadata.description,
        path: "/life-career"
      })} />

      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <div className="breadcrumbText"><Link href="/">Home</Link><span>-</span><span>Life & Career</span></div>
            <span className="pageEyebrow">LearnStack Playbooks</span>
            <h1>Life & Career Playbooks</h1>
            <p>{pageDescription}</p>
            <a href="#life-career-books" className="brutalButton">Browse Life & Career Books</a>
          </div>
          <aside className={styles.heroPanel} aria-label="Life and career focus areas">
            {focusAreas.slice(0, 6).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </aside>
        </div>
      </section>

      <section className={styles.introSection}>
        <div className={`container ${styles.introGrid}`}>
          <article>
            <span className="tag">Built for real life</span>
            <h2>Practical guidance for the parts of growth that are rarely taught clearly.</h2>
          </article>
          <p>
            These playbooks are for students, young adults, early professionals, and self-learners who want clearer ways to communicate, present, make decisions, build confidence, and handle life transitions.
          </p>
        </div>
      </section>

      <section id="life-career-books" className={styles.catalogSection}>
        <div className="container">
          {error ? (
            <div className={styles.emptyState}>
              <h2>Unable to load Life & Career Playbooks right now.</h2>
              <p>Please try again later.</p>
            </div>
          ) : products.length > 0 ? (
            <ProductCatalog
              products={products}
              searchLabel="Search playbooks"
              searchPlaceholder="Search communication, career, clarity..."
              countLabel="playbooks"
              buyLabel="Buy on Gumroad"
            />
          ) : (
            <div className={styles.emptyState}>
              <h2>Life & Career Playbooks will appear here as soon as they are added on Gumroad.</h2>
              <p>Use the Gumroad keyword <strong>learnstacklife</strong> on Life & Career products so LearnStack can place them here automatically.</p>
            </div>
          )}
        </div>
      </section>

      <section className={styles.suggestSection}>
        <div className={`container ${styles.suggestBox}`}>
          <div>
            <span className="tag">Suggest a Playbook</span>
            <h2>Want a playbook on a life or career topic?</h2>
            <p>
              Students, young professionals, and readers can suggest new LearnStack Life & Career books on communication, confidence, college life, side hustles, relationships, independence, and professional skills.
            </p>
          </div>
          <Link href="/suggest-a-book" className="brutalButton brutalButtonWhite">Suggest a Playbook</Link>
        </div>
      </section>
    </PageEntrance>
  );
}
