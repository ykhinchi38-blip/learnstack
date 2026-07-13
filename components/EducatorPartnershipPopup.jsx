"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import styles from "./EducatorPartnershipPopup.module.css";

const CONSENT_KEY = "learnstack_cookie_consent";
const DISMISSED_KEY = "learnstackEducatorPopupDismissedAt";
const CONVERTED_KEY = "learnstackEducatorPopupConverted";
const SESSION_KEY = "learnstackEducatorPopupSeen";
const DISMISS_INTERVAL = 30 * 24 * 60 * 60 * 1000;
const CONVERT_INTERVAL = 90 * 24 * 60 * 60 * 1000;
const FOCUSABLE = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

function storageValue(key, storage = "localStorage") {
  try {
    return window[storage].getItem(key);
  } catch {
    return null;
  }
}

function setStorageValue(key, value, storage = "localStorage") {
  try {
    window[storage].setItem(key, value);
  } catch {
    // Storage access is optional for this promotional UI.
  }
}

function isRecent(value, interval) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) && timestamp > 0 && Date.now() - timestamp < interval;
}

function isEligiblePath(pathname) {
  if (["/", "/products", "/handbooks", "/technical-handbooks", "/kids", "/kids-books", "/kids/books", "/life-career", "/bundles"].includes(pathname)) return true;
  return ["/products/", "/kids/", "/life-career/", "/bundles/"].some((prefix) => pathname.startsWith(prefix));
}

export default function EducatorPartnershipPopup() {
  const pathname = usePathname();
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);
  const hasOpened = useRef(false);
  const [open, setOpen] = useState(false);
  const partnershipEmail = process.env.NEXT_PUBLIC_PARTNERSHIP_EMAIL || "";

  useEffect(() => {
    if (!isEligiblePath(pathname) || storageValue(SESSION_KEY, "sessionStorage")) return undefined;
    if (isRecent(storageValue(DISMISSED_KEY), DISMISS_INTERVAL) || isRecent(storageValue(CONVERTED_KEY), CONVERT_INTERVAL)) return undefined;

    let eligibleTrigger = false;
    let hasConsentBeenObserved = Boolean(storageValue(CONSENT_KEY));
    let consentReadyAt = hasConsentBeenObserved ? 0 : null;

    function canOpen() {
      if (!eligibleTrigger || document.querySelector(".notFoundPage")) return false;
      const consent = storageValue(CONSENT_KEY);
      if (!consent || document.querySelector(".cookieBanner")) return false;
      if (consentReadyAt === null) consentReadyAt = Date.now() + 450;
      return Date.now() >= consentReadyAt;
    }

    function requestOpen() {
      if (hasOpened.current || !canOpen()) return;
      hasOpened.current = true;
      setStorageValue(SESSION_KEY, "true", "sessionStorage");
      previousFocus.current = document.activeElement;
      setOpen(true);
      trackEvent("educator_popup_viewed", { cta_location: "educator_popup" });
    }

    const delayTimer = window.setTimeout(() => {
      eligibleTrigger = true;
      requestOpen();
    }, 9000);

    function onScroll() {
      if (pathname !== "/") return;
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      if (window.scrollY / scrollable >= 0.37) {
        eligibleTrigger = true;
        requestOpen();
      }
    }

    const consentWatcher = window.setInterval(() => {
      if (!hasConsentBeenObserved && storageValue(CONSENT_KEY)) {
        hasConsentBeenObserved = true;
        consentReadyAt = Date.now() + 450;
      }
      requestOpen();
    }, 350);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(delayTimer);
      window.clearInterval(consentWatcher);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => dialogRef.current?.querySelector("button")?.focus(), 0);

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
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
    };
  }, [open]);

  function dismiss() {
    setStorageValue(DISMISSED_KEY, String(Date.now()));
    setOpen(false);
    trackEvent("educator_popup_dismissed", { cta_location: "educator_popup" });
    previousFocus.current?.focus?.();
  }

  function convert(eventName) {
    setStorageValue(CONVERTED_KEY, String(Date.now()));
    setOpen(false);
    trackEvent(eventName, { cta_location: "educator_popup" });
    trackEvent("educator_popup_clicked", { cta_location: "educator_popup" });
  }

  if (!open) return null;

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
      <section ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="educator-popup-title" aria-describedby="educator-popup-description">
        <button type="button" className={styles.closeButton} aria-label="Close educator and collaboration options" onClick={dismiss}>Close</button>
        <span className="tag">For Educators, Colleges &amp; Creators</span>
        <h2 id="educator-popup-title">Bring LearnStack Resources to Your Learners or Audience</h2>
        <p id="educator-popup-description">We work with teachers, tutors, colleges, libraries, learning communities, reviewers, and educational creators interested in evaluation copies, group access, learning partnerships, workshops, and relevant content collaborations.</p>
        <ul className={styles.benefits}>
          <li>Educator evaluation-copy requests</li>
          <li>Classroom, college, or group-access discussions</li>
          <li>Creator, reviewer, and affiliate partnerships</li>
        </ul>
        <div className={styles.actions}>
          <Link href="/for-educators" className="brutalButton" onClick={() => convert("educator_popup_educator_clicked")}>Explore Educator Options</Link>
          <Link href="/partner-with-us" className={styles.secondaryButton} onClick={() => convert("educator_popup_partner_clicked")}>Start a Collaboration</Link>
        </div>
        {partnershipEmail && <a className={styles.emailLink} href={`mailto:${partnershipEmail}`} onClick={() => convert("educator_popup_email_clicked")}>Prefer email? Contact LearnStack</a>}
        <p className={styles.disclosure}>Every request is reviewed individually. Review copies, commissions, paid collaborations, and group-access terms depend on relevance and collaboration fit.</p>
      </section>
    </div>
  );
}
