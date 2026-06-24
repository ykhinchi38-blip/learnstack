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
        // Stay on the maintenance page if the status check fails.
      }
    }

    const interval = window.setInterval(checkStatus, 60000);
    return () => window.clearInterval(interval);
  }, []);

  function submitEmail(event) {
    event.preventDefault();
    window.localStorage.setItem("learnstack_maintenance_notify_email", email);
    setSaved(true);
  }

  return (
    <section className="maintenancePage">
      <div className="brand">
        <Image src="/images/logo/learnstack-logo.png" alt="LearnStack logo" width={48} height={48} priority />
        <strong>LearnStack</strong>
      </div>

      <main className="maintenanceCard">
        <ToolsIcon />
        <h1>We're upgrading LearnStack</h1>
        <p>Our team is working hard to bring you something better. We'll be back shortly.</p>

        <div className="timeBox">
          <span>Expected back:</span>
          <strong>{EXPECTED_BACK}</strong>
        </div>

        <form onSubmit={submitEmail}>
          <label htmlFor="maintenance-email">Get notified</label>
          <div className="inputRow">
            <input
              id="maintenance-email"
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit">Notify Me</button>
          </div>
          {saved && <span className="confirmation">We'll notify you!</span>}
        </form>

        <div className="socialLinks" aria-label="Social links">
          <Link href="https://learnstack.gumroad.com/" target="_blank" rel="noopener noreferrer" aria-label="Gumroad">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5h14v14H5z" />
              <path d="M8 9h8" />
              <path d="M8 13h5" />
            </svg>
            <span>Gumroad</span>
          </Link>
          <Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="5" width="14" height="14" rx="4" />
              <circle cx="12" cy="12" r="3.5" />
              <path d="M16.8 7.8h.01" />
            </svg>
            <span>Instagram</span>
          </Link>
        </div>
      </main>

      <style jsx>{`
        .maintenancePage {
          position: fixed;
          inset: 0;
          z-index: 2000;
          min-height: 100vh;
          overflow-y: auto;
          background: #f5f0e8;
          color: #0d1b3e;
          padding: clamp(18px, 4vw, 42px);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #0d1b3e;
          font-family: var(--font-display), var(--font-display-fallback);
          font-size: 1.2rem;
          line-height: 1;
        }

        .brand :global(img) {
          border: 2px solid #0d1b3e;
          border-radius: 10px;
          background: #ffffff;
          box-shadow: 3px 3px 0 #2d6be4;
        }

        .maintenanceCard {
          width: min(100%, 720px);
          margin: clamp(38px, 8vw, 82px) auto 0;
          display: grid;
          justify-items: center;
          gap: 22px;
          text-align: center;
        }

        .toolsIcon {
          width: 96px;
          height: 96px;
          fill: none;
          stroke: #2d6be4;
          stroke-width: 7;
          stroke-linecap: round;
          stroke-linejoin: round;
          animation: spinTool 4s linear infinite;
        }

        h1 {
          color: #0d1b3e;
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 900;
          line-height: 0.95;
        }

        p {
          max-width: 560px;
          color: rgba(13, 27, 62, 0.72);
          font-size: 1.08rem;
          font-weight: 800;
        }

        .timeBox {
          display: grid;
          gap: 4px;
          min-width: min(100%, 340px);
          border: 3px solid #0d1b3e;
          background: #ffffff;
          box-shadow: 4px 4px 0 #2d6be4;
          padding: 18px;
        }

        .timeBox span {
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .timeBox strong {
          font-family: var(--font-display), var(--font-display-fallback);
          font-size: 1.7rem;
        }

        form {
          width: min(100%, 520px);
          display: grid;
          gap: 10px;
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
          min-height: 48px;
          border: 3px solid #0d1b3e;
          padding: 10px 14px;
          font-weight: 900;
        }

        input {
          background: #ffffff;
          color: #0d1b3e;
        }

        button {
          background: #2d6be4;
          color: #ffffff;
          box-shadow: 3px 3px 0 #0d1b3e;
        }

        .confirmation {
          color: #17803d;
        }

        .socialLinks {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 8px;
        }

        .socialLinks a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #2d6be4;
          font-weight: 900;
          text-decoration: underline;
          text-decoration-thickness: 3px;
          text-underline-offset: 5px;
        }

        .socialLinks svg {
          width: 22px;
          height: 22px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2.4;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        @keyframes spinTool {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 620px) {
          .inputRow {
            grid-template-columns: 1fr;
          }

          button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
