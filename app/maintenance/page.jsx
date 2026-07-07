"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const EXPECTED_BACK = "Shortly";

function ToolsIcon() {
  return (
    <svg className="toolsIcon" viewBox="0 0 88 88" aria-hidden="true">
      <path d="M50 12a20 20 0 0 0 24 24L42 68 28 54 60 22a20 20 0 0 0-10-10Z" />
      <path d="M24 18 12 30l12 12 8-8" />
      <path d="m48 50 22 22" />
    </svg>
  );
}

export default function MaintenancePage() {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      try {
        const response = await fetch("/api/status", { cache: "no-store" });
        const data = await response.json();

        if (data.maintenance === false) {
          window.location.replace("/");
        }
      } catch {
        // Stay on maintenance page if the status check fails.
      }
    }

    checkStatus();
    const interval = window.setInterval(checkStatus, 60000);

    return () => window.clearInterval(interval);
  }, []);

  function submitEmail(event) {
    event.preventDefault();

    try {
      window.localStorage.setItem("learnstack_maintenance_notify_email", email);
    } catch {
      // Ignore localStorage errors.
    }

    setSaved(true);
  }

  return (
    <section className="maintenancePage">
      <div className="backgroundGrid" aria-hidden="true" />
      <div className="glow glowOne" aria-hidden="true" />
      <div className="glow glowTwo" aria-hidden="true" />

      <header className="topBar">
        <Link href="/" className="brand" aria-label="LearnStack home">
          <Image
            src="/images/logo/learnstack-logo.png"
            alt="LearnStack logo"
            width={52}
            height={52}
            priority
          />
          <span>
            <strong>LearnStack</strong>
            <small>Digital Handbooks</small>
          </span>
        </Link>

        <Link
          href="https://learnstack.gumroad.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="gumroadLink"
        >
          Follow us on Gumroad →
        </Link>
      </header>

      <main className="maintenanceShell">
        <section className="contentPanel">
          <span className="statusBadge">Temporary Maintenance</span>

          <h1>We’re upgrading LearnStack.</h1>

          <p className="lead">
            We’re improving the experience, polishing resources, and preparing
            a smoother LearnStack platform for students, developers, and young
            learners.
          </p>

          <div className="infoGrid">
            <div className="infoCard">
              <span>Expected back</span>
              <strong>{EXPECTED_BACK}</strong>
            </div>

            <div className="infoCard">
              <span>Status check</span>
              <strong>Every 60 sec</strong>
            </div>
          </div>

          <form onSubmit={submitEmail} className="notifyForm">
            <label htmlFor="maintenance-email">Get notified when we return</label>

            <div className="inputRow">
              <input
                id="maintenance-email"
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <button type="submit">{saved ? "Saved" : "Notify Me"}</button>
            </div>

            {saved && (
              <span className="confirmation">
                You’re on the list. We’ll notify you when LearnStack is back.
              </span>
            )}
          </form>

          <nav className="quickLinks" aria-label="Useful links">
            <Link
              href="https://learnstack.gumroad.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gumroad Store
            </Link>
            <Link
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </Link>
          </nav>
        </section>

        <aside className="visualPanel" aria-label="Maintenance illustration">
          <div className="toolCard">
            <ToolsIcon />
            <span>System upgrade in progress</span>
          </div>

          <div className="bookStack" aria-hidden="true">
            <div className="book bookOne">
              <span>HTML</span>
            </div>
            <div className="book bookTwo">
              <span>DSA</span>
            </div>
            <div className="book bookThree">
              <span>PY</span>
            </div>
            <div className="book bookFour">
              <span>AI</span>
            </div>
          </div>

          <p>
            New improvements are being added carefully so your handbooks,
            previews, and downloads feel faster and cleaner.
          </p>
        </aside>
      </main>

      <style jsx>{`
        .maintenancePage {
          position: fixed;
          inset: 0;
          z-index: 2000;
          min-height: 100vh;
          overflow-y: auto;
          background:
            radial-gradient(circle at 15% 15%, rgba(45, 107, 228, 0.16), transparent 28%),
            radial-gradient(circle at 85% 20%, rgba(255, 211, 77, 0.16), transparent 26%),
            linear-gradient(135deg, #f7f2ea 0%, #ffffff 52%, #eef4ff 100%);
          color: #0d1b3e;
          padding: clamp(18px, 4vw, 44px);
        }

        .backgroundGrid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.28;
          background-image:
            linear-gradient(rgba(13, 27, 62, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 27, 62, 0.06) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, #000, transparent 78%);
        }

        .glow {
          position: fixed;
          width: 280px;
          height: 280px;
          border-radius: 999px;
          filter: blur(28px);
          pointer-events: none;
          opacity: 0.28;
        }

        .glowOne {
          top: 12%;
          left: 8%;
          background: #2d6be4;
        }

        .glowTwo {
          right: 10%;
          bottom: 10%;
          background: #ffd34d;
        }

        .topBar {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          max-width: 1180px;
          margin: 0 auto;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #0d1b3e;
          text-decoration: none;
        }

        .brand :global(img) {
          border: 2px solid #0d1b3e;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 4px 4px 0 #2d6be4;
        }

        .brand span {
          display: grid;
          gap: 3px;
        }

        .brand strong {
          font-family: var(--font-display), var(--font-display-fallback);
          font-size: 1.15rem;
          line-height: 1;
        }

        .brand small {
          color: #2d6be4;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .gumroadLink {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          border: 2px solid #0d1b3e;
          border-radius: 999px;
          background: #0d1b3e;
          color: #ffffff;
          padding: 10px 18px;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 4px 4px 0 #2d6be4;
        }

        .maintenanceShell {
          position: relative;
          z-index: 2;
          width: min(100%, 1180px);
          margin: clamp(42px, 8vw, 92px) auto 0;
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
          gap: clamp(24px, 4vw, 54px);
          align-items: center;
        }

        .contentPanel {
          border: 3px solid #0d1b3e;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 10px 10px 0 #2d6be4;
          padding: clamp(26px, 5vw, 56px);
        }

        .statusBadge {
          display: inline-flex;
          align-items: center;
          border: 2px solid #0d1b3e;
          background: #ffd34d;
          color: #0d1b3e;
          padding: 8px 12px;
          font-weight: 1000;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: 3px 3px 0 #0d1b3e;
        }

        h1 {
          margin: 24px 0 18px;
          color: #0d1b3e;
          font-family: var(--font-display), var(--font-display-fallback);
          font-size: clamp(2.6rem, 7vw, 5.8rem);
          font-weight: 1000;
          letter-spacing: -0.06em;
          line-height: 0.92;
        }

        .lead {
          max-width: 680px;
          color: rgba(13, 27, 62, 0.76);
          font-size: clamp(1rem, 1.5vw, 1.18rem);
          font-weight: 800;
          line-height: 1.7;
        }

        .infoGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin: 28px 0;
        }

        .infoCard {
          border: 2px solid #0d1b3e;
          background: #f7f2ea;
          padding: 16px;
        }

        .infoCard span {
          display: block;
          color: rgba(13, 27, 62, 0.62);
          font-size: 0.78rem;
          font-weight: 1000;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .infoCard strong {
          display: block;
          margin-top: 5px;
          font-size: 1.35rem;
          font-weight: 1000;
        }

        .notifyForm {
          display: grid;
          gap: 10px;
          margin-top: 24px;
        }

        label,
        .confirmation {
          font-weight: 900;
        }

        .inputRow {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px;
        }

        input,
        button {
          min-height: 52px;
          border: 3px solid #0d1b3e;
          border-radius: 0;
          padding: 12px 14px;
          font: inherit;
          font-weight: 900;
        }

        input {
          background: #ffffff;
          color: #0d1b3e;
          outline: none;
        }

        input:focus {
          box-shadow: 0 0 0 4px rgba(45, 107, 228, 0.18);
        }

        button {
          cursor: pointer;
          background: #2d6be4;
          color: #ffffff;
          box-shadow: 4px 4px 0 #0d1b3e;
          transition:
            transform 160ms ease,
            box-shadow 160ms ease;
        }

        button:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #0d1b3e;
        }

        .confirmation {
          color: #17803d;
          font-size: 0.92rem;
        }

        .quickLinks {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 24px;
        }

        .quickLinks a {
          color: #0d1b3e;
          font-weight: 1000;
          text-decoration: underline;
          text-decoration-color: #2d6be4;
          text-decoration-thickness: 3px;
          text-underline-offset: 5px;
        }

        .visualPanel {
          min-height: 520px;
          border: 3px solid #0d1b3e;
          background:
            linear-gradient(135deg, rgba(13, 27, 62, 0.96), rgba(17, 47, 112, 0.96)),
            #0d1b3e;
          color: #ffffff;
          box-shadow: 10px 10px 0 #ffd34d;
          padding: clamp(24px, 4vw, 44px);
          display: grid;
          align-content: center;
          justify-items: center;
          gap: 28px;
          text-align: center;
          overflow: hidden;
        }

        .toolCard {
          display: inline-grid;
          justify-items: center;
          gap: 12px;
          border: 2px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.08);
          padding: 18px 20px;
          backdrop-filter: blur(8px);
        }

        .toolCard span {
          color: #ffffff;
          font-weight: 1000;
          font-size: 0.88rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .bookStack {
          position: relative;
          width: min(100%, 340px);
          height: 250px;
        }

        .book {
          position: absolute;
          left: 50%;
          width: 255px;
          height: 54px;
          border: 3px solid #ffffff;
          box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.24);
          transform: translateX(-50%) rotate(var(--rotate));
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 18px;
          font-weight: 1000;
          letter-spacing: 0.08em;
        }

        .book span {
          font-size: 0.88rem;
        }

        .bookOne {
          --rotate: -6deg;
          top: 36px;
          background: #ffffff;
          color: #0d1b3e;
        }

        .bookTwo {
          --rotate: 4deg;
          top: 86px;
          background: #2d6be4;
        }

        .bookThree {
          --rotate: -3deg;
          top: 136px;
          background: #ffd34d;
          color: #0d1b3e;
        }

        .bookFour {
          --rotate: 5deg;
          top: 186px;
          background: #ffffff;
          color: #0d1b3e;
        }

        .visualPanel p {
          max-width: 360px;
          color: rgba(255, 255, 255, 0.78);
          font-weight: 800;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .maintenanceShell {
            grid-template-columns: 1fr;
          }

          .visualPanel {
            min-height: auto;
          }
        }

        @media (max-width: 620px) {
          .maintenancePage {
            padding: 16px;
          }

          .topBar {
            align-items: flex-start;
          }

          .gumroadLink {
            display: none;
          }

          .contentPanel,
          .visualPanel {
            box-shadow: 6px 6px 0 #2d6be4;
          }

          .inputRow,
          .infoGrid {
            grid-template-columns: 1fr;
          }

          button {
            width: 100%;
          }

          .bookStack {
            height: 220px;
          }

          .book {
            width: 230px;
            height: 48px;
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
        .toolsIcon {
          width: 86px;
          height: 86px;
          fill: none;
          stroke: #ffd34d;
          stroke-width: 6.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          animation: toolFloat 2.6s ease-in-out infinite;
        }

        @keyframes toolFloat {
          0%,
          100% {
            transform: translateY(0) rotate(-6deg);
          }

          50% {
            transform: translateY(-8px) rotate(6deg);
          }
        }
      `}</style>
    </section>
  );
}