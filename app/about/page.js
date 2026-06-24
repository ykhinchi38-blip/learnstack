import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/Icon";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import styles from "./AboutPage.module.css";

export const metadata = createMetadata({
  title: "About LearnStack",
  description: "Learn about LearnStack, a student-focused brand creating premium educational PDF handbooks for CSE students and developers.",
  path: "/about"
});

export default function AboutPage() {
  const values = [
    ["Clarity", "We explain concepts in a way that students can revise and apply."],
    ["Practicality", "Every resource is made for projects, interviews, and real learning."],
    ["Trust", "The website, products, and support flow are built like a serious brand."]
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "About", href: "/about" }])} />
      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">About</span>
          <h1 className="pageTitle">LearnStack exists to make self-learning less messy.</h1>
          <p className="pageLead">
            LearnStack is a premium PDF handbook brand for CSE students, developers, and self-learners who want clear, structured, and practical learning material.
          </p>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={`container ${styles.storyGrid}`}>
          <div className={styles.storyBlock}>
            <span className="tag">Founder story</span>
            <h2>Built from the student problem.</h2>
            <p>
              LearnStack began with a simple student habit: turning messy topics into clear, structured notes that are easier to revise, remember, and apply.
            </p>
            <p>
              Today, LearnStack focuses on clean explanations, practical chapters, revision-friendly formatting, and instant PDF access through Gumroad so learners can spend less time searching and more time building.
            </p>
          </div>
          <div className={styles.brandBlock}>
            <strong>{site.tagline}</strong>
            <span>Premium PDF handbooks for serious learners.</span>
          </div>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <div className="container">
          <h2>Our values.</h2>
          <div className={styles.valuesGrid}>
            {values.map(([title, copy]) => (
              <article key={title} className={styles.valueCard}>
                <Icon name="shield" />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.roadmapSection}>
        <div className="container">
          <span className="tag">Coming soon</span>
          <h2>New learning resources are always in progress.</h2>
          <ul>
            {["Linux Commands Handbook", "ChatGPT Prompts Handbook", "AI Tools & Uses Guide", "C Language Handbook", "HTML & CSS Handbooks", "Machine Learning Roadmap"].map((item) => (
              <li key={item}><span>Coming Soon</span>{item}</li>
            ))}
          </ul>
          <Link href={site.gumroadStore} className="brutalButton" target="_blank">Follow on Gumroad</Link>
        </div>
      </section>
    </>
  );
}
