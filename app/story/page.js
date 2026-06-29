import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { brand } from "@/data/brand";
import { breadcrumbJsonLd, createMetadata, personJsonLd } from "@/lib/seo";
import StoryBookAnimation from "./StoryBookAnimation";
import styles from "./StoryPage.module.css";

export const metadata = createMetadata({
  title: "Our Story | Yogesh Khinchi and LearnStack",
  description: "Read the founder-led story behind LearnStack, built from clear notes, practical learning, visual handbooks, and warm kids books.",
  path: "/story"
});

const storyChapters = [
  {
    eyebrow: "Chapter 01",
    title: "The habit started with notes.",
    body:
      "From childhood, Yogesh loved learning through handwritten notes. He did not study by randomly reading pages. He understood a subject best when he turned it into organized notes with headings, key points, colors, and structure. For him, notes were not just revision material - they were the way learning became clear.",
    image: "/story/childhood-notes.png",
    imageAlt: "A student writing organized colorful notes in a classroom",
    reverse: false
  },
  {
    eyebrow: "Chapter 02",
    title: "Color made learning easier.",
    body:
      "His notes were never plain black-and-blue pages. He used color pens, spacing, highlights, diagrams, and visual patterns to separate important ideas. A good note does more than store information. It guides the mind. Clear structure and color can make concepts easier to understand, revise, and remember.",
    image: "/story/colorful-notes-desk.png",
    imageAlt: "A desk with colorful organized notes, pens, sticky notes, and diagrams",
    reverse: true
  },
  {
    eyebrow: "Chapter 03",
    title: "Friends saw the value.",
    body:
      "When Yogesh entered engineering college, his friends and classmates noticed the way his notes simplified difficult topics. Many wanted to use them because the notes were clear, practical, and easy to revise. Their encouragement became the foundation of LearnStack - a place where structured learning could help more students beyond one classroom.",
    image: "/story/friends-encouragement.png",
    imageAlt: "Students gathered around a notebook and discussing clear study notes",
    reverse: false
  },
  {
    eyebrow: "Chapter 04",
    title: "From notes to digital books.",
    body:
      "LearnStack was created to turn clear notes, practical explanations, and visual learning into useful digital books. The goal is not to make long, boring PDFs filled with unnecessary content. LearnStack focuses on important points, examples, structure, visuals, and activities that help readers actually understand and continue learning.",
    image: "/story/book-making-process.png",
    imageAlt: "A visual book-making process from research and writing to design, review, and publishing",
    reverse: true
  },
  {
    eyebrow: "Chapter 05",
    title: "Why LearnStack Kids began.",
    body:
      "LearnStack later expanded into kids books after noticing a gap in children's learning content. Many kids books are entertaining, but not all of them help children learn values, emotions, curiosity, family connection, or real-life understanding in a balanced way. LearnStack Kids combines stories, imagination, activities, emotions, culture, and meaningful life lessons.",
    image: "/story/kids-vision.png",
    imageAlt: "Children and a parent reading colorful LearnStack Kids books together",
    reverse: false
  }
];

const processSteps = ["Research", "Write", "Design", "Review", "Publish"];

const philosophyCards = [
  ["Clear structure", "Important ideas are arranged in a way that is easier to follow and revise."],
  ["Visual learning", "Colors, spacing, diagrams, and layouts help the mind connect ideas faster."],
  ["Practical reading experience", "Books are made to be useful, readable, and easier to continue."]
];

function publicImageExists(src) {
  if (!src?.startsWith("/")) return false;
  return fs.existsSync(path.join(process.cwd(), "public", src.slice(1)));
}

function StoryImage({ src, alt, title }) {
  if (!publicImageExists(src)) {
    return (
      <div className={styles.imageFallback} role="img" aria-label={`${title} image placeholder`}>
        <span>{title}</span>
        <small>Image coming soon</small>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={900}
      sizes="(max-width: 720px) calc(100vw - 48px), (max-width: 1100px) 44vw, 500px"
      loading="lazy"
      className={styles.chapterImage}
    />
  );
}

function StoryChapter({ eyebrow, title, body, image, imageAlt, reverse }) {
  return (
    <article className={`${styles.chapter} ${reverse ? styles.reverseChapter : ""}`}>
      <div className={styles.chapterText}>
        <span className={styles.chapterEyebrow}>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <figure className={styles.chapterFigure}>
        <StoryImage src={image} alt={imageAlt} title={title} />
      </figure>
    </article>
  );
}

export default function StoryPage() {
  return (
    <PageEntrance variant="revealHero" className={styles.storyPage}>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Our Story", href: "/story" }])} />
      <JsonLd data={personJsonLd()} />

      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <StoryBookAnimation />
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Our Story</span>
            <h1>Built from the habit of making learning clearer.</h1>
            <p>
              LearnStack started from a simple habit: turning confusing topics into clearer notes, and turning that clarity into books.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/products">Explore Handbooks</Link>
              <Link className={styles.secondaryButton} href="/kids">Explore Kids Books</Link>
              <Link className={styles.secondaryButton} href="/suggest-a-book">Suggest a Book</Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.founderSection}>
        <div className={`container ${styles.founderGrid}`}>
          <figure className={styles.founderCard}>
            <Image
              src="/images/founder/yogesh-khinchi-story.png"
              alt={`${brand.founder}, founder of LearnStack`}
              width={720}
              height={960}
              priority
              sizes="(max-width: 720px) 86vw, 440px"
              className={styles.founderImage}
            />
            <figcaption>
              <strong>{brand.founder}</strong>
              <span>{brand.founderTitle}</span>
            </figcaption>
          </figure>
          <article className={styles.founderStoryCard}>
            <span className={styles.eyebrow}>Meet the Founder</span>
            <h2>Yogesh Khinchi, Founder of LearnStack</h2>
            <p>
              LearnStack was built by Yogesh Khinchi from a simple personal habit: making learning clearer through notes. From childhood, he enjoyed studying by breaking topics into clean points, writing them properly, highlighting important ideas, and turning confusing lessons into something easier to revise.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.chapterSection}>
        <div className="container">
          <div className={styles.sectionIntro}>
            <span className={styles.eyebrow}>From notes to LearnStack</span>
            <h2>A founder story shaped by clarity, color, and useful books.</h2>
          </div>
          <div className={styles.chapterStack}>
            {storyChapters.map((chapter) => (
              <StoryChapter key={chapter.title} {...chapter} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.processSection}>
        <div className="container">
          <div className={styles.sectionIntro}>
            <span className={styles.eyebrow}>Book making process</span>
            <h2>How LearnStack books are made</h2>
            <p>Every LearnStack book follows a careful process so the final resource feels clear, useful, and enjoyable.</p>
          </div>
          <div className={styles.timeline}>
            {processSteps.map((step, index) => (
              <article className={styles.timelineStep} key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.philosophySection}>
        <div className="container">
          <div className={styles.philosophyHeader}>
            <span className={styles.eyebrow}>Brand philosophy</span>
            <h2>We do not make boring books.</h2>
            <p>
              LearnStack books are designed to feel less like boring textbooks and more like guided learning experiences. We focus on useful points, clean structure, visual hierarchy, examples, colors, and activities because learning becomes easier when information is clear and engaging.
            </p>
          </div>
          <div className={styles.philosophyCards}>
            {philosophyCards.map(([title, copy]) => (
              <article className={styles.philosophyCard} key={title}>
                <span aria-hidden="true" />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.futureSection}>
        <div className={`container ${styles.futureCard}`}>
          <span className={styles.eyebrow}>Future vision</span>
          <h2>The journey is just starting.</h2>
          <p>
            LearnStack is growing toward a future of better digital books, physical editions, paperback releases, student handbooks, kids learning books, and free resources. The aim is to build a trusted learning book brand for students, parents, children, and self-learners.
          </p>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaCard}`}>
          <span className={styles.eyebrow}>Suggest the next idea</span>
          <h2>Help us decide what to make next.</h2>
          <p>
            Students, parents, teachers, and readers can suggest new LearnStack books and free resources. If a reader's idea strongly inspires a future LearnStack book, we may credit them in that book with permission.
          </p>
          <Link className={styles.primaryButton} href="/suggest-a-book">Suggest a Book</Link>
        </div>
      </section>
    </PageEntrance>
  );
}
