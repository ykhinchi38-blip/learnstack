"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const RETRY_SECONDS = 10;

function WifiOffIcon({ connected }) {
  if (connected) {
    return (
      <svg className="offlineStatusIcon connected" viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r="30" />
        <path d="m26 41 10 10 20-24" />
      </svg>
    );
  }
  return (
    <svg className="offlineStatusIcon" viewBox="0 0 80 80" aria-hidden="true">
      <path d="M14 26c15-12 37-12 52 0" />
      <path d="M24 38c9-7 23-7 32 0" />
      <path d="M35 51c3-2 7-2 10 0" />
      <path d="M18 14 62 66" />
    </svg>
  );
}

export default function OfflinePage() {
  const [seconds, setSeconds] = useState(RETRY_SECONDS);
  const [connected, setConnected] = useState(false);

  function goBackSoon() {
    setConnected(true);

    window.setTimeout(() => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.replace("/");
      }
    }, 900);
  }

  function retryNow() {
    if (navigator.onLine) {
      goBackSoon();
      return;
    }

    setSeconds(RETRY_SECONDS);
  }

  useEffect(() => {
    if (navigator.onLine) {
      goBackSoon();
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          if (navigator.onLine) {
            goBackSoon();
            return 0;
          }

          return RETRY_SECONDS;
        }

        return current - 1;
      });
    }, 1000);

    function handleOnline() {
      goBackSoon();
    }

    function handleOffline() {
      setConnected(false);
      setSeconds(RETRY_SECONDS);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <section className="offlinePage" aria-live="polite">
      <div className="gridBg" aria-hidden="true" />
      <div className="glow glowBlue" aria-hidden="true" />
      <div className="glow glowGold" aria-hidden="true" />

      <main className="offlineShell">
        <div className="brandBadge">
          <Image
            src="/images/logo/learnstack-logo.png"
            alt="LearnStack logo"
            width={54}
            height={54}
            priority
          />
          <span>
            <strong>LearnStack</strong>
            <small>Digital Handbooks</small>
          </span>
        </div>

        <div className="offlineCard">
          <div className="iconWrap">
            <WifiOffIcon connected={connected} />
          </div>

          <span className={connected ? "statusPill online" : "statusPill"}>
            {connected ? "Connection Restored" : "Offline Mode"}
          </span>

          <h1>{connected ? "You’re back online!" : "You’re offline right now"}</h1>

          <p>
            {connected
              ? "Taking you back to LearnStack..."
              : "Your internet connection seems unavailable. We’ll keep checking automatically, or you can try again now."}
          </p>

          {!connected && (
            <div className="retryBox">
              <span>Auto retry in</span>
              <strong>{seconds}s</strong>
            </div>
          )}

          {!connected && (
            <button type="button" onClick={retryNow}>
              Try Again
            </button>
          )}

          {!connected && (
            <div className="pulseDots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>

        <p className="footerNote">
          Some LearnStack pages may still be available if they were cached on your device.
        </p>
      </main>

      <style jsx>{`
        .offlinePage {
          position: fixed;
          inset: 0;
          z-index: 2000;
          min-height: 100vh;
          overflow-y: auto;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at 18% 16%, rgba(45, 107, 228, 0.28), transparent 30%),
            radial-gradient(circle at 85% 78%, rgba(255, 211, 77, 0.16), transparent 28%),
            linear-gradient(135deg, #0d1b3e 0%, #112f70 48%, #081126 100%);
          color: #ffffff;
          padding: clamp(18px, 4vw, 42px);
          text-align: center;
        }

        .gridBg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.18;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: linear-gradient(to bottom, #000, transparent 82%);
        }

        .glow {
          position: fixed;
          width: 280px;
          height: 280px;
          border-radius: 999px;
          filter: blur(36px);
          pointer-events: none;
          opacity: 0.28;
        }

        .glowBlue {
          top: 12%;
          left: 8%;
          background: #2d6be4;
        }

        .glowGold {
          right: 10%;
          bottom: 12%;
          background: #ffd34d;
        }

        .offlineShell {
          position: relative;
          z-index: 2;
          width: min(100%, 560px);
          display: grid;
          justify-items: center;
          gap: 20px;
        }

        .brandBadge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          padding: 8px 16px 8px 8px;
          backdrop-filter: blur(12px);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.2);
        }

        .brandBadge :global(img) {
          border: 2px solid rgba(255, 255, 255, 0.85);
          border-radius: 14px;
          background: #ffffff;
        }

        .brandBadge span {
          display: grid;
          text-align: left;
          gap: 2px;
        }

        .brandBadge strong {
          font-family: var(--font-display), var(--font-display-fallback);
          font-size: 1.05rem;
          line-height: 1;
        }

        .brandBadge small {
          color: #93c5fd;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .offlineCard {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.1);
          box-shadow:
            0 28px 80px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(18px);
          padding: clamp(28px, 6vw, 52px);
          display: grid;
          justify-items: center;
          gap: 18px;
        }

        .iconWrap {
          display: grid;
          place-items: center;
          width: 116px;
          height: 116px;
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: inset 0 0 0 8px rgba(45, 107, 228, 0.12);
        }

        .statusPill {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(255, 211, 77, 0.42);
          border-radius: 999px;
          background: rgba(255, 211, 77, 0.14);
          color: #ffd34d;
          padding: 8px 13px;
          font-size: 0.78rem;
          font-weight: 1000;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .statusPill.online {
          border-color: rgba(34, 197, 94, 0.45);
          background: rgba(34, 197, 94, 0.14);
          color: #86efac;
        }

        h1 {
          max-width: 480px;
          color: #ffffff;
          font-family: var(--font-display), var(--font-display-fallback);
          font-size: clamp(2.15rem, 6vw, 4.4rem);
          font-weight: 1000;
          letter-spacing: -0.055em;
          line-height: 0.95;
          margin: 0;
        }

        p {
          max-width: 430px;
          color: rgba(255, 255, 255, 0.74);
          font-weight: 750;
          line-height: 1.65;
          margin: 0;
        }

        .retryBox {
          display: inline-grid;
          grid-template-columns: auto auto;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          padding: 12px 16px;
        }

        .retryBox span {
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.86rem;
          font-weight: 900;
        }

        .retryBox strong {
          color: #ffd34d;
          font-size: 1.3rem;
          font-weight: 1000;
        }

        button {
          min-height: 50px;
          border: 0;
          border-radius: 999px;
          background: #2d6be4;
          color: #ffffff;
          padding: 13px 24px;
          font: inherit;
          font-weight: 1000;
          cursor: pointer;
          box-shadow: 0 16px 36px rgba(45, 107, 228, 0.34);
          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            background 160ms ease;
        }

        button:hover {
          transform: translateY(-2px);
          background: #2563eb;
          box-shadow: 0 20px 44px rgba(45, 107, 228, 0.44);
        }

        .pulseDots {
          display: flex;
          gap: 8px;
          margin-top: 2px;
        }

        .pulseDots span {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: #93c5fd;
          animation: pulseDot 1s ease-in-out infinite;
        }

        .pulseDots span:nth-child(2) {
          animation-delay: 0.16s;
        }

        .pulseDots span:nth-child(3) {
          animation-delay: 0.32s;
        }

        .footerNote {
          max-width: 480px;
          color: rgba(255, 255, 255, 0.58);
          font-size: 0.92rem;
          font-weight: 700;
        }

        @keyframes pulseDot {
          0%,
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }

          50% {
            opacity: 1;
            transform: translateY(-5px);
          }
        }

        @media (max-width: 520px) {
          .offlinePage {
            padding: 16px;
          }

          .offlineCard {
            border-radius: 24px;
          }

          .brandBadge {
            width: 100%;
            justify-content: center;
            border-radius: 20px;
          }

          .retryBox {
            grid-template-columns: 1fr;
            gap: 4px;
            width: 100%;
          }

          button {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation: none !important;
            transition: none !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <style jsx global>{`
        .offlineStatusIcon {
          width: 78px;
          height: 78px;
          fill: none;
          stroke: #93c5fd;
          stroke-width: 5.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .offlineStatusIcon.connected {
          stroke: #86efac;
        }
      `}</style>
    </section>
  );
}