import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import styles from "./PolicyPage.module.css";

export const metadata = createMetadata({
  title: "Terms of Use",
  description: "Read LearnStack website terms for educational PDF handbooks, Gumroad purchases, download access, and acceptable use.",
  path: "/terms"
});

export default function PolicyPage() {
  return (
    <PageEntrance variant="fadeUp">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Terms of Use", href: "/terms" }])} />
      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Trust</span>
          <h1 className="pageTitle">Terms and Digital Product Policy</h1>
          <p className="pageLead">These terms explain how LearnStack handbooks, website content, and digital purchases may be used.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.card}`}>
          <h2>Digital Product Policy</h2>

          <h3>1. What LearnStack provides</h3>
          <p>LearnStack sells educational PDF handbooks, sample resources, and learning material for students, developers, and young learners. The content is for learning, revision, project practice, and personal study.</p>

          <h3>2. Purchases and delivery</h3>
          <p>Paid digital products are sold through Gumroad. Gumroad may handle checkout, payment processing, receipts, taxes where applicable, and download delivery. After a successful purchase, buyers receive access through Gumroad or the email address used during checkout.</p>

          <h3>3. Personal-use license</h3>
          <p>When you buy or download a LearnStack resource, you receive a personal, non-exclusive, non-transferable license to read and use it for your own learning. You may not resell, upload, publicly share, copy, redistribute, or claim LearnStack content as your own.</p>

          <h3>4. Printing and group use</h3>
          <p>You may print a purchased PDF for your personal use. Personal-use purchases do not include permission to distribute files or printed copies to a class, workplace, library, or group. Contact LearnStack to discuss group access, workshops, or licensing.</p>

          <h3>5. Educational use only</h3>
          <p>Our handbooks are designed to make concepts clearer, but they do not guarantee exam scores, job offers, project outcomes, or interview results. Your progress depends on practice, consistency, and how you apply the material.</p>

          <h3>6. Content updates and corrections</h3>
          <p>We try to keep the content accurate and useful. If an error is found, LearnStack may update a PDF, publish a correction, or improve future versions. Product details, pricing, offers, and availability may change over time.</p>

          <h3>7. Acceptable website use</h3>
          <p>Please do not misuse the website, attempt to disrupt it, scrape it aggressively, interfere with checkout links, or use LearnStack material in a way that harms the brand, customers, or creators.</p>

          <h3>8. Support</h3>
          <p>If you have trouble accessing a purchase, contact LearnStack support with your order email, product name, and a short description of the issue.</p>
        </div>
      </section>
    </PageEntrance>
  );
}
