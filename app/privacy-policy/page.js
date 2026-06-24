import JsonLd from "@/components/JsonLd";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import styles from "./PolicyPage.module.css";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "Learn how LearnStack handles website data, support emails, Gumroad checkout redirection, and subscriber coupon verification information.",
  path: "/privacy-policy"
});

export default function PolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Privacy Policy", href: "/privacy-policy" }])} />
      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Trust</span>
          <h1 className="pageTitle">Privacy Policy</h1>
          <p className="pageLead">Last updated: June 23, 2026. This page explains what information LearnStack may receive and how it is used.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.card}`}>
          <h2>Privacy basics</h2>

          <h3>1. Information you share with us</h3>
          <p>You may share information with LearnStack when you contact support, submit a form, request a coupon, join updates, or ask a product question. This may include your name, email address, message, product interest, and order details you choose to provide.</p>

          <h3>2. Gumroad checkout</h3>
          <p>Purchases are completed through Gumroad. Gumroad may collect and process buyer information such as payment details, email address, order information, tax details, and fraud-prevention data according to its own policies. LearnStack may receive limited order information needed to provide support and verify purchases.</p>

          <h3>3. How we use information</h3>
          <p>We use information to answer support requests, verify subscriber or buyer status, deliver relevant updates, improve the website, understand product demand, and protect the website from misuse.</p>

          <h3>4. What we do not do</h3>
          <p>LearnStack does not sell personal information. We do not ask for card numbers on this website; payment details are handled by Gumroad or the relevant payment processor.</p>

          <h3>5. Cookies and analytics</h3>
          <p>The website or third-party services may use basic cookies, logs, or analytics-style data to keep the site working, measure traffic, and improve user experience. You can manage cookies through your browser settings.</p>

          <h3>6. Data care</h3>
          <p>We keep support and subscriber information only as long as it is useful for the purpose it was provided, unless a longer period is needed for legal, security, or record-keeping reasons. No online service can guarantee perfect security, but we aim to handle information responsibly.</p>

          <h3>7. Contact</h3>
          <p>For privacy questions or deletion requests, contact the support email listed in the footer. We may need enough information to verify the request before making changes.</p>
        </div>
      </section>
    </>
  );
}
