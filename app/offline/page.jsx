"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const RETRY_SECONDS = 10;

function WifiOffIcon({ connected }) {
  if (connected) {
    return (
      <svg className="statusIcon connected" viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r="30" />
        <path d="m26 41 10 10 20-24" />
      </svg>
    );
  }

  return (
    <svg className="statusIcon" viewBox="0 0 80 80" aria-hidden="true">
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
      window.history.back();
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
      <div className="offlineCard">
        <Image src="/images/logo/learnstack-logo.png" alt="LearnStack logo" width={80} height={80} priority />
        <strong className="brandName">LearnStack</strong>
        <WifiOffIcon connected={connected} />
        <h1>{connected ? "Connected!" : "You're Offline"}</h1>
        <p>{connected ? "Taking you back..." : "Check your internet connection. We'll keep trying automatically."}</p>
        {!connected && <span className="countdown">Retrying in {seconds} seconds...</span>}
        {!connected && (
          <button type="button" onClick={retryNow}>Try Now</button>
        )}
        {!connected && (
          <div className="pulseDots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <style jsx>{`
        .offlinePage {
          position: fixed;
          inset: 0;
          z-index: 2000;
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #0d1b3e;
          color: #ffffff;
          padding: 24px;
          text-align: center;
        }

        .offlineCard {
          width: min(100%, 520px);
          display: grid;
          justify-items: center;
          gap: 16px;
        }

        .brandName {
          color: #ffffff;
          font-family: var(--font-display), var(--font-display-fallback);
          font-size: 1.8rem;
          line-height: 1;
        }

        .statusIcon {
          width: 86px;
          height: 86px;
          margin-top: 12px;
          fill: none;
          stroke: #2d6be4;
          stroke-width: 6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .statusIcon.connected {
          stroke: #22c55e;
        }

        h1 {
          color: #ffffff;
          font-size: 32px;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        p {
          max-width: 430px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 700;
          line-height: 1.55;
        }

        .countdown {
          color: rgba(255, 255, 255, 0.82);
          font-weight: 900;
        }

        button {
          min-height: 48px;
          border: 2px solid #0d1b3e;
          background: #2d6be4;
          color: #ffffff;
          box-shadow: 3px 3px 0 #2d6be4;
          padding: 12px 20px;
          font-weight: 900;
        }

        .pulseDots {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .pulseDots span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #2d6be4;
          animation: pulseDot 1s ease-in-out infinite;
        }

        .pulseDots span:nth-child(2) {
          animation-delay: 0.16s;
        }

        .pulseDots span:nth-child(3) {
          animation-delay: 0.32s;
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
      `}</style>
    </section>
  );
}
