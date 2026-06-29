import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import SuggestBookForm from "@/components/SuggestBookForm";
import { brand } from "@/data/brand";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import styles from "../BrandTrustPage.module.css";

export const metadata = createMetadata({
  title: "Suggest a Book",
  description: "Suggest a new LearnStack handbook, kids book, activity book, or learning theme.",
  path: "/suggest-a-book"
});

const suggestionMail = `mailto:${brand.contactEmail}?subject=New%20LearnStack%20Book%20Suggestion&body=Suggested%20book%20topic:%0AWho%20should%20this%20book%20help:%0AWhat%20problem%20should%20this%20book%20solve:%0AMessage:%0A`;

export default function SuggestBookPage() {
  return (
    <PageEntrance variant="fadeScale" stagger>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Suggest a Book", href: "/suggest-a-book" }])} />

      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Suggest a Book</span>
          <h1 className="pageTitle">Tell us what LearnStack should make next.</h1>
          <p className="pageLead">
            Share a handbook topic, kids book idea, activity book, or learning theme that would help students, parents, teachers, or young learners.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.gridTwo}`}>
          <article className={styles.highlight}>
            <h2>Help us decide what to make next.</h2>
            <p>
              Students, parents, teachers, and readers can suggest new LearnStack books and free resources. If a reader's idea strongly inspires a future LearnStack book, we may credit them in that book with permission.
            </p>
            <p>
              You can also email your suggestion directly to <a href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a>.
            </p>
          </article>
          <SuggestBookForm />
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={`container ${styles.highlight}`}>
          <h2>Prefer buyer support?</h2>
          <p>For download, payment, or Gumroad order questions, use the help page instead so support details stay clear.</p>
          <div className={styles.actions}>
            <Link className="brutalButton brutalButtonWhite" href="/help">Go to Help</Link>
            <a className="brutalButton" href={suggestionMail}>Open Email Instead</a>
          </div>
        </div>
      </section>
    </PageEntrance>
  );
}
