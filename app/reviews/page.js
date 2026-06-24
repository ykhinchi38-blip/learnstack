import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import styles from "./ReviewsPage.module.css";

export const metadata = createMetadata({
  title: "Student Reviews",
  description: "Read how LearnStack collects student feedback and improves its practical PDF handbooks.",
  path: "/reviews"
});

const reviewSignals = [
  ["Clarity", "Students look for notes that are easier to revise before projects, exams, and interviews."],
  ["Structure", "Every handbook is shaped around focused topics, examples, and readable sections."],
  ["Usefulness", "Feedback helps LearnStack improve explanations, previews, and future handbook updates."]
];

export default function ReviewsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Student Reviews", href: "/reviews" }])} />

      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Student feedback</span>
          <h1 className="pageTitle">Real feedback shapes every LearnStack handbook.</h1>
          <p className="pageLead">
            This page is reserved for verified student feedback, product notes, and improvement updates as the
            LearnStack catalog grows.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.mainCard}>
            <span className="tag">Reviews</span>
            <h2>Verified reviews are coming soon.</h2>
            <p>
              LearnStack only publishes honest, verified feedback. As more learners use the handbooks, this page will highlight useful,
              verified feedback and product improvement notes.
            </p>
            <div className={styles.actions}>
              <Link href="/products" className="brutalButton">Explore Handbooks</Link>
              <Link href="/contact" className={styles.secondaryButton}>Share Feedback</Link>
            </div>
          </div>

          <div className={styles.signalGrid}>
            {reviewSignals.map(([title, copy]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
