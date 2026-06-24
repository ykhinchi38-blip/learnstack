import JsonLd from "@/components/JsonLd";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import styles from "./ContactPage.module.css";

export const metadata = createMetadata({
  title: "Contact LearnStack",
  description: "Contact LearnStack for support, product questions, Gumroad delivery help, partnerships, or feedback about educational PDF handbooks.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }])} />
      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Contact</span>
          <h1 className="pageTitle">Questions, support, or collaboration?</h1>
          <p className="pageLead">Send a message for Gumroad delivery help, product questions, partnerships, or suggestions for new LearnStack handbooks.</p>
        </div>
      </section>
      <section className={styles.contactSection}>
        <div className={`container ${styles.grid}`}>
          <form className={styles.form} action={process.env.NEXT_PUBLIC_CONTACT_FORM_ACTION || "#"} method="POST">
            <label>Name<input name="name" placeholder="Your name" required /></label>
            <label>Email<input type="email" name="email" placeholder="you@example.com" required /></label>
            <label>Subject
              <select name="subject" required>
                <option value="Support">Support</option>
                <option value="Product Question">Product Question</option>
                <option value="Partnership">Partnership</option>
                <option value="Feedback">Feedback</option>
              </select>
            </label>
            <label>Message<textarea name="message" rows="7" placeholder="Write your message..." required /></label>
            <button className="brutalButton" type="submit">Send Message</button>
          </form>
          <aside className={styles.infoBox}>
            <span className="tag">Support</span>
            <h2>We keep support simple.</h2>
            <p>Email us for purchase help, download issues, or feedback.</p>
            <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
            <a href={site.gumroadStore} target="_blank" rel="noopener noreferrer">Open Gumroad Store &rarr;</a>
          </aside>
        </div>
      </section>
    </>
  );
}
