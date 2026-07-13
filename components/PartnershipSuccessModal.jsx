"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./PartnershipSuccessModal.module.css";

const FOCUSABLE = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

export default function PartnershipSuccessModal({ open, onClose }) {
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previousFocus.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => dialogRef.current?.querySelector("button")?.focus(), 0);

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = Array.from(dialogRef.current?.querySelectorAll(FOCUSABLE) || []);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus.current?.focus?.();
    };
  }, [onClose, open]);

  function continueExploring() {
    onClose();
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  if (!open) return null;

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="partnership-success-title" aria-describedby="partnership-success-description">
        <button type="button" className={styles.closeButton} aria-label="Close partnership submission confirmation" onClick={onClose}>Close</button>
        <div className={styles.successIcon} aria-hidden="true">&#10003;</div>
        <span className="tag">Request Submitted</span>
        <h2 id="partnership-success-title">Congratulations!</h2>
        <p className={styles.mainMessage}>Your partnership request has been submitted successfully.</p>
        <p id="partnership-success-description">Thank you for your interest in collaborating with LearnStack. Our team will review your request and contact you soon if the collaboration is a suitable fit.</p>
        <p className={styles.note}>Please check your email inbox and spam folder for future communication from LearnStack.</p>
        <div className={styles.actions}>
          <button type="button" className="brutalButton" onClick={continueExploring}>Continue Exploring LearnStack</button>
          <Link href="/products" className={styles.booksLink}>Explore LearnStack Books</Link>
        </div>
      </section>
    </div>
  );
}
