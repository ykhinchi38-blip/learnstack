import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SubscriberDiscount from "@/components/SubscriberDiscount";
import CurrentOffers from "@/components/CurrentOffers";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { getRegularProducts } from "@/lib/gumroad";
import { createMetadata, breadcrumbJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import styles from "./HomePage.module.css";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Premium PDF Handbooks for CSE Students",
  description: "LearnStack sells premium educational PDF handbooks for CSE students and developers. Learn faster with practical guides, examples, and revision notes.",
  path: "/"
});

const stats = [
  ["500+", "Students"],
  ["10+", "Handbooks"],
  ["Clean", "Learning Experience"],
  ["Instant", "PDF Delivery"]
];

const features = [
  ["Practical", "Built around real examples, not random theory.", "book"],
  ["Structured", "Every handbook follows a clear path from basics to confidence.", "graph"],
  ["Revision", "Fast notes, checklists, and topic summaries for quick recall.", "bolt"],
  ["Project-ready", "Designed to support projects, interviews, and self-learning.", "code"],
  ["Student-first", "Affordable learning resources for CSE students.", "shield"],
  ["Downloadable", "PDFs delivered instantly through Gumroad.", "file"]
];

const purchaseInfo = [
  ["Preview before buying", "Use free samples and previews to understand the layout, depth, and reading style first.", "book"],
  ["Secure checkout", "Purchases happen through Gumroad, with receipt and download access sent to your email.", "shield"],
  ["Read anywhere", "Downloadable PDFs work on phones, tablets, laptops, and PDF reader apps.", "file"],
  ["Support when needed", "If delivery or access fails, contact support with your Gumroad order email.", "bolt"]
];

const feedbackCards = [
  ["Aarav Sharma", "CSE Student", "The layout makes revision much faster. The notes are clean, structured, and easy to read before exams."],
  ["Priya Mehta", "Beginner Programmer", "Clean examples, no unnecessary confusion. I can quickly understand what to learn and revise next."],
  ["Rohan Verma", "Web Development Learner", "Good for quick learning before projects. The examples and mistakes section feel very useful."],
  ["Sneha Kapoor", "College Student", "The handbook format keeps everything organized. It is much easier to revise important points in less time."],
  ["Kabir Singh", "Developer Learner", "LearnStack focuses on practical learning instead of only theory, which makes the content more helpful."]
];

const physicalBooksMessage = "Coming Soon: LearnStack Physical Books - premium handbooks you can hold, highlight, and revise anywhere.";

function createSeededRandom(seed) {
  let state = 0;

  for (let index = 0; index < seed.length; index += 1) {
    state = Math.imul(31, state) + seed.charCodeAt(index) | 0;
  }

  return function nextRandom() {
    state = Math.imul(1664525, state) + 1013904223 | 0;
    return (state >>> 0) / 4294967296;
  };
}

function applyShelfVariation(shelves, variant) {
  return shelves.map((shelf, shelfIndex) => {
    return shelf.map((book, bookIndex) => {
      const random = createSeededRandom(`${variant}-${shelfIndex}-${bookIndex}-${book.label}`);
      const shouldTilt = random() < 0.25;
      const tilt = shouldTilt ? (random() < 0.5 ? -3 : 2) : 0;

      const variedBook = {
        ...book,
        width: book.width || Math.round(26 + random() * 9),
        height: Math.round(55 + random() * 60),
        gap: Math.round(2 + random() * 6),
        tilt
      };

      if (variant === "adult" && shelfIndex === 2 && bookIndex === 0) {
        return {
          ...variedBook,
          flat: true,
          width: 28,
          height: 86,
          gap: 24,
          tilt: 90
        };
      }

      if (variant === "adult" && shelfIndex === 2 && bookIndex === 1) {
        return { ...variedBook, leaning: true, tilt: -3 };
      }

      if (variant === "adult" && shelfIndex === 2 && bookIndex === 2) {
        return { ...variedBook, leaning: true, tilt: 2 };
      }

      return variedBook;
    });
  });
}

const adultShelves = applyShelfVariation([
  [
    { label: "PY", color: "#2d6be4", edge: "#1f57bd", top: "#6ea0ff", panel: "#214f9f", sticker: "#90caf9" },
    { label: "JS", color: "#0d1b3e", edge: "#071025", top: "#30446c", panel: "#0a1531", sticker: "#4a8af4" },
    { label: "DSA", color: "#4a6fa5", edge: "#314d75", top: "#7fa2d1", panel: "#395b89", sticker: "#b6d5ff" },
    { label: "GIT", color: "#2d6be4", edge: "#1f57bd", top: "#6ea0ff", panel: "#214f9f", sticker: "#90caf9" },
    { label: "WEB", color: "#0d1b3e", edge: "#071025", top: "#30446c", panel: "#0a1531", sticker: "#4a8af4" }
  ],
  [
    { label: "OS", color: "#4a6fa5", edge: "#314d75", top: "#7fa2d1", panel: "#395b89", sticker: "#b6d5ff" },
    { label: "ML", color: "#2d6be4", edge: "#1f57bd", top: "#6ea0ff", panel: "#214f9f", sticker: "#90caf9" },
    { label: "SQL", color: "#0d1b3e", edge: "#071025", top: "#30446c", panel: "#0a1531", sticker: "#4a8af4" },
    { label: "AI", color: "#4a6fa5", edge: "#314d75", top: "#7fa2d1", panel: "#395b89", sticker: "#b6d5ff" },
    { label: "SYS", color: "#2d6be4", edge: "#1f57bd", top: "#6ea0ff", panel: "#214f9f", sticker: "#90caf9" }
  ],
  [
    { label: "API", color: "#2d6be4", edge: "#1f57bd", top: "#6ea0ff", panel: "#214f9f", sticker: "#90caf9" },
    { label: "C++", color: "#4a6fa5", edge: "#314d75", top: "#7fa2d1", panel: "#395b89", sticker: "#b6d5ff" },
    { label: "DB", color: "#0d1b3e", edge: "#071025", top: "#30446c", panel: "#0a1531", sticker: "#4a8af4" },
    { label: "NET", color: "#2d6be4", edge: "#1f57bd", top: "#6ea0ff", panel: "#214f9f", sticker: "#90caf9" },
    { label: "CLI", color: "#4a6fa5", edge: "#314d75", top: "#7fa2d1", panel: "#395b89", sticker: "#b6d5ff" }
  ]
], "adult");

const kidsShelves = applyShelfVariation([
  [
    { label: "ABC", color: "#2d6be4", edge: "#1f57bd", top: "#8fb5ff", panel: "#214f9f", sticker: "#d6e5ff" },
    { label: "123", color: "#5ba85a", edge: "#377637", top: "#8bd28a", panel: "#438743", sticker: "#b9f3b8" },
    { label: "FUN", color: "#c94f4f", edge: "#8d3030", top: "#ee8585", panel: "#a83b3b", sticker: "#ffb3b3" },
    { label: "GAME", color: "#7b5ea7", edge: "#513b78", top: "#a88ad8", panel: "#614886", sticker: "#d6c0ff" }
  ],
  [
    { label: "ART", color: "#7b5ea7", edge: "#513b78", top: "#a88ad8", panel: "#614886", sticker: "#d6c0ff" },
    { label: "ZOO", color: "#4a8af4", edge: "#2d6be4", top: "#9fbdff", panel: "#2f66c5", sticker: "#d6e5ff" },
    { label: "SCI", color: "#5ba85a", edge: "#377637", top: "#8bd28a", panel: "#438743", sticker: "#b9f3b8" },
    { label: "READ", color: "#c94f4f", edge: "#8d3030", top: "#ee8585", panel: "#a83b3b", sticker: "#ffb3b3" },
    { label: "LOGIC", color: "#2d6be4", edge: "#1f57bd", top: "#8fb5ff", panel: "#214f9f", sticker: "#d6e5ff" }
  ],
  [
    { label: "MATH", color: "#c94f4f", edge: "#8d3030", top: "#ee8585", panel: "#a83b3b", sticker: "#ffb3b3" },
    { label: "READ", color: "#7b5ea7", edge: "#513b78", top: "#a88ad8", panel: "#614886", sticker: "#d6c0ff" },
    { label: "CODE", color: "#2d6be4", edge: "#1f57bd", top: "#8fb5ff", panel: "#214f9f", sticker: "#d6e5ff" },
    { label: "SAFE", color: "#5ba85a", edge: "#377637", top: "#8bd28a", panel: "#438743", sticker: "#b9f3b8" }
  ]
], "kids");

function ShelfBook({ book, variant }) {
  const bookStyle = {
    "--book-color": book.color,
    "--book-edge": book.edge,
    "--book-top": book.top,
    "--book-panel": book.panel,
    "--book-sticker": book.sticker,
    "--book-width": `${book.width}px`,
    "--book-height": `${book.height}px`,
    "--book-tilt": `${book.tilt}deg`,
    "--book-gap": `${book.gap}px`
  };

  return (
    <span
      className={`${styles.book} ${variant === "kids" ? styles.kidsBook : styles.adultBook} ${book.flat ? styles.flatBook : ""} ${book.leaning ? styles.leaningBook : ""}`}
      style={bookStyle}
    >
      <span className={styles.bookTop} aria-hidden="true" />
      <span className={styles.bookEdge} aria-hidden="true" />
      <span className={styles.spinePanel}>
        <span className={styles.spineText}>{book.label}</span>
      </span>
      <span className={styles.spineRule} aria-hidden="true" />
      <span className={styles.spineSticker} aria-hidden="true" />
    </span>
  );
}

function BookcaseSection({ shelves, variant }) {
  return (
    <div className={styles.bookcaseSection}>
      {shelves.map((shelf, shelfIndex) => (
        <div className={styles.shelfCompartment} key={`${variant}-${shelfIndex}`}>
          <div className={styles.booksRow}>
            {shelf.map((book) => (
              <ShelfBook key={`${variant}-${shelfIndex}-${book.label}-${book.color}`} book={book} variant={variant} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BookshelfIllustration() {
  return (
    <div className={styles.bookshelf} role="img" aria-label="Neo-brutalist bookshelf with educational and kids handbooks">
      <BookcaseSection shelves={adultShelves} variant="adult" />
      <BookcaseSection shelves={kidsShelves} variant="kids" />
    </div>
  );
}

export default async function HomePage() {
  const products = await getRegularProducts();
  const featured = products.slice(0, 3);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }])} />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={`tag ${styles.heroBadge}`}>Premium learning PDFs</span>
            <h1>Stop collecting notes. Start building <span className={styles.underlinedWord}>skills.</span></h1>
            <p>
              LearnStack creates practical PDF handbooks for CSE students and developers who want to learn, revise, build, and grow with confidence.
            </p>
            <div className={styles.heroActions}>
              <Link href="/products" className="brutalButton">Browse Handbooks</Link>
              <Link href="/free-resources" className={styles.secondaryButton}>Free Sample &rarr;</Link>
            </div>
          </div>

          <div className={styles.heroMockup}>
            <BookshelfIllustration />
          </div>
        </div>
        <div className={styles.heroStripe} />
      </section>

      <section className={styles.physicalBooksBanner} aria-label="Physical books announcement">
        <div className={styles.marqueeTrack}>
          {[0, 1, 2].map((item) => (
            <span key={item}>
              <span className={styles.bookIcon} aria-hidden="true" />
              {physicalBooksMessage}
            </span>
          ))}
        </div>
      </section>

      <section id="about" className={styles.storyTeaser}>
        <div className={`container ${styles.storyTeaserInner}`}>
          <div className={styles.storyTeaserCopy}>
            <span className="tag">ABOUT LEARNSTACK</span>
            <h2>Built by a student, for every student.</h2>
            <p>
              LearnStack began with a simple habit: making clear, structured notes that helped students learn better. Today, that habit has grown into practical handbooks for learners everywhere.
            </p>
            <Link href="/story" className={styles.storyButton}>Read Our Story</Link>
          </div>
        </div>
      </section>

      <section className={styles.statsStrip}>
        <div className={`container ${styles.statsGrid}`}>
          {stats.map(([number, label]) => (
            <div key={label} className={styles.statItem}>
              <strong>{number}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <CurrentOffers />

      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="tag">Catalog</span>
              <h2>The Handbooks.</h2>
            </div>
            <Link href="/products" className={styles.underlineLink}>All Handbooks &rarr;</Link>
          </div>
          <div className={styles.featuredGrid}>
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.discountSection}>
        <div className="container">
          <SubscriberDiscount />
        </div>
      </section>

      <section className={styles.insideSection}>
        <div className={`container ${styles.insideGrid}`}>
          <div className={styles.previewStack}>
            <Image src="/images/previews/preview-placeholder-1.png" alt="PDF preview page" width={300} height={400} />
            <Image src="/images/previews/preview-placeholder-2.png" alt="PDF preview page" width={300} height={400} />
            <Image src="/images/previews/preview-placeholder-3.png" alt="PDF preview page" width={300} height={400} />
          </div>
          <div>
            <span className="tag">Inside every handbook</span>
            <h2>Designed like a study system.</h2>
            <ul className={styles.checkList}>
              <li>Beginner-friendly explanations without unnecessary complexity.</li>
              <li>Practical examples, mini projects, and revision notes.</li>
              <li>Topic-based structure so you always know what to learn next.</li>
              <li>Interview-focused sections for important concepts.</li>
              <li>Clean layout built for mobile, tablet, and laptop reading.</li>
              <li>Instant PDF delivery through Gumroad after purchase.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.purchaseSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="tag">Before you buy</span>
              <h2>Clear delivery, readable PDFs, and simple support.</h2>
            </div>
            <Link href="/refund-policy" className={styles.underlineLink}>Read Policies &rarr;</Link>
          </div>
          <div className={styles.purchaseGrid}>
            {purchaseInfo.map(([title, copy, icon]) => (
              <article key={title} className={styles.purchaseCard}>
                <Icon name={icon} />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.whySection}>
        <div className="container">
          <div className={styles.sectionHeaderLeft}>
            <span className="tag">Why LearnStack?</span>
            <h2>Learning resources that feel sharp, serious, and useful.</h2>
          </div>
          <div className={styles.featureGrid}>
            {features.map(([title, copy, icon]) => (
              <article key={title} className={styles.featureCard}>
                <Icon name={icon} />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.testimonialsSection}>
        <div className="container">
          <div className={styles.feedbackHeader}>
            <span className="tag">Learner Feedback</span>
            <h2>Student feedback from LearnStack readers.</h2>
            <p>Students use LearnStack-style notes to revise faster, understand clearly, and stay organized.</p>
          </div>
          <div className={styles.testimonialGrid}>
            {feedbackCards.map(([name, role, quote]) => (
              <article key={name} className={styles.testimonialCard}>
                <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
                <p>{quote}</p>
                <strong>{name}</strong>
                <small>{role}</small>
              </article>
            ))}
          </div>
          <Link href="/products" className={styles.feedbackButton}>Explore Handbooks</Link>
        </div>
      </section>

      <section className={styles.sampleBanner}>
        <div className="container">
          <h2>Read before you buy.</h2>
          <p>Start with a free sample chapter and see how LearnStack handbooks are structured.</p>
          <Link href="/free-resources" className="brutalButton">Browse Free Samples</Link>
        </div>
      </section>

      <section className={styles.newsletterSection}>
        <div className={`container ${styles.newsletterBox}`}>
          <div className={styles.newsletterCopy}>
            <span className="tag">NEW DROPS</span>
            <h2>Get notified when a new handbook launches.</h2>
            <p>No spam. Only new handbook drops, free samples, student offers, and LearnStack updates.</p>
          </div>
          <div className={styles.newsletterAction}>
            <form className={styles.newsletterForm} action="#" method="POST">
              <label className="visuallyHidden" htmlFor="homepage-newsletter-email">Email address</label>
              <input id="homepage-newsletter-email" type="email" name="email" placeholder="you@example.com" required />
              <button className="brutalButton" type="submit">Notify Me</button>
            </form>
            <div className={styles.newsletterTrust} aria-label="Newsletter benefits">
              <span>Free samples</span>
              <span>Student offers</span>
              <span>New handbook alerts</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
