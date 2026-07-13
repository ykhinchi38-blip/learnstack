import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { brand } from "@/data/brand";
import { breadcrumbJsonLd, createMetadata, faqJsonLd } from "@/lib/seo";
import { REGIONAL_PRICING_NOTE } from "@/lib/pricing";
import styles from "../BrandTrustPage.module.css";

const supportCategories = [
  {
    title: "Purchasing",
    faqs: [
      { q: "Are LearnStack books physical or digital?", a: "LearnStack products sold through this website are digital PDFs. Selected titles may also have a separate paperback listing where published." },
      { q: "Are sample previews available?", a: "Selected products include a free PDF sample or preview pages. Products without a valid preview do not show a preview button." }
    ]
  },
  {
    title: "Gumroad checkout",
    faqs: [
      { q: "Where does checkout happen?", a: "LearnStack uses Gumroad for checkout, payment handling, receipt emails, and download delivery." },
      { q: "Is regional pricing available?", a: REGIONAL_PRICING_NOTE }
    ]
  },
  {
    title: "Download delivery",
    faqs: [
      { q: "How will I receive the book?", a: "After purchase, Gumroad sends the download link to the email address used at checkout." },
      { q: "What should I do if the email does not arrive?", a: "Check the inbox, spam, and promotions folders for the checkout email. If it is still missing, contact LearnStack with the email used for the order and the product name." }
    ]
  },
  {
    title: "Regional pricing",
    faqs: [
      { q: "Do I need a coupon for regional pricing?", a: "No. Eligible regional pricing is handled automatically by Gumroad at checkout when available." },
      { q: "Why might the checkout price differ?", a: "Gumroad is the checkout source of truth and may apply eligible regional pricing, taxes, or checkout settings there." }
    ]
  },
  {
    title: "Printing and personal use",
    faqs: [
      { q: "Can I print the PDF?", a: "You may print a purchased PDF for your personal use. Please do not redistribute the file or printed copies." },
      { q: "Can I share the PDF with friends or students?", a: "No. Purchases include a personal-use license and do not allow sharing, uploading, resale, or redistribution." }
    ]
  },
  {
    title: "Classroom and institutional use",
    faqs: [
      { q: "Can schools request group access?", a: "Yes. Schools, tutors, libraries, and learning groups can request classroom, group-access, workshop, or licensing discussions through Partner With Us." },
      { q: "Can a teacher use a book in a classroom?", a: "A teacher may use a purchased copy for guided reading or activities. Wider sharing, printing, or group distribution requires a separate discussion." }
    ]
  },
  {
    title: "Technical support",
    faqs: [
      { q: "What happens if the file is corrupted?", a: `${brand.downloadIssueWindow} Send your Gumroad order email, product name, and a short description of the file problem so LearnStack can review it.` },
      { q: "What if a download link does not work?", a: "Contact LearnStack with the email used for the Gumroad order, the book name, and what happened when you opened the link." }
    ]
  },
  {
    title: "Partnership inquiries",
    faqs: [
      { q: "How can I contact LearnStack?", a: `For order or product help, email ${brand.contactEmail}. For educators, bulk access, reviewers, and partnerships, use the partnership inquiry page.` },
      { q: "Can I request an educator or partnership discussion?", a: "Yes. LearnStack reviews educator, school, library, creator, affiliate, workshop, and group-access requests individually." }
    ]
  }
];

const faqs = supportCategories.flatMap((category) => category.faqs);

export const metadata = createMetadata({
  title: "LearnStack Help Center",
  description: "Clear answers about LearnStack digital PDFs, Gumroad checkout, delivery, regional pricing, printing, group use, and support.",
  path: "/help"
});

export default function HelpPage() {
  return (
    <PageEntrance variant="fadeUp" stagger>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Help", href: "/help" }])} />
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Help Center</span>
          <h1 className="pageTitle">Clear support for LearnStack digital books.</h1>
          <p className="pageLead">Find accurate guidance on checkout, PDF delivery, previews, personal use, group access, and genuine download issues.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.gridTwo}>
            {supportCategories.map((category) => (
              <article className={styles.card} key={category.title}>
                <h2>{category.title}</h2>
                <div className={styles.list}>
                  {category.faqs.map((faq) => (
                    <div key={faq.q}>
                      <h3>{faq.q}</h3>
                      <p>{faq.a}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={`container ${styles.highlight}`}>
          <h2>Need help with an order?</h2>
          <p>Email {brand.contactEmail} with your Gumroad order email, product name, and a short description of a genuine delivery, download, or duplicate-payment issue.</p>
          <div className={styles.actions}>
            <a className="brutalButton" href={`mailto:${brand.contactEmail}`}>Contact support</a>
            <Link className="brutalButton brutalButtonWhite" href="/refund-policy">Refund and download policy</Link>
            <Link className="brutalButton brutalButtonWhite" href="/free-samples">Free PDF Samples</Link>
            <Link className="brutalButton brutalButtonWhite" href="/licensing-and-usage">Licensing FAQ</Link>
          </div>
        </div>
      </section>
    </PageEntrance>
  );
}
