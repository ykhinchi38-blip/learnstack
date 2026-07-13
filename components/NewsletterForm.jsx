"use client";

import { useId, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import styles from "./NewsletterForm.module.css";

const offers = {
  "Developers and Students": {
    heading: "Get a Free Learning Resource",
    text: "Receive a practical coding cheat sheet, selected handbook previews, and useful learning updates."
  },
  "Parents and Educators": {
    heading: "Get a Free Activity Resource",
    text: "Receive printable activities, reading prompts, and updates about new children's books."
  }
};

const MINIMUM_SUBMISSION_GAP = 60_000;

export default function NewsletterForm({ source = "homepage", defaultAudience = "Developers and Students", compact = false }) {
  const [email, setEmail] = useState("");
  const [audiencePreference, setAudiencePreference] = useState(defaultAudience);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const lastSubmissionAt = useRef(0);
  const id = useId();
  const offer = offers[audiencePreference] || offers["Developers and Students"];

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setStatus({ type: "error", message: "Enter a valid email address." });
      return;
    }
    if (!consent) {
      setStatus({ type: "error", message: "Consent is required before subscribing." });
      return;
    }
    if (Date.now() - lastSubmissionAt.current < MINIMUM_SUBMISSION_GAP) {
      setStatus({ type: "error", message: "Please wait a minute before submitting this email again." });
      return;
    }

    lastSubmissionAt.current = Date.now();
    setStatus({ type: "loading", message: "Submitting your request..." });

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          audiencePreference,
          source,
          consent
        })
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(result.error || "Your signup could not be sent. Please try again later.");

      setEmail("");
      setConsent(false);
      setStatus({ type: "success", message: result.message || "Thanks. Your request has been received." });
      trackEvent("newsletter_submitted", { audience_preference: audiencePreference, source });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Your signup could not be sent. Please try again later." });
    }
  }

  return (
    <section className={`${styles.capture} ${compact ? styles.compact : ""}`} aria-labelledby={`${id}-heading`}>
      <div className={styles.offer}>
        <h2 id={`${id}-heading`}>{offer.heading}</h2>
        <p>{offer.text}</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label htmlFor={`${id}-email`}>
        Email
        <input
          id={`${id}-email`}
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setStatus({ type: "idle", message: "" });
          }}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </label>
      <label htmlFor={`${id}-audience`}>
        Audience preference
        <select id={`${id}-audience`} value={audiencePreference} onChange={(event) => {
          setAudiencePreference(event.target.value);
          setStatus({ type: "idle", message: "" });
        }}>
          <option>Developers and Students</option>
          <option>Parents and Educators</option>
        </select>
      </label>
      <label className={styles.consent} htmlFor={`${id}-consent`}>
        <input id={`${id}-consent`} type="checkbox" checked={consent} onChange={(event) => {
          setConsent(event.target.checked);
          setStatus({ type: "idle", message: "" });
        }} />
        <span>I agree to receive the selected LearnStack resource and occasional updates.</span>
      </label>
      <button className="brutalButton" type="submit" disabled={status.type === "loading"}>
        {status.type === "loading" ? "Submitting..." : "Get the Free Resource"}
      </button>
      <p className={styles.disclosure}>You can unsubscribe from future updates at any time.</p>
      {status.type !== "idle" && <output className={`${styles.status} ${styles[status.type]}`} role={status.type === "error" ? "alert" : "status"}>{status.message}</output>}
      </form>
    </section>
  );
}
