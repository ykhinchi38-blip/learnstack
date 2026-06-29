import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { brand, bookMakingProcess } from "@/data/brand";
import { breadcrumbJsonLd, createMetadata, personJsonLd } from "@/lib/seo";
import styles from "../BrandTrustPage.module.css";

export const metadata = createMetadata({
  title: "About LearnStack",
  description: "LearnStack creates visual, practical handbooks, Life & Career Playbooks, and warm learning books for kids. Learn about the brand, founder Yogesh Khinchi, sample status, and support.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <PageEntrance variant="slideSoft" stagger>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "About", href: "/about" }])} />
      <JsonLd data={personJsonLd()} />

      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">About LearnStack</span>
          <h1 className="pageTitle">Practical books for students. Warm books for kids.</h1>
          <p className="pageLead">
            LearnStack creates digital PDF handbooks, Life & Career Playbooks, kids learning books, and helpful resources for learners who want clear, simple, and useful explanations.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.gridTwo}`}>
          <article className={styles.highlight}>
            <h2>What LearnStack is</h2>
            <p>
              LearnStack is a founder-led learning brand with three clear branches: practical handbooks for students and developers, Life & Career Playbooks for personal growth, and warm learning books for kids and families.
            </p>
            <p>
              The goal is to make learning easier to start, easier to understand, and easier to continue through focused, visual, easy-to-follow books.
            </p>
          </article>
          <figure className={`${styles.card} ${styles.imageCard}`}>
            <Image
              src="/images/founder/yogesh-khinchi-visionary.png"
              alt={`${brand.founder}, founder of LearnStack`}
              width={720}
              height={720}
              priority
            />
            <h2>Founder</h2>
            <p>{brand.founder}, {brand.founderTitle}, started LearnStack from the habit of making clear notes and turning learning into practical resources.</p>
          </figure>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={`container ${styles.gridTwo}`}>
          <article className={styles.highlight}>
            <h2>LearnStack Handbooks</h2>
            <p>Premium, practical PDF handbooks for coding, placements, developer tools, productivity, projects, and professional skills.</p>
            <Link className="brutalButton" href="/products">Browse Handbooks</Link>
          </article>
          <article className={styles.highlight}>
            <h2>LearnStack Kids</h2>
            <p>Warm, colorful, parent-friendly books for curiosity, moral stories, computer basics, early coding, emotions, culture, and safe learning.</p>
            <Link className="brutalButton" href="/kids">Browse Kids Books</Link>
          </article>
          <article className={styles.highlight}>
            <h2>Life & Career Playbooks</h2>
            <p>Practical books for communication, confidence, college life, personal branding, presentation skills, side hustles, independence, and professional manners.</p>
            <Link className="brutalButton" href="/life-career">Browse Playbooks</Link>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.gridThree}`}>
          <article className={styles.card}>
            <h2>How books are made</h2>
            <p>{bookMakingProcess.join(" -> ")}. LearnStack books are shaped around clear topic order, simple language, practical examples, visual design, and buyer questions that should be answered before checkout.</p>
          </article>
          <article className={styles.card}>
            <h2>Sample previews</h2>
            <p>Free previews are available for selected books, with new samples added regularly.</p>
          </article>
          <article className={styles.card}>
            <h2>Contact and support</h2>
            <p>For order or download help, email {brand.contactEmail} with your Gumroad order email and product name. {brand.supportResponseTime}</p>
          </article>
        </div>
      </section>
    </PageEntrance>
  );
}
