"use client";

import Image from "next/image";
import Link from "next/link";

function OpenBook() {
  return (
    <svg className="bookArt" viewBox="0 0 220 130" aria-hidden="true">
      <path className="page pageLeft" d="M108 30c-28-17-58-17-84-5v76c26-12 56-12 84 6V30Z" />
      <path className="page pageRight" d="M112 30c28-17 58-17 84-5v76c-26-12-56-12-84 6V30Z" />
      <path className="spine" d="M110 32v74" />
      <path className="line" d="M43 52h42M43 68h34M136 52h42M136 68h34" />
      <path className="lostPage" d="M139 15h34l10 10v38h-44V15Z" />
      <path className="lostFold" d="M173 15v10h10" />
      <path className="question" d="M156 33c0-6 10-7 10 0 0 5-5 5-5 10" />
      <path className="question" d="M161 51h.01" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <section className="notFoundPage">
      <Link href="/" className="cornerBrand" aria-label="LearnStack home">
        <Image src="/images/logo/learnstack-logo.png" alt="LearnStack logo" width={38} height={38} priority />
        <span>LearnStack</span>
      </Link>

      <div className="notFoundContent">
        <div className="visualWrap">
          <strong className="code">404</strong>
          <OpenBook />
        </div>
        <span className="eyebrow">Lost page</span>
        <h1>Page Not Found</h1>
        <p>The page you're looking for may have moved, been renamed, or does not exist.</p>
        <div className="actions">
          <Link href="/" className="primary">Go Home</Link>
          <Link href="/products" className="secondary">Explore Handbooks</Link>
          <Link href="/kids" className="tertiary">Explore Kids Books</Link>
        </div>
      </div>

      <style jsx>{`
        .notFoundPage {
          position: fixed;
          inset: 0;
          z-index: 2000;
          min-height: 100vh;
          overflow-y: auto;
          background:
            radial-gradient(circle at 86% 14%, rgba(45, 107, 228, 0.14), transparent 28%),
            linear-gradient(135deg, #f5f0e8 0 68%, #fffdf8 68% 100%);
          color: #0d1b3e;
          padding: clamp(18px, 4vw, 34px);
        }

        .cornerBrand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #0d1b3e;
          font-family: var(--font-display), var(--font-display-fallback);
          font-weight: 900;
          opacity: 0.9;
        }

        .cornerBrand :global(img) {
          border: 2px solid #0d1b3e;
          border-radius: 8px;
          background: #ffffff;
          box-shadow: 2px 2px 0 #2d6be4;
        }

        .notFoundContent {
          width: min(100%, 900px);
          margin: clamp(34px, 7vw, 72px) auto 0;
          display: grid;
          justify-items: center;
          gap: 16px;
          text-align: center;
        }

        .visualWrap {
          display: grid;
          justify-items: center;
          gap: clamp(12px, 3vw, 18px);
          width: min(100%, 520px);
          border: 3px solid #0d1b3e;
          background: #ffffff;
          box-shadow: 8px 8px 0 #2d6be4;
          padding: clamp(22px, 5vw, 38px);
        }

        .code {
          color: #0d1b3e;
          font-family: var(--font-display), var(--font-display-fallback);
          font-size: clamp(5rem, 18vw, 132px);
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 0.82;
          text-shadow: 5px 5px 0 #ffde59;
        }

        .bookArt {
          width: min(100%, 260px);
          height: auto;
          fill: none;
          stroke: #0d1b3e;
          stroke-width: 4.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .bookArt .page {
          fill: #fffdf8;
        }

        .bookArt .lostPage {
          fill: #ffde59;
        }

        .bookArt .line {
          stroke: #2d6be4;
          stroke-width: 4;
        }

        .eyebrow {
          display: inline-flex;
          border: 2px solid #0d1b3e;
          background: #0d1b3e;
          color: #ffffff;
          box-shadow: 3px 3px 0 #ffde59;
          padding: 5px 9px;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          line-height: 1;
          text-transform: uppercase;
        }

        h1 {
          color: #0d1b3e;
          font-size: clamp(2.3rem, 7vw, 48px);
          font-weight: 900;
        }

        p {
          max-width: 540px;
          color: rgba(13, 27, 62, 0.76);
          font-weight: 800;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 14px;
          margin-top: 4px;
        }

        .actions a {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #0d1b3e;
          padding: 12px 18px;
          font-weight: 900;
        }

        .primary {
          background: #2d6be4;
          color: #ffffff;
          box-shadow: 4px 4px 0 #0d1b3e;
        }

        .secondary,
        .tertiary {
          background: #ffffff;
          color: #0d1b3e;
          box-shadow: 4px 4px 0 #2d6be4;
        }

        @media (max-width: 560px) {
          .actions,
          .actions a {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
