import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { resources } from "@/data/resources";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import styles from "./ResourcesPage.module.css";

export const metadata = createMetadata({
  title: "LearnStack Free Learning Resources",
  description: "Helpful guides, study tips, kids learning ideas, AI productivity tips, and practical learning resources from LearnStack.",
  path: "/resources"
});

const resourceGroups = [
  {
    title: "For Students",
    id: "students",
    matcher: (resource) => ["Student Handbooks", "Roadmaps"].includes(resource.category)
  },
  {
    title: "Coding & Tech",
    id: "coding",
    matcher: (resource) => ["Coding Beginners", "Developer Tools", "Data Skills"].includes(resource.category)
  },
  {
    title: "AI & Productivity",
    id: "ai-tools",
    matcher: (resource) => ["AI & Productivity"].includes(resource.category)
  },
  {
    title: "Kids Learning",
    id: "kids",
    matcher: (resource) => ["LearnStack Kids", "Stories and Activities", "Kids Computer Science", "Emotional Learning", "Kids Confidence"].includes(resource.category)
  },
  {
    title: "Career & Life Skills",
    id: "career",
    matcher: (resource) => ["Life & Career", "Student Life", "Career Skills", "Communication Skills", "Side Hustles"].includes(resource.category)
  },
  {
    title: "Book Buying Guides",
    id: "buying-guides",
    matcher: (resource) => ["Free Samples"].includes(resource.category)
  }
];

const categoryChips = [
  ["All", "#resources-list"],
  ["Students", "#students"],
  ["Coding", "#coding"],
  ["AI Tools", "#ai-tools"],
  ["Kids", "#kids"],
  ["Career", "#career"],
  ["Parents", "#kids"]
];

export default function ResourcesPage() {
  return (
    <PageEntrance variant="resourceFade" stagger>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Resources", href: "/resources" }])} />

      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <div className="breadcrumbText"><Link href="/">Home</Link><span>-</span><span>Resources</span></div>
            <span className="pageEyebrow">LearnStack Resources</span>
            <h1>LearnStack Free Learning Resources</h1>
            <p>
              Helpful guides, study tips, kids learning ideas, and practical learning resources from LearnStack.
            </p>
            <p className={styles.heroIntro}>
              Explore beginner-friendly guides for students, developers, parents, and curious kids. These resources help you choose the right learning path before exploring LearnStack books and free samples.
            </p>
            <nav className={styles.chipNav} aria-label="Resource categories">
              {categoryChips.map(([label, href]) => (
                <a href={href} key={label}>{label}</a>
              ))}
            </nav>
          </div>
          <aside className={styles.heroCard}>
            <strong>{resources.length}</strong>
            <p>Helpful guides for LearnStack Handbooks and LearnStack Kids.</p>
          </aside>
        </div>
      </section>

      <section className={styles.section} id="resources-list">
        <div className={`container ${styles.groupStack}`}>
          {resourceGroups.map((group) => {
            const groupResources = resources.filter(group.matcher);

            if (!groupResources.length) return null;

            return (
              <div className={styles.group} id={group.id} key={group.title}>
                <h2>{group.title}</h2>
                <div className={styles.grid}>
                  {groupResources.map((resource) => (
                    <Link href={`/resources/${resource.slug}`} className={styles.card} key={resource.slug}>
                      <span>{resource.category}</span>
                      <h3>{resource.title}</h3>
                      <p>{resource.description}</p>
                      <div className={styles.meta}>
                        <small>{resource.audience}</small>
                        <small>{resource.readingTime}</small>
                      </div>
                      <strong className={styles.cardCta}>Read Guide</strong>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          <div className={styles.ctaGrid}>
            <Link href="/handbooks" className={styles.ctaBlock}>
              <span className="tag">Handbooks</span>
              <h2>Explore Handbooks</h2>
              <p>Browse practical LearnStack books for coding, tools, AI, data, and student learning.</p>
            </Link>
            <Link href="/kids/books" className={styles.ctaBlock}>
              <span className="tag">Kids Books</span>
              <h2>Explore Kids Books</h2>
              <p>Find colorful, value-based books for curious kids, parents, and teachers.</p>
            </Link>
            <Link href="/free-samples" className={styles.ctaBlock}>
              <span className="tag">Free Samples</span>
              <h2>View Free PDF Samples</h2>
              <p>Preview selected LearnStack books before buying.</p>
            </Link>
            <Link href="/life-career" className={styles.ctaBlock}>
              <span className="tag">Life & Career</span>
              <h2>Explore Life & Career Playbooks</h2>
              <p>Build practical skills for communication, confidence, college life, and career growth.</p>
            </Link>
          </div>
        </div>
      </section>
    </PageEntrance>
  );
}
