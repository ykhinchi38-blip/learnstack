import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import styles from "./BundlesPage.module.css";

export const metadata = createMetadata({
  title: "Learning Bundles",
  description: "Explore LearnStack bundle offers for programming, web development, data science, interview prep, and complete student learning packs.",
  path: "/bundles"
});

const items = [
  ["Programming Starter Bundle", "A practical starting pack for students building confidence with coding fundamentals."],
  ["Web Development Bundle", "Focused handbooks for learning frontend, backend, and project-ready web skills."],
  ["Data Science Bundle", "Structured resources for Python, analysis, notebooks, and beginner-friendly data workflows."],
  ["Interview Prep Bundle", "Revision-friendly notes for core concepts, problem solving, and quick interview refreshers."],
  ["Complete LearnStack Bundle", "A wider study pack for learners who want multiple handbooks in one place."]
];

export default function BundlesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Learning Bundles", href: "/bundles" }])} />
      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">LearnStack</span>
          <h1 className="pageTitle">Save more with focused bundles.</h1>
          <p className="pageLead">Bundles help students buy a complete learning path instead of single isolated PDFs.</p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.mainCard}>
            <h2>Learning Bundles</h2>
            <p>Bundles help students buy a complete learning path instead of single isolated PDFs.</p>
            <Link href="/products" className="brutalButton">Browse Handbooks</Link>
          </div>
          <div className={styles.sideList}>
            {items.map(([item, copy]) => (
              <article key={item}>
                <span aria-hidden="true">&rarr;</span>
                <strong>{item}</strong>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
