import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import NewsletterForm from "@/components/NewsletterForm";
import { TrackedLink } from "@/components/TrackedLinks";
import PageEntrance from "@/components/PageEntrance";
import { breadcrumbJsonLd, createMetadata, faqJsonLd } from "@/lib/seo";
import styles from "./ForEducators.module.css";

export const metadata = createMetadata({
  title: "Learning Resources for Teachers, Tutors, and Classrooms",
  description: "Explore classroom learning resources, illustrated children's books, technical guides, printable activities, and structured materials for teachers and tutors.",
  path: "/for-educators",
  keywords: ["classroom learning resources", "printable children's activities", "educational children's books", "coding resources for teachers"]
});

const resourceTypes = [
  "Illustrated children's books",
  "Social-emotional learning stories",
  "Activity and coloring books",
  "Technical handbooks",
  "Coding resources",
  "Learning bundles",
  "Free samples"
];

const useCases = [
  "Classroom reading",
  "Small-group discussion",
  "Homeschool learning",
  "Tutoring sessions",
  "Coding clubs",
  "Library activities",
  "Revision resources",
  "Workshops"
];

const faqs = [
  ["Can I use the book in a classroom?", "A personal purchase provides a personal, non-transferable license. It does not automatically include copying, redistribution, or wider classroom use; request classroom or group-access terms first."],
  ["Can I print the PDF?", "The standard personal-use license does not grant copying or redistribution. For printed materials for a group, discuss the intended use and group-access terms with LearnStack first."],
  ["Are bulk options available?", "Schools, tutors, and organizations can request classroom, group, or bulk-use terms. Pricing depends on the resources and number of learners, so no fixed institutional price is published."],
  ["Can I see a sample first?", "Yes. Selected LearnStack products have free samples available before purchase. Only products with a verified preview are shown on the Free Samples page."],
  ["Can LearnStack provide a workshop?", "Workshop requests can be submitted through the partnership form and are reviewed individually based on the learners, resources, and proposed use."],
  ["Can a library or learning club use these resources?", "Libraries and learning clubs can request a library program or group-access discussion. Personal-use purchases do not automatically include redistribution rights."]
];

export default function ForEducatorsPage() {
  return (
    <PageEntrance variant="fadeUp" stagger>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "For Educators", href: "/for-educators" }])} />
      <JsonLd data={faqJsonLd(faqs.map(([q, a]) => ({ q, a })))} />

      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <span className="tag">For educators and organizations</span>
            <h1>Learning Resources for Teachers, Tutors, and Classrooms</h1>
            <p>Explore illustrated children&apos;s books, technical learning guides, printable activities, and structured resources for individual and group learning.</p>
            <div className={styles.actions}>
              <TrackedLink href="/partner-with-us?partnershipType=Educator%20Evaluation" className="brutalButton" eventName="educator_copy_requested" eventParams={{ cta_location: "educators_hero", partnership_type: "Educator Evaluation" }}>Request an Educator Evaluation Copy</TrackedLink>
              <Link href="/free-samples" className={styles.secondary}>Browse Free Samples</Link>
            </div>
          </div>
          <aside className={styles.heroCard}>
            <strong>Resource types</strong>
            {resourceTypes.slice(0, 4).map((item) => <span key={item}>{item}</span>)}
          </aside>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <span className="tag">Resource types</span>
          <h2 className={styles.sectionTitle}>Resources for practical educational use.</h2>
          <div className={styles.caseGrid}>
            {resourceTypes.map((item) => <article key={item}><h3>{item}</h3></article>)}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.noticeSection}`}>
        <div className={`container ${styles.notice}`}>
          <div>
            <span className="tag">Educator evaluation</span>
            <h2>Explore the resource before wider use.</h2>
            <p>Educators may request selected evaluation copies. Complimentary complete copies are reviewed individually, honest feedback is requested, and positive reviews are never required.</p>
          </div>
          <TrackedLink href="/partner-with-us?partnershipType=Educator%20Evaluation" className="brutalButton brutalButtonWhite" eventName="educator_copy_requested" eventParams={{ cta_location: "educator_evaluation_section", partnership_type: "Educator Evaluation" }}>Request an Educator Evaluation Copy</TrackedLink>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.accessGrid}`}>
          <div>
            <span className="tag">Bulk and group access</span>
            <h2>Plan access for the learners you support.</h2>
            <p>Personal-use purchases do not automatically include group redistribution rights. Schools and tutors can request classroom or group-access terms, and pricing depends on the resources and number of learners.</p>
          </div>
          <Link href="/partner-with-us?partnershipType=Classroom%20or%20group%20access" className="brutalButton">Discuss Classroom or Group Access</Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <span className="tag">Ways to use LearnStack</span>
          <div className={styles.caseGrid}>
            {useCases.map((item) => <article key={item}><h3>{item}</h3></article>)}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.faqSection}`}>
        <div className="container">
          <span className="tag">Educator FAQ</span>
          <div className={styles.faqGrid}>
            {faqs.map(([question, answer]) => <article key={question}><h2>{question}</h2><p>{answer}</p></article>)}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-label="Free activity resource signup">
        <div className="container">
          <NewsletterForm source="educators-page" defaultAudience="Parents and Educators" compact />
        </div>
      </section>
    </PageEntrance>
  );
}
