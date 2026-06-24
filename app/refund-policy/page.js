import JsonLd from "@/components/JsonLd";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import styles from "./PolicyPage.module.css";

export const metadata = createMetadata({
  title: "Refund Policy",
  description: "Understand LearnStack refund and support policy for digital PDF handbooks purchased through Gumroad checkout.",
  path: "/refund-policy"
});

export default function PolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Refund Policy", href: "/refund-policy" }])} />
      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Trust</span>
          <h1 className="pageTitle">Refund Policy</h1>
          <p className="pageLead">Last updated: June 23, 2026. This policy explains how LearnStack handles digital PDF purchase issues.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.card}`}>
          <h2>Digital product refund policy</h2>

          <h3>1. Digital downloads</h3>
          <p>LearnStack handbooks are digital PDF products delivered through Gumroad. Because digital files can be accessed immediately, refunds are reviewed carefully and may not be available once a file has been downloaded, used, or shared.</p>

          <h3>2. When we can help</h3>
          <p>Contact us if you purchased the wrong product by mistake, were charged twice, cannot access your download, received a broken file, or believe the product description was materially incorrect. We will try to fix the issue first by restoring access, replacing the file, or clarifying the order.</p>

          <h3>3. Refund window</h3>
          <p>Please contact support within 7 days of purchase with your order email, product name, Gumroad receipt, and a short explanation. Refunds are handled case by case and may be processed through Gumroad where eligible.</p>

          <h3>4. No refund for misuse</h3>
          <p>Refunds may be refused if there is evidence of file sharing, redistribution, repeated refund abuse, a completed download with no product issue, or a request based only on not reading the product details before purchase.</p>

          <h3>5. Legal rights</h3>
          <p>Nothing in this policy is intended to remove any consumer rights that apply by law. If local law requires a different process, LearnStack will follow the applicable requirement.</p>

          <h3>6. Support contact</h3>
          <p>Use the support email in the footer and include enough order information for us to find your purchase quickly.</p>
        </div>
      </section>
    </>
  );
}
