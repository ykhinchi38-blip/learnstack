import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import AnalyticsPageView from "@/components/AnalyticsPageView";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { getKidsProductsResult } from "@/lib/gumroad";
import { getFeaturedKidsProducts } from "@/lib/productCollections";
import { breadcrumbJsonLd, collectionPageJsonLd, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import styles from "./KidsPage.module.css";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Educational Children's Books, Stories & Activities",
  description:
    "Explore educational children's books, social-emotional learning stories, coding resources, and printable activities for young learners, parents, and teachers.",
  path: "/kids",
  keywords: ["educational children's books", "social-emotional learning stories", "printable children's activities", "kids coding books"]
});

const whyItems = [
  {
    title: "Easy Explanations",
    copy: "Simple language, clear examples, and small learning steps for young beginners.",
    tone: "sun"
  },
  {
    title: "Colourful Pages",
    copy: "Bright layouts and friendly visuals help kids stay interested while learning.",
    tone: "sky"
  },
  {
    title: "Fun Activities",
    copy: "Practice blocks, puzzles, and project prompts turn concepts into action.",
    tone: "mint"
  },
  {
    title: "Parent-Friendly Learning",
    copy: "Parents can guide each lesson without needing advanced coding knowledge.",
    tone: "peach"
  },
  {
    title: "Beginner Safe",
    copy: "Gentle introductions to computers, coding, internet safety, and digital habits.",
    tone: "lavender"
  },
  {
    title: "Instant PDF Access",
    copy: "Secure Gumroad checkout with quick digital delivery after purchase.",
    tone: "pink"
  }
];

const learnItems = [
  ["Computer Basics", "Devices, files, folders, keyboard use, and healthy digital habits."],
  ["Coding Logic", "Patterns, instructions, conditions, loops, and step-by-step thinking."],
  ["Scratch Projects", "Game ideas, animations, scenes, sprites, and creative project planning."],
  ["Python Stories", "Story-based beginner coding ideas for kids ready for text-based logic."],
  ["Internet Safety", "Safer online choices, responsible browsing, and parent-guided habits."],
  ["Creative Thinking", "Puzzles, design choices, experiments, and confidence-building practice."]
];

const steps = [
  ["01", "Choose a kids book", "Pick the topic that fits your child's age, curiosity, and comfort level."],
  ["02", "Download instantly from Gumroad", "Buy securely and receive the PDF through Gumroad delivery."],
  ["03", "Learn with colourful examples and activities", "Use short explanations, guided examples, and activities at a steady pace."]
];

const ageGroups = [
  ["Ages 6-8", "Computer basics and safe digital habits"],
  ["Ages 8-12", "Logic, Scratch, creativity, beginner coding"],
  ["Ages 12-14", "Python basics, projects, problem solving"]
];

const faqs = [
  {
    q: "Are these books beginner-friendly?",
    a: "Yes. LearnStack Kids books start with simple ideas and build confidence through small, guided steps."
  },
  {
    q: "Do parents need coding knowledge?",
    a: "No. The explanations are written so parents can guide learning even without advanced coding experience."
  },
  {
    q: "Are the books delivered instantly?",
    a: "Yes. Gumroad handles secure checkout and instant PDF delivery after purchase."
  },
  {
    q: "Are these PDFs colourful?",
    a: "Yes. The kids books are designed to feel more visual, friendly, and activity-based than regular handbooks."
  },
  {
    q: "Can kids learn without prior experience?",
    a: "Yes. The books are made for curious beginners who are new to computers, coding, logic, and digital creativity."
  }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a
    }
  }))
};

export default async function KidsPage() {
  const { products, error } = await getKidsProductsResult();
  const featuredProducts = getFeaturedKidsProducts(products, 4);

  return (
    <>
      <AnalyticsPageView eventName="catalog_viewed" eventParams={{ catalog: "kids" }} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Kids Books", href: "/kids" }])} />
      <JsonLd data={collectionPageJsonLd({ name: "Educational Children's Books", description: metadata.description, path: "/kids" })} />
      <JsonLd data={faqJsonLd} />

      <div className={styles.kidsIntro} aria-hidden="true">
        <div className={styles.introBrand}>
          <Image
            src={site.logo}
            alt=""
            width={60}
            height={60}
            priority
            className={styles.introLogo}
          />
          <strong>LearnStack</strong>
          <span>Kids</span>
        </div>
        <svg className={styles.rainbowArc} viewBox="0 0 380 170">
          <path d="M32 146C90 40 290 40 348 146" />
          <path d="M56 146C106 72 274 72 324 146" />
          <path d="M82 146C122 104 258 104 298 146" />
        </svg>
        <div className={styles.starBurst}>
          {[
            ["-112px", "-72px", "#ff6b6b", "0.5s"],
            ["96px", "-86px", "#ffd93d", "0.6s"],
            ["132px", "18px", "#4ecdc4", "0.7s"],
            ["52px", "104px", "#a084e8", "0.8s"],
            ["-92px", "92px", "#7bc67e", "0.9s"],
            ["-142px", "10px", "#ff6b6b", "1s"]
          ].map(([x, y, color, delay]) => (
            <span key={`${x}-${y}`} style={{ "--x": x, "--y": y, "--star-color": color, "--delay": delay }} />
          ))}
        </div>
      </div>

      <PageEntrance variant="kidsFloat" className={styles.kidsPage} stagger>
        <section className={styles.hero}>
          <div className={styles.decorLayer} aria-hidden="true">
            <span className={styles.cloudOne} />
            <span className={styles.cloudTwo} />
            <span className={styles.starOne} />
            <span className={styles.starTwo} />
            <span className={styles.dotCluster} />
          </div>

          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>LearnStack Kids</span>
              <h1>Colourful Coding & Computer Books for Curious Kids</h1>
              <p>
                Easy explanations, fun activities, and step-by-step learning PDFs designed for young beginners and
                guided by parents.
              </p>
              <div className={styles.heroActions}>
                <Link href="/kids/books" className="brutalButton">View All Kids Books</Link>
                <Link href="/products" className="brutalButton brutalButtonWhite">View Regular Handbooks</Link>
              </div>
              <div className={styles.heroBadges} aria-label="Kids book qualities">
                <span>Colourful PDFs</span>
                <span>Parent guided</span>
                <span>Beginner safe</span>
              </div>
            </div>

            <aside className={styles.heroPanel} aria-label="LearnStack Kids learning preview">
              <div className={styles.panelTop}>
                <span>Kids world</span>
                <strong>{products.length || "New"}</strong>
                <small>{products.length === 1 ? "kids book" : "kids books"}</small>
              </div>
              <div className={styles.learningBoard}>
                <div className={styles.boardCard}>
                  <span>CODE</span>
                  <strong>if curious:</strong>
                  <small>try a tiny project</small>
                </div>
                <div className={styles.boardCard}>
                  <span>LOGIC</span>
                  <strong>step by step</strong>
                  <small>patterns, loops, choices</small>
                </div>
                <div className={styles.boardCard}>
                  <span>CREATE</span>
                  <strong>draw, build, test</strong>
                  <small>activities for practice</small>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className={styles.sampleSection} aria-labelledby="kids-sample-heading">
          <div className={`container ${styles.sampleCard}`}>
            <div>
              <span className={styles.eyebrow}>Kids Sample Preview</span>
              <h2 id="kids-sample-heading">Preview selected kids books before buying.</h2>
              <p>
                Free sample PDFs are available for selected kids books, with more previews added regularly.
              </p>
            </div>
            <Link href="/free-samples" className="brutalButton">
              View Free Samples
            </Link>
          </div>
        </section>

        <section className={styles.whySection} aria-labelledby="why-kids-heading">
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Why LearnStack Kids</span>
              <h2 id="why-kids-heading">Friendly learning that still feels structured.</h2>
              <p>
                Kids get playful activities and colourful pages. Parents get calm, practical resources that make each
                topic easier to guide.
              </p>
            </div>

            <div className={styles.whyGrid}>
              {whyItems.map((item) => (
                <article className={`${styles.infoCard} ${styles[item.tone]}`} key={item.title}>
                  <span aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.learnSection} aria-labelledby="learn-heading">
          <div className="container">
            <div className={styles.splitHeader}>
              <div>
                <span className={styles.eyebrow}>What kids will learn</span>
                <h2 id="learn-heading">Useful digital skills, explained gently.</h2>
              </div>
              <p>
                The kids catalog covers computer basics, creative coding, safe technology habits, and early
                problem-solving practice.
              </p>
            </div>

            <div className={styles.learnGrid}>
              {learnItems.map(([title, copy], index) => (
                <article key={title} className={styles.learnCard}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.promiseSection} aria-labelledby="promise-heading">
          <div className={`container ${styles.promiseGrid}`}>
            <div>
              <span className={styles.eyebrow}>Parent-friendly promise</span>
              <h2 id="promise-heading">Simple, guided, clean, and less confusing.</h2>
            </div>
            <div className={styles.promiseCard}>
              <p>
                LearnStack Kids books are designed to make early technology learning feel approachable. Each resource
                focuses on clear explanations, small activities, readable layouts, and steady practice instead of
                overwhelming kids with too much at once.
              </p>
              <div className={styles.promiseChecks} aria-label="Parent-friendly qualities">
                <span>Clear language</span>
                <span>Guided practice</span>
                <span>No hype</span>
                <span>Practical confidence</span>
              </div>
            </div>
          </div>
        </section>

        <section id="kids-books" className={styles.booksSection} aria-labelledby="kids-books-heading">
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Featured Kids Books</span>
              <h2 id="kids-books-heading">Start with these kids books.</h2>
              <p>
                A short, focused set of LearnStack Kids books for the landing page. The complete kids catalog lives on a dedicated page.
              </p>
              <Link href="/kids/books" className="brutalButton">
                View All Kids Books
              </Link>
            </div>

            {error ? (
              <div className={styles.emptyState}>
                <h3>Unable to load kids books right now.</h3>
                <p>Please try again later.</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className={styles.productGrid}>
                {featuredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={index < 2}
                    buyLabel="Buy on Gumroad"
                    showSample
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <h3>No kids books found yet.</h3>
                <p>Please check that Gumroad kids product URLs contain learnstackkids.</p>
              </div>
            )}
          </div>
        </section>

        <section className={styles.suggestSection} aria-labelledby="kids-suggest-heading">
          <div className={`container ${styles.suggestCard}`}>
            <div>
              <span className={styles.eyebrow}>Suggest a Kids Book</span>
              <h2 id="kids-suggest-heading">Want us to create a new kids book?</h2>
              <p>
                Parents, teachers, and readers can suggest new LearnStack Kids books, activity books, moral stories, curiosity topics, emotional learning books, or family learning ideas.
              </p>
            </div>
            <Link href="/suggest-a-book" className="brutalButton">
              Suggest a Kids Book
            </Link>
          </div>
        </section>

        <section className={styles.howSection} aria-labelledby="how-heading">
          <div className="container">
            <div className={styles.splitHeader}>
              <div>
                <span className={styles.eyebrow}>How it works</span>
                <h2 id="how-heading">A simple path from curiosity to practice.</h2>
              </div>
              <p>Choose the right PDF, download it instantly, and use the activities at a pace that feels comfortable.</p>
            </div>

            <div className={styles.stepsGrid}>
              {steps.map(([number, title, copy]) => (
                <article key={title} className={styles.stepCard}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ageSection} aria-labelledby="age-heading">
          <div className={`container ${styles.ageWrap}`}>
            <div>
              <span className={styles.eyebrow}>Age groups</span>
              <h2 id="age-heading">Pick a starting point that feels right.</h2>
            </div>
            <div className={styles.ageTags}>
              {ageGroups.map(([age, copy]) => (
                <article key={age}>
                  <strong>{age}</strong>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.faqSection} aria-labelledby="faq-heading">
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>FAQ</span>
              <h2 id="faq-heading">Questions parents often ask.</h2>
            </div>

            <div className={styles.faqGrid}>
              {faqs.map((faq) => (
                <article key={faq.q} className={styles.faqCard}>
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.finalCta} aria-labelledby="final-cta-heading">
          <div className={`container ${styles.finalCtaInner}`}>
            <span className={styles.eyebrow}>Ready to begin?</span>
            <h2 id="final-cta-heading">
              Start your child's learning journey with colourful, simple, and practical books.
            </h2>
            <Link href="/kids/books" className="brutalButton">View All Kids Books</Link>
          </div>
        </section>
      </PageEntrance>
    </>
  );
}
