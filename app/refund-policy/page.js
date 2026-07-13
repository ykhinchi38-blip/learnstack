import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import styles from "./PolicyPage.module.css";

export const metadata = createMetadata({
  title: "Refund and Download-Issue Policy",
  description: "Understand LearnStack support for delivery, corrupted-file, and duplicate-payment issues with digital PDFs purchased through Gumroad.",
  path: "/refund-policy"
});

export default function PolicyPage() {
  return (
    <PageEntrance variant="fadeUp">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Refund and Download-Issue Policy", href: "/refund-policy" }])} />
      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Trust</span>
          <h1 className="pageTitle">Refund and Download-Issue Policy</h1>
          <p className="pageLead">This policy explains how LearnStack handles genuine delivery, file, and duplicate-payment issues for digital PDF purchases.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.card}`}>
          <h2>Digital product support policy</h2>

          <h3>1. Digital downloads</h3>
          <p>LearnStack handbooks are digital PDF products delivered through Gumroad. Because digital files can be accessed immediately, refunds are reviewed carefully and may not be available once a file has been downloaded, used, or shared.</p>

          <h3>2. Change-of-mind requests</h3>
          <p>A change of mind, a completed download with no file problem, or not reviewing the product details before purchase does not automatically qualify for a refund. LearnStack does not promise refunds for every digital purchase.</p>

          <h3>3. Genuine delivery and payment issues</h3>
          <p>Contact LearnStack if you cannot access your download, received a corrupted file, were charged twice, or believe there is a genuine delivery problem. We will review the order and try to restore access, replace a faulty file, or clarify the purchase before considering any refund.</p>

          <h3>4. What to include</h3>
          <p>Please contact support within 3 days of a download problem with the email used for the Gumroad order, product name, Gumroad receipt where available, and a short explanation of what happened.</p>

          <h3>5. Refund decisions</h3>
          <p>Refunds are reviewed case by case and may be processed through Gumroad where eligible. Refunds may be refused where there is evidence of sharing, redistribution, repeated refund abuse, or no genuine product, delivery, or duplicate-payment issue.</p>

          <h3>6. Legal rights</h3>
          <p>Nothing in this policy is intended to remove any consumer rights that apply by law. If local law requires a different process, LearnStack will follow the applicable requirement.</p>

          <h3>7. Support contact</h3>
          <p>Use the support email in the footer and include enough order information for us to find your purchase quickly.</p>
        </div>
      </section>
    </PageEntrance>
  );
}
