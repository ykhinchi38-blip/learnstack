"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 300);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      className={`scrollTop ${visible ? "visible" : ""}`}
      aria-label="Scroll to top"
      onClick={scrollToTop}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
      <style jsx>{`
        .scrollTop {
          position: fixed;
          right: 28px;
          bottom: 32px;
          z-index: 999;
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 2px solid #0d1b3e;
          border-radius: 50%;
          background: #2d6be4;
          color: #ffffff;
          box-shadow: 3px 3px 0 #0d1b3e;
          opacity: 0;
          pointer-events: none;
          transform: scale(0.8);
          transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.2s ease;
        }

        .scrollTop.visible {
          opacity: 1;
          pointer-events: auto;
          transform: scale(1);
        }

        .scrollTop.visible:hover {
          box-shadow: 5px 5px 0 #0d1b3e;
          transform: translateY(-3px) scale(1);
        }

        svg {
          width: 24px;
          height: 24px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2.6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        @media (max-width: 680px) {
          .scrollTop {
            right: 18px;
            bottom: 80px;
          }
        }
      `}</style>
    </button>
  );
}
