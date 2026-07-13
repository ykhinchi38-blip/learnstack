import Image from "next/image";
import { useId } from "react";
import { getApprovedFeedback } from "@/data/testimonials";
import styles from "./ApprovedFeedback.module.css";

function normalized(value) {
  return String(value || "").trim().toLowerCase();
}

function matchesRole(feedback, terms) {
  const role = normalized(feedback.role);
  const source = normalized(feedback.source);
  return terms.some((term) => role.includes(term) || source.includes(term));
}

function feedbackMeta(feedback) {
  return [feedback.role, feedback.organization, feedback.country].filter(Boolean).join(" | ");
}

function FeedbackCard({ feedback }) {
  const image = String(feedback.image || "").trim();

  return (
    <article className={styles.card}>
      {image && (
        <Image
          src={image}
          alt={`${feedback.name} feedback contributor portrait`}
          className={styles.avatar}
          width={72}
          height={72}
          unoptimized={image.startsWith("http")}
        />
      )}
      <div className={styles.cardBody}>
        <p className={styles.feedback}>&ldquo;{feedback.feedback}&rdquo;</p>
        <div className={styles.person}>
          <strong>{feedback.name}</strong>
          {feedbackMeta(feedback) && <span>{feedbackMeta(feedback)}</span>}
          <div className={styles.labels}>
            {feedback.verifiedPurchase === true && <span>Verified purchase</span>}
            {feedback.complimentaryEvaluationCopy === true && <span>Complimentary evaluation copy</span>}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ApprovedFeedbackList({ feedback, title = "Reader feedback", className = "" }) {
  const headingId = useId();

  if (!feedback.length) return null;

  return (
    <section className={`${styles.section} ${className}`} aria-labelledby={headingId}>
      <span className={styles.kicker}>Approved feedback</span>
      <h2 id={headingId}>{title}</h2>
      <div className={styles.grid}>
        {feedback.map((entry) => <FeedbackCard feedback={entry} key={entry.id} />)}
      </div>
    </section>
  );
}

export function ProductFeedback({ productId, productIds = [], className = "" }) {
  const ids = new Set([productId, ...productIds].filter(Boolean).map(String));
  const feedback = getApprovedFeedback().filter((entry) => ids.has(String(entry.productId || "")));
  return <ApprovedFeedbackList feedback={feedback} title="Reader feedback" className={className} />;
}

export function EducatorFeedback({ className = "" }) {
  const feedback = getApprovedFeedback().filter((entry) => matchesRole(entry, ["educator", "teacher", "tutor", "school", "librar"]));
  return <ApprovedFeedbackList feedback={feedback} title="Educator feedback" className={className} />;
}

export function ParentFeedback({ className = "" }) {
  const feedback = getApprovedFeedback().filter((entry) => matchesRole(entry, ["parent", "guardian", "family"]));
  return <ApprovedFeedbackList feedback={feedback} title="Parent feedback" className={className} />;
}

export function StudentFeedback({ className = "" }) {
  const feedback = getApprovedFeedback().filter((entry) => matchesRole(entry, ["student", "learner"]));
  return <ApprovedFeedbackList feedback={feedback} title="Student feedback" className={className} />;
}

export function CreatorReviewerFeedback({ className = "" }) {
  const feedback = getApprovedFeedback().filter((entry) => matchesRole(entry, ["creator", "reviewer", "blogger", "author"]));
  return <ApprovedFeedbackList feedback={feedback} title="Creator and reviewer feedback" className={className} />;
}
