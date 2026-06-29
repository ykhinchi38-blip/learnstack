import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { brand } from "@/data/brand";
import { breadcrumbJsonLd, createMetadata, faqJsonLd } from "@/lib/seo";
import styles from "../BrandTrustPage.module.css";

const faqs = [
  { q: "Why choose LearnStack?", a: "LearnStack focuses on important points, clear structure, visual design, examples, activities, and honest buyer information before checkout." },
  { q: "What makes the books different?", a: "We do not make boring books. LearnStack books are designed to feel less like boring textbooks and more like guided learning experiences." },
  { q: "Are they beginner-friendly?", a: "Student handbooks are practical and beginner-friendly. Kids books are warm, safe, story-based, and parent-friendly." },
  { q: "How does LearnStack use visuals?", a: "Color, structure, examples, and visual hierarchy help readers understand and remember concepts faster." },
  { q: "What can buyers preview?", a: "Selected Gumroad products include free public sample PDFs, so buyers can inspect the LearnStack style before purchase." },
  { q: "How do I get the PDF?", a: "Digital PDF delivery is simple through Gumroad email after purchase." },
  { q: "What is the brand promise?", a: `${brand.name} aims to make learning easier to start, easier to understand, and easier to continue.` }
];

export const metadata = createMetadata({
  title: "Why LearnStack",
  description: "Why choose LearnStack for visual, practical, easy-to-follow student handbooks and warm LearnStack Kids books with honest buyer support.",
  path: "/why-learnstack"
});

export default function WhyLearnStackPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Why LearnStack", href: "/why-learnstack" }])} />
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Why LearnStack</span>
          <h1 className="pageTitle">A learning brand built around clarity, visuals, and trust.</h1>
          <p className="pageLead">
            LearnStack helps students, beginners, parents, teachers, and children choose useful learning books without guessing what is inside.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.gridThree}`}>
          <article className={styles.card}>
            <h2>Clear before clever</h2>
            <p>Books are written to make the first step easier, not to impress readers with unnecessary complexity.</p>
          </article>
          <article className={styles.card}>
            <h2>Not boring books</h2>
            <p>LearnStack uses color, visual hierarchy, structure, examples, and activities because clear design helps the mind learn faster.</p>
          </article>
          <article className={styles.card}>
            <h2>Two equal paths</h2>
            <p>LearnStack Handbooks support students and developers. LearnStack Kids supports children, parents, and teachers.</p>
          </article>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={`container ${styles.gridTwo}`}>
          {faqs.map((faq) => (
            <article className={styles.card} key={faq.q}>
              <h2>{faq.q}</h2>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.highlight}`}>
          <h2>Start with the clearest next step.</h2>
          <p>Read resources, browse the right catalog, or open free samples before choosing a LearnStack book. Support is available at {brand.contactEmail}.</p>
          <div className={styles.actions}>
            <Link className="brutalButton" href="/free-samples">Free PDF Samples</Link>
            <Link className="brutalButton brutalButtonWhite" href="/resources">Read resources</Link>
          </div>
        </div>
      </section>
    </>
  );
}
