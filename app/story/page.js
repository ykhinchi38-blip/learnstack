import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import styles from "./StoryPage.module.css";

const founderName = "Yogesh Khinchi";

const founderStorySections = [
  {
    title: "A Habit That Started Early",
    paragraphs: [
      "From childhood, our founder has always loved studying by making notes. In fact, he could only truly understand a subject when he created notes for it. He was never comfortable studying without notes.",
      "These were not ordinary notes. He always kept a proper set of colored pens and used them carefully while studying. In class, while the teacher explained lessons, he would write down the important points neatly and organize them using color-coded notes. Since childhood, note-making has been one of his greatest habits and passions."
    ]
  },
  {
    title: "Why Good Notes Matter",
    paragraphs: [
      "His notes were so well-made that anyone who saw them could not resist asking for them. Good notes can help students tremendously in their studies. The human mind often remembers color patterns and structured visual information better than plain black-and-blue writing. This made his notes even more effective and useful.",
      "When he got admission into a good engineering college, his friends and classmates encouraged him to share his notes with more students. That support became the foundation of LearnStack."
    ]
  },
  {
    title: "What Makes LearnStack Different",
    paragraphs: [
      "What makes LearnStack different is that the notes are not just lengthy - they are focused, practical, and filled only with what truly matters. Anyone can use them anytime, anywhere. Every PDF goes through careful checking and is reviewed by 4-5 experts before it is released. Each handbook is inspected closely to ensure the content is complete, clear, and useful. If anything important is missing, the process is repeated until the quality is right.",
      "That is why LearnStack notes are structured and reliable. There may still be occasional graphic or visual errors because we are still growing, but our focus on content quality remains strong."
    ]
  },
  {
    title: "The Bigger Goal",
    paragraphs: [
      "In the near future, LearnStack will expand beyond PDFs and offer properly published physical books as well. Our founder's goal is to make LearnStack one of India's best handbook and notes companies.",
      "This is only the beginning. Many exciting offers and improvements are on the way. For the next 4-5 months, all PDFs will remain available at the same affordable price. Later, these same resources may range between Rs.499 and Rs.799 as the content becomes even more detailed and additional bonuses and gifts are added."
    ]
  },
  {
    title: "Stay Connected",
    paragraphs: [
      "So stay connected with us - the best is yet to come."
    ]
  }
];

export const metadata = createMetadata({
  title: "Our Story | Why LearnStack Was Created",
  description:
    "Read the story behind LearnStack and how practical, student-friendly notes became digital handbooks for learners, developers, and kids.",
  path: "/story"
});

function BookOpeningAnimation() {
  return (
    <div className={styles.bookStage} aria-hidden="true">
      <div className={styles.bookStack}>
        <span className={`${styles.stackBook} ${styles.stackBookOne}`} />
        <span className={`${styles.stackBook} ${styles.stackBookTwo}`} />
        <span className={`${styles.stackBook} ${styles.stackBookThree}`} />

        <div className={styles.openBook}>
          <span className={`${styles.bookPage} ${styles.leftPage}`}>
            <span />
            <span />
            <span />
          </span>
          <span className={`${styles.bookPage} ${styles.rightPage}`}>
            <span />
            <span />
            <span />
          </span>
          <span className={styles.bookSpine} />
          <span className={styles.bookBrand}>LearnStack</span>
        </div>
      </div>
    </div>
  );
}

export default function StoryPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Our Story", href: "/story" }])} />
      <div className={styles.storyPage}>
        <section className={styles.hero} aria-labelledby="story-heading">
          <div className={`container ${styles.heroGrid}`}>
            <BookOpeningAnimation />

            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Our Story</span>
              <h1 id="story-heading">The Story Behind LearnStack</h1>
              <p>Built to help students learn, build, and grow with practical digital handbooks.</p>
            </div>
          </div>
        </section>

        <section className={styles.realStorySection} aria-labelledby="real-story-heading">
          <div className={`container ${styles.realStoryGrid}`}>
            <figure className={styles.founderCard} aria-label={`${founderName}, founder of LearnStack`}>
              <Image
                src="/images/founder/yogesh-khinchi-story.png"
                alt={`${founderName}, founder of LearnStack`}
                width={1152}
                height={1536}
                className={styles.founderImage}
              />
              <figcaption className={styles.founderCaption}>
                <strong>{founderName}</strong>
                <span>Founder of LearnStack</span>
              </figcaption>
            </figure>

            <div className={styles.realStoryCard}>
              <span className={styles.eyebrow}>Founder Story</span>
              <h2 id="real-story-heading">The Story Behind LearnStack</h2>
              <div className={styles.storyBlocks}>
                {founderStorySections.map((section) => (
                  <article className={styles.storyBlock} key={section.title}>
                    <h3>{section.title}</h3>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.missionSection} aria-labelledby="mission-heading">
          <div className={`container ${styles.missionCard}`}>
            <span className={styles.eyebrow}>Our Mission</span>
            <h2 id="mission-heading">Learn. Build. Grow.</h2>
            <p>
              LearnStack helps learners move from confusion to confidence with resources that are organized like notes,
              practical like projects, and clear enough to return to whenever revision matters.
            </p>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className="container">
            <h2>Start with the resource that fits your next step.</h2>
            <div className={styles.ctaActions}>
              <Link href="/products" className={styles.primaryButton}>Explore Handbooks</Link>
              <Link href="/kids" className={styles.secondaryButton}>Explore Kids Books</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
