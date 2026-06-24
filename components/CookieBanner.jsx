"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "learnstack_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(CONSENT_KEY)) return undefined;

    const timer = window.setTimeout(() => setVisible(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  function chooseConsent(value) {
    window.localStorage.setItem(CONSENT_KEY, value);
    setClosing(true);
    window.setTimeout(() => setVisible(false), 300);
  }

  if (!visible) return null;

  return (
    <div className={`cookieBanner ${closing ? "closing" : ""}`} role="region" aria-label="Cookie consent">
      <div className="cookieCopy">
        <span className="cookieIcon" aria-hidden="true">LS</span>
        <p>We use cookies to improve your LearnStack experience and remember basic preferences.</p>
      </div>
      <div className="cookieActions">
        <button type="button" className="accept" onClick={() => chooseConsent("accepted")}>Accept</button>
        <button type="button" className="decline" onClick={() => chooseConsent("dismissed")}>Not now</button>
      </div>
      <style jsx>{`
        .cookieBanner {
          position: fixed;
          left: 18px;
          right: 18px;
          bottom: 18px;
          z-index: 1100;
          width: min(720px, calc(100vw - 36px));
          margin-inline: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border: 3px solid #0d1b3e;
          background: #ffffff;
          box-shadow: 5px 5px 0 #2d6be4;
          color: #0d1b3e;
          padding: 14px;
          transform: translateY(0);
          animation: slideUp 0.4s ease both;
          transition: transform 0.3s ease;
        }

        .cookieBanner.closing {
          transform: translateY(130%);
        }

        .cookieCopy {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .cookieIcon {
          flex: 0 0 auto;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 2px solid #0d1b3e;
          background: #0d1b3e;
          color: #ffffff;
          box-shadow: 2px 2px 0 #ffde59;
          font-family: var(--font-display), var(--font-display-fallback);
          font-size: 0.9rem;
          font-weight: 900;
          line-height: 1;
        }

        p {
          color: #0d1b3e;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.45;
        }

        .cookieActions {
          display: flex;
          gap: 10px;
          flex: 0 0 auto;
        }

        button {
          min-height: 40px;
          border: 2px solid #0d1b3e;
          padding: 9px 14px;
          font-weight: 900;
        }

        .accept {
          background: #2d6be4;
          color: #ffffff;
          box-shadow: 2px 2px 0 #0d1b3e;
        }

        .decline {
          background: #ffffff;
          color: #0d1b3e;
          box-shadow: 2px 2px 0 rgba(13, 27, 62, 0.2);
        }

        @keyframes slideUp {
          from {
            transform: translateY(130%);
          }

          to {
            transform: translateY(0);
          }
        }

        @media (max-width: 680px) {
          .cookieBanner,
          .cookieCopy,
          .cookieActions {
            display: grid;
          }

          .cookieBanner {
            left: 12px;
            right: 12px;
            bottom: 12px;
            width: calc(100vw - 24px);
          }

          .cookieActions,
          button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
