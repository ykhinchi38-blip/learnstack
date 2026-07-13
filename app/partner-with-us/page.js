import Link from "next/link";
import PartnershipInquiryForm from "@/components/PartnershipInquiryForm";
import AnalyticsPageView from "@/components/AnalyticsPageView";
import JsonLd from "@/components/JsonLd";
import PageEntrance from "@/components/PageEntrance";
import { getApprovedFeedback } from "@/data/testimonials";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import styles from "./PartnerWithUs.module.css";

export const metadata = createMetadata({
  title: "Partner With LearnStack",
  description: "Discuss education, classroom, library, creator, reviewer, affiliate, workshop, and community partnerships with LearnStack.",
  path: "/partner-with-us"
});

const partnerGroups = [
  ["Colleges & Educational Organizations", ["Bulk student access", "Learning bundles", "Department resources", "Workshops", "Coding-club partnerships", "Campus campaigns", "Custom resource collections"]],
  ["Teachers & Tutors", ["Evaluation-copy requests", "Classroom-use discussions", "Printable activities", "Group access", "Honest educator feedback", "Reading and learning sessions"]],
  ["Creators & Reviewers", ["Review-copy requests", "Affiliate partnerships", "Sponsored-content inquiries", "Book walkthroughs", "Audience discount codes", "Educational collaborations"]]
];

export default function PartnerWithUsPage() {
  const hasApprovedFeedback = getApprovedFeedback().length > 0;

  return (
    <PageEntrance variant="fadeUp" stagger>
      <AnalyticsPageView eventName="partner_page_viewed" />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Partner With Us", href: "/partner-with-us" }])} />

      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">Partnerships</span>
          <h1 className="pageTitle">Partner With LearnStack</h1>
          <p className="pageLead">Collaborate with us to bring practical handbooks and meaningful educational books to students, children, families, and learning communities.</p>
          <div className={styles.heroActions}>
            <a href="#partnership-request" className="brutalButton">Submit a Partnership Request</a>
            <Link href="/products" className="brutalButton brutalButtonWhite">Explore Books</Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.partnerGrid}`}>
          {partnerGroups.map(([title, items]) => (
            <article className={styles.partnerCard} key={title}>
              <h2>{title}</h2>
              <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.disclosureSection}>
        <div className={`container ${styles.disclosure}`}>
          <span className="tag">Clear expectations</span>
          <p>Every request is reviewed individually. Review copies, commissions, paid collaborations, and licensing terms depend on relevance, audience fit, and the proposed collaboration.</p>
          <ul>
            <li>Free copies never require positive reviews.</li>
            <li>Not every request will be accepted.</li>
            <li>Paid collaborations require written approval.</li>
            <li>Commission details are provided only to accepted partners.</li>
          </ul>
          {!hasApprovedFeedback && <p className={styles.feedbackNotice}>Verified reader and educator feedback will be added as it is collected.</p>}
        </div>
      </section>

      <section className={styles.formSection} id="partnership-request">
        <div className={`container ${styles.formLayout}`}>
          <div>
            <span className="tag">Partnership request</span>
            <h2>Tell us about the collaboration.</h2>
            <p>Share enough context for LearnStack to understand the audience, intended use, and what a useful partnership could look like.</p>
          </div>
          <PartnershipInquiryForm />
        </div>
      </section>
    </PageEntrance>
  );
}
