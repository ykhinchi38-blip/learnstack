import Image from "next/image";
import Link from "next/link";
import StickyPurchaseBar from "@/components/StickyPurchaseBar";
import { ProductFeedback } from "@/components/ApprovedFeedback";
import AnalyticsPageView from "@/components/AnalyticsPageView";
import { TrackedExternalLink } from "@/components/TrackedLinks";
import TrackedProductPreviewGallery from "@/components/TrackedProductPreviewGallery";
import { findAmazonBookForProduct } from "@/data/amazonPaperbacks";
import { brand } from "@/data/brand";
import { productAudienceLabel, productDetailHref } from "@/lib/productRouting";
import { formatPrice, getProductPricing, REGIONAL_PRICING_NOTE } from "@/lib/pricing";
import { hasValidSampleUrl } from "@/lib/sampleMatching";
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

function productAnalyticsParams(product, ctaLocation) {
  return {
    product_id: product.id || product.slug || "",
    product_title: product.title || "",
    product_category: product.category || product.audience || "",
    price: Number(product.price) || undefined,
    currency: product.currency || "USD",
    cta_location: ctaLocation
  };
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

function itemValues(value) {
  const values = Array.isArray(value) ? value : value ? [value] : [];

  return values
    .map((item) => typeof item === "string" || typeof item === "number" ? String(item) : item?.title || item?.name || "")
    .map(readableText)
    .filter(Boolean);
}

function uniqueItems(items = []) {
  return Array.from(new Set(items.map(readableText).filter(Boolean)));
}

function countFact(value, label, pluralLabel = `${label}s`) {
  const count = itemValues(value).length;
  return count ? `${count} ${count === 1 ? label : pluralLabel}` : "";
}

function getQuickFacts(product, isKidsBook) {
  const facts = [];
  const pageCount = product.pageCount || product.pages;
  const ageRange = product.ageRange || (/^ages?\s/i.test(product.badge || "") ? product.badge : "");

  if (isKidsBook && ageRange) facts.push(`Age range: ${ageRange}`);
  if (!isKidsBook && (product.skillLevel || product.level)) facts.push(`Skill level: ${product.skillLevel || product.level}`);
  if (pageCount && pageCount !== "PDF") facts.push(`${pageCount} pages`);
  if (product.edition && product.edition !== "Latest Edition") facts.push(product.edition);
  if (product.format) facts.push(product.format);

  if (isKidsBook) {
    if (product.illustrated || itemValues(product.illustrations).length) facts.push("Illustrated PDF");
    const themes = itemValues(product.themes);
    if (themes.length) facts.push(`Themes: ${themes.slice(0, 3).join(", ")}`);
    const activityFact = countFact(product.activities, "activity", "activities") || countFact(product.coloringPages, "coloring page") || countFact(product.discussionPrompts, "discussion prompt");
    if (activityFact) facts.push(activityFact);
  } else {
    [countFact(product.projects, "project"), countFact(product.examples, "example"), countFact(product.exercises, "exercise"), countFact(product.cheatSheets, "cheat sheet")]
      .filter(Boolean)
      .forEach((fact) => facts.push(fact));
  }

  facts.push("Instant digital delivery");
  return uniqueItems(facts).slice(0, 7);
}

function getOutcomeItems(product) {
  const explicitOutcomes = itemValues(product.learningOutcomes || product.whatYouWillLearn);
  return uniqueItems(explicitOutcomes.length ? explicitOutcomes : itemValues(product.topics)).slice(0, 8);
}

function getIncludedItems(product) {
  const chapters = itemValues(product.chapters);
  const specifiedItems = itemValues(product.whatInside);
  const labelledItems = [
    ["Projects", product.projects], ["Examples", product.examples], ["Exercises", product.exercises], ["Cheat sheets", product.cheatSheets],
    ["Activities", product.activities], ["Coloring pages", product.coloringPages], ["Discussion prompts", product.discussionPrompts], ["Illustrations", product.illustrations]
  ].flatMap(([label, value]) => itemValues(value).map((item) => `${label}: ${item}`));

  return uniqueItems([...specifiedItems, ...chapters, ...labelledItems]).slice(0, 10);
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

function getProductFaqs(product, isKidsBook, isLifeCareerBook, hasSamplePreview, hasImagePreview) {
  const categoryFaqs = isKidsBook ? [
    { q: "Is this suitable for children?", a: "LearnStack Kids books are designed with a warm, parent-friendly style for guided learning." },
    { q: "Can parents or teachers use it?", a: "Yes. Parents, teachers, and families can use LearnStack Kids books for guided reading and activities." },
    { q: "What format do I get?", a: "You receive a digital PDF through Gumroad email after purchase." },
    { q: "How do I receive the PDF?", a: "After purchase, Gumroad sends the download email to the address used at checkout." },
    ...(hasSamplePreview ? [{ q: "Can I preview it?", a: "Yes. A free sample is available before buying." }] : []),
    { q: "What if my file does not download?", a: `Contact ${brand.contactEmail} within 3 days for genuine file or download issues.` }
  ] : isLifeCareerBook ? [
    { q: "Is this book for students or young professionals?", a: "Yes. LearnStack Life & Career Playbooks are made for students, young adults, early professionals, self-learners, and career-focused readers." },
    { q: "What format do I get?", a: "You receive a digital PDF through Gumroad email after purchase." },
    { q: "How do I receive the PDF?", a: "After purchase, Gumroad sends the download email to the address used at checkout." },
    { q: "Can I use it for self-study?", a: "Yes. The playbooks are designed for practical self-study, reflection, and clear next steps." },
    ...(hasSamplePreview ? [{ q: "Is a sample available?", a: "Yes. A free sample is available before buying." }] : []),
    { q: "What if my file does not download?", a: `Contact ${brand.contactEmail} within 3 days for genuine file or download issues.` }
  ] : [
    { q: "Is this beginner-friendly?", a: "LearnStack handbooks are made for students, beginners, self-learners, developers, and early professionals." },
    { q: "What format do I get?", a: "You receive a digital PDF through Gumroad email after purchase." },
    { q: "How do I receive the PDF?", a: "After purchase, Gumroad sends the download email to the address used at checkout." },
    { q: "Can I use it for self-study?", a: "Yes. LearnStack handbooks are designed for practical self-study and guided revision." },
    ...(hasSamplePreview ? [{ q: "Can I preview it?", a: "Yes. A free sample is available before buying." }] : []),
    { q: "What if my file does not download?", a: `Contact ${brand.contactEmail} within 3 days for genuine file or download issues.` }
  ];

  const productFaqs = Array.isArray(product.faqs) ? product.faqs.filter((faq) => faq?.q && faq?.a) : [];
  const seen = new Set();

  const pricingFaq = {
    q: "Can regional pricing apply at checkout?",
    a: REGIONAL_PRICING_NOTE
  };
  const reusableFaqs = [
    { q: "Is this a digital product?", a: "Yes. This product is delivered as a digital PDF through Gumroad." },
    { q: "How will I receive it?", a: "After purchase, Gumroad sends the download link to the email address used at checkout." },
    { q: "Is a preview available?", a: hasSamplePreview ? "Yes. A free sample PDF is available before purchase." : hasImagePreview ? "Yes. Preview pages are available on this product page." : "A preview is not currently available for this title." },
    { q: "Is regional pricing available?", a: REGIONAL_PRICING_NOTE },
    { q: "Can I print the PDF?", a: "You may print a purchased PDF for your personal use. Please do not redistribute the file or printed copies." },
    ...(isKidsBook ? [{ q: "Can teachers use it in classrooms?", a: "Teachers can use a purchased copy for guided reading or activities. Contact LearnStack for wider-use or sharing questions." }] : []),
    { q: "What should I do if the download link does not work?", a: `Contact ${brand.contactEmail} with your Gumroad order email and book name within 3 days.` }
  ];

  return [...reusableFaqs, ...productFaqs, ...categoryFaqs, pricingFaq].filter((faq) => {
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

function PreviewPanel({ product, previewImages, hasSamplePreview }) {
  if (!hasSamplePreview && previewImages.length === 0) return null;

  const samplePageCount = product.sample?.samplePageCount;
  const samplePageLabel = hasSamplePreview && samplePageCount
    ? `${samplePageCount} preview ${samplePageCount === 1 ? "page" : "pages"}`
    : hasSamplePreview ? "Free preview PDF" : "Preview pages";

  return (
    <section className={styles.previewCard} aria-labelledby="preview-card-heading">
      <div>
        <h2 id="preview-card-heading">{hasSamplePreview ? "Free sample available" : "Preview pages"}</h2>
        <p>{hasSamplePreview ? "Preview the book before purchasing the full digital PDF." : "Explore the available preview pages before purchasing the full digital PDF."}</p>
        <span className={styles.sampleMeta}>{samplePageLabel}</span>
      </div>

      {hasSamplePreview && <TrackedExternalLink href={product.sampleUrl} target="_blank" rel="noopener noreferrer" className={styles.textButton} eventName="preview_opened" eventParams={productAnalyticsParams(product, "product_preview_panel")}>View Free Sample</TrackedExternalLink>}

      {previewImages.length > 0 ? (
        <TrackedProductPreviewGallery product={product} images={previewImages} />
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
        <p>{formatPrice(item)}</p>
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

function BundleIncludedBook({ item }) {
  const cover = item.image || item.coverImage;
  const hasPreview = hasValidSampleUrl(item);

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
        <p>{formatPrice(item)}</p>
        <div className={styles.bundleCardLinks}>
          <Link href={productDetailHref(item)} className={styles.textButton}>Details</Link>
          {hasPreview && <a href={item.sampleUrl} target="_blank" rel="noopener noreferrer" className={styles.textButton}>Preview</a>}
        </div>
      </div>
    </article>
  );
}

export default function ProductDetailView({ product, catalogHref, catalogLabel, eyebrow, relatedProducts = [], relatedResources = [], bundleDetails = null, excludedProductIds = [] }) {
  const coverImage = product.image || product.coverImage;
  const previewImages = getProductPreviewImages(product);
  const hasSamplePreview = hasValidSampleUrl(product);
  const hasImagePreview = previewImages.length > 0;
  const amazonBook = findAmazonBookForProduct(product);
  const amazonUrl = amazonBook?.amazonUrl || product.amazonUrl;
  const isKidsBook = product.audience === "kids";
  const isLifeCareerBook = product.audience === "life-career";
  const summary = readableText(product.summary || product.tagline || "A LearnStack digital book designed for simple and practical learning.");
  const descriptionParagraphs = getDescriptionParagraphs(product, summary);
  const audienceCards = getAudienceCards(product, isKidsBook, isLifeCareerBook);
  const quickFacts = getQuickFacts(product, isKidsBook);
  const outcomeItems = getOutcomeItems(product);
  const insideItems = getIncludedItems(product);
  const faqs = getProductFaqs(product, isKidsBook, isLifeCareerBook, hasSamplePreview, hasImagePreview);
  const themeClass = isKidsBook ? styles.kidsTheme : isLifeCareerBook ? styles.lifeTheme : styles.handbookTheme;
  const categoryLabel = productAudienceLabel(product);
  const sampleStatus = hasSamplePreview || hasImagePreview ? "Preview available" : "Digital PDF edition";
  const pricing = getProductPricing(product);
  const hasStickyPurchase = pricing.pricingType === "fixed" && Boolean(product.gumroadUrl);
  const relatedBooks = relatedProducts
    .filter((item) => item?.id !== product.id && !excludedProductIds.includes(item?.id) && !item?.deleted && !item?.hidden && !item?.unavailable && (item?.status || "published") === "published")
    .slice(0, 3);
  const resources = relatedResources.slice(0, 3);
  const bundleDefinition = bundleDetails?.definition;
  const viewEventName = product.isBundle ? "bundle_viewed" : "product_viewed";
  const buyEventName = product.isBundle ? "bundle_buy_clicked" : "gumroad_buy_clicked";

  return (
    <main className={`${styles.page} ${themeClass} ${hasStickyPurchase ? styles.withStickyPurchase : ""}`}>
      <AnalyticsPageView eventName={viewEventName} eventParams={productAnalyticsParams(product, "product_page")} />
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

            <PreviewPanel product={product} previewImages={previewImages} hasSamplePreview={hasSamplePreview} />
          </div>

          <div className={styles.heroContent}>
            <span className="tag">{eyebrow || categoryLabel}</span>
            <h1>{product.title}</h1>
            {summary && <p className={styles.summary}>{summary}</p>}

            <div className={styles.purchaseCard}>
              <div className={styles.priceRow}>
                <span>Digital PDF</span>
                <strong>{formatPrice(product)}</strong>
              </div>

              <div className={styles.formatBadges}>
                <span>{product.format || "Digital PDF"}</span>
                <span>{categoryLabel}</span>
                <span>Secure checkout through Gumroad</span>
              </div>

              <div className={styles.heroButtons}>
                <TrackedExternalLink href={product.gumroadUrl} target="_blank" rel="noopener noreferrer" className={`brutalButton ${styles.primaryCta}`} eventName={buyEventName} eventParams={productAnalyticsParams(product, "product_hero")}>
                  Buy Digital PDF
                </TrackedExternalLink>
                {hasSamplePreview && (
                  <TrackedExternalLink href={product.sampleUrl} target="_blank" rel="noopener noreferrer" className={`brutalButton brutalButtonWhite ${styles.secondaryCta}`} eventName="preview_opened" eventParams={productAnalyticsParams(product, "product_hero")}>
                    View Free Sample
                  </TrackedExternalLink>
                )}
                {amazonUrl && (
                  <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className={`brutalButton brutalButtonWhite ${styles.secondaryCta}`}>
                    View on Amazon
                  </a>
                )}
              </div>

              <div className={styles.purchaseNotes}>
                <p>Secure checkout through Gumroad. Your digital PDF is delivered by email after purchase.</p>
                <p>{REGIONAL_PRICING_NOTE}</p>
                <p>
                  Support is available for genuine delivery issues. Read the{" "}
                  <Link href="/refund-policy">refund and download policy</Link> or contact{" "}
                  <a href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a> within 3 days.
                </p>
                <p>Preview available on selected products. <Link href="/help">Visit the Help Center</Link> for delivery and checkout guidance.</p>
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

          {quickFacts.length > 0 && (
            <article className={styles.contentCard}>
              <span className={styles.sectionKicker}>Quick facts</span>
              <h2>At a glance</h2>
              <div className={styles.audienceGrid}>
                {quickFacts.map((fact) => <span key={fact}>{fact}</span>)}
              </div>
            </article>
          )}

          {outcomeItems.length > 0 && (
            <article className={`${styles.contentCard} ${styles.wideCard}`}>
              <span className={styles.sectionKicker}>Outcomes</span>
              <h2>{isKidsBook ? "What This Book Helps Children Explore" : "What You Will Learn"}</h2>
              <ul className={styles.insideList}>
                {outcomeItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          )}

          {insideItems.length > 0 && (
            <article className={styles.contentCard}>
              <span className={styles.sectionKicker}>Contents</span>
              <h2>What is included</h2>
              <ul className={styles.insideList}>
                {insideItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          )}

          {bundleDefinition && (
            <article className={`${styles.contentCard} ${styles.wideCard}`}>
              <span className={styles.sectionKicker}>Bundle guide</span>
              <h2>Who this bundle is for</h2>
              <div className={styles.bundleFacts}>
                <div>
                  <h3>Ideal audience</h3>
                  <p>{bundleDefinition.idealAudience}</p>
                </div>
                <div>
                  <h3>Prerequisites</h3>
                  <p>{bundleDefinition.prerequisites}</p>
                </div>
              </div>
            </article>
          )}

          {bundleDetails?.includedProducts.length > 0 && (
            <section className={`${styles.contentCard} ${styles.wideCard}`} aria-labelledby="included-books-heading">
              <span className={styles.sectionKicker}>Included books</span>
              <h2 id="included-books-heading">Everything included in this bundle</h2>
              <div className={styles.relatedBooksGrid}>
                {bundleDetails.includedProducts.map((item) => <BundleIncludedBook item={item} key={item.id} />)}
              </div>
            </section>
          )}

          {bundleDefinition && bundleDetails?.learningOrder.length > 0 && (
            <article className={`${styles.contentCard} ${styles.wideCard}`}>
              <span className={styles.sectionKicker}>Learning path</span>
              <h2>Recommended learning order</h2>
              <ol className={styles.insideList}>
                {bundleDetails.learningOrder.map((title) => <li key={title}>{title}</li>)}
              </ol>
              <h3 className={styles.bundleOutcomeHeading}>What you will achieve</h3>
              <ul className={styles.insideList}>
                {bundleDefinition.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
              </ul>
            </article>
          )}

          {bundleDetails?.includedProducts.length > 0 && bundleDetails.bundlePrice !== null && (
            <section className={`${styles.contentCard} ${styles.wideCard}`} aria-labelledby="bundle-comparison-heading">
              <span className={styles.sectionKicker}>Bundle value</span>
              <h2 id="bundle-comparison-heading">Compare your options</h2>
              <div className={styles.bundleComparison}>
                <article>
                  <h3>Buy Individually</h3>
                  <ul>
                    {bundleDetails.includedProducts.map((item) => <li key={item.id}>{item.title} <span>{formatPrice(item)}</span></li>)}
                  </ul>
                  {bundleDetails.individualValue !== null && <strong>Total current price: {formatPrice(bundleDetails.individualValue)}</strong>}
                </article>
                <article>
                  <h3>Get the Bundle</h3>
                  <p>All included products in one bundle.</p>
                  <strong>Bundle price: {formatPrice(bundleDetails.bundlePrice)}</strong>
                  {bundleDetails.savings !== null && <em>Exact savings: {formatPrice(bundleDetails.savings)} ({bundleDetails.savingsPercentage.toFixed(1)}%)</em>}
                </article>
              </div>
            </section>
          )}

          {hasSamplePreview && (
            <article className={styles.contentCard}>
              <span className={styles.sectionKicker}>Preview</span>
              <h2>Preview before buying</h2>
              <p>Open the free sample PDF before choosing the full LearnStack book.</p>
              <TrackedExternalLink href={product.sampleUrl} target="_blank" rel="noopener noreferrer" className={styles.textButton} eventName="preview_opened" eventParams={productAnalyticsParams(product, "product_content") }>
                View Free Sample
              </TrackedExternalLink>
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

          <ProductFeedback
            productId={product.id}
            productIds={[product.slug]}
            className={`${styles.contentCard} ${styles.wideCard}`}
          />

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
            <p className={styles.faqLinks}>
              Need usage or classroom guidance? <Link href="/licensing-and-usage">Read the licensing FAQ</Link>. For delivery and payment support, see the <Link href="/refund-policy">refund and download policy</Link>.
            </p>
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
              <TrackedExternalLink href={product.gumroadUrl} target="_blank" rel="noopener noreferrer" className="brutalButton" eventName={buyEventName} eventParams={productAnalyticsParams(product, "product_final_cta")}>
                Buy Digital PDF
              </TrackedExternalLink>
              {hasSamplePreview && (
                <TrackedExternalLink href={product.sampleUrl} target="_blank" rel="noopener noreferrer" className="brutalButton brutalButtonWhite" eventName="preview_opened" eventParams={productAnalyticsParams(product, "product_final_cta")}>
                  View Free Sample
                </TrackedExternalLink>
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
