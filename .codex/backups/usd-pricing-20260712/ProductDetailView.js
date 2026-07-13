import Image from "next/image";
import Link from "next/link";
import ProductImageGallery from "@/components/ProductImageGallery";
import StickyPurchaseBar from "@/components/StickyPurchaseBar";
import { findAmazonBookForProduct } from "@/data/amazonPaperbacks";
import { brand } from "@/data/brand";
import { productAudienceLabel, productDetailHref } from "@/lib/productRouting";
import styles from "./ProductDetailView.module.css";

function normalizeImageKey(value) {
  const text = String(value || "").trim().toLowerCase();

  if (!text) return "";

  try {
    const parsed = new URL(text);
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return text.replace(/[?#].*$/, "").replace(/\/$/, "");
  }
}

function imageSource(image) {
  if (typeof image === "string") return image;
  return image?.url || image?.src || image?.href || image?.image || image?.image_url || image?.thumbnail_url || image?.cover_url || "";
}

function imageFallbackKey(image) {
  if (typeof image === "string") return image;
  return image?.alt || image?.title || image?.name || imageSource(image);
}

function isPlaceholderPreview(value = "") {
  return normalizeImageKey(value).includes("preview-placeholder");
}

export function dedupeImages(images = [], excludeImages = []) {
  const excluded = new Set(excludeImages.map((image) => normalizeImageKey(imageSource(image) || imageFallbackKey(image))).filter(Boolean));
  const seen = new Set();
  const unique = [];

  images.forEach((image) => {
    const source = String(imageSource(image) || "").trim();
    const fallback = String(imageFallbackKey(image) || "").trim();
    const key = normalizeImageKey(source || fallback);

    if (!key || excluded.has(key) || seen.has(key) || isPlaceholderPreview(source || fallback)) return;

    seen.add(key);
    unique.push(source || fallback);
  });

  return unique;
}

function collectImageValues(value, images = [], seen = new Set()) {
  if (!value) return images;

  if (typeof value === "string") {
    images.push(value);
    return images;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectImageValues(item, images, seen));
    return images;
  }

  if (typeof value === "object") {
    if (seen.has(value)) return images;
    seen.add(value);

    const directImage = imageSource(value);

    if (directImage) {
      images.push(directImage);
    }

    [
      value.previewImages,
      value.preview_images,
      value.product_previews,
      value.productPreviews,
      value.demoImages,
      value.demo_images,
      value.images,
      value.pictures,
      value.previews,
      value.preview,
      value.file_info,
      value.fileInfo,
      value.covers
    ].forEach((item) => collectImageValues(item, images, seen));
  }

  return images;
}

export function getProductPreviewImages(product) {
  const candidates = collectImageValues([
    product.image,
    product.coverImage,
    product.thumbnail,
    product.thumbnailUrl,
    product.thumbnail_url,
    product.previewImages,
    product.preview_images,
    product.demoImages,
    product.demo_images,
    product.images,
    product.pictures,
    product.previews,
    product.preview,
    product.product_previews,
    product.productPreviews,
    product.raw
  ]);

  return dedupeImages(candidates);
}

function isExternalImage(src = "") {
  return String(src).startsWith("http");
}

function readableText(value = "") {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function getDescriptionParagraphs(product, fallback) {
  const source = product.longDescription || product.description || product.limitedDescription || fallback;
  const blocks = String(source || "")
    .split(/\n{2,}|\r\n{2,}/)
    .map(readableText)
    .filter(Boolean);

  return blocks.length ? blocks.slice(0, 4) : [fallback];
}

function getAudienceCards(product, isKidsBook, isLifeCareerBook) {
  if (Array.isArray(product.whoFor) && product.whoFor.length) {
    return product.whoFor.slice(0, 4);
  }

  if (isKidsBook) return ["Children", "Parents", "Teachers", "Families"];
  if (isLifeCareerBook) return ["Students", "Young professionals", "Self-learners", "Career-focused readers"];
  return ["Students", "Beginners", "Self-learners", "Early professionals"];
}

function getInsideItems(product) {
  if (Array.isArray(product.whatInside) && product.whatInside.length) {
    return product.whatInside.map((item) => typeof item === "string" ? item : item?.title).filter(Boolean).slice(0, 6);
  }

  if (Array.isArray(product.chapters) && product.chapters.length) {
    return product.chapters.map((chapter) => chapter?.title).filter(Boolean).slice(0, 6);
  }

  return [];
}

function categoryPurpose(isKidsBook, isLifeCareerBook) {
  if (isKidsBook) {
    return "LearnStack Kids books are made to feel warm, safe, colorful, and easier for families to continue.";
  }

  if (isLifeCareerBook) {
    return "LearnStack Life & Career Playbooks are made for practical self-growth, confidence, communication, and student life.";
  }

  return "LearnStack handbooks are made for clear, practical, beginner-friendly learning.";
}

function getProductFaqs(product, isKidsBook, isLifeCareerBook) {
  const categoryFaqs = isKidsBook ? [
    { q: "Is this suitable for children?", a: "LearnStack Kids books are designed with a warm, parent-friendly style for guided learning." },
    { q: "Can parents or teachers use it?", a: "Yes. Parents, teachers, and families can use LearnStack Kids books for guided reading and activities." },
    { q: "What format do I get?", a: "You receive a digital PDF through Gumroad email after purchase." },
    { q: "How do I receive the PDF?", a: "After purchase, Gumroad sends the download email to the address used at checkout." },
    ...(product.sampleUrl ? [{ q: "Can I preview it?", a: "Yes. A free sample is available before buying." }] : []),
    { q: "What if my file does not download?", a: `Contact ${brand.contactEmail} within 3 days for genuine file or download issues.` }
  ] : isLifeCareerBook ? [
    { q: "Is this book for students or young professionals?", a: "Yes. LearnStack Life & Career Playbooks are made for students, young adults, early professionals, self-learners, and career-focused readers." },
    { q: "What format do I get?", a: "You receive a digital PDF through Gumroad email after purchase." },
    { q: "How do I receive the PDF?", a: "After purchase, Gumroad sends the download email to the address used at checkout." },
    { q: "Can I use it for self-study?", a: "Yes. The playbooks are designed for practical self-study, reflection, and clear next steps." },
    ...(product.sampleUrl ? [{ q: "Is a sample available?", a: "Yes. A free sample is available before buying." }] : []),
    { q: "What if my file does not download?", a: `Contact ${brand.contactEmail} within 3 days for genuine file or download issues.` }
  ] : [
    { q: "Is this beginner-friendly?", a: "LearnStack handbooks are made for students, beginners, self-learners, developers, and early professionals." },
    { q: "What format do I get?", a: "You receive a digital PDF through Gumroad email after purchase." },
    { q: "How do I receive the PDF?", a: "After purchase, Gumroad sends the download email to the address used at checkout." },
    { q: "Can I use it for self-study?", a: "Yes. LearnStack handbooks are designed for practical self-study and guided revision." },
    ...(product.sampleUrl ? [{ q: "Can I preview it?", a: "Yes. A free sample is available before buying." }] : []),
    { q: "What if my file does not download?", a: `Contact ${brand.contactEmail} within 3 days for genuine file or download issues.` }
  ];

  const productFaqs = Array.isArray(product.faqs) ? product.faqs.filter((faq) => faq?.q && faq?.a) : [];
  const seen = new Set();

  return [...productFaqs, ...categoryFaqs].filter((faq) => {
    const key = faq.q.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 8);
}

function ProductImage({ src, title, className, alt, width = 720, height = 960, priority = false }) {
  if (!src) {
    return (
      <div className={`${styles.imageFallback} ${className || ""}`} role="img" aria-label={alt}>
        <span>{String(title || "PDF").slice(0, 3).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      sizes={priority ? "(max-width: 900px) 88vw, 420px" : "(max-width: 700px) 45vw, 220px"}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      unoptimized={isExternalImage(src)}
    />
  );
}

function PreviewPanel({ product, previewImages }) {
  if (!product.sampleUrl) return null;

  const samplePageCount = product.sample?.samplePageCount;
  const samplePageLabel = samplePageCount
    ? `${samplePageCount} preview ${samplePageCount === 1 ? "page" : "pages"}`
    : "Free preview PDF";

  return (
    <section className={styles.previewCard} aria-labelledby="preview-card-heading">
      <div>
        <h2 id="preview-card-heading">Free sample available</h2>
        <p>Preview the book before purchasing the full digital PDF.</p>
        <span className={styles.sampleMeta}>{samplePageLabel}</span>
      </div>

      <a href={product.sampleUrl} target="_blank" rel="noopener noreferrer" className={styles.textButton}>View Free Sample</a>

      {previewImages.length > 0 ? (
        <ProductImageGallery images={previewImages} title={product.title} />
      ) : null}
    </section>
  );
}

function RelatedBookCard({ item }) {
  const cover = item.image || item.coverImage;

  return (
    <article className={styles.relatedBookCard}>
      <div className={styles.relatedCover}>
        <ProductImage
          src={cover}
          title={item.title}
          alt={`${item.title} cover by LearnStack`}
          className={styles.relatedCoverImage}
          width={180}
          height={240}
        />
      </div>
      <div>
        <span>{productAudienceLabel(item)}</span>
        <h3>{item.title}</h3>
        {item.priceDisplay && <p>{item.priceDisplay}</p>}
        <Link href={productDetailHref(item)} className={styles.textButton}>
          Details
        </Link>
      </div>
    </article>
  );
}

function RelatedResourceCard({ resource }) {
  return (
    <Link href={`/resources/${resource.slug}`} className={styles.resourceCard}>
      <span>{resource.readingTime}</span>
      <h3>{resource.title}</h3>
      {resource.description && <p>{resource.description}</p>}
    </Link>
  );
}

export default function ProductDetailView({ product, catalogHref, catalogLabel, eyebrow, relatedProducts = [], relatedResources = [] }) {
  const coverImage = product.image || product.coverImage;
  const previewImages = getProductPreviewImages(product);
  const amazonBook = findAmazonBookForProduct(product);
  const amazonUrl = amazonBook?.amazonUrl || product.amazonUrl;
  const isKidsBook = product.audience === "kids";
  const isLifeCareerBook = product.audience === "life-career";
  const summary = readableText(product.summary || product.tagline || "A LearnStack digital book designed for simple and practical learning.");
  const descriptionParagraphs = getDescriptionParagraphs(product, summary);
  const audienceCards = getAudienceCards(product, isKidsBook, isLifeCareerBook);
  const insideItems = getInsideItems(product);
  const faqs = getProductFaqs(product, isKidsBook, isLifeCareerBook);
  const themeClass = isKidsBook ? styles.kidsTheme : isLifeCareerBook ? styles.lifeTheme : styles.handbookTheme;
  const categoryLabel = productAudienceLabel(product);
  const sampleStatus = product.sampleUrl ? "Preview available" : "Digital PDF edition";
  const relatedBooks = relatedProducts.slice(0, 4);
  const resources = relatedResources.slice(0, 3);

  return (
    <main className={`${styles.page} ${themeClass}`}>
      <section className={styles.heroSection}>
        <nav className={`container ${styles.breadcrumbBar}`} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={catalogHref}>{catalogLabel}</Link>
          <span>/</span>
          <span>{product.title}</span>
        </nav>

        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.mediaCol}>
            <div className={styles.coverCard}>
              <ProductImage
                src={coverImage}
                title={product.title}
                alt={`${product.title} ${categoryLabel.toLowerCase()} cover by LearnStack`}
                className={styles.coverImage}
                priority
              />
            </div>

            <div className={styles.mediaStrip} aria-label="Product format and preview status">
              <span>Digital PDF</span>
              <span>{sampleStatus}</span>
            </div>

            <PreviewPanel product={product} previewImages={previewImages} />
          </div>

          <div className={styles.heroContent}>
            <span className="tag">{eyebrow || categoryLabel}</span>
            <h1>{product.title}</h1>
            {summary && <p className={styles.summary}>{summary}</p>}

            <div className={styles.purchaseCard}>
              <div className={styles.priceRow}>
                <span>Digital PDF</span>
                <strong>{product.priceDisplay || "View price"}</strong>
              </div>

              <div className={styles.formatBadges}>
                <span>{product.format || "Digital PDF"}</span>
                <span>{categoryLabel}</span>
                <span>Delivered by Gumroad</span>
              </div>

              <div className={styles.heroButtons}>
                <a href={product.gumroadUrl} target="_blank" rel="noopener noreferrer" className={`brutalButton ${styles.primaryCta}`}>
                  Buy Digital PDF
                </a>
                {product.sampleUrl && (
                  <a href={product.sampleUrl} target="_blank" rel="noopener noreferrer" className={`brutalButton brutalButtonWhite ${styles.secondaryCta}`}>
                    View Free Sample
                  </a>
                )}
                {amazonUrl && (
                  <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className={`brutalButton brutalButtonWhite ${styles.secondaryCta}`}>
                    View on Amazon
                  </a>
                )}
              </div>

              <div className={styles.purchaseNotes}>
                <p>Digital PDF is delivered after purchase through Gumroad email.</p>
                <p>
                  Download issue? Contact{" "}
                  <a href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a> within 3 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={`container ${styles.contentGrid}`}>
          <article className={`${styles.contentCard} ${styles.wideCard}`}>
            <span className={styles.sectionKicker}>About the book</span>
            <h2>What this book is about</h2>
            {descriptionParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <article className={styles.contentCard}>
            <span className={styles.sectionKicker}>Readers</span>
            <h2>Who this is for</h2>
            <div className={styles.audienceGrid}>
              {audienceCards.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>

          {insideItems.length > 0 && (
            <article className={styles.contentCard}>
              <span className={styles.sectionKicker}>Contents</span>
              <h2>Inside this book</h2>
              <ul className={styles.insideList}>
                {insideItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          )}

          {product.sampleUrl && (
            <article className={styles.contentCard}>
              <span className={styles.sectionKicker}>Preview</span>
              <h2>Preview before buying</h2>
              <p>Open the free sample PDF before choosing the full LearnStack book.</p>
              <a href={product.sampleUrl} target="_blank" rel="noopener noreferrer" className={styles.textButton}>
                View Free Sample
              </a>
            </article>
          )}

          <article className={styles.contentCard}>
            <span className={styles.sectionKicker}>Formats</span>
            <h2>Digital PDF vs Paperback</h2>
            <p>Digital PDF editions are available through LearnStack/Gumroad.</p>
            <p>Paperback editions may be available on Amazon where published.</p>
            {amazonUrl && (
              <>
                <p>Paperback availability may vary by country and delivery location.</p>
                <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className={styles.textButton}>
                  View on Amazon
                </a>
              </>
            )}
          </article>

          <article className={`${styles.contentCard} ${styles.wideCard}`}>
            <span className={styles.sectionKicker}>LearnStack purpose</span>
            <h2>Why LearnStack made this book</h2>
            <p>{categoryPurpose(isKidsBook, isLifeCareerBook)}</p>
          </article>

          <section className={`${styles.contentCard} ${styles.wideCard}`} aria-labelledby="product-faq-heading">
            <span className={styles.sectionKicker}>Questions</span>
            <h2 id="product-faq-heading">FAQ</h2>
            <div className={styles.faqGrid}>
              {faqs.map((faq) => (
                <article key={faq.q} className={styles.faqCard}>
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </article>
              ))}
            </div>
          </section>

          {relatedBooks.length > 0 && (
            <section className={`${styles.contentCard} ${styles.wideCard}`} aria-labelledby="related-books-heading">
              <span className={styles.sectionKicker}>Keep exploring</span>
              <h2 id="related-books-heading">Related books</h2>
              <div className={styles.relatedBooksGrid}>
                {relatedBooks.map((item) => (
                  <RelatedBookCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {resources.length > 0 && (
            <section className={`${styles.contentCard} ${styles.wideCard}`} aria-labelledby="related-guides-heading">
              <span className={styles.sectionKicker}>Learn more</span>
              <h2 id="related-guides-heading">Related resources</h2>
              <div className={styles.resourceGrid}>
                {resources.map((resource) => (
                  <RelatedResourceCard key={resource.slug} resource={resource} />
                ))}
              </div>
            </section>
          )}

          <section className={`${styles.finalCta} ${styles.wideCard}`} aria-labelledby="ready-heading">
            <div>
              <span className={styles.sectionKicker}>Ready to start reading?</span>
              <h2 id="ready-heading">Start with the digital PDF</h2>
              <p>Checkout happens on Gumroad, and the download link is sent to your email after purchase.</p>
            </div>
            <div className={styles.finalButtons}>
              <a href={product.gumroadUrl} target="_blank" rel="noopener noreferrer" className="brutalButton">
                Buy Digital PDF
              </a>
              {product.sampleUrl && (
                <a href={product.sampleUrl} target="_blank" rel="noopener noreferrer" className="brutalButton brutalButtonWhite">
                  View Free Sample
                </a>
              )}
              {amazonUrl && (
                <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className="brutalButton brutalButtonWhite">
                  View on Amazon
                </a>
              )}
            </div>
          </section>
        </div>
      </section>
      <StickyPurchaseBar product={product} />
    </main>
  );
}
