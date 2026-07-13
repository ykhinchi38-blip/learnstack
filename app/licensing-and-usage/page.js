import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { breadcrumbJsonLd, createMetadata, faqJsonLd } from "@/lib/seo";
import styles from "../BrandTrustPage.module.css";

const faqs = [
  {
    q: "What license comes with a LearnStack purchase?",
    a: "A purchase provides a personal, non-exclusive, non-transferable license to read and use the digital PDF for your own learning."
  },
  {
    q: "Can I print the PDF?",
    a: "Yes. You may print a purchased PDF for your personal use. Please do not distribute the file or printed copies to others."
  },
  {
    q: "Can I share a PDF with friends, students, or colleagues?",
    a: "No. Personal-use purchases do not allow sharing, uploading, resale, redistribution, or presenting LearnStack content as your own."
  },
  {
    q: "Can teachers use LearnStack books in classrooms?",
    a: "Teachers may use a purchased copy for guided reading or activities. Wider printing, sharing, or group distribution needs a separate discussion with LearnStack."
  },
  {
    q: "Can a school, tutor, library, or coding club request group access?",
    a: "Yes. LearnStack reviews requests for classroom access, bulk purchase, workshops, libraries, and other group-use arrangements individually."
  },
  {
    q: "Where can I request classroom or institutional access?",
    a: "Use the Partner With Us form and select the option closest to the intended use. Terms and pricing depend on the resources and learner group."
  }
];

export const metadata = createMetadata({
  title: "Licensing and Usage FAQ",
  description: "Understand personal-use, printing, classroom, group-access, and institutional-use guidance for LearnStack digital PDFs.",
  path: "/licensing-and-usage"
});

export default function LicensingAndUsagePage() {
  return (
    <PageEntrance variant="fadeUp" stagger>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Licensing and Usage", href: "/licensing-and-usage" }])} />
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Licensing</span>
          <h1 className="pageTitle">Licensing and usage FAQ.</h1>
          <p className="pageLead">Clear guidance for personal PDFs, printing, classroom use, and requests for group or institutional access.</p>
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
          <h2>Need a group-use discussion?</h2>
          <p>Personal-use purchases do not automatically include classroom or redistribution rights. Share the intended use, resources, and learner group so LearnStack can review the request.</p>
          <div className={styles.actions}>
            <Link className="brutalButton" href="/partner-with-us?partnershipType=Classroom%20or%20group%20access">Discuss group access</Link>
            <Link className="brutalButton brutalButtonWhite" href="/terms">Read Terms</Link>
            <Link className="brutalButton brutalButtonWhite" href="/help">Help Center</Link>
          </div>
        </div>
      </section>
    </PageEntrance>
  );
}
