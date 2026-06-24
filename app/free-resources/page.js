import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import styles from "./FreeResourcesPage.module.css";

export const metadata = createMetadata({
  title: "Free Resources",
  description:
    "Download LearnStack sample chapters, quick references, and beginner-friendly learning PDFs before choosing a complete handbook.",
  path: "/free-resources"
});

const benefitCards = [
  {
    title: "Sample Before You Buy",
    body: "Preview the LearnStack learning style before choosing a complete handbook."
  },
  {
    title: "Quick Revision",
    body: "Use short references to revise important ideas without digging through scattered notes."
  },
  {
    title: "Beginner Friendly",
    body: "Start with clear, approachable resources made for learners who want a practical path."
  }
];

const includedItems = [
  "Sample chapter",
  "Clean explanations",
  "Practical examples",
  "Roadmap preview",
  "Handbook-style layout"
];

const sampleDownloads = [
  {
    title: "LearnStack Adult Handbook Sample",
    subtitle: "Preview our student and developer handbook style.",
    description:
      "Download a free sample of LearnStack's adult/student-focused handbook format, including code examples, revision pages, mistakes, interview notes, and learning structure.",
    href: "/downloads/LearnStack_Free_Sample_PDF_Adult_READY_TO_UPLOAD.pdf",
    button: "Download Adult Sample PDF",
    cover: "Adult Handbook Sample",
    bullets: ["Sample chapter", "Code example", "Common mistakes", "Interview-ready notes", "Revision plan"]
  },
  {
    title: "LearnStack Kids Free Sample",
    subtitle: "Preview colourful and beginner-friendly learning pages for kids.",
    description:
      "Download a free sample of LearnStack Kids with computer basics, coding logic, activities, worksheets, and creative practice pages.",
    href: "/downloads/LearnStack_Kids_Free_Sample_PDF_READY_TO_UPLOAD.pdf",
    button: "Download Kids Sample PDF",
    cover: "Kids Learning Sample",
    bullets: ["Computer basics", "Coding logic", "Fun activity", "Worksheet preview", "Parent-friendly format"]
  }
];

export default function FreeResourcesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Free Resources", href: "/free-resources" }])} />
      <main className={styles.freeResourcesPage}>
        <section className={styles.hero}>
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Free LearnStack Downloads</span>
              <h1>Start Learning with Free Resources</h1>
              <p>
                Download sample chapters, quick references, and beginner-friendly learning PDFs before choosing a
                complete LearnStack handbook.
              </p>
              <a href="#free-downloads" className={styles.primaryButton}>Browse Free Downloads</a>
            </div>

            <div className={styles.heroPreview} aria-hidden="true">
              <div className={styles.previewSheet}>
                <span>LearnStack</span>
                <strong>Free PDF</strong>
                <small>Sample chapter + roadmap preview</small>
              </div>
              <div className={styles.previewTab}>PDF</div>
            </div>
          </div>
        </section>

        <section className={styles.benefitsSection} aria-labelledby="why-free-heading">
          <div className={`container ${styles.sectionHeader}`}>
            <span className={styles.eyebrow}>Why Free Resources</span>
            <h2 id="why-free-heading">Try the structure before you commit.</h2>
          </div>
          <div className={`container ${styles.benefitGrid}`}>
            {benefitCards.map((card) => (
              <article className={styles.benefitCard} key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.featuredSection} id="free-downloads" aria-labelledby="featured-free-heading">
          <div className={`container ${styles.featuredGrid}`}>
            <div className={styles.featuredCopy}>
              <span className={styles.eyebrow}>Free LearnStack Samples</span>
              <h2 id="featured-free-heading">Download the sample that fits your learning path.</h2>
              <p>
                Start with a free PDF preview for adult handbooks or kids learning pages. Both samples show the
                LearnStack structure before you choose a complete resource.
              </p>
            </div>

            <div className={styles.sampleGrid}>
              {sampleDownloads.map((sample) => (
                <article className={styles.pdfCard} key={sample.title}>
                  <span className={styles.badge}>Free PDF</span>
                  <div className={styles.pdfCover} aria-hidden="true">
                    <strong>LearnStack</strong>
                    <span>{sample.cover}</span>
                  </div>
                  <div className={styles.pdfDetails}>
                    <h3>{sample.title}</h3>
                    <p className={styles.subtitle}>{sample.subtitle}</p>
                    <p>{sample.description}</p>
                    <ul className={styles.sampleList}>
                      {sample.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                    <a href={sample.href} className={styles.downloadButton} download>
                      {sample.button}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.includedSection} aria-labelledby="included-heading">
          <div className={`container ${styles.includedPanel}`}>
            <div>
              <span className={styles.eyebrow}>What You&apos;ll Get</span>
              <h2 id="included-heading">A small sample of the LearnStack format.</h2>
            </div>
            <div className={styles.includedGrid}>
              {includedItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className="container">
            <h2>Want the complete learning experience?</h2>
            <div className={styles.ctaActions}>
              <Link href="/products" className={styles.primaryButton}>Explore Handbooks</Link>
              <Link href="/kids" className={styles.secondaryButton}>Explore Kids Books</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
