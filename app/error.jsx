"use client";

import Link from "next/link";

function BrokenBook() {
  return (
    <svg className="brokenBook" viewBox="0 0 180 110" aria-hidden="true">
      <path d="M88 22c-24-13-48-13-70-3v68c22-10 46-10 70 3V22Z" />
      <path d="M92 22c24-13 48-13 70-3v68c-22-10-46-10-70 3V22Z" />
      <path d="M90 24v64" />
      <path d="m78 26 12 15-9 12 13 14-9 20" />
    </svg>
  );
}

export default function ErrorPage({ error, reset }) {
  return (
    <section className="errorPage">
      <div className="errorContent">
        <strong className="code">500</strong>
        <BrokenBook />
        <h1>Something went wrong.</h1>
        <p>Our servers hit an unexpected error. Our team has been notified.</p>
        <div className="actions">
          <button type="button" onClick={reset}>Try Again</button>
          <Link href="/">Go Home</Link>
        </div>
        <small>If this keeps happening, contact us at learnstacksupport@gmail.com</small>
      </div>
      <style jsx>{`
        .errorPage {
          position: fixed;
          inset: 0;
          z-index: 2000;
          min-height: 100vh;
          display: grid;
          place-items: center;
          overflow-y: auto;
          background: #0d1b3e;
          color: #ffffff;
          padding: 24px;
          text-align: center;
        }

        .errorContent {
          width: min(100%, 760px);
          display: grid;
          justify-items: center;
          gap: 18px;
        }

        .code {
          color: #ffffff;
          font-family: var(--font-display), var(--font-display-fallback);
          font-size: clamp(5rem, 17vw, 140px);
          font-weight: 900;
          letter-spacing: -0.07em;
          line-height: 0.85;
          text-shadow: 6px 6px 0 #e53e3e;
        }

        .brokenBook {
          width: min(100%, 210px);
          height: auto;
          fill: none;
          stroke: #ffffff;
          stroke-width: 5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        h1 {
          color: #ffffff;
          font-size: clamp(2rem, 7vw, 36px);
          font-weight: 900;
        }

        p {
          max-width: 540px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 800;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 14px;
        }

        button,
        a {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #ffffff;
          padding: 12px 18px;
          font-weight: 900;
        }

        button {
          background: #2d6be4;
          color: #ffffff;
        }

        a {
          background: #ffffff;
          color: #0d1b3e;
        }

        small {
          color: rgba(255, 255, 255, 0.4);
          font-weight: 800;
        }

        @media (max-width: 560px) {
          .actions,
          button,
          a {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
