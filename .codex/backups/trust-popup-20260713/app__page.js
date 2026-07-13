import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SubscriberDiscount from "@/components/SubscriberDiscount";
import NewsletterForm from "@/components/NewsletterForm";
import AnalyticsPageView from "@/components/AnalyticsPageView";
import { TrackedLink } from "@/components/TrackedLinks";
import CurrentOffers from "@/components/CurrentOffers";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { getHomepageAmazonPaperbackProducts } from "@/data/amazonPaperbacks";
import { brand, bookMakingProcess } from "@/data/brand";
import { getFeaturedResources } from "@/data/resources";
import { getAllProducts, getKidsProducts, getLifeCareerProducts, getRegularProducts } from "@/lib/gumroad";
import { productDetailHref } from "@/lib/productRouting";
import { getPublicSamples } from "@/lib/sampleMatching";
import { createMetadata, breadcrumbJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/pricing";
import { getFeaturedProducts } from "@/lib/productCatalog";
import styles from "./HomePage.module.css";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Premium PDF Handbooks for Students, Developers & Kids",
  description: "Explore LearnStack digital handbooks, Life & Career Playbooks, and kids learning books with Gumroad PDF delivery and honest sample-preview updates.",
  path: "/"
});

const trustCards = [
  ["Direct PDF delivery", "Digital editions are delivered through Gumroad email after purchase.", "file"],
  ["Free samples available", "Selected LearnStack books include free preview PDFs.", "book"],
  ["Built by LearnStack", "A founder-led learning brand with a clear learning-first point of view.", "shield"],
  ["Support within 24-48 hours", `Email ${brand.contactEmail} if you need buyer support.`, "bolt"],
  ["Download issue help", "If your file does not download properly, contact us within 3 days.", "graph"]
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
  ["Preview before buying", "Selected books include free sample PDFs so you can explore the style first.", "book"],
  ["Secure Gumroad checkout", "Purchases happen through Gumroad, with receipt and download access sent to your email.", "shield"],
  ["Instant digital delivery", "Your PDF download is delivered through Gumroad after purchase.", "file"],
  ["Regional pricing where eligible", "Gumroad may apply regional pricing automatically for eligible countries at checkout.", "graph"]
];

const kidsFeatures = ["Moral stories", "Curiosity questions", "Fun learning", "Free samples", "Digital access"];

const pathCards = [
  {
    title: "Student Handbooks",
    copy: "Coding, tools, AI, career, and practical student learning.",
    href: "/handbooks",
    cta: "Browse Handbooks"
  },
  {
    title: "Kids Books",
    copy: "Story-based books for curiosity, emotions, values, family learning, and early education.",
    href: "/kids",
    cta: "Browse Kids Books"
  },
  {
    title: "Life & Career Playbooks",
    copy: "Communication, confidence, independence, personal branding, presentation skills, side hustles, and practical life skills.",
    href: "/life-career",
    cta: "Browse Life & Career"
  }
];

const homepageFaqs = [
  ["What is LearnStack?", "LearnStack is a learning brand that creates practical PDF handbooks for students and developers, plus warm LearnStack Kids books for children, parents, teachers, and families."],
  ["Are the books digital or physical?", "Digital PDF edition available on LearnStack through Gumroad. Paperback edition available on Amazon where available."],
  ["Can I preview before buying?", "Yes. Selected Gumroad books now include free PDF samples, and more previews will be added as books are prepared."],
  ["Are kids books safe for children?", "LearnStack Kids books use simple, parent-friendly language and are designed for guided, safe learning."],
  ["Are the coding books beginner-friendly?", "Yes. Most handbooks start with clear basics, then move into examples, practice, revision, and interview-ready ideas."],
  ["Where do I download after purchase?", "Gumroad sends the receipt and download link to the email used during checkout."],
  ["Are Amazon paperback editions available?", "Paperback editions are shown only where available. LearnStack does not claim Amazon prices or availability unless a link exists."],
  ["How do I contact support?", `Email ${brand.contactEmail} with your order email and the book name if you need help.`]
];

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

function AmazonPaperbackCard({ book, priority = false }) {
  const coverImage = book.image || book.coverImage;

  return (
    <article className={styles.amazonBookCard}>
      <div className={styles.amazonBookCover}>
        {coverImage ? (
          <Image
            src={coverImage}
            alt={`${book.shortTitle || book.title} paperback cover`}
            width={210}
            height={280}
            sizes="(max-width: 680px) 46vw, 210px"
            priority={priority}
            unoptimized={coverImage.startsWith("http")}
          />
        ) : (
          <span>{book.shortTitle || "LearnStack"}</span>
        )}
      </div>
      <div className={styles.amazonBookBody}>
        <span className={styles.amazonBookMeta}>{book.category} / {book.format}</span>
        <h3>{book.shortTitle || book.title}</h3>
        <div className={styles.amazonBookDetails}>
          <span>Live on Amazon</span>
          {book.price && <span>{book.price}</span>}
        </div>
        <div className={styles.amazonBookActions}>
          <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
            View on Amazon
          </a>
          {book.digitalUrl && (
            <Link href={book.digitalUrl}>
              View Digital PDF
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function HomePage() {
  const [products, kidsProducts, lifeCareerProducts, allProducts] = await Promise.all([
    getRegularProducts(),
    getKidsProducts(),
    getLifeCareerProducts(),
    getAllProducts()
  ]);
  const featured = getFeaturedProducts(products, 3);
  const kidsPreview = getFeaturedProducts(kidsProducts, 3);
  const lifeCareerPreview = getFeaturedProducts(lifeCareerProducts, 3);
  const homepageSamples = getPublicSamples(allProducts).slice(0, 6);
  const featuredResources = getFeaturedResources(6);
  const homepageAmazonBooks = getHomepageAmazonPaperbackProducts(allProducts, 4);
  const bundlePreview = allProducts.filter((product) => product.isBundle).slice(0, 2);

  return (
    <PageEntrance variant="revealHero" stagger>
      <AnalyticsPageView eventName="homepage_viewed" />
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }])} />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={`tag ${styles.heroBadge}`}>Learn. Build. Grow.</span>
            <h1>Premium Learning Books for Students, Kids, and Curious Minds</h1>
            <p>
              LearnStack creates practical PDF handbooks, kids learning books, and story-based resources designed to make learning clear, useful, and enjoyable.
            </p>
            <div className={styles.heroActions}>
              <Link href="/products" className="brutalButton">Explore Handbooks</Link>
              <Link href="/kids" className="brutalButton brutalButtonWhite">Explore Kids Books</Link>
              <Link href="/life-career" className={styles.secondaryButton}>Life & Career</Link>
              <TrackedLink href="/free-samples" className={styles.secondaryButton} eventName="free_sample_cta_clicked" eventParams={{ cta_location: "homepage_hero" }}>View Free Samples</TrackedLink>
              <Link href="/resources" className={styles.secondaryButton}>Read Resources</Link>
            </div>
            <p className={styles.heroPricingNote}>
              Regional pricing may be applied automatically by Gumroad at checkout for eligible countries.
            </p>
          </div>

          <div className={styles.heroMockup}>
            <BookshelfIllustration />
          </div>
        </div>
        <div className={styles.heroStripe} />
      </section>

      <section className={styles.amazonTickerSection} aria-label="Amazon paperback announcement">
        <a href={site.amazonAuthorUrl} target="_blank" rel="noopener noreferrer" className={styles.amazonTicker}>
          <span className={styles.tickerLabel}>NOW ON AMAZON</span>
          <span className={styles.tickerViewport}>
            <span className={styles.tickerTrack}>
              <span>Premium LearnStack paperbacks are now available on Amazon</span>
              <span>Printed books for offline reading</span>
              <span>Explore LearnStack paperbacks</span>
              <span>Premium LearnStack paperbacks are now available on Amazon</span>
              <span>Printed books for offline reading</span>
              <span>Explore LearnStack paperbacks</span>
            </span>
          </span>
        </a>
      </section>

      <section className={styles.statsStrip}>
        <div className={`container ${styles.statsGrid}`}>
          {trustCards.map(([title, copy, icon]) => (
            <div key={title} className={styles.trustCard}>
              <Icon name={icon} />
              <strong>{title}</strong>
              <span>{copy}</span>
            </div>
          ))}
        </div>
      </section>

      <CurrentOffers />

      <section className={styles.pathSection} aria-labelledby="learning-path-heading">
        <div className="container">
          <div className={styles.sectionHeaderLeft}>
            <span className="tag">Choose Your Learning Path</span>
            <h2 id="learning-path-heading">Two ways to begin with LearnStack.</h2>
          </div>
          <div className={styles.pathGrid}>
            {pathCards.map((card) => (
              <article className={styles.pathCard} key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <Link href={card.href} className="brutalButton">{card.cta}</Link>
              </article>
            ))}
          </div>
          {lifeCareerPreview.length > 0 && (
            <div className={styles.lifeCareerPreview}>
              <span className="tag">New Playbooks</span>
              <div>
                {lifeCareerPreview.map((product) => (
                  <Link key={product.id} href={productDetailHref(product)}>
                    {product.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <Link href="/partner-with-us" className={styles.underlineLink}>
            For Teachers, Colleges &amp; Creators
          </Link>
        </div>
      </section>

      <section className={styles.samplesSection} aria-labelledby="samples-heading">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="tag">Preview Before You Buy</span>
              <h2 id="samples-heading">Preview before you buy</h2>
              <p>
                Open free sample PDFs for selected LearnStack books and explore the style before purchasing.
              </p>
            </div>
            <Link href="/free-samples" className={styles.underlineLink}>All Free Samples</Link>
          </div>
          {homepageSamples.length ? (
            <div className={styles.sampleGroups}>
              {homepageSamples.map(({ product, sample, sampleUrl, sourceSlug, previewImages }) => (
                <article className={styles.sampleGroup} key={`${sourceSlug}-${product.id}`}>
                  <h3>{product.title}</h3>
                  <div className={styles.sampleRow}>
                    <span>{sample?.samplePageCount ? `${sample.samplePageCount} preview pages` : previewImages.length ? "Image preview" : "Free PDF sample"}</span>
                    {sampleUrl ? (
                      <a href={sampleUrl} target="_blank" rel="noopener noreferrer">View Free Sample</a>
                    ) : (
                      <Link href="/free-samples">View Free Sample</Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <article className={styles.sampleGroup}>
              <h3>Sample previews are being added.</h3>
              <p>Free sample PDFs will appear here after they are linked to live Gumroad products.</p>
            </article>
          )}
        </div>
      </section>

      <section className={styles.resourcesSection} aria-labelledby="resources-heading">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="tag">Resources</span>
              <h2 id="resources-heading">Helpful guides before you buy.</h2>
            </div>
            <Link href="/resources" className={styles.underlineLink}>All Resources</Link>
          </div>
          <div className={styles.resourceGrid}>
            {featuredResources.map((resource) => (
              <Link href={`/resources/${resource.slug}`} className={styles.resourceCard} key={resource.slug}>
                <span>{resource.category}</span>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="tag">Popular Student Handbooks</span>
              <h2>Practical books for coding, tools, and revision.</h2>
            </div>
            <Link href="/products" className={styles.underlineLink}>All Handbooks</Link>
          </div>
          <div className={styles.featuredGrid}>
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index === 0} />
            ))}
          </div>
        </div>
      </section>

      {bundlePreview.length > 0 && (
        <section className={styles.bundleCtaSection} aria-labelledby="homepage-bundles-heading">
          <div className={`container ${styles.bundleCtaCard}`}>
            <div>
              <span className="tag">Bundles</span>
              <h2 id="homepage-bundles-heading">Looking for complete learning packs?</h2>
              <p>Explore curated LearnStack book bundles without mixing them into the normal handbook catalog.</p>
            </div>
            <Link href="/bundles" className="brutalButton">Explore Bundles</Link>
          </div>
        </section>
      )}

      <section className={styles.kidsDiscoverySection} aria-labelledby="homepage-kids-heading">
        <div className={`container ${styles.kidsDiscoveryGrid}`}>
          <div className={styles.kidsDiscoveryCopy}>
            <span className={styles.kidsLabel}>Popular Kids Books</span>
            <h2 id="homepage-kids-heading">Warm books for curious children and guiding adults.</h2>
            <p>
              Explore colorful kids books with moral stories, curiosity-building questions, simple activities, and safe learning ideas made for young readers.
            </p>
            <div className={styles.kidsChips} aria-label="LearnStack Kids book features">
              {kidsFeatures.map((feature) => (
                <span key={feature}>{feature}</span>
              ))}
            </div>
            <div className={styles.kidsActions}>
              <Link href="/kids" className="brutalButton">Explore Kids Books</Link>
              <Link href="/free-samples" className={styles.kidsSecondaryButton}>View Free Samples</Link>
            </div>
          </div>

          <div className={styles.kidsPreviewPanel} aria-label="LearnStack Kids book previews">
            <div className={styles.kidsDecor} aria-hidden="true">
              <span className={styles.kidsCloudOne} />
              <span className={styles.kidsCloudTwo} />
              <span className={styles.kidsStarOne} />
              <span className={styles.kidsStarTwo} />
              <span className={styles.kidsPencil} />
            </div>
            <div className={styles.kidsPreviewGrid}>
              {kidsPreview.length > 0 ? kidsPreview.map((product, index) => {
                const coverImage = product.image || product.coverImage;

                return (
                <Link
                  href={product.detailPath || `/kids/${product.slug || product.id}`}
                  className={styles.kidsPreviewCard}
                  key={product.id}
                >
                  <span className={styles.kidsBookBadge}>Kids Book</span>
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={`${product.title} kids learning book cover by LearnStack`}
                      width={210}
                      height={280}
                      sizes="(max-width: 680px) 45vw, 180px"
                      priority={false}
                      unoptimized={coverImage.startsWith("http")}
                      className={styles.kidsCoverImage}
                    />
                  ) : (
                    <div className={styles.kidsCoverFallback} role="img" aria-label={`${product.title} kids learning book cover by LearnStack`}>
                      <span>{product.logoText || "KID"}</span>
                    </div>
                  )}
                  <strong>{product.title}</strong>
                  <small>{formatPrice(product)}</small>
                </Link>
              );}) : [0, 1, 2].map((item) => (
                <Link href="/kids" className={styles.kidsPreviewCard} key={item}>
                  <span className={styles.kidsBookBadge}>Kids Book</span>
                  <div className={styles.kidsCoverFallback} role="img" aria-label="LearnStack Kids learning book preview">
                    <span>{["CODE", "FUN", "IDEA"][item]}</span>
                  </div>
                  <strong>{["Coding Adventures", "Moral Stories", "Curiosity Book"][item]}</strong>
                  <small>View price on Gumroad</small>
                </Link>
              ))}
              </div>
          </div>
        </div>
      </section>

      <section className={styles.amazonShowcaseSection} aria-labelledby="amazon-paperbacks-heading">
        <div className="container">
          <div className={styles.amazonShowcaseHeader}>
            <div>
              <span className="tag">Now on Amazon</span>
              <h2 id="amazon-paperbacks-heading">Premium LearnStack Paperbacks</h2>
              <p>
                Prefer printed books? Explore selected LearnStack Kids paperback editions on Amazon.
              </p>
            </div>
            <div className={styles.amazonShowcaseActions}>
              <Link href="/amazon-special" className={styles.storyButton}>View All Amazon Paperbacks</Link>
              <a href={site.amazonAuthorUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>
                LearnStack Author Page
              </a>
            </div>
          </div>
          <div className={styles.amazonBookGrid}>
            {homepageAmazonBooks.map((book, index) => (
              <AmazonPaperbackCard book={book} key={book.asin} priority={index === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.discountSection}>
        <div className="container">
          <SubscriberDiscount />
        </div>
      </section>

      <section id="about" className={styles.storyTeaser}>
        <div className={`container ${styles.storyTeaserInner}`}>
          <div className={styles.storyTeaserCopy}>
            <span className="tag">Built by Yogesh Khinchi</span>
            <h2>Clear notes, practical learning, and child-friendly explanations.</h2>
            <p>
              LearnStack was started by Yogesh Khinchi to turn clear notes, practical learning, and child-friendly explanations into useful digital books. The goal is simple: make learning easier to start, easier to understand, and easier to continue.
            </p>
            <div className={styles.founderActions}>
              <Link href="/story" className={styles.storyButton}>Read Our Story</Link>
              <Link href="/free-samples" className={styles.secondaryButton}>Free Samples</Link>
            </div>
          </div>
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
            <span className="tag">How books are made</span>
            <h2>Research, write, design, review, and publish.</h2>
            <p className={styles.processIntro}>
              LearnStack books are designed to feel less like boring textbooks and more like guided learning experiences.
            </p>
            <div className={styles.processGrid}>
              {bookMakingProcess.map((step, index) => (
                <article className={styles.processCard} key={step}>
                  <span>{index + 1}</span>
                  <strong>{step}</strong>
                </article>
              ))}
            </div>
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
            <Link href="/help" className={styles.underlineLink}>Get Help &rarr;</Link>
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

      <section className={styles.faqSection} aria-labelledby="homepage-faq-heading">
        <div className="container">
          <div className={styles.sectionHeaderLeft}>
            <span className="tag">FAQ</span>
            <h2 id="homepage-faq-heading">Buyer questions, answered before checkout.</h2>
          </div>
          <div className={styles.faqGrid}>
            {homepageFaqs.map(([question, answer]) => (
              <article className={styles.faqCard} key={question}>
                <h3>{question}</h3>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.newsletterSection} aria-label="Free LearnStack resource signup">
        <div className="container">
          <NewsletterForm source="homepage" />
        </div>
      </section>
    </PageEntrance>
  );
}
