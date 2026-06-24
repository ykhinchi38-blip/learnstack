import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import styles from "./LearningPathsPage.module.css";

export const metadata = createMetadata({
  title: "Learning Paths",
  description: "Follow structured LearnStack learning paths for programming, data science, web development, AI tools, and interview preparation.",
  path: "/learning-paths"
});

const items = [
  ["Programming Path", "Start with fundamentals, then move into practical projects and revision."],
  ["Web Developer Path", "Build a steady route through HTML, CSS, JavaScript, APIs, and project work."],
  ["Data Science Path", "Learn Python-based analysis, notebooks, and beginner-friendly data workflows."],
  ["Interview Prep Path", "Use focused notes to revise key concepts before applications and interviews."]
];

export default function LearningPathsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Learning Paths", href: "/learning-paths" }])} />
      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">LearnStack</span>
          <h1 className="pageTitle">Follow a path, not random content.</h1>
          <p className="pageLead">Learning paths show which handbooks to read first and what to build after each stage.</p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.mainCard}>
            <h2>Learning Paths</h2>
            <p>Learning paths show which handbooks to read first and what to build after each stage.</p>
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
