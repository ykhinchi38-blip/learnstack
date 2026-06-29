import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { getResourceBySlug, resources } from "@/data/resources";
import { brand } from "@/data/brand";
import { getAllProducts } from "@/lib/gumroad";
import { productDetailHref } from "@/lib/productRouting";
import { articleJsonLd, breadcrumbJsonLd, createMetadata, faqJsonLd } from "@/lib/seo";
import styles from "./ResourceDetailPage.module.css";

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export function generateMetadata({ params }) {
  const resource = getResourceBySlug(params.slug);

  if (!resource) {
    return createMetadata({
      title: "Resource Not Found",
      description: "This LearnStack resource could not be found.",
      path: `/resources/${params.slug}`
    });
  }

  return createMetadata({
    title: resource.seoTitle || resource.title,
    description: resource.seoDescription || resource.description,
    path: `/resources/${resource.slug}`
  });
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function catalogHrefForResource(resource) {
  const category = resource.category.toLowerCase();

  if (category.includes("kids")) return "/kids";
  if (category.includes("career") || category.includes("life")) return "/life-career";
  return "/products";
}

function fallbackChecklist(resource) {
  const category = resource.category.toLowerCase();

  if (category.includes("kids") || category.includes("emotional") || category.includes("stories")) {
    return [
      "Read the guide once before using it with a child.",
      "Pick one idea to try this week instead of doing everything at once.",
      "Use short questions and let the child answer in their own words.",
      "Connect the guide to a story, drawing, activity, or daily moment."
    ];
  }

  if (category.includes("career") || category.includes("communication") || category.includes("side")) {
    return [
      "Choose one practical skill from the guide to practise this week.",
      "Write down a small next step you can complete in 20 minutes.",
      "Use examples from your own student life or career goal.",
      "Review your progress after one week and adjust the plan."
    ];
  }

  return [
    "Start with the section that matches your current level.",
    "Turn the guide into a short revision checklist.",
    "Practise with one example before moving to the next topic.",
    "Use the related books or samples only after you know what you need."
  ];
}

export default async function ResourceDetailPage({ params }) {
  const resource = getResourceBySlug(params.slug);
  if (!resource) notFound();

  const checklist = Array.isArray(resource.checklist) && resource.checklist.length > 0
    ? resource.checklist
    : fallbackChecklist(resource);
  const products = await getAllProducts();
  const relatedProducts = resource.relatedProductSlugs
    .map((slug) => products.find((product) => product.slug === slug || product.id === slug))
    .filter(Boolean)
    .slice(0, 4);
  const relatedResources = resource.relatedResourceSlugs
    .map(getResourceBySlug)
    .filter(Boolean)
    .slice(0, 4);
  const visibleFaqJsonLd = faqJsonLd(resource.faqs);

  return (
    <PageEntrance variant="fadeUp">
      <JsonLd data={articleJsonLd(resource)} />
      {visibleFaqJsonLd && <JsonLd data={visibleFaqJsonLd} />}
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", href: "/" },
        { name: "Resources", href: "/resources" },
        { name: resource.title, href: `/resources/${resource.slug}` }
      ])} />

      <section className={styles.hero}>
        <div className="container">
          <div className="breadcrumbText">
            <Link href="/">Home</Link><span>-</span><Link href="/resources">Resources</Link><span>-</span><span>{resource.title}</span>
          </div>
          <span className="pageEyebrow">{resource.category}</span>
          <h1>{resource.title}</h1>
          <p className={styles.intro}>{resource.intro}</p>
          <div className={styles.meta}>
            <span>{resource.audience}</span>
            <span>{resource.readingTime}</span>
            <span>Updated {formatDate(resource.updatedAt)}</span>
          </div>
        </div>
      </section>

      <div className={`container ${styles.layout}`}>
        <article className={styles.article}>
          <nav className={styles.toc} aria-label="Table of contents">
            <strong>Table of contents</strong>
            {resource.sections.map((section) => (
              <a href={`#${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} key={section.heading}>
                {section.heading}
              </a>
            ))}
            <a href="#practical-checklist">Practical checklist</a>
            <a href="#recommended-books">Recommended LearnStack Books</a>
            <a href="#faqs">FAQ</a>
          </nav>

          {resource.sections.map((section) => (
            <section className={styles.section} id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")} key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}

          <section className={styles.checklistBlock} id="practical-checklist">
            <h2>{resource.checklistTitle || "Practical checklist"}</h2>
            <ul>
              {checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className={styles.faqBlock} id="faqs">
            <h2>FAQ</h2>
            <div className={styles.faqGrid}>
              {resource.faqs.map((faq) => (
                <article className={styles.faqItem} key={faq.q}>
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </article>
              ))}
            </div>
          </section>
        </article>

        <aside className={styles.sidebar}>
          <section className={styles.trustCard}>
            <h2>Founder Note</h2>
            <p>LearnStack is built by {brand.founder}, {brand.founderTitle}, to make learning books clearer, more visual, and easier to continue.</p>
            <Link href="/story">Read Our Story</Link>
          </section>

          <section className={styles.ctaCard} id="recommended-books">
            <h2>Recommended LearnStack Books</h2>
            <div className={styles.sideList}>
              {relatedProducts.length ? relatedProducts.map((product) => (
                <div className={styles.sideItem} key={product.id}>
                  <strong>{product.title}</strong>
                  <p>{product.summary || product.tagline}</p>
                  <Link href={productDetailHref(product)}>
                    View book
                  </Link>
                </div>
              )) : <p>Related LearnStack books will be added here as the catalog grows.</p>}
            </div>
          </section>

          {Array.isArray(resource.relatedLinks) && resource.relatedLinks.length > 0 && (
            <section className={styles.ctaCard}>
              <h2>Explore next</h2>
              <div className={styles.sideList}>
                {resource.relatedLinks.map((link) => (
                  <div className={styles.sideItem} key={link.href}>
                    <strong>{link.label}</strong>
                    {link.description && <p>{link.description}</p>}
                    <Link href={link.href}>Open</Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={styles.ctaCard}>
            <h2>Related guides</h2>
            <div className={styles.sideList}>
              {relatedResources.map((item) => (
                <div className={styles.sideItem} key={item.slug}>
                  <strong>{item.title}</strong>
                  <Link href={`/resources/${item.slug}`}>Read guide</Link>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.ctaCard}>
            <h2>Preview before buying</h2>
            <p>Free previews are available for selected books so you can explore the style before buying.</p>
            <Link href="/free-samples">View Free Samples</Link>
            <Link href={catalogHrefForResource(resource)}>
              Browse relevant catalog
            </Link>
          </section>

          <p className={styles.updated}>Updated {formatDate(resource.updatedAt)}</p>
        </aside>
      </div>
    </PageEntrance>
  );
}
