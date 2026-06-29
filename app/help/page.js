import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { brand } from "@/data/brand";
import { breadcrumbJsonLd, createMetadata, faqJsonLd } from "@/lib/seo";
import styles from "../BrandTrustPage.module.css";

const faqs = [
  { q: "How do digital PDF downloads work?", a: "After purchase, your digital PDF is delivered through Gumroad email." },
  { q: "Where does purchase happen?", a: "LearnStack uses Gumroad for checkout, payment handling, receipt email, and PDF delivery." },
  { q: "Are sample previews available?", a: "Yes. Selected Gumroad products include free public sample PDFs, and more samples are added as books are prepared." },
  { q: "What if my file does not download properly?", a: `${brand.downloadIssueWindow} Email ${brand.contactEmail} with your Gumroad order email and book name.` },
  { q: "How fast does support reply?", a: brand.supportResponseTime },
  { q: "Are paperback editions available?", a: "Some LearnStack books may also be available as Amazon paperback editions where published." },
  { q: "How do refunds or support requests work?", a: "Refund/help is available only for genuine file or download issues." }
];

export const metadata = createMetadata({
  title: "Help and Buyer Support",
  description: "Learn how LearnStack digital PDF delivery, Gumroad checkout, sample previews, Amazon paperback availability, and email support work.",
  path: "/help"
});

export default function HelpPage() {
  return (
    <PageEntrance variant="fadeUp" stagger>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Help", href: "/help" }])} />
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Help</span>
          <h1 className="pageTitle">Buyer support for LearnStack books.</h1>
          <p className="pageLead">Clear answers about Gumroad PDF delivery, sample previews, paperback availability, file download issues, and email support.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.gridTwo}`}>
          {faqs.map((faq) => (
            <article className={styles.card} key={faq.q}>
              <h2>{faq.q}</h2>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={`container ${styles.highlight}`}>
          <h2>Need help with an order?</h2>
          <p>Email {brand.contactEmail} with your Gumroad order email, product name, and a short description of the issue. {brand.supportResponseTime}</p>
          <div className={styles.actions}>
            <a className="brutalButton" href={`mailto:${brand.contactEmail}`}>Contact support</a>
            <Link className="brutalButton brutalButtonWhite" href="/amazon-special">Amazon paperback editions</Link>
            <Link className="brutalButton brutalButtonWhite" href="/free-samples">Free PDF Samples</Link>
          </div>
        </div>
      </section>
    </PageEntrance>
  );
}
